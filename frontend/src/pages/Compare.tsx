import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, Star, MapPin, UtensilsCrossed, X, Plus, Sparkles, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { useCollections } from '../hooks/useCollections';
import { getHostelById } from '../services/hostelService';
import { HOSTELS } from '../data';
import { formatINR, formatDistance } from '../utils/format';
import { FacilityChip } from '../components/common/FacilityBadge';
import AvailabilityBadge from '../components/common/AvailabilityBadge';
import type { Hostel } from '../types';

function valueScore(h: Hostel) {
  return Math.round((h.rating * 20 + h.facilities.length * 3 - h.price / 300));
}

export default function Compare() {
  const { compareIds, toggleCompare, clearCompare } = useCollections();
  const [picking, setPicking] = useState(false);
  const [activeImageMap, setActiveImageMap] = useState<Record<string, number>>({});
  const [modalData, setModalData] = useState<{
    hostelName: string;
    locality: string;
    city: string;
    images: string[];
    currentIndex: number;
  } | null>(null);

  const navigate = useNavigate();
  const hostels = compareIds.map((id) => getHostelById(id)).filter(Boolean) as Hostel[];

  const winners = useMemo(() => {
    if (hostels.length < 2) return null;
    return {
      price: hostels.reduce((a, b) => (a.price < b.price ? a : b)),
      rating: hostels.reduce((a, b) => (a.rating > b.rating ? a : b)),
      distance: hostels.reduce((a, b) => (a.distanceKm < b.distanceKm ? a : b)),
      food: hostels.reduce((a, b) => (a.food.rating > b.food.rating ? a : b)),
      safety: hostels.reduce((a, b) => (a.safetyScore > b.safetyScore ? a : b)),
    };
  }, [hostels]);

  const available = HOSTELS.filter((h) => !compareIds.includes(h.id)).slice(0, 12);

  const handlePrevImage = (e: React.MouseEvent, hostelId: string, total: number) => {
    e.stopPropagation();
    setActiveImageMap((prev) => ({
      ...prev,
      [hostelId]: ((prev[hostelId] || 0) - 1 + total) % total,
    }));
  };

  const handleNextImage = (e: React.MouseEvent, hostelId: string, total: number) => {
    e.stopPropagation();
    setActiveImageMap((prev) => ({
      ...prev,
      [hostelId]: ((prev[hostelId] || 0) + 1) % total,
    }));
  };

  const openLightbox = (hostel: Hostel, imageIndex: number) => {
    setModalData({
      hostelName: hostel.name,
      locality: hostel.locality,
      city: hostel.city,
      images: hostel.images,
      currentIndex: imageIndex,
    });
  };

  const rows: { label: string; render: (h: Hostel) => React.ReactNode }[] = [
    { label: 'Monthly Rent', render: (h) => <span className="font-mono font-semibold tabular">{formatINR(h.price)}</span> },
    { label: 'Distance', render: (h) => formatDistance(h.distanceKm) },
    { label: 'Rating', render: (h) => <span className="inline-flex items-center gap-1"><Star size={12} className="fill-[var(--color-saffron)] text-[var(--color-saffron)]" />{h.rating}</span> },
    { label: 'Food', render: (h) => h.food.included ? `Included (${h.food.rating.toFixed(1)}★)` : 'Not included' },
    { label: 'Wi-Fi', render: (h) => h.facilities.includes('wifi') ? '✓' : '—' },
    { label: 'AC', render: (h) => h.facilities.includes('ac') ? '✓' : '—' },
    { label: 'Laundry', render: (h) => h.facilities.includes('laundry') ? '✓' : '—' },
    { label: 'Security', render: (h) => h.facilities.includes('security') ? '✓' : '—' },
    { label: 'Room Types', render: (h) => h.roomTypes.map((r) => r.label).join(', ') },
    { label: 'Availability', render: (h) => <AvailabilityBadge status={h.availability} beds={h.bedsAvailable} /> },
    { label: 'Facilities', render: (h) => <div className="flex flex-wrap gap-1">{h.facilities.slice(0, 4).map((f) => <FacilityChip key={f} facility={f} />)}</div> },
    { label: 'Value Score', render: (h) => <span className="font-semibold">{valueScore(h)}</span> },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-[var(--color-ink)]">Compare Hostels</h1>
          <p className="text-sm text-[var(--color-ink-soft)]">Add 2–4 hostels to compare rent, facilities, food and safety side by side.</p>
        </div>
        {hostels.length > 0 && (
          <button onClick={clearCompare} className="rounded-full border border-[var(--color-line)] px-4 py-2 text-xs font-medium text-[var(--color-ink-soft)] hover:bg-slate-50 transition-colors">Clear all</button>
        )}
      </div>

      {hostels.length === 0 ? (
        <div className="space-y-6">
          {/* Empty State Banner */}
          <div className="rounded-3xl border border-dashed border-[var(--color-line-strong)] bg-white p-10 text-center shadow-xs">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--color-indigo-soft)] text-[var(--color-indigo)]">
              <Trophy size={28} />
            </div>
            <h2 className="font-display text-xl font-bold text-[var(--color-ink)]">No Hostels Added to Compare Yet</h2>
            <p className="mx-auto mt-1 max-w-md text-sm text-[var(--color-ink-soft)]">
              Compare rent, room amenities, food quality, safety scores, and distance side-by-side to make the best choice.
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => {
                  const demo = HOSTELS.slice(0, 2);
                  demo.forEach((h) => toggleCompare(h.id));
                }}
                className="inline-flex items-center gap-2 rounded-full bg-[var(--color-indigo)] px-5 py-3 text-xs font-semibold text-white shadow-sm transition-transform active:scale-95 hover:bg-[var(--color-ink)]"
              >
                <Sparkles size={14} /> Compare 2 Demo Hostels Instantly
              </button>

              <button
                onClick={() => navigate('/discover')}
                className="inline-flex items-center gap-2 rounded-full border border-[var(--color-line-strong)] bg-white px-5 py-3 text-xs font-semibold text-[var(--color-ink)] hover:bg-slate-50"
              >
                Browse All Hostels
              </button>
            </div>
          </div>

          {/* How Compare Works Guide */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-[var(--color-line)] bg-white p-5">
              <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 font-mono text-xs font-bold text-amber-800">
                1
              </div>
              <h3 className="font-display text-sm font-semibold text-[var(--color-ink)]">Tap ⚖️ Compare Icon</h3>
              <p className="mt-1 text-xs text-[var(--color-ink-faint)]">
                Click the scale icon at the top right of any hostel card while searching.
              </p>
            </div>

            <div className="rounded-2xl border border-[var(--color-line)] bg-white p-5">
              <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 font-mono text-xs font-bold text-blue-800">
                2
              </div>
              <h3 className="font-display text-sm font-semibold text-[var(--color-ink)]">Add 2 to 4 Hostels</h3>
              <p className="mt-1 text-xs text-[var(--color-ink-faint)]">
                Select multiple hostels from Hyderabad, Bangalore, Delhi or any city.
              </p>
            </div>

            <div className="rounded-2xl border border-[var(--color-line)] bg-white p-5">
              <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 font-mono text-xs font-bold text-emerald-800">
                3
              </div>
              <h3 className="font-display text-sm font-semibold text-[var(--color-ink)]">View Winner Highlights</h3>
              <p className="mt-1 text-xs text-[var(--color-ink-faint)]">
                Get automated trophies for Lowest Rent, Highest Safety, and Best Value score.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-[var(--color-line)] bg-white shadow-xs">
          <table className="w-full min-w-[760px] text-sm">
            <thead>
              <tr className="border-b border-[var(--color-line)]">
                <th className="w-40 p-4"></th>
                {hostels.map((h) => {
                  const currentImgIdx = activeImageMap[h.id] || 0;
                  const currentImage = h.images[currentImgIdx] || h.images[0];
                  return (
                    <th key={h.id} className="p-4 text-left align-top">
                      <div className="relative">
                        {/* Image Box with Enlarge & Nav Controls */}
                        <div className="group relative mb-3 h-48 sm:h-56 w-full overflow-hidden rounded-xl bg-slate-100 shadow-xs">
                          <img
                            src={currentImage}
                            alt={h.name}
                            onClick={() => openLightbox(h, currentImgIdx)}
                            className="h-full w-full cursor-pointer object-cover transition-transform duration-300 group-hover:scale-105"
                          />

                          {/* Enlarge Lightbox Button */}
                          <button
                            onClick={() => openLightbox(h, currentImgIdx)}
                            className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-medium text-white backdrop-blur-xs opacity-80 hover:opacity-100 hover:bg-black/80 transition-all"
                            title="Click to enlarge photo"
                          >
                            <Maximize2 size={11} /> Enlarge
                          </button>

                          {/* Remove Hostel Button */}
                          <button
                            onClick={() => toggleCompare(h.id)}
                            className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-xs hover:bg-red-600 transition-colors shadow-sm"
                            title="Remove from comparison"
                          >
                            <X size={14} />
                          </button>

                          {/* Image Gallery Nav Controls */}
                          {h.images.length > 1 && (
                            <>
                              <button
                                onClick={(e) => handlePrevImage(e, h.id, h.images.length)}
                                className="absolute left-1.5 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 hover:bg-black/80 transition-all shadow-md"
                                title="Previous photo"
                              >
                                <ChevronLeft size={16} />
                              </button>
                              <button
                                onClick={(e) => handleNextImage(e, h.id, h.images.length)}
                                className="absolute right-1.5 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 hover:bg-black/80 transition-all shadow-md"
                                title="Next photo"
                              >
                                <ChevronRight size={16} />
                              </button>

                              {/* Dot Indicators */}
                              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 rounded-full bg-black/50 px-2.5 py-1 backdrop-blur-xs">
                                {h.images.map((_, idx) => (
                                  <button
                                    key={idx}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setActiveImageMap((prev) => ({ ...prev, [h.id]: idx }));
                                    }}
                                    className={`h-1.5 rounded-full transition-all ${
                                      idx === currentImgIdx ? 'w-4 bg-white' : 'w-1.5 bg-white/50 hover:bg-white/80'
                                    }`}
                                  />
                                ))}
                              </div>
                            </>
                          )}
                        </div>

                        {/* Title & Locality */}
                        <button
                          onClick={() => navigate(`/hostel/${h.id}`)}
                          className="font-display text-base font-bold text-[var(--color-ink)] hover:text-[var(--color-indigo)] transition-colors text-left block"
                        >
                          {h.name}
                        </button>
                        <p className="text-xs text-[var(--color-ink-faint)] mt-0.5">{h.locality}, {h.city}</p>
                      </div>
                    </th>
                  );
                })}
                {hostels.length < 4 && (
                  <th className="p-4 align-top">
                    <button
                      onClick={() => setPicking(true)}
                      className="flex h-48 sm:h-56 w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[var(--color-line-strong)] bg-slate-50/50 text-xs font-semibold text-[var(--color-ink-soft)] hover:border-[var(--color-indigo)] hover:bg-indigo-50/30 hover:text-[var(--color-indigo)] transition-all"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-xs border border-[var(--color-line)]">
                        <Plus size={20} />
                      </div>
                      <span>Add hostel to compare</span>
                    </button>
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-line)]">
              {rows.map((row) => (
                <tr key={row.label}>
                  <td className="p-4 text-xs font-medium text-[var(--color-ink-faint)]">{row.label}</td>
                  {hostels.map((h) => {
                    let icon = null;
                    if (winners) {
                      if (row.label === 'Monthly Rent' && h.id === winners.price.id) icon = <Trophy size={12} className="text-[var(--color-saffron)]" />;
                      if (row.label === 'Rating' && h.id === winners.rating.id) icon = <Star size={12} className="text-[var(--color-saffron)]" />;
                      if (row.label === 'Distance' && h.id === winners.distance.id) icon = <MapPin size={12} className="text-[var(--color-indigo)]" />;
                      if (row.label === 'Food' && h.id === winners.food.id) icon = <UtensilsCrossed size={12} className="text-[var(--color-amber)]" />;
                    }
                    return (
                      <td key={h.id} className="p-4 text-[var(--color-ink)]">
                        <span className="inline-flex items-center gap-1.5">{row.render(h)} {icon}</span>
                      </td>
                    );
                  })}
                  {hostels.length < 4 && <td />}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Hostel Selector Modal */}
      {picking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs" onClick={() => setPicking(false)}>
          <div onClick={(e) => e.stopPropagation()} className="max-h-[70vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-5 shadow-xl">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-display text-lg font-semibold text-[var(--color-ink)]">Add a hostel to compare</h3>
              <button onClick={() => setPicking(false)} className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
                <X size={16} />
              </button>
            </div>
            <div className="space-y-2">
              {available.map((h) => (
                <button
                  key={h.id}
                  onClick={() => { toggleCompare(h.id); setPicking(false); }}
                  className="flex w-full items-center gap-3 rounded-xl border border-[var(--color-line)] p-2.5 text-left transition-all hover:border-[var(--color-indigo)] hover:bg-indigo-50/30"
                >
                  <img src={h.images[0]} alt={h.name} className="h-14 w-14 rounded-lg object-cover" />
                  <div>
                    <p className="text-sm font-semibold text-[var(--color-ink)]">{h.name}</p>
                    <p className="text-xs text-[var(--color-ink-faint)]">{h.locality}, {h.city} · {formatINR(h.price)}/mo</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Lightbox Photo Preview Modal */}
      {modalData && (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/85 p-4 sm:p-6 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setModalData(null)}
        >
          {/* Header Bar */}
          <div className="mb-4 flex w-full max-w-4xl items-center justify-between text-white" onClick={(e) => e.stopPropagation()}>
            <div>
              <h3 className="font-display text-lg font-bold">{modalData.hostelName}</h3>
              <p className="text-xs text-slate-300">{modalData.locality}, {modalData.city} · Photo {modalData.currentIndex + 1} of {modalData.images.length}</p>
            </div>
            <button
              onClick={() => setModalData(null)}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Main Enlarged Image Container */}
          <div className="relative flex max-h-[75vh] w-full max-w-4xl items-center justify-center overflow-hidden rounded-2xl bg-black shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <img
              src={modalData.images[modalData.currentIndex]}
              alt={modalData.hostelName}
              className="max-h-[75vh] w-auto max-w-full object-contain"
            />

            {/* Modal Prev / Next Buttons */}
            {modalData.images.length > 1 && (
              <>
                <button
                  onClick={() =>
                    setModalData((prev) =>
                      prev
                        ? {
                            ...prev,
                            currentIndex: (prev.currentIndex - 1 + prev.images.length) % prev.images.length,
                          }
                        : null
                    )
                  }
                  className="absolute left-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 transition-all shadow-lg"
                >
                  <ChevronLeft size={22} />
                </button>
                <button
                  onClick={() =>
                    setModalData((prev) =>
                      prev
                        ? {
                            ...prev,
                            currentIndex: (prev.currentIndex + 1) % prev.images.length,
                          }
                        : null
                    )
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 transition-all shadow-lg"
                >
                  <ChevronRight size={22} />
                </button>
              </>
            )}
          </div>

          {/* Bottom Thumbnails */}
          {modalData.images.length > 1 && (
            <div className="mt-4 flex items-center gap-2 overflow-x-auto p-1" onClick={(e) => e.stopPropagation()}>
              {modalData.images.map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setModalData((prev) => (prev ? { ...prev, currentIndex: idx } : null))}
                  className={`h-14 w-20 overflow-hidden rounded-lg border-2 transition-all ${
                    idx === modalData.currentIndex ? 'border-white scale-105 shadow-md' : 'border-transparent opacity-50 hover:opacity-100'
                  }`}
                >
                  <img src={imgUrl} alt={`Thumbnail ${idx + 1}`} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

