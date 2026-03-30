import { useState } from 'react';
import { X } from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

export default function AddPhoneModal({ onClose, onCreated }) {
  const [form, setForm] = useState({
    number: '',
    type: 'local',
    status: 'available',
    carrier: '',
    assignedTo: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...form };
      if (!payload.carrier) delete payload.carrier;
      if (!payload.assignedTo) delete payload.assignedTo;
      if (!payload.notes) delete payload.notes;
      await api.post('/phones', payload);
      toast.success('Phone number created');
      onCreated();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create phone number');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 dark:bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white dark:bg-[#18181B] border border-gray-200 dark:border-[#27272A] rounded-xl w-full max-w-md p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-gray-900 dark:text-[#F4F4F5]">Add Phone Number</h2>
          <button onClick={onClose} className="text-gray-400 dark:text-[#71717A] hover:text-gray-600 dark:hover:text-[#A1A1AA] transition-colors">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-[#A1A1AA] mb-1.5">Number *</label>
            <input
              required
              value={form.number}
              onChange={(e) => setForm({ ...form, number: e.target.value })}
              placeholder="+12025551234"
              className="w-full bg-white dark:bg-[#09090B] border border-gray-200 dark:border-[#27272A] rounded-lg px-3.5 py-2.5 text-sm text-gray-900 dark:text-[#F4F4F5] placeholder-gray-400 dark:placeholder-[#52525B] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-500 transition-colors"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-[#A1A1AA] mb-1.5">Type</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full bg-white dark:bg-[#18181B] border border-gray-200 dark:border-[#27272A] rounded-lg px-3 py-2 text-sm text-gray-700 dark:text-[#A1A1AA] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
              >
                <option value="local">Local</option>
                <option value="toll-free">Toll-Free</option>
                <option value="mobile">Mobile</option>
                <option value="voip">VoIP</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-[#A1A1AA] mb-1.5">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full bg-white dark:bg-[#18181B] border border-gray-200 dark:border-[#27272A] rounded-lg px-3 py-2 text-sm text-gray-700 dark:text-[#A1A1AA] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
              >
                <option value="available">Available</option>
                <option value="assigned">Assigned</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-[#A1A1AA] mb-1.5">Carrier</label>
            <input
              value={form.carrier}
              onChange={(e) => setForm({ ...form, carrier: e.target.value })}
              placeholder="AT&T"
              className="w-full bg-white dark:bg-[#09090B] border border-gray-200 dark:border-[#27272A] rounded-lg px-3.5 py-2.5 text-sm text-gray-900 dark:text-[#F4F4F5] placeholder-gray-400 dark:placeholder-[#52525B] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-[#A1A1AA] mb-1.5">Assigned To</label>
            <input
              value={form.assignedTo}
              onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}
              placeholder="customer-001"
              className="w-full bg-white dark:bg-[#09090B] border border-gray-200 dark:border-[#27272A] rounded-lg px-3.5 py-2.5 text-sm text-gray-900 dark:text-[#F4F4F5] placeholder-gray-400 dark:placeholder-[#52525B] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-500 transition-colors"
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
              {loading ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
