import { Check, X, Flag } from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const STATUS_BADGE = {
  pending: 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400',
  approved: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
  rejected: 'bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400',
  completed: 'bg-violet-50 dark:bg-violet-500/10 text-violet-700 dark:text-violet-400',
  flagged: 'bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400',
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
      <div className="bg-white dark:bg-[#18181B] border border-gray-200 dark:border-[#27272A] rounded-xl shadow-sm p-12 text-center text-gray-400 dark:text-[#71717A] text-sm">
        No porting requests found.
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#18181B] border border-gray-200 dark:border-[#27272A] rounded-xl shadow-sm overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr>
            <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 dark:text-[#71717A] uppercase tracking-wider bg-gray-50 dark:bg-white/[0.02] border-b border-gray-200 dark:border-[#27272A]">Phone Number</th>
            <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 dark:text-[#71717A] uppercase tracking-wider bg-gray-50 dark:bg-white/[0.02] border-b border-gray-200 dark:border-[#27272A]">From</th>
            <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 dark:text-[#71717A] uppercase tracking-wider bg-gray-50 dark:bg-white/[0.02] border-b border-gray-200 dark:border-[#27272A]">To</th>
            <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 dark:text-[#71717A] uppercase tracking-wider bg-gray-50 dark:bg-white/[0.02] border-b border-gray-200 dark:border-[#27272A]">Status</th>
            <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 dark:text-[#71717A] uppercase tracking-wider bg-gray-50 dark:bg-white/[0.02] border-b border-gray-200 dark:border-[#27272A]">Date</th>
            {isAdmin && <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 dark:text-[#71717A] uppercase tracking-wider bg-gray-50 dark:bg-white/[0.02] border-b border-gray-200 dark:border-[#27272A]">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {requests.map((req) => (
            <tr
              key={req._id}
              className={`border-b border-gray-100 dark:border-[#27272A]/40 last:border-0 transition-colors duration-150 ${req.flagged ? 'bg-red-50/50 dark:bg-red-500/5 hover:bg-red-50 dark:hover:bg-red-500/[0.08]' : 'hover:bg-gray-50/80 dark:hover:bg-white/[0.02]'}`}
            >
              <td className="px-4 py-3.5 font-mono text-sm text-gray-900 dark:text-[#F4F4F5]">
                <span className="flex items-center gap-1.5">
                  {req.phoneNumber?.number || '—'}
                  {req.flagged && <Flag size={12} className="text-red-500 dark:text-red-400" />}
                </span>
              </td>
              <td className="px-4 py-3.5 text-sm text-gray-600 dark:text-[#A1A1AA]">{req.fromCarrier}</td>
              <td className="px-4 py-3.5 text-sm text-gray-600 dark:text-[#A1A1AA]">{req.toCarrier}</td>
              <td className="px-4 py-3.5">
                <span className={`text-xs px-2 py-0.5 rounded-md font-medium capitalize ${STATUS_BADGE[req.status] || 'bg-gray-100 dark:bg-[#27272A] text-gray-600 dark:text-[#71717A]'}`}>
                  {req.status}
                </span>
              </td>
              <td className="px-4 py-3.5 text-sm text-gray-600 dark:text-[#A1A1AA]">
                {req.requestedAt ? new Date(req.requestedAt).toLocaleDateString() : '—'}
              </td>
              {isAdmin && (
                <td className="px-4 py-3.5">
                  {(req.status === 'pending' || req.status === 'flagged') && (
                    <div className="flex gap-1">
                      <button
                        onClick={(e) => handleApprove(req._id, e)}
                        className="p-1.5 text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
                        title="Approve"
                      >
                        <Check size={16} />
                      </button>
                      <button
                        onClick={(e) => handleReject(req._id, e)}
                        className="p-1.5 text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 transition-colors"
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
