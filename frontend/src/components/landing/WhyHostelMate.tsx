import { motion } from 'framer-motion';
import { ShieldCheck, Scale, BrainCircuit, MapPinned, BadgeCheck, LineChart } from 'lucide-react';

const FEATURES = [
  { icon: MapPinned, title: 'Map-first discovery', desc: 'See exactly how far a hostel is from your college or office before you commit.' },
  { icon: Scale, title: 'Real comparison', desc: 'Line up 2–4 hostels on rent, food, safety and facilities in one table.' },
  { icon: BrainCircuit, title: 'Smart Match scoring', desc: 'A transparent estimate of fit based on your budget, location and preferences.' },
  { icon: LineChart, title: 'Worth-it analysis', desc: 'A value breakdown for every hostel — not just a star rating.' },
  { icon: ShieldCheck, title: 'Safety scoring', desc: 'CCTV, access control and warden details, scored and broken down.' },
  { icon: BadgeCheck, title: 'Honest data labels', desc: 'Every price and vacancy is marked Verified, Community, Estimated or Sample.' },
];

export default function WhyHostelMate() {
  return (
    <section className="border-b border-[var(--color-line)] bg-white py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-mono text-xs font-semibold uppercase tracking-widest text-[var(--color-indigo)]">Why HostelMate</p>
          <h2 className="mt-2 font-display text-3xl font-semibold text-[var(--color-ink)] sm:text-4xl">
            Built for the decision, not just the listing.
          </h2>
        </div>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07, duration: 0.4 }}
              className="rounded-2xl border border-[var(--color-line)] p-6"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--color-indigo-soft)]">
                <f.icon size={20} className="text-[var(--color-indigo)]" />
              </span>
              <h3 className="mt-4 font-display text-lg font-semibold text-[var(--color-ink)]">{f.title}</h3>
              <p className="mt-1.5 text-sm text-[var(--color-ink-soft)]">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
