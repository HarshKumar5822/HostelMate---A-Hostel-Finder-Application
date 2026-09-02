import { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import { Heart, LogOut, LogIn, ChevronDown, LayoutDashboard, PlusCircle, Building2 } from 'lucide-react';
import Logo from '../common/Logo';
import { useAuth } from '../../hooks/useAuth';

const LINKS = [
  { to: '/discover', label: 'Discover' },
  { to: '/map', label: 'Map' },
  { to: '/compare', label: 'Compare' },
  { to: '/saved', label: 'Saved' },
  { to: '/insights', label: 'Insights' },
];

export default function Navbar() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [ownerDropdownOpen, setOwnerDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOwnerDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-line)] bg-[var(--color-paper)]/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <button onClick={() => navigate('/')} className="shrink-0">
          <Logo />
        </button>

        <nav className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-[var(--color-ink)] text-white'
                    : 'text-[var(--color-ink-soft)] hover:bg-white hover:text-[var(--color-ink)]'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}

          {/* Hostel Owners Dropdown Menu */}
          <div className="relative ml-2" ref={dropdownRef}>
            <button
              onClick={() => setOwnerDropdownOpen((prev) => !prev)}
              className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                ownerDropdownOpen
                  ? 'bg-[var(--color-indigo)] text-white'
                  : 'bg-[var(--color-indigo-soft)] text-[var(--color-indigo)] hover:bg-indigo-100'
              }`}
            >
              <Building2 size={16} />
              <span>Hostel Owners</span>
              <ChevronDown size={14} className={`transition-transform duration-200 ${ownerDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {ownerDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-[var(--color-line)] bg-white p-2 shadow-xl animate-in fade-in duration-150 z-50">
                <div className="px-3 py-2 border-b border-slate-100">
                  <p className="text-xs font-bold uppercase tracking-wider text-[var(--color-indigo)]">Hostel Owners Portal</p>
                  <p className="text-[11px] text-[var(--color-ink-faint)]">Manage listings & student leads</p>
                </div>
                <div className="py-1 space-y-0.5">
                  <Link
                    to="/owner"
                    onClick={() => setOwnerDropdownOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-medium text-[var(--color-ink)] hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-[var(--color-indigo)]">
                      <LayoutDashboard size={16} />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">Owner Dashboard</p>
                      <p className="text-[11px] text-[var(--color-ink-faint)]">Analytics & enquiries</p>
                    </div>
                  </Link>

                  <Link
                    to="/owner/add-hostel"
                    onClick={() => setOwnerDropdownOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-medium text-[var(--color-ink)] hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                      <PlusCircle size={16} />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">List Your Hostel</p>
                      <p className="text-[11px] text-[var(--color-ink-faint)]">Add PG property listing</p>
                    </div>
                  </Link>

                  <Link
                    to="/owner/hostels"
                    onClick={() => setOwnerDropdownOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-medium text-[var(--color-ink)] hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                      <Building2 size={16} />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">My Hostels</p>
                      <p className="text-[11px] text-[var(--color-ink-faint)]">Manage bed availability</p>
                    </div>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </nav>

        <div className="flex items-center gap-2">
          {/* Quick Mobile Owner Button */}
          <Link
            to="/owner"
            className="flex items-center gap-1 rounded-full bg-[var(--color-indigo-soft)] px-3 py-1.5 text-xs font-semibold text-[var(--color-indigo)] md:hidden"
          >
            <Building2 size={14} /> Owners
          </Link>

          {isAuthenticated ? (
            <>
              <button
                onClick={() => navigate('/saved')}
                aria-label="Saved hostels"
                className="hidden h-10 w-10 items-center justify-center rounded-full text-[var(--color-ink-soft)] hover:bg-white sm:inline-flex"
              >
                <Heart size={18} />
              </button>
              <button
                onClick={() => navigate('/profile')}
                className="flex h-10 items-center gap-2 rounded-full border border-[var(--color-line)] bg-white px-3.5 text-sm font-semibold text-[var(--color-ink)] hover:border-[var(--color-indigo)]"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-indigo-soft)] text-xs font-bold text-[var(--color-indigo)]">
                  {user?.name ? user.name[0].toUpperCase() : 'U'}
                </div>
                <span className="hidden sm:inline">{user?.name ? user.name.split(' ')[0] : 'Profile'}</span>
              </button>
              <button
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                title="Log out"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition-colors hover:bg-red-50 hover:text-red-600"
              >
                <LogOut size={16} />
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate('/login')}
                className="flex items-center gap-1.5 rounded-full border border-[var(--color-line)] bg-white px-4 py-2 text-xs font-semibold text-[var(--color-ink)] hover:bg-slate-50"
              >
                <LogIn size={14} /> Log in
              </button>
              <button
                onClick={() => navigate('/signup')}
                className="rounded-full bg-[var(--color-saffron)] px-4 py-2 text-xs font-semibold text-white transition-transform active:scale-95 hover:bg-[var(--color-saffron-dark)]"
              >
                Sign up
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
