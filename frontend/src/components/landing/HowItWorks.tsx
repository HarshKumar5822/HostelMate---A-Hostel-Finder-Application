import { motion } from 'framer-motion';
import { MapPin, SlidersHorizontal, Search, Scale, LineChart, CheckCircle2 } from 'lucide-react';

const STEPS = [
  { icon: MapPin, title: 'Location', desc: 'Tell us your city, area or college.' },
  { icon: SlidersHorizontal, title: 'Preferences', desc: 'Budget, room type, facilities, food.' },
  { icon: Search, title: 'Discover', desc: 'Browse verified and community listings.' },
  { icon: Scale, title: 'Compare', desc: 'Line up 2–4 hostels side by side.' },
  { icon: LineChart, title: 'Analyze', desc: "See if a hostel is really worth it." },
  { icon: CheckCircle2, title: 'Decide', desc: 'Shortlist, save, and move in with confidence.' },
];

export default function HowItWorks() {
  return (
    <section className="border-b border-[var(--color-line)] bg-white py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-mono text-xs font-semibold uppercase tracking-widest text-[var(--color-indigo)]">How HostelMate works</p>
          <h2 className="mt-2 font-display text-3xl font-semibold text-[var(--color-ink)] sm:text-4xl">Six stations, one journey.</h2>
        </div>

        <div className="relative mt-16">
          <div className="route-line-h absolute left-0 right-0 top-6 hidden h-px sm:block" />
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-6">
            {STEPS.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className="flex flex-col items-center text-center"
              >
                <span className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full border-2 border-[var(--color-indigo)] bg-white">
                  <s.icon size={20} className="text-[var(--color-indigo)]" />
                </span>
                <p className="mt-3 text-sm font-semibold text-[var(--color-ink)]">{s.title}</p>
                <p className="mt-1 text-xs text-[var(--color-ink-faint)]">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
