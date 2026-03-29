import { Phone, ArrowLeftRight, ShieldAlert, CheckCircle } from 'lucide-react';

const cards = [
  { key: 'total', label: 'Total Numbers', icon: Phone, iconColor: 'text-[#0A84FF]', iconBg: 'bg-[#0A84FF]/10' },
  { key: 'porting', label: 'Active Porting', icon: ArrowLeftRight, iconColor: 'text-amber-400', iconBg: 'bg-amber-400/10' },
  { key: 'fraud', label: 'Fraud Alerts', icon: ShieldAlert, iconColor: 'text-red-400', iconBg: 'bg-red-400/10' },
  { key: 'available', label: 'Available', icon: CheckCircle, iconColor: 'text-emerald-400', iconBg: 'bg-emerald-400/10' },
];

export default function StatsCards({ stats }) {
  const values = {
    total: stats?.phoneStats?.total ?? '—',
    porting: stats?.portingStats?.active ?? '—',
    fraud: stats?.fraudStats?.unresolved ?? '—',
    available: stats?.phoneStats?.available ?? '—',
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map(({ key, label, icon: Icon, iconColor, iconBg }) => (
        <div key={key} className="bg-[#111114] border border-[#27272A] rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-medium text-[#71717A] uppercase tracking-widest">{label}</span>
            <div className={`${iconBg} p-2 rounded-lg`}>
              <Icon className={iconColor} size={16} />
            </div>
          </div>
          <div className="text-3xl font-bold text-[#E4E4E7] tabular-nums">{values[key]}</div>
        </div>
      ))}
    </div>
  );
}
