import { useMemo, useState } from 'react';
import { List, Map as MapIcon } from 'lucide-react';
import MapView from '../components/discover/MapView';
import HostelCard from '../components/hostel/HostelCard';
import SearchBar from '../components/discover/SearchBar';
import { usePreferences } from '../hooks/usePreferences';
import { searchHostels, filtersFromPreferences } from '../services/hostelService';

export default function MapPage() {
  const { prefs } = usePreferences();
  const [mobileView, setMobileView] = useState<'list' | 'map'>('map');
  const results = useMemo(() => searchHostels(filtersFromPreferences(prefs), 'nearest').slice(0, 40), [prefs]);

  return (
    <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-5">
        <SearchBar />
      </div>

      <div className="mb-4 flex items-center justify-between">
        <h1 className="font-display text-xl font-semibold text-[var(--color-ink)]">{results.length} hostels on the map</h1>
        <div className="inline-flex rounded-full border border-[var(--color-line)] bg-white p-1 lg:hidden">
          <button
            onClick={() => setMobileView('list')}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium ${mobileView === 'list' ? 'bg-[var(--color-ink)] text-white' : 'text-[var(--color-ink-soft)]'}`}
          >
            <List size={13} /> List
          </button>
          <button
            onClick={() => setMobileView('map')}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium ${mobileView === 'map' ? 'bg-[var(--color-ink)] text-white' : 'text-[var(--color-ink-soft)]'}`}
          >
            <MapIcon size={13} /> Map
          </button>
        </div>
      </div>

      <div className="grid gap-5 lg:h-[calc(100vh-230px)] lg:grid-cols-[440px_1fr]">
        <div className={`space-y-4 overflow-y-auto pr-1 lg:block ${mobileView === 'map' ? 'hidden' : 'block'}`}>
          {results.map((h, i) => <HostelCard key={h.id} hostel={h} index={i} />)}
        </div>
        <div className={`h-[70vh] lg:h-full ${mobileView === 'list' ? 'hidden lg:block' : 'block'}`}>
          <MapView hostels={results} />
        </div>
      </div>
    </div>
  );
}
