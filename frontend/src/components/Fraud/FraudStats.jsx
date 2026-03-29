export default function FraudStats({ stats }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      <div className="bg-[#111114] border border-[#27272A] rounded-xl p-4">
        <div className="text-2xl font-bold text-[#E4E4E7]">{stats?.total ?? '—'}</div>
        <div className="text-xs text-[#71717A] mt-1">Total Alerts</div>
      </div>
      <div className="bg-[#111114] border border-[#27272A] rounded-xl p-4">
        <div className="text-2xl font-bold text-red-400">{stats?.unresolved ?? '—'}</div>
        <div className="text-xs text-[#71717A] mt-1">Unresolved</div>
      </div>
      {(stats?.bySeverity || []).map((s) => (
        <div key={s._id} className="bg-[#111114] border border-[#27272A] rounded-xl p-4">
          <div className="text-2xl font-bold text-[#E4E4E7]">{s.count}</div>
          <div className="text-xs text-[#71717A] mt-1 capitalize">{s._id} severity</div>
        </div>
      ))}
    </div>
  );
}
