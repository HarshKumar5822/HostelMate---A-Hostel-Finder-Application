import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, LocateFixed, Star, ShieldCheck, MapPin, Layers, Sun, Moon, Trees } from 'lucide-react';
import type { Hostel } from '../../types';
import { computeBounds, project } from '../../services/mapService';
import { formatINR, formatDistance } from '../../utils/format';
import GenderBadge from '../common/GenderBadge';
import { useNavigate } from 'react-router-dom';

type DisplayMode = 'name-price' | 'detailed' | 'price';
type MapTheme = 'vibrant' | 'dark' | 'emerald';

function MapCanvasBackground({ theme }: { theme: MapTheme }) {
  if (theme === 'dark') {
    return (
      <svg className="absolute inset-0 h-full w-full object-cover select-none pointer-events-none" preserveAspectRatio="none" viewBox="0 0 1000 800">
        <defs>
          <pattern id="darkGrid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="1000" height="800" fill="#0F172A" />
        <rect width="1000" height="800" fill="url(#darkGrid)" />

        {/* Cyber Parks */}
        <path d="M 50 80 C 120 40, 220 60, 260 140 C 290 200, 220 280, 140 260 C 80 240, 30 160, 50 80 Z" fill="#064E3B" opacity="0.6" />
        <path d="M 680 100 C 780 70, 880 120, 920 220 C 950 300, 890 380, 800 360 C 720 340, 640 220, 680 100 Z" fill="#065F46" opacity="0.5" />
        
        {/* Neon River */}
        <path d="M 0 350 Q 250 300, 450 420 T 800 380 T 1000 480" fill="none" stroke="#0284C7" strokeWidth="22" opacity="0.6" strokeLinecap="round" />
        <path d="M 0 350 Q 250 300, 450 420 T 800 380 T 1000 480" fill="none" stroke="#38BDF8" strokeWidth="10" opacity="0.8" strokeLinecap="round" />

        {/* Neon Highways */}
        <path d="M 150 0 L 350 800" stroke="#F59E0B" strokeWidth="8" opacity="0.7" />
        <path d="M 0 200 L 1000 300" stroke="#EC4899" strokeWidth="8" opacity="0.7" />
        
        {/* Secondary Grid */}
        <path d="M 100 0 L 100 800 M 300 0 L 300 800 M 500 0 L 500 800 M 700 0 L 700 800 M 900 0 L 900 800" stroke="#334155" strokeWidth="1.5" opacity="0.4" />
        <path d="M 0 100 L 1000 100 M 0 300 L 1000 300 M 0 500 L 1000 500 M 0 700 L 1000 700" stroke="#334155" strokeWidth="1.5" opacity="0.4" />
      </svg>
    );
  }

  if (theme === 'emerald') {
    return (
      <svg className="absolute inset-0 h-full w-full object-cover select-none pointer-events-none" preserveAspectRatio="none" viewBox="0 0 1000 800">
        <defs>
          <linearGradient id="emGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#DDF2E4" />
            <stop offset="100%" stopColor="#CBE5D5" />
          </linearGradient>
        </defs>
        <rect width="1000" height="800" fill="url(#emGrad)" />
        
        {/* Forest reserves */}
        <path d="M 40 40 Q 200 20, 240 180 T 80 300 Z" fill="#A7F3D0" opacity="0.8" />
        <path d="M 600 80 Q 800 40, 880 260 T 650 360 Z" fill="#6EE7B7" opacity="0.7" />

        {/* Turquoise River */}
        <path d="M 0 350 Q 250 300, 450 420 T 800 380 T 1000 480" fill="none" stroke="#0EA5E9" strokeWidth="20" opacity="0.75" strokeLinecap="round" />
        <path d="M 0 350 Q 250 300, 450 420 T 800 380 T 1000 480" fill="none" stroke="#7DD3FC" strokeWidth="10" opacity="0.9" strokeLinecap="round" />

        {/* Highways */}
        <path d="M 150 0 L 350 800" stroke="#EA580C" strokeWidth="9" opacity="0.75" />
        <path d="M 0 200 L 1000 300" stroke="#F97316" strokeWidth="9" opacity="0.75" />
        <path d="M 100 0 L 100 800 M 300 0 L 300 800 M 500 0 L 500 800 M 700 0 L 700 800" stroke="#94A3B8" strokeWidth="2" opacity="0.4" />
      </svg>
    );
  }

  // Default 'vibrant' theme
  return (
    <svg className="absolute inset-0 h-full w-full object-cover select-none pointer-events-none" preserveAspectRatio="none" viewBox="0 0 1000 800">
      <defs>
        <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E3EFE8" />
          <stop offset="50%" stopColor="#E8E5DA" />
          <stop offset="100%" stopColor="#DFEBE5" />
        </linearGradient>
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(148, 163, 184, 0.18)" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="1000" height="800" fill="url(#bgGrad)" />
      <rect width="1000" height="800" fill="url(#grid)" />

      {/* Lush Green Parks & Gardens */}
      <path d="M 50 80 C 120 40, 220 60, 260 140 C 290 200, 220 280, 140 260 C 80 240, 30 160, 50 80 Z" fill="#C8E6C9" opacity="0.85" />
      <path d="M 680 100 C 780 70, 880 120, 920 220 C 950 300, 890 380, 800 360 C 720 340, 640 220, 680 100 Z" fill="#DCEDC8" opacity="0.9" />
      <path d="M 420 520 C 520 480, 620 540, 660 640 C 680 710, 600 780, 500 760 C 400 740, 360 620, 420 520 Z" fill="#C8E6C9" opacity="0.8" />
      <path d="M 120 600 C 200 580, 280 640, 260 740 C 240 800, 140 820, 80 760 C 40 700, 80 620, 120 600 Z" fill="#DCEDC8" opacity="0.85" />

      {/* Blue River Curves */}
      <path d="M 0 350 Q 250 300, 450 420 T 800 380 T 1000 480" fill="none" stroke="#60A5FA" strokeWidth="24" opacity="0.85" strokeLinecap="round" />
      <path d="M 0 350 Q 250 300, 450 420 T 800 380 T 1000 480" fill="none" stroke="#93C5FD" strokeWidth="16" opacity="0.9" strokeLinecap="round" />
      <path d="M 0 350 Q 250 300, 450 420 T 800 380 T 1000 480" fill="none" stroke="#DBEAFE" strokeWidth="6" opacity="0.9" strokeDasharray="12 8" strokeLinecap="round" />

      {/* City Lake */}
      <ellipse cx="780" cy="580" rx="90" ry="60" fill="#93C5FD" opacity="0.75" />
      <ellipse cx="780" cy="580" rx="75" ry="48" fill="#60A5FA" opacity="0.8" />

      {/* Major Golden Arterial Highways */}
      <path d="M 150 0 L 350 800" stroke="#F59E0B" strokeWidth="12" opacity="0.8" />
      <path d="M 150 0 L 350 800" stroke="#FDE68A" strokeWidth="6" opacity="0.9" />
      <path d="M 150 0 L 350 800" stroke="#FFFFFF" strokeWidth="1.5" strokeDasharray="8 6" opacity="0.9" />

      <path d="M 0 200 L 1000 300" stroke="#F59E0B" strokeWidth="12" opacity="0.8" />
      <path d="M 0 200 L 1000 300" stroke="#FDE68A" strokeWidth="6" opacity="0.9" />
      <path d="M 0 200 L 1000 300" stroke="#FFFFFF" strokeWidth="1.5" strokeDasharray="8 6" opacity="0.9" />

      <path d="M 0 650 Q 500 500, 1000 700" stroke="#EF4444" strokeWidth="10" opacity="0.75" />
      <path d="M 0 650 Q 500 500, 1000 700" stroke="#FCA5A5" strokeWidth="5" opacity="0.9" />

      {/* Secondary City Streets */}
      <path d="M 100 0 L 100 800 M 300 0 L 300 800 M 500 0 L 500 800 M 700 0 L 700 800 M 900 0 L 900 800" stroke="#CBD5E1" strokeWidth="2.5" opacity="0.6" />
      <path d="M 0 100 L 1000 100 M 0 300 L 1000 300 M 0 500 L 1000 500 M 0 700 L 1000 700" stroke="#CBD5E1" strokeWidth="2.5" opacity="0.6" />

      {/* Tech Park & College Hub Zones */}
      <rect x="240" y="240" width="160" height="120" rx="20" fill="#EDE9FE" opacity="0.75" stroke="#C4B5FD" strokeWidth="2" strokeDasharray="4 4" />
      <text x="320" y="306" textAnchor="middle" fill="#6D28D9" fontSize="12" fontWeight="700" fontFamily="sans-serif" letterSpacing="0.5">TECH PARK ZONE</text>

      <rect x="620" y="420" width="140" height="100" rx="20" fill="#FEF3C7" opacity="0.75" stroke="#FDE68A" strokeWidth="2" strokeDasharray="4 4" />
      <text x="690" y="475" textAnchor="middle" fill="#B45309" fontSize="12" fontWeight="700" fontFamily="sans-serif" letterSpacing="0.5">COLLEGE HUB</text>
    </svg>
  );
}

export default function MapView({ hostels }: { hostels: Hostel[] }) {
  const [zoom, setZoom] = useState(1);
  const [displayMode, setDisplayMode] = useState<DisplayMode>('name-price');
  const [mapTheme, setMapTheme] = useState<MapTheme>('vibrant');
  const [hovered, setHovered] = useState<Hostel | null>(null);
  const [active, setActive] = useState<Hostel | null>(null);
  const navigate = useNavigate();
  const bounds = useMemo(() => computeBounds(hostels), [hostels]);

  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl border border-[var(--color-line)] bg-[#E3EFE8] shadow-inner">
      {/* Rich SVG Map Canvas Background */}
      <MapCanvasBackground theme={mapTheme} />

      {/* Top Header Controls: Display Mode & Theme Selector */}
      <div className="absolute left-3 top-3 z-20 flex flex-wrap items-center gap-2">
        {/* Pin Display Mode Toggle */}
        <div className="flex items-center gap-1 rounded-full border border-[var(--color-line)] bg-white/95 p-1 shadow-md backdrop-blur">
          <button
            onClick={() => setDisplayMode('name-price')}
            className={`rounded-full px-3 py-1 text-xs font-semibold transition-all ${
              displayMode === 'name-price'
                ? 'bg-[var(--color-ink)] text-white shadow-xs'
                : 'text-[var(--color-ink-soft)] hover:bg-slate-100 hover:text-[var(--color-ink)]'
            }`}
          >
            Name + Rent
          </button>
          <button
            onClick={() => setDisplayMode('detailed')}
            className={`rounded-full px-3 py-1 text-xs font-semibold transition-all ${
              displayMode === 'detailed'
                ? 'bg-[var(--color-ink)] text-white shadow-xs'
                : 'text-[var(--color-ink-soft)] hover:bg-slate-100 hover:text-[var(--color-ink)]'
            }`}
          >
            Detailed Badges
          </button>
          <button
            onClick={() => setDisplayMode('price')}
            className={`rounded-full px-3 py-1 text-xs font-semibold transition-all ${
              displayMode === 'price'
                ? 'bg-[var(--color-ink)] text-white shadow-xs'
                : 'text-[var(--color-ink-soft)] hover:bg-slate-100 hover:text-[var(--color-ink)]'
            }`}
          >
            Price Only
          </button>
        </div>

        {/* Map Style Theme Picker */}
        <div className="flex items-center gap-1 rounded-full border border-[var(--color-line)] bg-white/95 p-1 shadow-md backdrop-blur">
          <button
            onClick={() => setMapTheme('vibrant')}
            className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold transition-all ${
              mapTheme === 'vibrant' ? 'bg-emerald-700 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
            title="Vibrant City Style"
          >
            <Sun size={12} /> City
          </button>
          <button
            onClick={() => setMapTheme('dark')}
            className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold transition-all ${
              mapTheme === 'dark' ? 'bg-slate-900 text-cyan-300' : 'text-slate-600 hover:bg-slate-100'
            }`}
            title="Midnight Dark Style"
          >
            <Moon size={12} /> Dark
          </button>
          <button
            onClick={() => setMapTheme('emerald')}
            className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold transition-all ${
              mapTheme === 'emerald' ? 'bg-teal-700 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
            title="Lush Emerald Style"
          >
            <Trees size={12} /> Emerald
          </button>
        </div>

        <div className="hidden rounded-full bg-white/90 px-3 py-1.5 text-[11px] font-medium text-[var(--color-ink)] shadow-xs backdrop-blur sm:inline-block">
          {hostels.length} hostels plotted
        </div>
      </div>

      {/* Map Navigation Controls */}
      <div className="absolute right-3 top-3 z-20 flex flex-col gap-1.5">
        <button
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-[var(--color-ink)] shadow-md transition-transform active:scale-95 hover:bg-slate-50"
          onClick={() => setZoom((z) => Math.min(2.2, z + 0.2))}
          aria-label="Zoom in"
          title="Zoom In"
        >
          <Plus size={16} />
        </button>
        <button
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-[var(--color-ink)] shadow-md transition-transform active:scale-95 hover:bg-slate-50"
          onClick={() => setZoom((z) => Math.max(0.6, z - 0.2))}
          aria-label="Zoom out"
          title="Zoom Out"
        >
          <Minus size={16} />
        </button>
        <button
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-[var(--color-ink)] shadow-md transition-transform active:scale-95 hover:bg-slate-50"
          onClick={() => setZoom(1)}
          aria-label="Reset zoom"
          title="Reset View"
        >
          <LocateFixed size={16} />
        </button>
      </div>

      {/* Interactive Map Surface */}
      <motion.div
        className="absolute inset-0"
        animate={{ scale: zoom }}
        transition={{ duration: 0.25 }}
      >
        {hostels.map((h) => {
          const { x, y } = project(h, bounds);
          const isActive = active?.id === h.id;
          const isHovered = hovered?.id === h.id;

          return (
            <button
              key={h.id}
              onClick={() => setActive(h)}
              onMouseEnter={() => setHovered(h)}
              onMouseLeave={() => setHovered(null)}
              style={{ left: `${x}%`, top: `${y}%` }}
              className="absolute -translate-x-1/2 -translate-y-full focus:outline-none"
            >
              <motion.div
                whileHover={{ scale: 1.12 }}
                animate={isActive ? { scale: 1.18 } : { scale: 1 }}
                className={`relative flex flex-col items-center transition-all ${
                  isActive || isHovered ? 'z-30' : 'z-10'
                }`}
              >
                {/* Instant Hover Tooltip Popover */}
                <AnimatePresence>
                  {isHovered && !isActive && (
                    <motion.div
                      initial={{ opacity: 0, y: -6, scale: 0.95 }}
                      animate={{ opacity: 1, y: -10, scale: 1 }}
                      exit={{ opacity: 0, y: -6, scale: 0.95 }}
                      className="pointer-events-none absolute bottom-full mb-2 flex w-56 flex-col rounded-xl border border-[var(--color-line)] bg-white p-2.5 shadow-[var(--shadow-pop)] text-left z-40"
                    >
                      <div className="flex gap-2">
                        <img src={h.images[0]} alt={h.name} className="h-12 w-12 shrink-0 rounded-lg object-cover" />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-xs font-bold text-[var(--color-ink)]">{h.name}</p>
                          <p className="truncate text-[10px] text-[var(--color-ink-faint)]">{h.locality}</p>
                          <div className="mt-0.5 flex items-center justify-between">
                            <span className="font-mono text-xs font-semibold text-[var(--color-indigo)]">{formatINR(h.price)}/mo</span>
                            <span className="flex items-center gap-0.5 text-[10px] font-semibold text-amber-600">
                              <Star size={10} className="fill-amber-400 text-amber-400" /> {h.rating}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Interactive Map Pin Pill */}
                <div
                  className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold shadow-md transition-all ${
                    isActive
                      ? 'bg-[var(--color-saffron)] text-white ring-4 ring-[var(--color-saffron-soft)]'
                      : isHovered
                      ? 'bg-[var(--color-ink)] text-white ring-2 ring-indigo-400'
                      : h.gender === 'girls'
                      ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white border border-rose-300'
                      : 'bg-gradient-to-r from-indigo-700 to-blue-600 text-white border border-indigo-300'
                  }`}
                >
                  {displayMode === 'price' && (
                    <span className="font-mono font-bold tracking-tight">{formatINR(h.price)}</span>
                  )}

                  {displayMode === 'name-price' && (
                    <>
                      <span className="max-w-[130px] truncate text-[11px] font-medium tracking-tight">
                        {h.name}
                      </span>
                      <span className="h-2.5 w-px bg-white/30" />
                      <span className="font-mono font-bold text-[11px]">{formatINR(h.price)}</span>
                    </>
                  )}

                  {displayMode === 'detailed' && (
                    <>
                      <span className="flex items-center gap-0.5 text-[10px] font-bold text-amber-200">
                        <Star size={10} className="fill-amber-300 text-amber-300" /> {h.rating}
                      </span>
                      <span className="h-2.5 w-px bg-white/30" />
                      <span className="max-w-[120px] truncate text-[11px] font-medium">
                        {h.name}
                      </span>
                      <span className="h-2.5 w-px bg-white/30" />
                      <span className="font-mono font-bold text-[11px]">{formatINR(h.price)}/mo</span>
                    </>
                  )}
                </div>

                {/* Pin Pointer Tail */}
                <span
                  className={`h-2.5 w-2.5 -translate-y-1 rotate-45 transition-colors ${
                    isActive
                      ? 'bg-[var(--color-saffron)]'
                      : isHovered
                      ? 'bg-[var(--color-ink)]'
                      : h.gender === 'girls'
                      ? 'bg-rose-600'
                      : 'bg-indigo-700'
                  }`}
                />
              </motion.div>
            </button>
          );
        })}
      </motion.div>

      {/* Selected Hostel Active Bottom Card */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-3 left-3 right-3 z-30 flex flex-col gap-3 rounded-2xl border border-[var(--color-line)] bg-white/98 p-4 shadow-[var(--shadow-pop)] backdrop-blur sm:left-4 sm:w-96"
          >
            <div className="flex items-start justify-between gap-2 border-b border-[var(--color-line)] pb-3">
              <div className="flex gap-3 min-w-0">
                <img
                  src={active.images[0]}
                  alt={active.name}
                  className="h-16 w-16 shrink-0 rounded-xl object-cover border border-[var(--color-line)]"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <GenderBadge gender={active.gender} />
                    {active.verified && (
                      <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 border border-emerald-200">
                        <ShieldCheck size={10} /> Verified
                      </span>
                    )}
                  </div>
                  <h3 className="mt-1 truncate font-display text-base font-semibold text-[var(--color-ink)]">
                    {active.name}
                  </h3>
                  <p className="truncate text-xs text-[var(--color-ink-faint)] flex items-center gap-1">
                    <MapPin size={11} className="text-[var(--color-ink-faint)] shrink-0" />
                    {active.locality}, {active.city} · {formatDistance(active.distanceKm)}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActive(null)}
                className="rounded-full p-1 text-[var(--color-ink-faint)] hover:bg-slate-100 hover:text-[var(--color-ink)]"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-medium uppercase tracking-wider text-[var(--color-ink-faint)]">Starting Monthly Rent</p>
                <p className="font-mono text-lg font-bold text-[var(--color-ink)] tabular">
                  {formatINR(active.price)}
                  <span className="text-xs font-normal text-[var(--color-ink-faint)]">/mo</span>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate(`/enquire/${active.id}`)}
                  className="rounded-full bg-[var(--color-saffron)] px-3.5 py-2 text-xs font-semibold text-white transition-transform active:scale-95 hover:bg-[var(--color-saffron-dark)]"
                >
                  Enquire
                </button>
                <button
                  onClick={() => navigate(`/hostel/${active.id}`)}
                  className="rounded-full bg-[var(--color-ink)] px-3.5 py-2 text-xs font-semibold text-white transition-transform active:scale-95 hover:bg-[var(--color-indigo)]"
                >
                  View Details
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
