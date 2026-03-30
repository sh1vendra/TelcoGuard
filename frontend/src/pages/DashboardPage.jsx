import { useState, useEffect } from 'react';
import Navbar from '../components/Layout/Navbar';
import StatsCards from '../components/Dashboard/StatsCards';
import StatusChart from '../components/Dashboard/StatusChart';
import RecentActivity from '../components/Dashboard/RecentActivity';
import api from '../api/axios';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const STATUS_COLORS = {
  pending: '#2563EB',
  approved: '#059669',
  rejected: '#DC2626',
  completed: '#7C3AED',
  flagged: '#D97706',
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-[#18181B] border border-gray-200 dark:border-[#27272A] rounded-lg px-3 py-2 shadow-lg text-xs">
        <p className="text-gray-500 dark:text-[#A1A1AA] capitalize mb-0.5">{label}</p>
        <p className="text-gray-900 dark:text-[#F4F4F5] font-semibold">{payload[0].value}</p>
      </div>
    );
  }
  return null;
};

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [phoneByStatus, setPhoneByStatus] = useState([]);
  const [portingByStatus, setPortingByStatus] = useState([]);
  const [recentLogs, setRecentLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [phoneStatsRes, fraudStatsRes, portingRes, auditRes] = await Promise.all([
          api.get('/phones/stats'),
          api.get('/fraud/stats'),
          api.get('/porting?limit=100'),
          api.get('/audit?limit=5'),
        ]);

        const phoneStats = phoneStatsRes.data.data;
        const fraudStats = fraudStatsRes.data.data;
        const portingData = portingRes.data.data;

        const availableCount = phoneStats.byStatus?.find((s) => s._id === 'available')?.count || 0;
        const activePorting = portingData.requests?.filter((r) => r.status === 'pending').length || 0;

        setStats({
          phoneStats: { total: phoneStats.total, available: availableCount },
          portingStats: { active: activePorting },
          fraudStats: { unresolved: fraudStats.unresolved },
        });

        setPhoneByStatus(phoneStats.byStatus || []);

        const portingStatusMap = {};
        portingData.requests?.forEach((r) => {
          portingStatusMap[r.status] = (portingStatusMap[r.status] || 0) + 1;
        });
        setPortingByStatus(
          Object.entries(portingStatusMap).map(([status, count]) => ({ status, count }))
        );

        setRecentLogs(auditRes.data.data?.logs || []);
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 overflow-auto bg-[#FAFAFA] dark:bg-[#09090B] transition-colors duration-200">
        <Navbar title="Dashboard" />
        <div className="p-6 max-w-[1280px] mx-auto space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-[#18181B] border border-gray-200 dark:border-[#27272A] rounded-xl p-5 animate-pulse">
                <div className="flex items-center justify-between mb-4">
                  <div className="h-3 bg-gray-100 dark:bg-[#27272A] rounded w-24" />
                  <div className="w-8 h-8 bg-gray-100 dark:bg-[#27272A] rounded-lg" />
                </div>
                <div className="h-8 bg-gray-100 dark:bg-[#27272A] rounded w-16" />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-[#18181B] border border-gray-200 dark:border-[#27272A] rounded-xl p-5 animate-pulse h-72">
                <div className="h-3 bg-gray-100 dark:bg-[#27272A] rounded w-32 mb-6" />
                <div className="h-48 bg-gray-100 dark:bg-[#27272A] rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto bg-[#FAFAFA] dark:bg-[#09090B] transition-colors duration-200">
      <Navbar title="Dashboard" />
      <div className="p-6 max-w-[1280px] mx-auto space-y-6">
        <StatsCards stats={stats} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <StatusChart data={phoneByStatus} />
          <div className="bg-white dark:bg-[#18181B] border border-gray-200 dark:border-[#27272A] rounded-xl shadow-sm p-5">
            <h3 className="text-xs font-semibold text-gray-500 dark:text-[#71717A] uppercase tracking-wider mb-5">
              Porting by Status
            </h3>
            {portingByStatus.length === 0 ? (
              <div className="flex items-center justify-center h-56 text-gray-400 dark:text-[#71717A] text-sm">
                No porting data
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={portingByStatus} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="portingGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563EB" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--grid-stroke, #F3F4F6)" vertical={false} />
                  <XAxis dataKey="status" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="count"
                    stroke="#2563EB"
                    strokeWidth={2}
                    fill="url(#portingGrad)"
                    isAnimationActive={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
        <RecentActivity logs={recentLogs} />
      </div>
    </div>
  );
}
