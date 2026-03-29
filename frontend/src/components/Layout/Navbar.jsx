import { useAuth } from '../../context/AuthContext';

export default function Navbar({ title }) {
  const { user } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <h1 className="text-xl font-semibold text-gray-800">{title}</h1>
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-500">{user?.name}</span>
        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full capitalize font-medium">
          {user?.role}
        </span>
      </div>
    </header>
  );
}
