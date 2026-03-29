const ACTION_COLORS = {
  NUMBER_PROVISIONED: 'bg-green-100 text-green-700',
  NUMBER_UPDATED: 'bg-blue-100 text-blue-700',
  NUMBER_STATUS_CHANGED: 'bg-yellow-100 text-yellow-700',
  PORT_REQUESTED: 'bg-purple-100 text-purple-700',
  PORT_APPROVED: 'bg-green-100 text-green-700',
  PORT_REJECTED: 'bg-red-100 text-red-700',
  FRAUD_RESOLVED: 'bg-orange-100 text-orange-700',
};

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function RecentActivity({ logs }) {
  if (!logs || logs.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Recent Activity</h3>
        <p className="text-gray-400 text-sm text-center py-8">No recent activity</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-5">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">Recent Activity</h3>
      <div className="space-y-3">
        {logs.slice(0, 5).map((log) => (
          <div key={log._id} className="flex items-start gap-3">
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap ${
                ACTION_COLORS[log.action] || 'bg-gray-100 text-gray-600'
              }`}
            >
              {log.action?.replace(/_/g, ' ')}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-600 truncate">
                by {log.user?.name || 'System'}
              </p>
              <p className="text-xs text-gray-400">
                {log.timestamp ? timeAgo(log.timestamp) : '—'}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
