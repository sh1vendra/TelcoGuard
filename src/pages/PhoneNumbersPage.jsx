import { useState, useEffect, useCallback } from 'react';
import Navbar from '../components/Layout/Navbar';
import PhoneTable from '../components/PhoneNumbers/PhoneTable';
import PhoneFilters from '../components/PhoneNumbers/PhoneFilters';
import AddPhoneModal from '../components/PhoneNumbers/AddPhoneModal';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';

export default function PhoneNumbersPage() {
  const { user } = useAuth();
  const [phones, setPhones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({ status: '', type: '', search: '' });

  const fetchPhones = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 20 };
      if (filters.status) params.status = filters.status;
      if (filters.type) params.type = filters.type;
      if (filters.search) params.search = filters.search;
      const { data } = await api.get('/phones', { params });
      setPhones(data.data.phones || []);
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
    fetchPhones();
  }, [fetchPhones]);

  return (
    <div className="flex-1 overflow-auto">
      <Navbar title="Phone Numbers" />
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <PhoneFilters filters={filters} onChange={setFilters} />
          {user?.role === 'admin' && (
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg transition-colors"
            >
              <Plus size={16} />
              Add Number
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <PhoneTable phones={phones} />
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
            <span className="text-sm text-gray-600">
              Page {page} of {totalPages}
            </span>
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
        <AddPhoneModal onClose={() => setShowModal(false)} onCreated={fetchPhones} />
      )}
    </div>
  );
}
