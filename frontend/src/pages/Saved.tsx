import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Heart, Sparkles, TrendingDown, Bell, BellRing, Filter, ArrowUpDown,
  ShieldCheck, Utensils, CheckCircle2, Trash2, ExternalLink, MessageSquare, Tag, MapPin
} from 'lucide-react';
import { useCollections } from '../hooks/useCollections';
import { getHostelById } from '../services/hostelService';
import { HOSTELS } from '../data';
import { formatINR, formatDistance } from '../utils/format';
import Rating from '../components/common/Rating';
import GenderBadge from '../components/common/GenderBadge';
import AvailabilityBadge from '../components/common/AvailabilityBadge';
import type { Hostel } from '../types';

export default function Saved() {
  const { savedIds, toggleSaved, toggleCompare, isComparing } = useCollections();
  const navigate = useNavigate();

  const [sortBy, setSortBy] = useState<'price-low' | 'rating' | 'distance'>('price-low');
  const [cityFilter, setCityFilter] = useState<string>('all');
  const [priceAlerts, setPriceAlerts] = useState<Record<string, boolean>>({});

  // Resolve saved hostel objects
  const rawSavedHostels = useMemo(() => {
    return savedIds.map((id) => getHostelById(id)).filter(Boolean) as Hostel[];
  }, [savedIds]);

  // Available cities among saved hostels
  const savedCities = useMemo(() => {
    const cities = new Set(rawSavedHostels.map((h) => h.city));
    return Array.from(cities);
  }, [rawSavedHostels]);

  // Filtered and Sorted Hostels
  const hostels = useMemo(() => {
    let result = [...rawSavedHostels];
    if (cityFilter !== 'all') {
      result = result.filter((h) => h.city === cityFilter);
    }
    if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'distance') {
      result.sort((a, b) => a.distanceKm - b.distanceKm);
    }
    return result;
  }, [rawSavedHostels, cityFilter, sortBy]);

  // Calculate statistics
  const avgPrice = useMemo(() => {
    if (hostels.length === 0) return 0;
    const sum = hostels.reduce((acc, h) => acc + h.price, 0);
    return Math.round(sum / hostels.length);
  }, [hostels]);

  const toggleAlert = (id: string) => {
    setPriceAlerts((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSaveDemoHostels = () => {
    const demoList = HOSTELS.slice(0, 3);
    demoList.forEach((h) => {
      if (!savedIds.includes(h.id)) {
        toggleSaved(h.id);
      }
    });
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Top Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl font-bold text-[var(--color-ink)]">My Saved Hostels</h1>
            {rawSavedHostels.length > 0 && (
              <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-3 py-1 text-xs font-bold text-rose-600 border border-rose-200">
                <Heart size={12} className="fill-rose-500" /> {rawSavedHostels.length} Saved
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-[var(--color-ink-soft)]">
            Track price drops, availability changes, and save your top choices for easy booking.
          </p>
        </div>

        {rawSavedHostels.length > 0 && (
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 rounded-full border border-[var(--color-line)] bg-white px-3 py-1.5 text-xs text-[var(--color-ink)]">
              <span className="text-[var(--color-ink-faint)]">Avg Rent:</span>
              <span className="font-mono font-bold text-[var(--color-indigo)]">{formatINR(avgPrice)}/mo</span>
            </div>
          </div>
        )}
      </div>

      {/* EMPTY STATE */}
      {rawSavedHostels.length === 0 ? (
        <div className="space-y-6">
          <div className="rounded-3xl border border-dashed border-[var(--color-line-strong)] bg-white p-10 text-center shadow-xs">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-500">
              <Heart size={28} className="fill-rose-100" />
            </div>
            <h2 className="font-display text-xl font-bold text-[var(--color-ink)]">No Hostels Saved Yet</h2>
            <p className="mx-auto mt-1 max-w-md text-sm text-[var(--color-ink-soft)]">
              Save your favorite hostels while searching to track price drops, compare facilities, and get instant move-in alerts.
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={handleSaveDemoHostels}
                className="inline-flex items-center gap-2 rounded-full bg-[var(--color-saffron)] px-5 py-3 text-xs font-semibold text-white shadow-sm transition-transform active:scale-95 hover:bg-[var(--color-saffron-dark)]"
              >
                <Sparkles size={14} /> Add 3 Demo Hostels to Saved
              </button>

              <button
                onClick={() => navigate('/discover')}
                className="inline-flex items-center gap-2 rounded-full bg-[var(--color-ink)] px-5 py-3 text-xs font-semibold text-white shadow-sm transition-transform active:scale-95 hover:bg-[var(--color-indigo)]"
              >
                Browse All Hostels
              </button>
            </div>
          </div>

          {/* Quick Feature Highlights */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-[var(--color-line)] bg-white p-5">
              <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-rose-100 text-rose-700 font-bold">
                💖
              </div>
              <h3 className="font-display text-sm font-semibold text-[var(--color-ink)]">One-Tap Shortlisting</h3>
              <p className="mt-1 text-xs text-[var(--color-ink-faint)]">
                Tap the heart icon on any hostel card to save it into your personal watch list.
              </p>
            </div>

            <div className="rounded-2xl border border-[var(--color-line)] bg-white p-5">
              <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 font-bold">
                📉
              </div>
              <h3 className="font-display text-sm font-semibold text-[var(--color-ink)]">Price Drop Alerts</h3>
              <p className="mt-1 text-xs text-[var(--color-ink-faint)]">
                Get notified when owner discounts or monthly rent drops occur on your saved PGs.
              </p>
            </div>

            <div className="rounded-2xl border border-[var(--color-line)] bg-white p-5">
              <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700 font-bold">
                ⚡
              </div>
              <h3 className="font-display text-sm font-semibold text-[var(--color-ink)]">Instant Enquiry & Compare</h3>
              <p className="mt-1 text-xs text-[var(--color-ink-faint)]">
                Quickly submit enquiries or launch side-by-side comparison directly from your list.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div>
          {/* Controls Bar: Filter by City & Sort */}
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[var(--color-line)] bg-white p-3.5 shadow-xs">
            <div className="flex items-center gap-2">
              <Filter size={14} className="text-[var(--color-ink-faint)]" />
              <span className="text-xs font-semibold text-[var(--color-ink)]">City:</span>
              <select
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                className="rounded-lg border border-[var(--color-line)] bg-slate-50 px-3 py-1.5 text-xs font-medium text-[var(--color-ink)] outline-none focus:border-[var(--color-indigo)]"
              >
                <option value="all">All Cities ({rawSavedHostels.length})</option>
                {savedCities.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <ArrowUpDown size={14} className="text-[var(--color-ink-faint)]" />
              <span className="text-xs font-semibold text-[var(--color-ink)]">Sort By:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="rounded-lg border border-[var(--color-line)] bg-slate-50 px-3 py-1.5 text-xs font-medium text-[var(--color-ink)] outline-none focus:border-[var(--color-indigo)]"
              >
                <option value="price-low">Price: Low to High</option>
                <option value="rating">Highest Rated</option>
                <option value="distance">Nearest Distance</option>
              </select>
            </div>
          </div>

          {/* Saved Hostel List */}
          <div className="space-y-4">
            {hostels.map((h) => {
              const prevPrice = Math.round((h.price * 1.06) / 100) * 100;
              const discount = prevPrice - h.price;
              const isAlertOn = !!priceAlerts[h.id];
              const comparing = isComparing(h.id);

              return (
                <div
                  key={h.id}
                  className="group flex flex-col gap-4 rounded-2xl border border-[var(--color-line)] bg-white p-4 shadow-xs transition-all hover:border-[var(--color-line-strong)] hover:shadow-md sm:flex-row sm:items-center"
                >
                  <button onClick={() => navigate(`/hostel/${h.id}`)} className="shrink-0">
                    <img
                      src={h.images[0]}
                      alt={h.name}
                      className="h-32 w-full rounded-xl object-cover transition-transform duration-300 group-hover:scale-105 sm:h-28 sm:w-36"
                    />
                  </button>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <GenderBadge gender={h.gender} />
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                        <TrendingDown size={11} /> Save {formatINR(discount)}/mo
                      </span>
                    </div>

                    <button
                      onClick={() => navigate(`/hostel/${h.id}`)}
                      className="mt-1.5 truncate font-display text-base font-bold text-[var(--color-ink)] hover:text-[var(--color-indigo)]"
                    >
                      {h.name}
                    </button>

                    <p className="mt-0.5 flex items-center gap-1 text-xs text-[var(--color-ink-faint)]">
                      <MapPin size={12} className="shrink-0" />
                      {h.locality}, {h.city} · {formatDistance(h.distanceKm)}
                    </p>

                    <div className="mt-2 flex items-center gap-3">
                      <Rating value={h.rating} count={h.reviewCount} size={12} />
                      <AvailabilityBadge status={h.availability} beds={h.bedsAvailable} />
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 border-t border-[var(--color-line)] pt-3 sm:border-t-0 sm:pt-0 sm:border-l sm:pl-4">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-ink-faint)]">Current Rent</p>
                      <div className="flex items-baseline gap-2">
                        <p className="font-mono text-base font-bold text-[var(--color-ink)] tabular">
                          {formatINR(h.price)}
                          <span className="text-xs font-normal text-[var(--color-ink-faint)]">/mo</span>
                        </p>
                        <span className="text-xs text-[var(--color-ink-faint)] line-through">{formatINR(prevPrice)}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => navigate(`/enquire/${h.id}`)}
                        className="rounded-full bg-[var(--color-saffron)] px-3.5 py-1.5 text-xs font-semibold text-white transition-transform active:scale-95 hover:bg-[var(--color-saffron-dark)]"
                      >
                        Enquire
                      </button>

                      <button
                        onClick={() => toggleCompare(h.id)}
                        className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                          comparing
                            ? 'bg-[var(--color-indigo)] text-white'
                            : 'border border-[var(--color-line)] bg-white text-[var(--color-ink)] hover:bg-slate-50'
                        }`}
                      >
                        {comparing ? 'Comparing' : 'Compare'}
                      </button>

                      <button
                        onClick={() => toggleAlert(h.id)}
                        title={isAlertOn ? 'Price Alerts Active' : 'Enable Price Alerts'}
                        className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
                          isAlertOn
                            ? 'bg-amber-100 text-amber-700'
                            : 'border border-[var(--color-line)] bg-white text-[var(--color-ink-faint)] hover:bg-slate-50'
                        }`}
                      >
                        {isAlertOn ? <BellRing size={14} /> : <Bell size={14} />}
                      </button>

                      <button
                        onClick={() => toggleSaved(h.id)}
                        title="Remove from saved"
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
