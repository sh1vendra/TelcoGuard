const ACTION_COLORS = {
  NUMBER_PROVISIONED: 'bg-emerald-400/10 text-emerald-400',
  NUMBER_UPDATED: 'bg-[#0A84FF]/10 text-[#0A84FF]',
  NUMBER_STATUS_CHANGED: 'bg-amber-400/10 text-amber-400',
  PORT_REQUESTED: 'bg-purple-400/10 text-purple-400',
  PORT_APPROVED: 'bg-emerald-400/10 text-emerald-400',
  PORT_REJECTED: 'bg-red-400/10 text-red-400',
  FRAUD_RESOLVED: 'bg-orange-400/10 text-orange-400',
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
      <div className="bg-[#111114] border border-[#27272A] rounded-xl p-5">
        <h3 className="text-xs font-semibold text-[#A1A1AA] uppercase tracking-wide mb-4">Recent Activity</h3>
        <p className="text-[#71717A] text-sm text-center py-8">No recent activity</p>
      </div>
    );
  }

  return (
    <div className="bg-[#111114] border border-[#27272A] rounded-xl p-5">
      <h3 className="text-xs font-semibold text-[#A1A1AA] uppercase tracking-wide mb-4">Recent Activity</h3>
      <div className="space-y-3">
        {logs.slice(0, 5).map((log) => (
          <div key={log._id} className="flex items-start gap-3">
            <span
              className={`text-xs px-2 py-0.5 rounded font-medium whitespace-nowrap ${
                ACTION_COLORS[log.action] || 'bg-[#27272A] text-[#71717A]'
              }`}
            >
              {log.action?.replace(/_/g, ' ')}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-[#A1A1AA] truncate">
                by {log.user?.name || 'System'}
              </p>
              <p className="text-xs text-[#71717A]">
                {log.timestamp ? timeAgo(log.timestamp) : '—'}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
