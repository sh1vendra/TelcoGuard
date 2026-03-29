import { useState, useEffect, useCallback } from 'react';
import Navbar from '../components/Layout/Navbar';
import PortingTable from '../components/Porting/PortingTable';
import PortingFilters from '../components/Porting/PortingFilters';
import NewPortingModal from '../components/Porting/NewPortingModal';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';

export default function PortingPage() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({ status: '', flaggedOnly: false });

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 20 };
      if (filters.status) params.status = filters.status;
      if (filters.flaggedOnly) params.flagged = true;
      const { data } = await api.get('/porting', { params });
      setRequests(data.data.requests || []);
      setTotalPages(data.data.totalPages || 1);
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
    fetchRequests();
  }, [fetchRequests]);

  return (
    <div className="flex-1 overflow-auto">
      <Navbar title="Porting Requests" />
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <PortingFilters filters={filters} onChange={setFilters} />
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg transition-colors"
          >
            <Plus size={16} />
            New Request
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <PortingTable requests={requests} isAdmin={user?.role === 'admin'} onRefresh={fetchRequests} />
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

      {showModal && (
        <NewPortingModal onClose={() => setShowModal(false)} onCreated={fetchRequests} />
      )}
    </div>
  );
}
