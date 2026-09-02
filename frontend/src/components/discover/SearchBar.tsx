import { useState } from 'react';
import { MapPin, Wallet, Users, Calendar, Search } from 'lucide-react';
import { usePreferences } from '../../hooks/usePreferences';
import type { Gender } from '../../types';

export default function SearchBar({ onSearch }: { onSearch?: () => void }) {
  const { prefs, setPrefs } = usePreferences();
  const [location, setLocation] = useState(prefs.location);

  return (
    <div className="rounded-2xl border border-[var(--color-line)] bg-white p-2 shadow-[var(--shadow-pop)] sm:p-3">
      <div className="grid grid-cols-1 divide-y divide-[var(--color-line)] sm:grid-cols-4 sm:divide-x sm:divide-y-0">
        <div className="flex items-center gap-2.5 px-3 py-2.5">
          <MapPin size={17} className="shrink-0 text-[var(--color-indigo)]" />
          <div className="w-full">
            <label className="block text-[10px] font-semibold uppercase tracking-wide text-[var(--color-ink-faint)]">Location</label>
            <input
              value={location}
              onChange={(e) => { setLocation(e.target.value); setPrefs({ location: e.target.value }); }}
              placeholder="City, area or college"
              className="w-full bg-transparent text-sm text-[var(--color-ink)] outline-none placeholder:text-[var(--color-ink-faint)]"
            />
          </div>
        </div>

        <div className="flex items-center gap-2.5 px-3 py-2.5">
          <Wallet size={17} className="shrink-0 text-[var(--color-indigo)]" />
          <div className="w-full">
            <label className="block text-[10px] font-semibold uppercase tracking-wide text-[var(--color-ink-faint)]">Budget</label>
            <select
              className="w-full bg-transparent text-sm text-[var(--color-ink)] outline-none"
              value={`${prefs.budgetMin}-${prefs.budgetMax}`}
              onChange={(e) => {
                const [min, max] = e.target.value.split('-').map(Number);
                setPrefs({ budgetMin: min, budgetMax: max });
              }}
            >
              <option value="5000-15000">All (₹5,000 – ₹15,000)</option>
              <option value="5000-8000">₹5,000 – ₹8,000 (Budget Friendly)</option>
              <option value="8000-11000">₹8,000 – ₹11,000</option>
              <option value="11000-15000">₹11,000 – ₹15,000</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2.5 px-3 py-2.5">
          <Users size={17} className="shrink-0 text-[var(--color-indigo)]" />
          <div className="w-full">
            <label className="block text-[10px] font-semibold uppercase tracking-wide text-[var(--color-ink-faint)]">Gender</label>
            <select
              className="w-full bg-transparent text-sm text-[var(--color-ink)] outline-none"
              value={prefs.gender ?? ''}
              onChange={(e) => setPrefs({ gender: (e.target.value || null) as Gender | null })}
            >
              <option value="">Any</option>
              <option value="boys">Boys</option>
              <option value="girls">Girls</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2.5 px-3 py-2.5">
          <Calendar size={17} className="shrink-0 text-[var(--color-indigo)]" />
          <div className="w-full">
            <label className="block text-[10px] font-semibold uppercase tracking-wide text-[var(--color-ink-faint)]">Move-in</label>
            <input
              type="date"
              className="w-full bg-transparent text-sm text-[var(--color-ink)] outline-none"
              value={prefs.moveInDate ?? ''}
              onChange={(e) => setPrefs({ moveInDate: e.target.value })}
            />
          </div>
        </div>
      </div>

      <button
        onClick={onSearch}
        className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-saffron)] py-3.5 text-sm font-semibold text-white transition-transform active:scale-[0.99] sm:mt-0 sm:w-auto sm:px-6"
      >
        <Search size={16} /> Search Hostels
      </button>
    </div>
  );
}
