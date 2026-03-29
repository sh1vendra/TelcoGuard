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
    <div className="flex-1 overflow-auto">
      <Navbar title="Fraud Alerts" />
      <div className="p-6 space-y-5">
        <FraudStats stats={stats} />

        <div className="flex flex-wrap gap-3">
          <select
            value={filters.severity}
            onChange={(e) => setFilters({ ...filters, severity: e.target.value })}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All</option>
            <option value="false">Unresolved</option>
            <option value="true">Resolved</option>
          </select>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <FraudAlertList alerts={alerts} isAdmin={user?.role === 'admin'} onRefresh={fetchAlerts} />
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="p-1 text-gray-500 hover:text-gray-800 disabled:opacity-30"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="text-sm text-gray-600">Page {page} of {totalPages}</span>
            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="p-1 text-gray-500 hover:text-gray-800 disabled:opacity-30"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
