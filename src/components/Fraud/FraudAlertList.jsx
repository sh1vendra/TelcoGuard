import { useState } from 'react';
import { ShieldAlert, CheckCircle } from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const SEVERITY_STYLES = {
  low: 'border-gray-200 bg-white',
  medium: 'border-yellow-200 bg-yellow-50',
  high: 'border-orange-200 bg-orange-50',
  critical: 'border-red-300 bg-red-50',
};

const SEVERITY_BADGE = {
  low: 'bg-gray-100 text-gray-600',
  medium: 'bg-yellow-100 text-yellow-700',
  high: 'bg-orange-100 text-orange-700',
  critical: 'bg-red-100 text-red-700',
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
      <div className="bg-white rounded-xl shadow-sm p-12 text-center">
        <ShieldAlert className="mx-auto text-gray-300 mb-3" size={40} />
        <p className="text-gray-400">No fraud alerts found</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {alerts.map((alert) => (
        <div
          key={alert._id}
          className={`rounded-xl border p-5 ${SEVERITY_STYLES[alert.severity] || 'bg-white border-gray-200'}`}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold uppercase ${SEVERITY_BADGE[alert.severity] || 'bg-gray-100 text-gray-600'}`}>
                  {alert.severity}
                </span>
                <span className="text-xs text-gray-500 capitalize">{alert.alertType?.replace(/-/g, ' ')}</span>
                {alert.resolved && (
                  <span className="flex items-center gap-1 text-xs text-green-600">
                    <CheckCircle size={12} />
                    Resolved
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-700 mb-1">{alert.description || '—'}</p>
              <p className="text-xs text-gray-400">
                {new Date(alert.createdAt).toLocaleString()}
              </p>
              {alert.portingRequest && (
                <p className="text-xs text-gray-500 mt-1">
                  Porting request: {alert.portingRequest._id}
                </p>
              )}
            </div>
            {isAdmin && !alert.resolved && (
              <button
                onClick={() => handleResolve(alert._id)}
                disabled={resolvingId === alert._id}
                className="text-sm bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50 whitespace-nowrap"
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
