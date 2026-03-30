import { useState, useEffect, useCallback } from 'react';
import Navbar from '../components/Layout/Navbar';
import FraudStats from '../components/Fraud/FraudStats';
import FraudAlertList from '../components/Fraud/FraudAlertList';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function FraudAlertsPage() {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({ severity: '', resolved: '' });

  const fetchAlerts = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 20 };
      if (filters.severity) params.severity = filters.severity;
      if (filters.resolved !== '') params.resolved = filters.resolved;
      const [alertsRes, statsRes] = await Promise.all([
        api.get('/fraud', { params }),
        api.get('/fraud/stats'),
      ]);
      setAlerts(alertsRes.data.data?.alerts || []);
      setTotalPages(alertsRes.data.data?.totalPages || 1);
      setStats(statsRes.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, filters]);

  useEffect(() => {
    setPage(1);
  }, [filters]);

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  return (
    <div className="flex-1 overflow-auto bg-[#FAFAFA] dark:bg-[#09090B] transition-colors duration-200">
      <Navbar title="Fraud Alerts" />
      <div className="p-6 max-w-[1280px] mx-auto space-y-5">
        <FraudStats stats={stats} />

        <div className="flex flex-wrap gap-3">
          <select
            value={filters.severity}
            onChange={(e) => setFilters({ ...filters, severity: e.target.value })}
            className="bg-white dark:bg-[#18181B] border border-gray-200 dark:border-[#27272A] rounded-lg px-3 py-2 text-sm text-gray-700 dark:text-[#A1A1AA] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
          >
            <option value="">All Severities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
          <select
            value={filters.resolved}
            onChange={(e) => setFilters({ ...filters, resolved: e.target.value })}
            className="bg-white dark:bg-[#18181B] border border-gray-200 dark:border-[#27272A] rounded-lg px-3 py-2 text-sm text-gray-700 dark:text-[#A1A1AA] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
          >
            <option value="">All</option>
            <option value="false">Unresolved</option>
            <option value="true">Resolved</option>
          </select>
        </div>

        {loading ? (
          <div className="bg-white dark:bg-[#18181B] border border-gray-200 dark:border-[#27272A] rounded-xl shadow-sm overflow-hidden animate-pulse">
            <div className="border-b border-gray-200 dark:border-[#27272A] bg-gray-50 dark:bg-white/[0.02] h-12" />
            {[...Array(5)].map((_, i) => (
              <div key={i} className="border-b border-gray-100 dark:border-[#27272A]/40 last:border-0 h-14 flex items-center px-4 gap-4">
                <div className="h-3 bg-gray-100 dark:bg-[#27272A] rounded w-32" />
                <div className="h-3 bg-gray-100 dark:bg-[#27272A] rounded w-20" />
                <div className="h-5 bg-gray-100 dark:bg-[#27272A] rounded-md w-16" />
              </div>
            ))}
          </div>
        ) : (
          <FraudAlertList alerts={alerts} isAdmin={user?.role === 'admin'} onRefresh={fetchAlerts} />
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="p-1.5 text-gray-400 dark:text-[#71717A] hover:text-gray-600 dark:hover:text-[#A1A1AA] disabled:opacity-30 transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <span className="text-sm text-gray-500 dark:text-[#71717A]">Page {page} of {totalPages}</span>
            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="p-1.5 text-gray-400 dark:text-[#71717A] hover:text-gray-600 dark:hover:text-[#A1A1AA] disabled:opacity-30 transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
