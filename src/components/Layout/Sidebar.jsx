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
    <aside className="w-64 bg-gray-900 text-white flex flex-col min-h-screen">
      <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-700">
        <Shield className="text-blue-400" size={24} />
        <span className="text-lg font-bold tracking-wide">TelcoGuard</span>
      </div>

      <nav className="flex-1 py-4">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-6 py-3 text-sm transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="px-6 py-4 border-t border-gray-700">
        <div className="text-xs text-gray-400 mb-1">{user?.name}</div>
        <div className="text-xs text-gray-500 capitalize mb-3">{user?.role}</div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </aside>
  );
}
