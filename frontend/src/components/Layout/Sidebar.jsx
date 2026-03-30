import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Phone,
  ArrowLeftRight,
  ShieldAlert,
  ClipboardList,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/phones', icon: Phone, label: 'Phone Numbers' },
  { to: '/porting', icon: ArrowLeftRight, label: 'Porting' },
  { to: '/fraud', icon: ShieldAlert, label: 'Fraud Alerts' },
  { to: '/audit', icon: ClipboardList, label: 'Audit Log' },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out');
    navigate('/login');
  };

  const initials = user?.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <aside className="w-60 bg-white dark:bg-[#18181B] border-r border-gray-200 dark:border-[#27272A] flex flex-col min-h-screen transition-colors duration-200">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 h-14 border-b border-gray-200 dark:border-[#27272A]">
        <img src="/Telcoguard-logo.png" alt="TelcoGuard" className="h-7 w-auto shrink-0" />
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-3 space-y-0.5">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `relative flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors duration-150 ${
                isActive
                  ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 font-medium'
                  : 'text-gray-600 dark:text-[#A1A1AA] hover:bg-gray-100 dark:hover:bg-white/[0.04] hover:text-gray-900 dark:hover:text-[#F4F4F5]'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-blue-600 dark:bg-blue-400 rounded-r" />
                )}
                <Icon size={16} strokeWidth={isActive ? 2 : 1.5} />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User */}
      <div className="px-4 py-4 border-t border-gray-200 dark:border-[#27272A]">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-semibold flex items-center justify-center shrink-0">
            {initials || '?'}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-gray-900 dark:text-[#F4F4F5] truncate">{user?.name}</p>
            <p className="text-xs text-gray-400 dark:text-[#71717A] capitalize">{user?.role}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-xs text-gray-500 dark:text-[#71717A] hover:text-red-600 dark:hover:text-red-400 transition-colors duration-150"
        >
          <LogOut size={13} strokeWidth={1.5} />
          Sign out
        </button>
      </div>
    </aside>
  );
}
