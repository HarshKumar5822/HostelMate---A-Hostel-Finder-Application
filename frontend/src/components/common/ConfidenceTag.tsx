import type { DataConfidence } from '../../types';

const META: Record<DataConfidence, { label: string; cls: string }> = {
  verified: { label: 'Verified', cls: 'bg-[var(--color-signal-soft)] text-[var(--color-signal)]' },
  live: { label: 'Live data', cls: 'bg-[var(--color-indigo-soft)] text-[var(--color-indigo)]' },
  community: { label: 'Community data', cls: 'bg-[var(--color-amber-soft)] text-[var(--color-amber)]' },
  estimated: { label: 'Estimated', cls: 'bg-[var(--color-line)] text-[var(--color-ink-soft)]' },
  sample: { label: 'Sample data', cls: 'bg-[var(--color-rose-soft)] text-[var(--color-rose)]' },
};

export default function ConfidenceTag({ level, className = '' }: { level: DataConfidence; className?: string }) {
  const m = META[level];
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${m.cls} ${className}`}>
      {m.label}
    </span>
  );
}
