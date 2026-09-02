import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Star } from 'lucide-react';

const MARKERS = [
  { x: 62, y: 30, city: 'Delhi' },
  { x: 46, y: 68, city: 'Hyderabad' },
  { x: 40, y: 82, city: 'Bangalore' },
  { x: 58, y: 55, city: 'Pune' },
  { x: 52, y: 90, city: 'Chennai' },
  { x: 70, y: 62, city: 'Kolkata' },
];

export default function Hero() {
  const navigate = useNavigate();
  return (
    <section className="relative overflow-hidden border-b border-[var(--color-line)] bg-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:py-24 lg:px-8">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="mb-6 flex flex-wrap items-center gap-3"
          >
            <img src="/logo.png" alt="Room Mates" className="h-12 w-auto object-contain sm:h-14" />
            <span className="inline-flex items-center rounded-full bg-[var(--color-indigo-soft)] px-3.5 py-1.5 text-xs font-semibold text-[var(--color-indigo)]">
              Now live across 10 Indian cities
            </span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.05 }}
            className="font-display text-4xl font-semibold leading-[1.05] text-[var(--color-ink)] sm:text-5xl lg:text-[3.4rem]"
          >
            Stop searching for hostels.
            <br />
            Start finding the <span className="text-[var(--color-saffron)]">right</span> one.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.12 }}
            className="mt-5 max-w-lg text-lg text-[var(--color-ink-soft)]"
          >
            Discover, compare and analyze hostels across India based on your budget, location, lifestyle and needs — without visiting twenty of them first.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.18 }}
            className="mt-8 flex flex-col gap-3 sm:flex-row"
          >
            <button
              onClick={() => navigate('/onboarding')}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--color-ink)] px-6 py-3.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
            >
              Find My Hostel <ArrowRight size={16} />
            </button>
            <button
              onClick={() => navigate('/discover')}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-[var(--color-line-strong)] bg-white px-6 py-3.5 text-sm font-semibold text-[var(--color-ink)] hover:border-[var(--color-ink)]"
            >
              Explore Hostels
            </button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.1 }}
          className="relative aspect-[4/5] w-full max-w-md justify-self-center rounded-[2rem] border border-[var(--color-line)] bg-[var(--color-paper)] p-4 sm:p-6"
        >
          <svg viewBox="0 0 100 100" className="h-full w-full opacity-90">
            <path
              d="M50 4 C 65 6, 78 18, 76 34 C 82 40, 80 52, 74 58 C 76 66, 70 76, 62 80 C 60 88, 50 96, 44 92 C 34 94, 24 86, 26 76 C 18 72, 14 60, 20 50 C 16 40, 22 26, 32 20 C 34 10, 44 2, 50 4 Z"
              fill="var(--color-indigo-soft)"
              stroke="var(--color-indigo)"
              strokeWidth="0.6"
            />
          </svg>
          {MARKERS.map((m, i) => (
            <motion.div
              key={m.city}
              className="absolute flex flex-col items-center"
              style={{ left: `${m.x}%`, top: `${m.y}%` }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + i * 0.12, duration: 0.4, ease: 'backOut' }}
            >
              <motion.span
                className="h-3 w-3 rounded-full bg-[var(--color-saffron)] ring-4 ring-[var(--color-saffron-soft)]"
                animate={{ scale: [1, 1.25, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
              />
            </motion.div>
          ))}

          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1, duration: 0.5 }}
            className="absolute bottom-6 left-6 rounded-xl bg-white px-3.5 py-2.5 shadow-[var(--shadow-pop)]"
          >
            <p className="flex items-center gap-1 text-xs font-semibold text-[var(--color-ink)]">
              <Star size={12} className="fill-[var(--color-saffron)] text-[var(--color-saffron)]" /> 4.7 · ₹8,500/month
            </p>
            <p className="text-[11px] text-[var(--color-ink-faint)]">Wi-Fi · Food · AC · 3 beds available</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
