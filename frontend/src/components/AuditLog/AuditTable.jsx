const ACTION_BADGE = {
  NUMBER_PROVISIONED: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
  NUMBER_UPDATED: 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400',
  NUMBER_STATUS_CHANGED: 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400',
  PORT_REQUESTED: 'bg-violet-50 dark:bg-violet-500/10 text-violet-700 dark:text-violet-400',
  PORT_APPROVED: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
  PORT_REJECTED: 'bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400',
  FRAUD_RESOLVED: 'bg-orange-50 dark:bg-orange-500/10 text-orange-700 dark:text-orange-400',
};

export default function AuditTable({ logs }) {
  if (!logs || logs.length === 0) {
    return (
      <div className="bg-white dark:bg-[#18181B] border border-gray-200 dark:border-[#27272A] rounded-xl shadow-sm p-12 text-center text-gray-400 dark:text-[#71717A] text-sm">
        No audit logs found.
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#18181B] border border-gray-200 dark:border-[#27272A] rounded-xl shadow-sm overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr>
            <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 dark:text-[#71717A] uppercase tracking-wider bg-gray-50 dark:bg-white/[0.02] border-b border-gray-200 dark:border-[#27272A]">Action</th>
            <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 dark:text-[#71717A] uppercase tracking-wider bg-gray-50 dark:bg-white/[0.02] border-b border-gray-200 dark:border-[#27272A]">Performed By</th>
            <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 dark:text-[#71717A] uppercase tracking-wider bg-gray-50 dark:bg-white/[0.02] border-b border-gray-200 dark:border-[#27272A]">Target</th>
            <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 dark:text-[#71717A] uppercase tracking-wider bg-gray-50 dark:bg-white/[0.02] border-b border-gray-200 dark:border-[#27272A]">Details</th>
            <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 dark:text-[#71717A] uppercase tracking-wider bg-gray-50 dark:bg-white/[0.02] border-b border-gray-200 dark:border-[#27272A]">Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log._id} className="border-b border-gray-100 dark:border-[#27272A]/40 last:border-0 hover:bg-gray-50/80 dark:hover:bg-white/[0.02] transition-colors duration-150">
              <td className="px-4 py-3.5">
                <span className={`text-xs px-2 py-0.5 rounded-md font-medium ${ACTION_BADGE[log.action] || 'bg-gray-100 dark:bg-[#27272A] text-gray-600 dark:text-[#71717A]'}`}>
                  {log.action?.replace(/_/g, ' ')}
                </span>
              </td>
              <td className="px-4 py-3.5 text-sm text-gray-900 dark:text-[#F4F4F5]">{log.user?.name || '—'}</td>
              <td className="px-4 py-3.5 text-sm text-gray-400 dark:text-[#71717A]">{log.targetType || '—'}</td>
              <td className="px-4 py-3.5 text-sm text-gray-400 dark:text-[#71717A] max-w-xs truncate">
                {log.details ? JSON.stringify(log.details) : '—'}
              </td>
              <td className="px-4 py-3.5 text-sm text-gray-400 dark:text-[#71717A]">
                {log.timestamp ? new Date(log.timestamp).toLocaleString() : '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
