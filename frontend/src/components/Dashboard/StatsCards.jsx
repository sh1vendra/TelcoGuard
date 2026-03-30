import { Phone, ArrowLeftRight, ShieldAlert, CheckCircle } from 'lucide-react';

const cards = [
  {
    key: 'total',
    label: 'Total Numbers',
    icon: Phone,
    iconBg: 'bg-blue-50 dark:bg-blue-500/10',
    iconColor: 'text-blue-600 dark:text-blue-400',
  },
  {
    key: 'porting',
    label: 'Active Porting',
    icon: ArrowLeftRight,
    iconBg: 'bg-amber-50 dark:bg-amber-500/10',
    iconColor: 'text-amber-600 dark:text-amber-400',
  },
  {
    key: 'fraud',
    label: 'Fraud Alerts',
    icon: ShieldAlert,
    iconBg: 'bg-red-50 dark:bg-red-500/10',
    iconColor: 'text-red-600 dark:text-red-400',
  },
  {
    key: 'available',
    label: 'Available',
    icon: CheckCircle,
    iconBg: 'bg-emerald-50 dark:bg-emerald-500/10',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
  },
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
      {cards.map(({ key, label, icon: Icon, iconBg, iconColor }) => (
        <div
          key={key}
          className="bg-white dark:bg-[#18181B] border border-gray-200 dark:border-[#27272A] rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow duration-150"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-medium text-gray-500 dark:text-[#71717A]">{label}</span>
            <div className={`${iconBg} p-2 rounded-lg`}>
              <Icon className={iconColor} size={16} strokeWidth={1.75} />
            </div>
          </div>
          <div className="text-[28px] font-semibold text-gray-900 dark:text-[#F4F4F5] tabular-nums leading-none">
            {values[key]}
          </div>
        </div>
      ))}
    </div>
  );
}
