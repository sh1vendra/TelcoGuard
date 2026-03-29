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
    <div className="flex-1 overflow-auto bg-[#0A0A0B]">
      <Navbar title="Audit Log" />
      <div className="p-6 space-y-4">
        <div>
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="bg-[#111114] border border-[#27272A] rounded-lg px-3 py-2 text-sm text-[#E4E4E7] focus:outline-none focus:border-[#0A84FF] transition-colors"
          >
            <option value="">All Actions</option>
            {ACTIONS.map((a) => (
              <option key={a} value={a}>{a.replace(/_/g, ' ')}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-4 border-[#27272A] border-t-[#0A84FF] rounded-full animate-spin" />
          </div>
        ) : (
          <AuditTable logs={logs} />
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="p-1 text-[#71717A] hover:text-[#E4E4E7] disabled:opacity-30"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="text-sm text-[#71717A]">Page {page} of {totalPages}</span>
            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="p-1 text-[#71717A] hover:text-[#E4E4E7] disabled:opacity-30"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
