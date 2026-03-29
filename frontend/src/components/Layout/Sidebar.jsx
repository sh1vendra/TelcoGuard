import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Phone,
  ArrowLeftRight,
  ShieldAlert,
  ClipboardList,
  LogOut,
  Shield,
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

  return (
    <aside className="w-64 bg-[#0A0A0B] border-r border-[#27272A] flex flex-col min-h-screen">
      <div className="flex items-center gap-2.5 px-6 py-5 border-b border-[#27272A]">
        <Shield className="text-[#0A84FF]" size={20} />
        <span className="text-[#E4E4E7] text-xs font-bold tracking-[0.15em] uppercase">TELCOGUARD NOC</span>
      </div>

      <nav className="flex-1 py-3">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `relative flex items-center gap-3 px-6 py-3 text-sm transition-colors ${
                isActive
                  ? 'bg-[#111114] text-[#0A84FF]'
                  : 'text-[#71717A] hover:bg-[#111114] hover:text-[#A1A1AA]'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span className="absolute left-0 top-0 bottom-0 w-0.5 bg-[#0A84FF] rounded-r" />
                )}
                <Icon size={18} />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="px-6 py-4 border-t border-[#27272A]">
        <div className="text-xs font-medium text-[#E4E4E7] mb-0.5">{user?.name}</div>
        <div className="text-xs text-[#71717A] capitalize mb-3">{user?.role}</div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm text-[#71717A] hover:text-red-400 transition-colors"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </aside>
  );
}
