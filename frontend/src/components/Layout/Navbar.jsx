import { useAuth } from '../../context/AuthContext';

export default function Navbar({ title }) {
  const { user } = useAuth();

  return (
    <header className="bg-[#111114] border-b border-[#27272A] px-6 py-4 flex items-center justify-between">
      <h1 className="text-base font-semibold text-[#E4E4E7] tracking-wide">{title}</h1>
      <div className="flex items-center gap-3">
        <span className="text-sm text-[#A1A1AA]">{user?.name}</span>
        <span className="text-xs bg-[#0A84FF]/10 text-[#0A84FF] border border-[#0A84FF]/20 px-2.5 py-0.5 rounded capitalize font-medium">
          {user?.role}
        </span>
      </div>
    </header>
  );
}
