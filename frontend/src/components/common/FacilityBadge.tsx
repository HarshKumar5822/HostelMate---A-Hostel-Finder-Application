import type { Facility } from '../../types';
import { FACILITY_META } from '../../data/facilities';

export function FacilityChip({ facility }: { facility: Facility }) {
  const meta = FACILITY_META[facility];
  const Icon = meta.icon;
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-[var(--color-line)] bg-white px-2.5 py-1 text-xs text-[var(--color-ink-soft)]">
      <Icon size={13} className="text-[var(--color-indigo)]" />
      {meta.label}
    </span>
  );
}

export function FacilityGrid({ facilities }: { facilities: Facility[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
      {facilities.map((f) => {
        const meta = FACILITY_META[f];
        const Icon = meta.icon;
        return (
          <div
            key={f}
            className="flex items-center gap-2.5 rounded-xl border border-[var(--color-line)] bg-white px-3 py-3"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--color-indigo-soft)]">
              <Icon size={16} className="text-[var(--color-indigo)]" />
            </span>
            <span className="text-sm text-[var(--color-ink)]">{meta.label}</span>
          </div>
        );
      })}
    </div>
  );
}
