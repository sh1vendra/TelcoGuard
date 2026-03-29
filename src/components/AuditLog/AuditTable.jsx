const ACTION_BADGE = {
  NUMBER_PROVISIONED: 'bg-green-100 text-green-700',
  NUMBER_UPDATED: 'bg-blue-100 text-blue-700',
  NUMBER_STATUS_CHANGED: 'bg-yellow-100 text-yellow-700',
  PORT_REQUESTED: 'bg-purple-100 text-purple-700',
  PORT_APPROVED: 'bg-green-100 text-green-700',
  PORT_REJECTED: 'bg-red-100 text-red-700',
  FRAUD_RESOLVED: 'bg-orange-100 text-orange-700',
};

export default function AuditTable({ logs }) {
  if (!logs || logs.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-12 text-center text-gray-400">
        No audit logs found.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Action</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Performed By</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Target</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Details</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Timestamp</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {logs.map((log) => (
            <tr key={log._id} className="hover:bg-gray-50">
              <td className="px-4 py-3">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${ACTION_BADGE[log.action] || 'bg-gray-100 text-gray-600'}`}>
                  {log.action?.replace(/_/g, ' ')}
                </span>
              </td>
              <td className="px-4 py-3 text-gray-700">{log.user?.name || '—'}</td>
              <td className="px-4 py-3 text-gray-500 text-xs">{log.targetType || '—'}</td>
              <td className="px-4 py-3 text-gray-500 text-xs max-w-xs truncate">
                {log.details ? JSON.stringify(log.details) : '—'}
              </td>
              <td className="px-4 py-3 text-gray-400 text-xs">
                {log.timestamp ? new Date(log.timestamp).toLocaleString() : '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
