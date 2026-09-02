import { Link } from 'react-router-dom';
import Logo from '../common/Logo';

export default function Footer() {
  return (
    <footer className="border-t border-[var(--color-line)] bg-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Logo />
            <p className="mt-4 max-w-xs text-sm text-[var(--color-ink-soft)]">
              Discover, compare and analyze hostels across India — so you never have to visit twenty of them again.
            </p>
          </div>
          <div>
            <h3 className="mb-3 text-sm font-semibold text-[var(--color-ink)]">Product</h3>
            <ul className="space-y-2 text-sm text-[var(--color-ink-soft)]">
              <li><Link to="/discover" className="hover:text-[var(--color-indigo)]">Discover</Link></li>
              <li><Link to="/map" className="hover:text-[var(--color-indigo)]">Map</Link></li>
              <li><Link to="/compare" className="hover:text-[var(--color-indigo)]">Compare</Link></li>
              <li><Link to="/insights" className="hover:text-[var(--color-indigo)]">Insights</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="mb-3 text-sm font-semibold text-[var(--color-ink)]">Cities</h3>
            <ul className="space-y-2 text-sm text-[var(--color-ink-soft)]">
              <li><Link to="/city/Hyderabad" className="hover:text-[var(--color-indigo)]">Hyderabad</Link></li>
              <li><Link to="/city/Bangalore" className="hover:text-[var(--color-indigo)]">Bangalore</Link></li>
              <li><Link to="/city/Delhi" className="hover:text-[var(--color-indigo)]">Delhi</Link></li>
              <li><Link to="/city/Pune" className="hover:text-[var(--color-indigo)]">Pune</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="mb-3 text-sm font-semibold text-[var(--color-ink)]">Hostel Owners</h3>
            <ul className="space-y-2 text-sm text-[var(--color-ink-soft)]">
              <li><Link to="/owner" className="hover:text-[var(--color-indigo)]">Owner dashboard</Link></li>
              <li><Link to="/owner/add-hostel" className="hover:text-[var(--color-indigo)]">List your hostel</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-[var(--color-line)] pt-6 text-xs text-[var(--color-ink-faint)] sm:flex-row">
          <span>© 2026 Room Mates. Built for students moving cities.</span>
          <span className="font-semibold text-[var(--color-ink)] bg-slate-100 px-3 py-1 rounded-full border border-[var(--color-line)]">Created By Harsh Kumar</span>
          <span>Made in India 🇮🇳</span>
        </div>
      </div>
    </footer>
  );
}
