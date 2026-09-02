import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, X, MapIcon, SearchX } from 'lucide-react';
import SearchBar from '../components/discover/SearchBar';
import FilterPanel from '../components/discover/FilterPanel';
import HostelCard from '../components/hostel/HostelCard';
import { usePreferences } from '../hooks/usePreferences';
import { searchHostels, filtersFromPreferences, type SortKey } from '../services/hostelService';
import { useNavigate } from 'react-router-dom';
import type { Facility, RoomTypeKey } from '../types';

const SORTS: { key: SortKey; label: string }[] = [
  { key: 'recommended', label: 'Recommended' },
  { key: 'lowestPrice', label: 'Lowest Price' },
  { key: 'highestRated', label: 'Highest Rated' },
  { key: 'nearest', label: 'Nearest' },
  { key: 'mostFacilities', label: 'Most Facilities' },
  { key: 'recentlyAdded', label: 'Recently Added' },
];

export default function Discover() {
  const { prefs, setPrefs } = usePreferences();
  const [sort, setSort] = useState<SortKey>('recommended');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [roomTypes, setRoomTypes] = useState<RoomTypeKey[]>(prefs.roomTypes);
  const [facilities, setFacilities] = useState<Facility[]>(prefs.facilities);
  const [foodOnly, setFoodOnly] = useState(prefs.food.included);
  const navigate = useNavigate();

  const results = useMemo(() => {
    const filters = filtersFromPreferences({ ...prefs, roomTypes, facilities, food: { ...prefs.food, included: foodOnly } });
    return searchHostels(filters, sort);
  }, [prefs, roomTypes, facilities, foodOnly, sort]);

  const locationLabel = prefs.location || 'India';

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <SearchBar />

      <div className="mt-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-[var(--color-ink)]">
            {results.length} hostels found near {locationLabel}
          </h1>
        </div>
        <div className="hidden items-center gap-2 sm:flex">
          <button
            onClick={() => navigate('/map')}
            className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-line)] px-4 py-2 text-sm font-medium text-[var(--color-ink)] hover:border-[var(--color-indigo)]"
          >
            <MapIcon size={15} /> Map view
          </button>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {SORTS.map((s) => (
          <button
            key={s.key}
            onClick={() => setSort(s.key)}
            className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
              sort === s.key ? 'border-[var(--color-ink)] bg-[var(--color-ink)] text-white' : 'border-[var(--color-line)] text-[var(--color-ink-soft)] hover:border-[var(--color-line-strong)]'
            }`}
          >
            {s.label}
          </button>
        ))}
        <button
          onClick={() => setMobileFiltersOpen(true)}
          className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-[var(--color-line)] px-3.5 py-1.5 text-xs font-medium text-[var(--color-ink)] lg:hidden"
        >
          <SlidersHorizontal size={13} /> Filters
        </button>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[260px_1fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-24 rounded-2xl border border-[var(--color-line)] bg-white p-5">
            <FilterPanel
              roomTypes={roomTypes} onRoomTypesChange={setRoomTypes}
              facilities={facilities} onFacilitiesChange={setFacilities}
              foodOnly={foodOnly} onFoodOnlyChange={setFoodOnly}
            />
          </div>
        </aside>

        <div>
          {results.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--color-line-strong)] py-20 text-center">
              <SearchX size={36} className="mb-3 text-[var(--color-ink-faint)]" />
              <p className="font-display text-lg font-semibold text-[var(--color-ink)]">No hostels found</p>
              <p className="mt-1 max-w-xs text-sm text-[var(--color-ink-soft)]">Try increasing your budget or expanding your search area.</p>
              <div className="mt-5 flex gap-3">
                <button onClick={() => setMobileFiltersOpen(true)} className="rounded-full border border-[var(--color-line-strong)] px-4 py-2 text-sm font-medium text-[var(--color-ink)]">Adjust Filters</button>
                <button onClick={() => setPrefs({ location: '' })} className="rounded-full bg-[var(--color-ink)] px-4 py-2 text-sm font-medium text-white">Explore Nearby</button>
              </div>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {results.map((h, i) => <HostelCard key={h.id} hostel={h} index={i} />)}
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {mobileFiltersOpen && (
          <motion.div className="fixed inset-0 z-50 lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-black/40" onClick={() => setMobileFiltersOpen(false)} />
            <motion.div
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ ease: 'easeOut', duration: 0.3 }}
              className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-2xl bg-white p-5"
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-display text-lg font-semibold text-[var(--color-ink)]">Filters</h3>
                <button onClick={() => setMobileFiltersOpen(false)}><X size={20} /></button>
              </div>
              <FilterPanel
                roomTypes={roomTypes} onRoomTypesChange={setRoomTypes}
                facilities={facilities} onFacilitiesChange={setFacilities}
                foodOnly={foodOnly} onFoodOnlyChange={setFoodOnly}
              />
              <button onClick={() => setMobileFiltersOpen(false)} className="mt-6 w-full rounded-full bg-[var(--color-ink)] py-3 text-sm font-semibold text-white">
                Show {results.length} hostels
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
