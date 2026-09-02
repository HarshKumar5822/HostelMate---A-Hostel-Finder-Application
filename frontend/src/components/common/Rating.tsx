import { Star } from 'lucide-react';

export default function Rating({
  value, count, size = 14, showValue = true,
}: { value: number; count?: number; size?: number; showValue?: boolean }) {
  return (
    <span className="inline-flex items-center gap-1 tabular">
      <Star size={size} className="fill-[var(--color-saffron)] text-[var(--color-saffron)]" />
      {showValue && <span className="font-semibold text-[var(--color-ink)]">{value.toFixed(1)}</span>}
      {count != null && <span className="text-[var(--color-ink-faint)]">({count})</span>}
    </span>
  );
}
