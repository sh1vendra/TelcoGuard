const ACTION_BADGE = {
  NUMBER_PROVISIONED: 'bg-emerald-400/10 text-emerald-400',
  NUMBER_UPDATED: 'bg-[#0A84FF]/10 text-[#0A84FF]',
  NUMBER_STATUS_CHANGED: 'bg-amber-400/10 text-amber-400',
  PORT_REQUESTED: 'bg-purple-400/10 text-purple-400',
  PORT_APPROVED: 'bg-emerald-400/10 text-emerald-400',
  PORT_REJECTED: 'bg-red-400/10 text-red-400',
  FRAUD_RESOLVED: 'bg-orange-400/10 text-orange-400',
};

export default function AuditTable({ logs }) {
  if (!logs || logs.length === 0) {
    return (
      <div className="bg-[#111114] border border-[#27272A] rounded-xl p-12 text-center text-[#71717A]">
        No audit logs found.
      </div>
    );
  }

  return (
    <div className="bg-[#111114] border border-[#27272A] rounded-xl overflow-hidden">
      <table className="w-full text-sm">
        <thead className="border-b border-[#27272A]">
          <tr>
            <th className="text-left px-4 py-3 text-xs font-semibold text-[#71717A] uppercase tracking-wider bg-[#111114]">Action</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-[#71717A] uppercase tracking-wider bg-[#111114]">Performed By</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-[#71717A] uppercase tracking-wider bg-[#111114]">Target</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-[#71717A] uppercase tracking-wider bg-[#111114]">Details</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-[#71717A] uppercase tracking-wider bg-[#111114]">Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log._id} className="border-b border-[#27272A]/50 last:border-0 hover:bg-[#17171A] transition-colors">
              <td className="px-4 py-3">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${ACTION_BADGE[log.action] || 'bg-zinc-500/20 text-zinc-400'}`}>
                  {log.action?.replace(/_/g, ' ')}
                </span>
              </td>
              <td className="px-4 py-3 text-sm text-[#E4E4E7]">{log.user?.name || '—'}</td>
              <td className="px-4 py-3 text-xs text-[#71717A]">{log.targetType || '—'}</td>
              <td className="px-4 py-3 text-xs text-[#71717A] max-w-xs truncate">
                {log.details ? JSON.stringify(log.details) : '—'}
              </td>
              <td className="px-4 py-3 text-xs text-[#71717A]">
                {log.timestamp ? new Date(log.timestamp).toLocaleString() : '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
