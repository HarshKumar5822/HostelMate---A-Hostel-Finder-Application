import { useMemo, useState } from 'react';
import type { Review } from '../../types';
import Rating from '../common/Rating';
import { timeAgo } from '../../utils/format';

const FILTERS = ['Recent', 'Highest Rated', 'Lowest Rated', 'Food', 'Cleanliness'] as const;
type FilterKey = typeof FILTERS[number];

const CATEGORY_LABELS: { key: keyof Review['categories']; label: string }[] = [
  { key: 'cleanliness', label: 'Cleanliness' },
  { key: 'food', label: 'Food' },
  { key: 'location', label: 'Location' },
  { key: 'safety', label: 'Safety' },
  { key: 'staff', label: 'Staff' },
  { key: 'value', label: 'Value for Money' },
];

export default function ReviewsSection({ reviews, overallRating }: { reviews: Review[]; overallRating: number }) {
  const [filter, setFilter] = useState<FilterKey>('Recent');

  const categoryAverages = useMemo(() => {
    const sums: Record<string, { total: number; count: number }> = {};
    reviews.forEach((r) => {
      Object.entries(r.categories).forEach(([k, v]) => {
        if (v == null) return;
        sums[k] = sums[k] || { total: 0, count: 0 };
        sums[k].total += v; sums[k].count += 1;
      });
    });
    return sums;
  }, [reviews]);

  const sorted = useMemo(() => {
    const list = [...reviews];
    if (filter === 'Highest Rated') list.sort((a, b) => b.rating - a.rating);
    else if (filter === 'Lowest Rated') list.sort((a, b) => a.rating - b.rating);
    else if (filter === 'Food') list.sort((a, b) => (b.categories.food ?? 0) - (a.categories.food ?? 0));
    else if (filter === 'Cleanliness') list.sort((a, b) => (b.categories.cleanliness ?? 0) - (a.categories.cleanliness ?? 0));
    else list.sort((a, b) => (a.date < b.date ? 1 : -1));
    return list;
  }, [reviews, filter]);

  return (
    <div>
      <div className="mb-6 flex flex-col gap-6 rounded-2xl border border-[var(--color-line)] bg-white p-6 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <span className="font-display text-4xl font-semibold text-[var(--color-ink)] tabular">{overallRating.toFixed(1)}</span>
          <div>
            <Rating value={overallRating} showValue={false} />
            <p className="text-xs text-[var(--color-ink-faint)]">{reviews.length} reviews</p>
          </div>
        </div>
        <div className="grid flex-1 grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-3">
          {CATEGORY_LABELS.map((c) => {
            const s = categoryAverages[c.key];
            const avg = s ? s.total / s.count : 0;
            return (
              <div key={c.key} className="flex items-center justify-between gap-2 text-xs">
                <span className="text-[var(--color-ink-faint)]">{c.label}</span>
                <span className="font-semibold text-[var(--color-ink)] tabular">{avg.toFixed(1)}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full border px-3.5 py-1.5 text-xs font-medium ${
              filter === f ? 'border-[var(--color-ink)] bg-[var(--color-ink)] text-white' : 'border-[var(--color-line)] text-[var(--color-ink-soft)]'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {sorted.slice(0, 8).map((r) => (
          <div key={r.id} className="rounded-2xl border border-[var(--color-line)] bg-white p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-indigo-soft)] font-display text-sm font-semibold text-[var(--color-indigo)]">
                  {r.name.charAt(0)}
                </span>
                <div>
                  <p className="text-sm font-semibold text-[var(--color-ink)]">{r.name}</p>
                  <p className="text-xs text-[var(--color-ink-faint)]">{r.role} · {timeAgo(r.date)}</p>
                </div>
              </div>
              <Rating value={r.rating} showValue={false} />
            </div>
            <p className="mt-3 text-sm text-[var(--color-ink-soft)]">{r.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
