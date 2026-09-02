import { motion } from 'framer-motion';

export default function ProgressBar({
  label, value, color = 'var(--color-indigo)',
}: { label: string; value: number; color?: string }) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-xs">
        <span className="text-[var(--color-ink-soft)]">{label}</span>
        <span className="font-semibold text-[var(--color-ink)] tabular">{value}%</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--color-line)]">
        <motion.div
          className="h-full rounded-full"
          style={{ background: color }}
          initial={{ width: 0 }}
          whileInView={{ width: `${value}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}
