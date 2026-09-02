import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, AlertCircle, ArrowRight } from 'lucide-react';
import Logo from '../components/common/Logo';
import { useAuth } from '../hooks/useAuth';

export default function Signup() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result = await signup(name, email, password);
    setLoading(false);

    if (result.success) {
      navigate('/onboarding');
    } else {
      setError(result.error || 'Signup failed. Please try again with a different email.');
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--color-paper)] px-4 py-12">
      <div className="w-full max-w-md rounded-3xl border border-[var(--color-line)] bg-white p-8 shadow-sm">
        <div className="mb-6 flex justify-center">
          <Logo />
        </div>
        <h1 className="text-center font-display text-2xl font-semibold text-[var(--color-ink)]">Create Account</h1>
        <p className="mt-1.5 text-center text-sm text-[var(--color-ink-soft)]">
          Join Room Mates to save hostels, compare options, and find your perfect PG.
        </p>

        {error && (
          <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs text-red-800">
            <AlertCircle size={16} className="mt-0.5 shrink-0 text-red-600" />
            <div className="flex-1">
              <p className="font-semibold">Registration Failed</p>
              <p className="mt-0.5 text-red-700">{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="relative">
            <User size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-ink-faint)]" />
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full Name"
              className="w-full rounded-xl border border-[var(--color-line)] py-3 pl-10 pr-3 text-sm outline-none transition-colors focus:border-[var(--color-indigo)] focus:ring-2 focus:ring-indigo-100"
            />
          </div>
          <div className="relative">
            <Mail size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-ink-faint)]" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="w-full rounded-xl border border-[var(--color-line)] py-3 pl-10 pr-3 text-sm outline-none transition-colors focus:border-[var(--color-indigo)] focus:ring-2 focus:ring-indigo-100"
            />
          </div>
          <div className="relative">
            <Lock size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-ink-faint)]" />
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create Password (min 6 chars)"
              className="w-full rounded-xl border border-[var(--color-line)] py-3 pl-10 pr-3 text-sm outline-none transition-colors focus:border-[var(--color-indigo)] focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-saffron)] py-3.5 text-sm font-semibold text-white transition-all hover:bg-[var(--color-saffron-dark)] disabled:opacity-50"
          >
            {loading ? 'Creating Account in DB...' : 'Create Account'} <ArrowRight size={16} />
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[var(--color-ink-soft)]">
          Already have an account? <Link to="/login" className="font-semibold text-[var(--color-indigo)] hover:underline">Log in</Link>
        </p>
      </div>

      <footer className="mt-8 text-center text-xs text-[var(--color-ink-faint)]">
        <span className="font-semibold text-[var(--color-ink)] bg-white px-3 py-1.5 rounded-full border border-[var(--color-line)] shadow-xs">Created By Harsh Kumar</span>
      </footer>
    </div>
  );
}
