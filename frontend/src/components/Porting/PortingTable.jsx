import { Check, X, Flag } from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const STATUS_BADGE = {
  pending: 'bg-amber-400/10 text-amber-400',
  approved: 'bg-emerald-400/10 text-emerald-400',
  rejected: 'bg-red-400/10 text-red-400',
  completed: 'bg-[#0A84FF]/10 text-[#0A84FF]',
  flagged: 'bg-red-400/10 text-red-400',
};

export default function PortingTable({ requests, isAdmin, onRefresh }) {
  const handleApprove = async (id, e) => {
    e.stopPropagation();
    try {
      await api.patch(`/porting/${id}/approve`);
      toast.success('Request approved');
      onRefresh();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to approve');
    }
  };

  const handleReject = async (id, e) => {
    e.stopPropagation();
    try {
      await api.patch(`/porting/${id}/reject`);
      toast.success('Request rejected');
      onRefresh();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reject');
    }
  };

  if (!requests || requests.length === 0) {
    return (
      <div className="bg-[#111114] border border-[#27272A] rounded-xl p-12 text-center text-[#71717A]">
        No porting requests found.
      </div>
    );
  }

  return (
    <div className="bg-[#111114] border border-[#27272A] rounded-xl overflow-hidden">
      <table className="w-full text-sm">
        <thead className="border-b border-[#27272A]">
          <tr>
            <th className="text-left px-4 py-3 text-xs font-semibold text-[#71717A] uppercase tracking-wider bg-[#111114]">Phone Number</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-[#71717A] uppercase tracking-wider bg-[#111114]">From</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-[#71717A] uppercase tracking-wider bg-[#111114]">To</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-[#71717A] uppercase tracking-wider bg-[#111114]">Status</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-[#71717A] uppercase tracking-wider bg-[#111114]">Date</th>
            {isAdmin && <th className="text-left px-4 py-3 text-xs font-semibold text-[#71717A] uppercase tracking-wider bg-[#111114]">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {requests.map((req) => (
            <tr
              key={req._id}
              className={`border-b border-[#27272A]/50 last:border-0 transition-colors ${req.flagged ? 'bg-red-400/5 hover:bg-red-400/10' : 'hover:bg-[#17171A]'}`}
            >
              <td className="px-4 py-3 font-mono text-sm text-[#E4E4E7]">
                <span className="flex items-center gap-1">
                  {req.phoneNumber?.number || '—'}
                  {req.flagged && <Flag size={12} className="text-red-400" />}
                </span>
              </td>
              <td className="px-4 py-3 text-sm text-[#A1A1AA]">{req.fromCarrier}</td>
              <td className="px-4 py-3 text-sm text-[#A1A1AA]">{req.toCarrier}</td>
              <td className="px-4 py-3">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${STATUS_BADGE[req.status] || 'bg-zinc-500/20 text-zinc-400'}`}>
                  {req.status}
                </span>
              </td>
              <td className="px-4 py-3 text-sm text-[#A1A1AA]">
                {req.requestedAt ? new Date(req.requestedAt).toLocaleDateString() : '—'}
              </td>
              {isAdmin && (
                <td className="px-4 py-3">
                  {(req.status === 'pending' || req.status === 'flagged') && (
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => handleApprove(req._id, e)}
                        className="p-1 text-emerald-400 hover:text-emerald-300"
                        title="Approve"
                      >
                        <Check size={16} />
                      </button>
                      <button
                        onClick={(e) => handleReject(req._id, e)}
                        className="p-1 text-red-400 hover:text-red-300"
                        title="Reject"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
