import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield } from 'lucide-react';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      toast.success('Account created!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center p-8">
      <div className="bg-[#111114] border border-[#27272A] rounded-xl p-8 w-full max-w-sm">
        <div className="flex items-center gap-2.5 mb-8">
          <Shield className="text-[#0A84FF]" size={20} />
          <span className="text-[#E4E4E7] text-xs font-bold tracking-[0.15em] uppercase">TelcoGuard NOC</span>
        </div>

        <h2 className="text-xl font-bold text-[#E4E4E7] mb-1">Create account</h2>
        <p className="text-[#71717A] text-sm mb-7">Register for NOC access</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-medium text-[#A1A1AA] uppercase tracking-wide mb-2">Full Name</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full bg-[#0A0A0B] border border-[#27272A] rounded-lg px-4 py-2.5 text-sm text-[#E4E4E7] placeholder-[#3F3F46] focus:outline-none focus:border-[#0A84FF] transition-colors"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#A1A1AA] uppercase tracking-wide mb-2">Email Address</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full bg-[#0A0A0B] border border-[#27272A] rounded-lg px-4 py-2.5 text-sm text-[#E4E4E7] placeholder-[#3F3F46] focus:outline-none focus:border-[#0A84FF] transition-colors"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#A1A1AA] uppercase tracking-wide mb-2">Password</label>
            <input
              type="password"
              required
              minLength={6}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full bg-[#0A0A0B] border border-[#27272A] rounded-lg px-4 py-2.5 text-sm text-[#E4E4E7] placeholder-[#3F3F46] focus:outline-none focus:border-[#0A84FF] transition-colors"
              placeholder="Min 6 characters"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0A84FF] hover:bg-[#0A84FF]/90 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-40 mt-2"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-[#71717A] text-xs mt-7 text-center">
          Already have an account?{' '}
          <Link to="/login" className="text-[#0A84FF] hover:text-[#0A84FF]/80 transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
