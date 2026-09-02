import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Sparkles, X, ThumbsUp, ThumbsDown } from 'lucide-react';
import type { Hostel } from '../../types';
import { analyzeHostel } from '../../services/analyzer';
import ScoreRing from '../common/ScoreRing';
import ProgressBar from '../common/ProgressBar';

export default function AnalyzerButton({ hostel }: { hostel: Hostel }) {
  const [open, setOpen] = useState(false);
  const analysis = analyzeHostel(hostel);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--color-indigo)] bg-[var(--color-indigo-soft)] px-4 py-3 text-sm font-semibold text-[var(--color-indigo)]"
      >
        <Sparkles size={16} /> Is This Hostel Worth It?
      </button>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center">
            <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }} transition={{ ease: 'easeOut', duration: 0.3 }}
              className="relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-2xl bg-white p-6 sm:rounded-2xl"
            >
              <button onClick={() => setOpen(false)} className="absolute right-5 top-5" aria-label="Close"><X size={20} /></button>
              <p className="font-mono text-xs font-semibold uppercase tracking-widest text-[var(--color-indigo)]">Hostel Analyzer</p>
              <h3 className="mt-1 font-display text-2xl font-semibold text-[var(--color-ink)]">{hostel.name}</h3>

              <div className="mt-6 flex items-center justify-center">
                <ScoreRing value={analysis.overall} label="Overall Score" size={140} color="var(--color-saffron)" />
              </div>
              <p className="mt-3 text-center font-display text-lg font-semibold text-[var(--color-signal)]">{analysis.verdict}</p>

              <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4">
                <ProgressBar label="Value for Money" value={analysis.valueForMoney} color="var(--color-indigo)" />
                <ProgressBar label="Location" value={analysis.location} color="var(--color-saffron)" />
                <ProgressBar label="Facilities" value={analysis.facilities} color="var(--color-signal)" />
                <ProgressBar label="Food" value={analysis.food} color="var(--color-amber)" />
                <ProgressBar label="Safety" value={analysis.safety} color="var(--color-rose)" />
                <ProgressBar label="Reviews" value={analysis.reviews} color="var(--color-indigo)" />
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-[var(--color-signal)]"><ThumbsUp size={13} /> Pros</p>
                  <ul className="space-y-1.5 text-sm text-[var(--color-ink-soft)]">
                    {analysis.pros.map((p) => <li key={p}>• {p}</li>)}
                  </ul>
                </div>
                <div>
                  <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-[var(--color-rose)]"><ThumbsDown size={13} /> Cons</p>
                  <ul className="space-y-1.5 text-sm text-[var(--color-ink-soft)]">
                    {analysis.cons.map((c) => <li key={c}>• {c}</li>)}
                  </ul>
                </div>
              </div>

              <p className="mt-6 text-[11px] text-[var(--color-ink-faint)]">
                This is an analytical estimate generated from available listing, review and safety data — not a certified inspection.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
