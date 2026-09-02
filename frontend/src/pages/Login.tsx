import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import Logo from '../components/common/Logo';
import { useAuth } from '../hooks/useAuth';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      navigate('/discover');
    } else {
      setError(result.error || 'Invalid email or password. Please check your credentials.');
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--color-paper)] px-4 py-12">
      <div className="w-full max-w-md rounded-3xl border border-[var(--color-line)] bg-white p-8 shadow-sm">
        <div className="mb-6 flex justify-center">
          <Logo />
        </div>
        <h1 className="text-center font-display text-2xl font-semibold text-[var(--color-ink)]">Welcome Back</h1>
        <p className="mt-1.5 text-center text-sm text-[var(--color-ink-soft)]">
          Log in to access room searches, map listings, and personalized match recommendations.
        </p>

        {/* Real DB Authentication Error Box */}
        {error && (
          <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs text-red-800">
            <AlertCircle size={16} className="mt-0.5 shrink-0 text-red-600" />
            <div className="flex-1">
              <p className="font-semibold">Authentication Failed</p>
              <p className="mt-0.5 text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Demo Credentials Tip */}
        <div className="mt-4 flex items-center gap-2 rounded-xl bg-slate-50 border border-slate-200 p-3 text-xs text-slate-700">
          <ShieldCheck size={16} className="text-[var(--color-indigo)] shrink-0" />
          <span>Demo Account: <strong className="font-mono text-[var(--color-ink)]">user@hostelmate.com</strong> / <strong className="font-mono text-[var(--color-ink)]">password123</strong></span>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="relative">
            <Mail size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-ink-faint)]" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address (e.g. user@hostelmate.com)"
              className="w-full rounded-xl border border-[var(--color-line)] py-3 pl-10 pr-3 text-sm outline-none transition-colors focus:border-[var(--color-indigo)] focus:ring-2 focus:ring-indigo-100"
            />
          </div>
          <div className="relative">
            <Lock size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-ink-faint)]" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full rounded-xl border border-[var(--color-line)] py-3 pl-10 pr-3 text-sm outline-none transition-colors focus:border-[var(--color-indigo)] focus:ring-2 focus:ring-indigo-100"
            />
          </div>
          <div className="text-right">
            <Link to="/login" className="text-xs font-medium text-[var(--color-indigo)] hover:underline">Forgot password?</Link>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-ink)] py-3.5 text-sm font-semibold text-white transition-all hover:bg-[var(--color-indigo)] disabled:opacity-50"
          >
            {loading ? 'Authenticating with DB...' : 'Log in'} <ArrowRight size={16} />
          </button>
        </form>

        <div className="my-5 flex items-center gap-3 text-xs text-[var(--color-ink-faint)]">
          <span className="h-px flex-1 bg-[var(--color-line)]" /> or <span className="h-px flex-1 bg-[var(--color-line)]" />
        </div>
        <button
          onClick={() => {
            setEmail('user@hostelmate.com');
            setPassword('password123');
          }}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--color-line)] py-3 text-xs font-medium text-[var(--color-ink)] transition-colors hover:bg-slate-50"
        >
          Fill Demo Credentials
        </button>

        <p className="mt-6 text-center text-sm text-[var(--color-ink-soft)]">
          New to Room Mates? <Link to="/signup" className="font-semibold text-[var(--color-indigo)] hover:underline">Sign up</Link>
        </p>
      </div>

      <footer className="mt-8 text-center text-xs text-[var(--color-ink-faint)]">
        <span className="font-semibold text-[var(--color-ink)] bg-white px-3 py-1.5 rounded-full border border-[var(--color-line)] shadow-xs">Created By Harsh Kumar</span>
      </footer>
    </div>
  );
}
