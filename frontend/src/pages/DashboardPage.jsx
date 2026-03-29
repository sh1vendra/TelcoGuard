import { useState, useEffect } from 'react';
import Navbar from '../components/Layout/Navbar';
import StatsCards from '../components/Dashboard/StatsCards';
import StatusChart from '../components/Dashboard/StatusChart';
import RecentActivity from '../components/Dashboard/RecentActivity';
import api from '../api/axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const PORTING_COLORS = {
  pending: '#f59e0b',
  approved: '#10b981',
  rejected: '#ef4444',
  completed: '#3b82f6',
  flagged: '#8b5cf6',
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#111114] border border-[#27272A] rounded-lg px-3 py-2 text-xs">
        <p className="text-[#A1A1AA] capitalize">{label}</p>
        <p className="text-[#E4E4E7] font-semibold">{payload[0].value}</p>
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
      <div className="flex-1 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#27272A] border-t-[#0A84FF] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto bg-[#0A0A0B]">
      <Navbar title="Dashboard" />
      <div className="p-6 space-y-6">
        <StatsCards stats={stats} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <StatusChart data={phoneByStatus} />
          <div className="bg-[#111114] border border-[#27272A] rounded-xl p-5">
            <h3 className="text-xs font-semibold text-[#A1A1AA] uppercase tracking-wide mb-4">Porting Requests by Status</h3>
            {portingByStatus.length === 0 ? (
              <div className="flex items-center justify-center h-56 text-[#71717A] text-sm">
                No porting data
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={portingByStatus}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272A" />
                  <XAxis
                    dataKey="status"
                    tick={{ fontSize: 11, fill: '#71717A' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fontSize: 11, fill: '#71717A' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="count"
                    radius={[4, 4, 0, 0]}
                    fill="#0A84FF"
                    isAnimationActive={false}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
        <RecentActivity logs={recentLogs} />
      </div>
    </div>
  );
}
