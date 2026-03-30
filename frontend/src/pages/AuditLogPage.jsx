import { useState, useEffect, useCallback } from 'react';
import Navbar from '../components/Layout/Navbar';
import AuditTable from '../components/AuditLog/AuditTable';
import api from '../api/axios';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ACTIONS = [
  'NUMBER_PROVISIONED',
  'NUMBER_UPDATED',
  'NUMBER_STATUS_CHANGED',
  'PORT_REQUESTED',
  'PORT_APPROVED',
  'PORT_REJECTED',
  'FRAUD_RESOLVED',
];

export default function AuditLogPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [actionFilter, setActionFilter] = useState('');

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 20 };
      if (actionFilter) params.action = actionFilter;
      const { data } = await api.get('/audit', { params });
      setLogs(data.data?.logs || []);
      setTotalPages(data.data?.totalPages || 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, actionFilter]);

  useEffect(() => {
    setPage(1);
  }, [actionFilter]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  return (
    <div className="flex-1 overflow-auto bg-[#FAFAFA] dark:bg-[#09090B] transition-colors duration-200">
      <Navbar title="Audit Log" />
      <div className="p-6 max-w-[1280px] mx-auto space-y-5">
        <div>
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="bg-white dark:bg-[#18181B] border border-gray-200 dark:border-[#27272A] rounded-lg px-3 py-2 text-sm text-gray-700 dark:text-[#A1A1AA] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
          >
            <option value="">All Actions</option>
            {ACTIONS.map((a) => (
              <option key={a} value={a}>{a.replace(/_/g, ' ')}</option>
            ))}
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
          <AuditTable logs={logs} />
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
