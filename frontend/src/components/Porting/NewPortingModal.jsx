import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

export default function NewPortingModal({ onClose, onCreated }) {
  const [phones, setPhones] = useState([]);
  const [form, setForm] = useState({ phoneNumber: '', fromCarrier: '', toCarrier: '', notes: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/phones?limit=100').then(({ data }) => setPhones(data.data.phones || []));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...form };
      if (!payload.notes) delete payload.notes;
      await api.post('/porting', payload);
      toast.success('Porting request submitted');
      onCreated();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create porting request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 dark:bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white dark:bg-[#18181B] border border-gray-200 dark:border-[#27272A] rounded-xl w-full max-w-md p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-gray-900 dark:text-[#F4F4F5]">New Porting Request</h2>
          <button onClick={onClose} className="text-gray-400 dark:text-[#71717A] hover:text-gray-600 dark:hover:text-[#A1A1AA] transition-colors">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-[#A1A1AA] mb-1.5">Phone Number *</label>
            <select
              required
              value={form.phoneNumber}
              onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
              className="w-full bg-white dark:bg-[#18181B] border border-gray-200 dark:border-[#27272A] rounded-lg px-3 py-2 text-sm text-gray-700 dark:text-[#A1A1AA] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
            >
              <option value="">Select number...</option>
              {phones.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.number} ({p.status})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-[#A1A1AA] mb-1.5">From Carrier *</label>
            <input
              required
              value={form.fromCarrier}
              onChange={(e) => setForm({ ...form, fromCarrier: e.target.value })}
              placeholder="Current carrier"
              className="w-full bg-white dark:bg-[#09090B] border border-gray-200 dark:border-[#27272A] rounded-lg px-3.5 py-2.5 text-sm text-gray-900 dark:text-[#F4F4F5] placeholder-gray-400 dark:placeholder-[#52525B] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-[#A1A1AA] mb-1.5">To Carrier *</label>
            <input
              required
              value={form.toCarrier}
              onChange={(e) => setForm({ ...form, toCarrier: e.target.value })}
              placeholder="New carrier"
              className="w-full bg-white dark:bg-[#09090B] border border-gray-200 dark:border-[#27272A] rounded-lg px-3.5 py-2.5 text-sm text-gray-900 dark:text-[#F4F4F5] placeholder-gray-400 dark:placeholder-[#52525B] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-[#A1A1AA] mb-1.5">Notes</label>
            <textarea
              rows={2}
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="w-full bg-white dark:bg-[#09090B] border border-gray-200 dark:border-[#27272A] rounded-lg px-3.5 py-2.5 text-sm text-gray-900 dark:text-[#F4F4F5] placeholder-gray-400 dark:placeholder-[#52525B] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-500 transition-colors resize-none"
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-600 dark:text-[#A1A1AA] hover:text-gray-900 dark:hover:text-[#F4F4F5] transition-colors">
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
