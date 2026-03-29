import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Activity } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] flex">
      {/* Left: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <div className="flex items-center gap-2.5 mb-10">
            <Shield className="text-[#0A84FF]" size={22} />
            <span className="text-[#E4E4E7] text-sm font-bold tracking-[0.15em] uppercase">TelcoGuard NOC</span>
          </div>

          <h2 className="text-2xl font-bold text-[#E4E4E7] mb-1">Sign in</h2>
          <p className="text-[#71717A] text-sm mb-8">Access the Network Operations Center</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-medium text-[#A1A1AA] uppercase tracking-wide mb-2">Email Address</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full bg-[#111114] border border-[#27272A] rounded-lg px-4 py-2.5 text-sm text-[#E4E4E7] placeholder-[#3F3F46] focus:outline-none focus:border-[#0A84FF] transition-colors"
                placeholder="operator@telcoguard.com"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#A1A1AA] uppercase tracking-wide mb-2">Password</label>
              <input
                type="password"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full bg-[#111114] border border-[#27272A] rounded-lg px-4 py-2.5 text-sm text-[#E4E4E7] placeholder-[#3F3F46] focus:outline-none focus:border-[#0A84FF] transition-colors"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0A84FF] hover:bg-[#0A84FF]/90 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-40 mt-2"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          <p className="text-[#71717A] text-xs mt-8 text-center">
            Need an account?{' '}
            <Link to="/register" className="text-[#0A84FF] hover:text-[#0A84FF]/80 transition-colors">
              Register
            </Link>
          </p>
        </div>
      </div>

      {/* Right: Abstract Network Visual */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden items-center justify-center" style={{ background: 'linear-gradient(135deg, #0A0A0B 0%, #0a0a1a 50%, #050510 100%)' }}>
        <div className="absolute inset-0">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <radialGradient id="glow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#0A84FF" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#0A84FF" stopOpacity="0" />
              </radialGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#glow)" />
            {/* Grid lines */}
            {Array.from({ length: 20 }).map((_, i) => (
              <line key={`h${i}`} x1="0" y1={`${i * 5}%`} x2="100%" y2={`${i * 5}%`} stroke="#27272A" strokeWidth="0.5" />
            ))}
            {Array.from({ length: 20 }).map((_, i) => (
              <line key={`v${i}`} x1={`${i * 5}%`} y1="0" x2={`${i * 5}%`} y2="100%" stroke="#27272A" strokeWidth="0.5" />
            ))}
            {/* Network nodes */}
            {[
              [30, 25], [55, 35], [70, 20], [45, 50], [25, 60],
              [65, 55], [50, 70], [35, 80], [75, 75], [20, 40],
              [80, 40], [60, 85], [15, 75], [85, 60], [40, 15],
            ].map(([cx, cy], i) => (
              <g key={i}>
                <circle cx={`${cx}%`} cy={`${cy}%`} r="3" fill="#0A84FF" fillOpacity="0.8" />
                <circle cx={`${cx}%`} cy={`${cy}%`} r="8" fill="#0A84FF" fillOpacity="0.1" />
              </g>
            ))}
            {/* Connecting lines */}
            {[
              [[30, 25], [55, 35]], [[55, 35], [70, 20]], [[55, 35], [45, 50]],
              [[45, 50], [25, 60]], [[45, 50], [65, 55]], [[65, 55], [50, 70]],
              [[50, 70], [35, 80]], [[50, 70], [75, 75]], [[25, 60], [20, 40]],
              [[70, 20], [80, 40]], [[80, 40], [85, 60]], [[35, 80], [60, 85]],
            ].map(([[x1, y1], [x2, y2]], i) => (
              <line
                key={i}
                x1={`${x1}%`} y1={`${y1}%`}
                x2={`${x2}%`} y2={`${y2}%`}
                stroke="#0A84FF" strokeOpacity="0.2" strokeWidth="1"
              />
            ))}
          </svg>
        </div>
        <div className="relative z-10 text-center">
          <Shield className="text-[#0A84FF] mx-auto mb-4 opacity-60" size={48} />
          <p className="text-[#27272A] text-xs uppercase tracking-widest">Network Operations Center</p>
        </div>
      </div>
    </div>
  );
}
