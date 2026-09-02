import { motion } from 'framer-motion';
import { Search, Phone, Car, IndianRupee, UtensilsCrossed, DoorOpen, RotateCcw } from 'lucide-react';

const OLD_STEPS = [
  { icon: Search, label: 'Search Google' },
  { icon: Phone, label: 'Call hostel' },
  { icon: Car, label: 'Travel there' },
  { icon: IndianRupee, label: 'Ask rent' },
  { icon: UtensilsCrossed, label: 'Ask food' },
  { icon: DoorOpen, label: 'Ask vacancy' },
  { icon: RotateCcw, label: 'Repeat again' },
];

export default function PainSection() {
  return (
    <section className="border-b border-[var(--color-line)] bg-[var(--color-paper)] py-20">
      <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
        <p className="font-mono text-xs font-semibold uppercase tracking-widest text-[var(--color-ink-faint)]">The old way</p>
        <h2 className="mx-auto mt-2 max-w-2xl font-display text-3xl font-semibold text-[var(--color-ink)] sm:text-4xl">
          Visiting twenty hostels just to learn the rent.
        </h2>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-x-2 gap-y-6">
          {OLD_STEPS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.4 }}
              className="flex items-center gap-2"
            >
              <div className="flex flex-col items-center gap-2 rounded-2xl border border-[var(--color-line)] bg-white px-4 py-4">
                <s.icon size={20} className="text-[var(--color-rose)]" />
                <span className="text-xs font-medium text-[var(--color-ink-soft)]">{s.label}</span>
              </div>
              {i < OLD_STEPS.length - 1 && <span className="text-[var(--color-line-strong)]">→</span>}
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mx-auto mt-14 max-w-md rounded-2xl border-2 border-[var(--color-signal)] bg-white p-8"
        >
          <p className="font-display text-2xl font-semibold text-[var(--color-ink)]">HostelMate</p>
          <p className="mt-2 text-[var(--color-ink-soft)]">One search. Multiple options. Better decisions.</p>
        </motion.div>
      </div>
    </section>
  );
}
