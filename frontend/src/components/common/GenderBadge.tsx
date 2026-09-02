import type { Gender } from '../../types';

export default function GenderBadge({ gender }: { gender: Gender }) {
  const isGirls = gender === 'girls';
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${
        isGirls ? 'bg-[var(--color-rose-soft)] text-[var(--color-rose)]' : 'bg-[var(--color-indigo-soft)] text-[var(--color-indigo)]'
      }`}
    >
      {isGirls ? 'Girls Hostel' : 'Boys Hostel'}
    </span>
  );
}
