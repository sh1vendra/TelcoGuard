import { Sun, Moon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export default function Navbar({ title }) {
  const { user } = useAuth();
  const { isDark, toggle } = useTheme();

  return (
    <header className="h-14 bg-white dark:bg-[#18181B] border-b border-gray-200 dark:border-[#27272A] px-6 flex items-center justify-between transition-colors duration-200 shrink-0">
      <h1 className="text-sm font-medium text-gray-700 dark:text-[#A1A1AA]">{title}</h1>
      <div className="flex items-center gap-3">
        <button
          onClick={toggle}
          className="p-1.5 rounded-lg text-gray-400 dark:text-[#71717A] hover:bg-gray-100 dark:hover:bg-[#27272A] hover:text-gray-600 dark:hover:text-[#A1A1AA] transition-colors duration-150"
          aria-label="Toggle theme"
        >
          {isDark ? <Sun size={16} strokeWidth={1.5} /> : <Moon size={16} strokeWidth={1.5} />}
        </button>
        <span className="text-sm text-gray-600 dark:text-[#A1A1AA]">{user?.name}</span>
        <span className="text-xs bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-500/20 px-2.5 py-0.5 rounded-full capitalize font-medium">
          {user?.role}
        </span>
      </div>
    </header>
  );
}
