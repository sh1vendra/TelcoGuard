import { Check, X, Flag } from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const STATUS_BADGE = {
  pending: 'bg-yellow-100 text-yellow-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
  completed: 'bg-blue-100 text-blue-700',
  flagged: 'bg-purple-100 text-purple-700',
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
      <div className="bg-white rounded-xl shadow-sm p-12 text-center text-gray-400">
        No porting requests found.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Phone Number</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">From</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">To</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Date</th>
            {isAdmin && <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {requests.map((req) => (
            <tr
              key={req._id}
              className={req.flagged ? 'bg-red-50 hover:bg-red-100' : 'hover:bg-gray-50'}
            >
              <td className="px-4 py-3 font-mono text-gray-800">
                <span className="flex items-center gap-1">
                  {req.phoneNumber?.number || '—'}
                  {req.flagged && <Flag size={12} className="text-red-500" />}
                </span>
              </td>
              <td className="px-4 py-3 text-gray-600">{req.fromCarrier}</td>
              <td className="px-4 py-3 text-gray-600">{req.toCarrier}</td>
              <td className="px-4 py-3">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${STATUS_BADGE[req.status] || 'bg-gray-100 text-gray-600'}`}>
                  {req.status}
                </span>
              </td>
              <td className="px-4 py-3 text-gray-500 text-xs">
                {req.requestedAt ? new Date(req.requestedAt).toLocaleDateString() : '—'}
              </td>
              {isAdmin && (
                <td className="px-4 py-3">
                  {(req.status === 'pending' || req.status === 'flagged') && (
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => handleApprove(req._id, e)}
                        className="p-1 text-green-600 hover:text-green-800"
                        title="Approve"
                      >
                        <Check size={16} />
                      </button>
                      <button
                        onClick={(e) => handleReject(req._id, e)}
                        className="p-1 text-red-500 hover:text-red-700"
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
