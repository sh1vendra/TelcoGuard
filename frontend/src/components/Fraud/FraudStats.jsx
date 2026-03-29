const statCards = [
  { key: 'total', label: 'Total Alerts', color: 'text-gray-800' },
  { key: 'unresolved', label: 'Unresolved', color: 'text-red-600' },
];

export default function FraudStats({ stats }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="text-2xl font-bold text-gray-800">{stats?.total ?? '—'}</div>
        <div className="text-sm text-gray-500">Total Alerts</div>
      </div>
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="text-2xl font-bold text-red-600">{stats?.unresolved ?? '—'}</div>
        <div className="text-sm text-gray-500">Unresolved</div>
      </div>
      {(stats?.bySeverity || []).map((s) => (
        <div key={s._id} className="bg-white rounded-xl shadow-sm p-4">
          <div className="text-2xl font-bold text-gray-800">{s.count}</div>
          <div className="text-sm text-gray-500 capitalize">{s._id} severity</div>
        </div>
      ))}
    </div>
  );
}
