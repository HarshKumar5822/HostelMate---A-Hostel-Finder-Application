const META = {
  available: { label: 'Available', dot: 'bg-[var(--color-signal)]', text: 'text-[var(--color-signal)]' },
  limited: { label: 'Limited', dot: 'bg-[var(--color-amber)]', text: 'text-[var(--color-amber)]' },
  full: { label: 'Full', dot: 'bg-[var(--color-rose)]', text: 'text-[var(--color-rose)]' },
} as const;

export default function AvailabilityBadge({
  status, beds,
}: { status: 'available' | 'limited' | 'full'; beds?: number }) {
  const m = META[status];
  let label: string = m.label;
  if (status !== 'full' && beds != null) {
    label = beds === 1 ? '1 bed remaining' : `${beds} beds available`;
  } else if (status === 'full') {
    label = 'No availability';
  }
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${m.text}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${m.dot}`} />
      {label}
    </span>
  );
}
