import { NavLink } from 'react-router-dom';
import { Home, Search, Map, Heart, User } from 'lucide-react';

const ITEMS = [
  { to: '/', label: 'Home', icon: Home, end: true },
  { to: '/discover', label: 'Search', icon: Search },
  { to: '/map', label: 'Map', icon: Map },
  { to: '/saved', label: 'Saved', icon: Heart },
  { to: '/profile', label: 'Profile', icon: User },
];

export default function MobileBottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--color-line)] bg-white/95 backdrop-blur md:hidden">
      <div className="mx-auto flex max-w-md items-stretch justify-between px-2 pb-[env(safe-area-inset-bottom)]">
        {ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-medium ${
                isActive ? 'text-[var(--color-indigo)]' : 'text-[var(--color-ink-faint)]'
              }`
            }
          >
            <item.icon size={20} />
            {item.label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
