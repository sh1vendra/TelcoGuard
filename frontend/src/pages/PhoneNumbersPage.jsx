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
    <div className="flex-1 overflow-auto bg-[#FAFAFA] dark:bg-[#09090B] transition-colors duration-200">
      <Navbar title="Phone Numbers" />
      <div className="p-6 max-w-[1280px] mx-auto space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <PhoneFilters filters={filters} onChange={setFilters} />
          {user?.role === 'admin' && (
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
              <Plus size={16} />
              Add Number
            </button>
          )}
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
          <PhoneTable phones={phones} />
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

      {showModal && (
        <AddPhoneModal onClose={() => setShowModal(false)} onCreated={fetchPhones} />
      )}
    </div>
  );
}
