import { useState } from 'react';
import { ShieldAlert, CheckCircle } from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const SEVERITY_STYLES = {
  low: 'border-[#27272A] bg-[#111114] border-l-4 border-l-zinc-600',
  medium: 'border-[#27272A] bg-[#111114] border-l-4 border-l-amber-400',
  high: 'border-[#27272A] bg-[#111114] border-l-4 border-l-orange-400',
  critical: 'border-[#27272A] bg-[#111114] border-l-4 border-l-red-400',
};

const SEVERITY_BADGE = {
  low: 'bg-zinc-500/20 text-zinc-400',
  medium: 'bg-amber-400/10 text-amber-400',
  high: 'bg-orange-400/10 text-orange-400',
  critical: 'bg-red-400/10 text-red-400',
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
      <div className="bg-[#111114] border border-[#27272A] rounded-xl p-12 text-center">
        <ShieldAlert className="mx-auto text-[#27272A] mb-3" size={40} />
        <p className="text-[#71717A]">No fraud alerts found</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {alerts.map((alert) => (
        <div
          key={alert._id}
          className={`rounded-xl border p-5 ${SEVERITY_STYLES[alert.severity] || 'border-[#27272A] bg-[#111114]'}`}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold uppercase ${SEVERITY_BADGE[alert.severity] || 'bg-zinc-500/20 text-zinc-400'}`}>
                  {alert.severity}
                </span>
                <span className="text-xs text-[#71717A] capitalize">{alert.alertType?.replace(/-/g, ' ')}</span>
                {alert.resolved && (
                  <span className="text-xs text-emerald-400 flex items-center gap-1">
                    <CheckCircle size={12} />
                    Resolved
                  </span>
                )}
              </div>
              <p className="text-sm text-[#A1A1AA] mb-1">{alert.description || '—'}</p>
              <p className="text-xs text-[#71717A]">
                {new Date(alert.createdAt).toLocaleString()}
              </p>
              {alert.portingRequest && (
                <p className="text-xs text-[#71717A] mt-1">
                  Porting request: {alert.portingRequest._id}
                </p>
              )}
            </div>
            {isAdmin && !alert.resolved && (
              <button
                onClick={() => handleResolve(alert._id)}
                disabled={resolvingId === alert._id}
                className="text-sm bg-[#111114] border border-[#27272A] text-[#A1A1AA] hover:border-[#0A84FF] hover:text-[#0A84FF] px-3 py-1.5 rounded-lg transition-colors disabled:opacity-40 whitespace-nowrap"
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
