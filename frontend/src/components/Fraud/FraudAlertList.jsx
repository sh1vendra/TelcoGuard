import { useState } from 'react';
import { ShieldAlert, CheckCircle } from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const SEVERITY_CARD = {
  low: 'bg-white dark:bg-[#18181B] border border-gray-200 dark:border-[#27272A] border-l-2 border-l-gray-300 dark:border-l-[#52525B]',
  medium: 'bg-white dark:bg-[#18181B] border border-gray-200 dark:border-[#27272A] border-l-2 border-l-amber-400',
  high: 'bg-white dark:bg-[#18181B] border border-gray-200 dark:border-[#27272A] border-l-2 border-l-orange-500',
  critical: 'bg-white dark:bg-[#18181B] border border-gray-200 dark:border-[#27272A] border-l-2 border-l-red-500',
};

const SEVERITY_BADGE = {
  low: 'bg-gray-100 dark:bg-[#27272A] text-gray-600 dark:text-[#71717A]',
  medium: 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400',
  high: 'bg-orange-50 dark:bg-orange-500/10 text-orange-700 dark:text-orange-400',
  critical: 'bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400',
};

export default function FraudAlertList({ alerts, isAdmin, onRefresh }) {
  const [resolvingId, setResolvingId] = useState(null);

  const handleResolve = async (id) => {
    setResolvingId(id);
    try {
      await api.patch(`/fraud/${id}/resolve`, { resolutionNotes: 'Resolved via dashboard' });
      toast.success('Alert resolved');
      onRefresh();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to resolve');
    } finally {
      setResolvingId(null);
    }
  };

  if (!alerts || alerts.length === 0) {
    return (
      <div className="bg-white dark:bg-[#18181B] border border-gray-200 dark:border-[#27272A] rounded-xl shadow-sm p-12 text-center">
        <ShieldAlert className="text-gray-200 dark:text-[#27272A] mx-auto mb-3" size={40} />
        <p className="text-gray-400 dark:text-[#71717A] text-sm">No fraud alerts found</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {alerts.map((alert) => (
        <div
          key={alert._id}
          className={`rounded-xl p-4 shadow-sm ${SEVERITY_CARD[alert.severity] || 'bg-white dark:bg-[#18181B] border border-gray-200 dark:border-[#27272A]'}`}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-xs px-2 py-0.5 rounded-md font-medium capitalize ${SEVERITY_BADGE[alert.severity] || 'bg-gray-100 dark:bg-[#27272A] text-gray-600 dark:text-[#71717A]'}`}>
                  {alert.severity}
                </span>
                <span className="text-xs text-gray-400 dark:text-[#71717A] capitalize">{alert.alertType?.replace(/-/g, ' ')}</span>
                {alert.resolved && (
                  <span className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
                    <CheckCircle size={12} />
                    Resolved
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-700 dark:text-[#A1A1AA] mb-1">{alert.description || '—'}</p>
              <p className="text-xs text-gray-400 dark:text-[#71717A]">
                {new Date(alert.createdAt).toLocaleString()}
              </p>
              {alert.portingRequest && (
                <p className="text-xs text-gray-400 dark:text-[#71717A] mt-1">
                  Porting request: {alert.portingRequest._id}
                </p>
              )}
            </div>
            {isAdmin && !alert.resolved && (
              <button
                onClick={() => handleResolve(alert._id)}
                disabled={resolvingId === alert._id}
                className="text-xs bg-white dark:bg-transparent border border-gray-200 dark:border-[#27272A] text-gray-600 dark:text-[#A1A1AA] hover:border-emerald-400 hover:text-emerald-600 dark:hover:border-emerald-500 dark:hover:text-emerald-400 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-40 whitespace-nowrap"
              >
                {resolvingId === alert._id ? 'Resolving...' : 'Resolve'}
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
