import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, ResponsiveContainer, XAxis, Tooltip } from 'recharts';
import { ArrowRight } from 'lucide-react';
import { getCityStats } from '../../data';

export default function InsightsTeaser() {
  const navigate = useNavigate();
  const data = getCityStats().slice(0, 6).map((c) => ({ name: c.city, rent: c.avgRent }));
  return (
    <section className="border-b border-[var(--color-line)] bg-white py-20">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div>
          <p className="font-mono text-xs font-semibold uppercase tracking-widest text-[var(--color-indigo)]">HostelMate Insights</p>
          <h2 className="mt-2 font-display text-3xl font-semibold text-[var(--color-ink)] sm:text-4xl">
            Rent data across India, at a glance.
          </h2>
          <p className="mt-4 max-w-md text-[var(--color-ink-soft)]">
            Average rent, rating distribution and facility availability by city and area — updated as HostelMate's listings grow.
          </p>
          <button onClick={() => navigate('/insights')} className="mt-6 inline-flex items-center gap-1.5 rounded-full border border-[var(--color-line-strong)] px-5 py-2.5 text-sm font-semibold text-[var(--color-ink)]">
            View full insights <ArrowRight size={15} />
          </button>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
          className="h-64 rounded-2xl border border-[var(--color-line)] bg-[var(--color-paper)] p-4"
        >
          <p className="mb-2 text-xs font-semibold text-[var(--color-ink-faint)]">Average monthly rent by city</p>
          <ResponsiveContainer width="100%" height="90%">
            <BarChart data={data}>
              <XAxis dataKey="name" tick={{ fontSize: 10 }} stroke="var(--color-ink-faint)" />
              <Tooltip formatter={(v: any) => [`₹${Number(v).toLocaleString("en-IN")}`, "Avg rent"]} />
              <Bar dataKey="rent" fill="var(--color-indigo)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </section>
  );
}
