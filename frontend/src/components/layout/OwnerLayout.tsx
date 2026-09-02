import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, Building2, BarChart3, PlusCircle } from 'lucide-react';
import Logo from '../common/Logo';

const LINKS = [
  { to: '/owner', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/owner/hostels', label: 'My Hostels', icon: Building2 },
  { to: '/owner/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/owner/add-hostel', label: 'Add Hostel', icon: PlusCircle },
];

export default function OwnerLayout() {
  return (
    <div className="min-h-screen bg-[var(--color-paper)] md:flex">
      <aside className="hidden w-60 shrink-0 border-r border-[var(--color-line)] bg-white p-5 md:block">
        <Logo size={24} />
        <p className="mt-1 text-xs text-[var(--color-ink-faint)]">Owner Dashboard</p>
        <nav className="mt-8 space-y-1">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                `flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium ${
                  isActive ? 'bg-[var(--color-indigo-soft)] text-[var(--color-indigo)]' : 'text-[var(--color-ink-soft)] hover:bg-[var(--color-paper)]'
                }`
              }
            >
              <l.icon size={16} /> {l.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="flex flex-1 flex-col justify-between">
        <div>
          <div className="border-b border-[var(--color-line)] bg-white px-4 py-3.5 md:hidden">
            <Logo size={22} />
          </div>
          <div className="flex gap-1 overflow-x-auto border-b border-[var(--color-line)] bg-white px-4 py-2 no-scrollbar md:hidden">
            {LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                className={({ isActive }) =>
                  `shrink-0 rounded-full px-3 py-1.5 text-xs font-medium ${isActive ? 'bg-[var(--color-ink)] text-white' : 'text-[var(--color-ink-soft)]'}`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </div>
          <Outlet />
        </div>
        <footer className="mt-12 border-t border-[var(--color-line)] bg-white px-6 py-4 text-center text-xs text-[var(--color-ink-soft)] flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>© 2026 Room Mates Owner Portal</span>
          <span className="font-semibold text-[var(--color-ink)] bg-slate-100 px-3 py-1 rounded-full border border-[var(--color-line)]">Created By Harsh Kumar</span>
          <span>Made in India 🇮🇳</span>
        </footer>
      </div>
    </div>
  );
}
