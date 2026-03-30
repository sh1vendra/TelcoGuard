export default function FraudStats({ stats }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      <div className="bg-white dark:bg-[#18181B] border border-gray-200 dark:border-[#27272A] rounded-xl shadow-sm p-4">
        <div className="text-2xl font-semibold text-gray-900 dark:text-[#F4F4F5]">{stats?.total ?? '—'}</div>
        <div className="text-xs text-gray-500 dark:text-[#71717A] mt-1">Total Alerts</div>
      </div>
      <div className="bg-white dark:bg-[#18181B] border border-gray-200 dark:border-[#27272A] rounded-xl shadow-sm p-4">
        <div className="text-2xl font-semibold text-red-600 dark:text-red-400">{stats?.unresolved ?? '—'}</div>
        <div className="text-xs text-gray-500 dark:text-[#71717A] mt-1">Unresolved</div>
      </div>
      {(stats?.bySeverity || []).map((s) => (
        <div key={s._id} className="bg-white dark:bg-[#18181B] border border-gray-200 dark:border-[#27272A] rounded-xl shadow-sm p-4">
          <div className="text-2xl font-semibold text-gray-900 dark:text-[#F4F4F5]">{s.count}</div>
          <div className="text-xs text-gray-500 dark:text-[#71717A] mt-1 capitalize">{s._id} severity</div>
        </div>
      ))}
    </div>
  );
}
