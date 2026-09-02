import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { getCityStats } from '../../data';
import { formatINR } from '../../utils/format';

export default function PopularCities() {
  const stats = getCityStats();
  const navigate = useNavigate();
  return (
    <section className="border-b border-[var(--color-line)] bg-[var(--color-paper)] py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="font-mono text-xs font-semibold uppercase tracking-widest text-[var(--color-indigo)]">Explore hostels across India</p>
            <h2 className="mt-2 font-display text-3xl font-semibold text-[var(--color-ink)] sm:text-4xl">Popular cities</h2>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {stats.map((c, i) => (
            <motion.button
              key={c.city}
              onClick={() => navigate(`/city/${c.city}`)}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.35 }}
              whileHover={{ y: -3 }}
              className="group rounded-2xl border border-[var(--color-line)] bg-white p-4 text-left"
            >
              <div className="mb-3 flex items-start justify-between">
                <p className="font-display text-lg font-semibold text-[var(--color-ink)]">{c.city}</p>
                <ArrowUpRight size={16} className="text-[var(--color-ink-faint)] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[var(--color-indigo)]" />
              </div>
              <p className="text-xs text-[var(--color-ink-faint)]">{c.hostelCount} hostels</p>
              <p className="mt-1 font-mono text-sm font-semibold text-[var(--color-ink)] tabular">avg {formatINR(c.avgRent)}/mo</p>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}
