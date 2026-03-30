const ACTION_DOTS = {
  NUMBER_PROVISIONED: 'bg-emerald-500',
  NUMBER_UPDATED: 'bg-blue-500',
  NUMBER_STATUS_CHANGED: 'bg-amber-500',
  PORT_REQUESTED: 'bg-violet-500',
  PORT_APPROVED: 'bg-emerald-500',
  PORT_REJECTED: 'bg-red-500',
  FRAUD_RESOLVED: 'bg-orange-500',
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
  return (
    <div className="bg-white dark:bg-[#18181B] border border-gray-200 dark:border-[#27272A] rounded-xl shadow-sm p-5">
      <h3 className="text-xs font-semibold text-gray-500 dark:text-[#71717A] uppercase tracking-wider mb-4">
        Recent Activity
      </h3>
      {!logs || logs.length === 0 ? (
        <p className="text-gray-400 dark:text-[#71717A] text-sm text-center py-6">No recent activity</p>
      ) : (
        <div className="space-y-3">
          {logs.slice(0, 5).map((log) => (
            <div key={log._id} className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full shrink-0 ${ACTION_DOTS[log.action] || 'bg-gray-400'}`} />
              <div className="flex-1 flex items-center justify-between gap-4 min-w-0">
                <div className="min-w-0">
                  <span className="text-sm text-gray-700 dark:text-[#A1A1AA] capitalize">
                    {log.action?.replace(/_/g, ' ').toLowerCase()}
                  </span>
                  <span className="text-sm text-gray-400 dark:text-[#71717A]"> · {log.user?.name || 'System'}</span>
                </div>
                <span className="text-xs text-gray-400 dark:text-[#71717A] shrink-0">
                  {log.timestamp ? timeAgo(log.timestamp) : '—'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
