import { motion } from 'framer-motion';

export default function ScoreRing({
  value, size = 96, stroke = 8, label, color = 'var(--color-signal)',
}: { value: number; size?: number; stroke?: number; label?: string; color?: string }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} stroke="var(--color-line)" strokeWidth={stroke} fill="none" />
        <motion.circle
          cx={size / 2} cy={size / 2} r={r}
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          whileInView={{ strokeDashoffset: c - (value / 100) * c }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className="font-display text-xl font-semibold text-[var(--color-ink)] tabular">{value}</span>
        {label && <span className="text-[10px] text-[var(--color-ink-faint)]">{label}</span>}
      </div>
    </div>
  );
}
