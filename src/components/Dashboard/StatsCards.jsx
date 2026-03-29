import { Phone, ArrowLeftRight, ShieldAlert, CheckCircle } from 'lucide-react';

const cards = [
  { key: 'total', label: 'Total Numbers', icon: Phone, color: 'blue' },
  { key: 'porting', label: 'Active Porting', icon: ArrowLeftRight, color: 'orange' },
  { key: 'fraud', label: 'Fraud Alerts', icon: ShieldAlert, color: 'red' },
  { key: 'available', label: 'Available', icon: CheckCircle, color: 'green' },
];

const colorMap = {
  blue: { bg: 'bg-blue-50', icon: 'text-blue-600', text: 'text-blue-700' },
  orange: { bg: 'bg-orange-50', icon: 'text-orange-600', text: 'text-orange-700' },
  red: { bg: 'bg-red-50', icon: 'text-red-600', text: 'text-red-700' },
  green: { bg: 'bg-green-50', icon: 'text-green-600', text: 'text-green-700' },
};

export default function StatsCards({ stats }) {
  const values = {
    total: stats?.phoneStats?.total ?? '—',
    porting: stats?.portingStats?.active ?? '—',
    fraud: stats?.fraudStats?.unresolved ?? '—',
    available: stats?.phoneStats?.available ?? '—',
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map(({ key, label, icon: Icon, color }) => {
        const c = colorMap[color];
        return (
          <div key={key} className="bg-white rounded-xl shadow-sm p-5 flex items-center gap-4">
            <div className={`${c.bg} p-3 rounded-lg`}>
              <Icon className={c.icon} size={22} />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800">{values[key]}</div>
              <div className="text-sm text-gray-500">{label}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
