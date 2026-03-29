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
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-[#111114] border border-[#27272A] rounded-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-[#E4E4E7]">New Porting Request</h2>
          <button onClick={onClose} className="text-[#71717A] hover:text-[#E4E4E7]">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#A1A1AA] uppercase tracking-wide mb-1.5">Phone Number *</label>
            <select
              required
              value={form.phoneNumber}
              onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
              className="w-full bg-[#0A0A0B] border border-[#27272A] rounded-lg px-3 py-2 text-sm text-[#E4E4E7] focus:outline-none focus:border-[#0A84FF] transition-colors"
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
            <label className="block text-xs font-medium text-[#A1A1AA] uppercase tracking-wide mb-1.5">From Carrier *</label>
            <input
              required
              value={form.fromCarrier}
              onChange={(e) => setForm({ ...form, fromCarrier: e.target.value })}
              placeholder="Current carrier"
              className="w-full bg-[#0A0A0B] border border-[#27272A] rounded-lg px-3 py-2 text-sm text-[#E4E4E7] focus:outline-none focus:border-[#0A84FF] transition-colors placeholder:text-[#71717A]"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#A1A1AA] uppercase tracking-wide mb-1.5">To Carrier *</label>
            <input
              required
              value={form.toCarrier}
              onChange={(e) => setForm({ ...form, toCarrier: e.target.value })}
              placeholder="New carrier"
              className="w-full bg-[#0A0A0B] border border-[#27272A] rounded-lg px-3 py-2 text-sm text-[#E4E4E7] focus:outline-none focus:border-[#0A84FF] transition-colors placeholder:text-[#71717A]"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#A1A1AA] uppercase tracking-wide mb-1.5">Notes</label>
            <textarea
              rows={2}
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="w-full bg-[#0A0A0B] border border-[#27272A] rounded-lg px-3 py-2 text-sm text-[#E4E4E7] focus:outline-none focus:border-[#0A84FF] transition-colors resize-none placeholder:text-[#71717A]"
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-[#71717A] hover:text-[#E4E4E7] transition-colors">
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-[#0A84FF] text-white text-sm rounded-lg hover:bg-[#0A84FF]/90 disabled:opacity-40 transition-colors"
            >
              {loading ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
