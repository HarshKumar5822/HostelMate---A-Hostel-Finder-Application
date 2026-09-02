import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

export default function StepShell({
  step, total, title, subtitle, children, footer,
}: { step: number; total: number; title: string; subtitle?: string; children: ReactNode; footer: ReactNode }) {
  return (
    <div className="mx-auto flex min-h-screen max-w-2xl flex-col px-6 py-10">
      <div className="mb-10 flex items-center gap-1.5">
        {Array.from({ length: total }).map((_, i) => (
          <div key={i} className="flex flex-1 items-center gap-1.5">
            <span
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                i < step ? 'bg-[var(--color-indigo)]' : 'bg-[var(--color-line)]'
              }`}
            />
          </div>
        ))}
      </div>

      <motion.div
        key={step}
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -24 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="flex-1"
      >
        <p className="mb-2 font-mono text-xs font-medium uppercase tracking-widest text-[var(--color-indigo)]">
          Step {step} of {total}
        </p>
        <h1 className="font-display text-3xl font-semibold text-[var(--color-ink)] sm:text-4xl">{title}</h1>
        {subtitle && <p className="mt-3 max-w-lg text-[var(--color-ink-soft)]">{subtitle}</p>}
        <div className="mt-8">{children}</div>
      </motion.div>

      <div className="mt-10 flex items-center justify-between border-t border-[var(--color-line)] pt-6">{footer}</div>
    </div>
  );
}
