import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Trophy, Star as StarIcon, MapPin, ShieldCheck, ArrowRight } from 'lucide-react';
import ScoreRing from '../common/ScoreRing';
import { HOSTELS } from '../../data';
import { formatINR } from '../../utils/format';

const sample = HOSTELS.slice(0, 3);

export function ComparisonTeaser() {
  const navigate = useNavigate();
  return (
    <section className="border-b border-[var(--color-line)] bg-[var(--color-paper)] py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <p className="font-mono text-xs font-semibold uppercase tracking-widest text-[var(--color-indigo)]">Compare hostels</p>
          <h2 className="mt-2 font-display text-3xl font-semibold text-[var(--color-ink)] sm:text-4xl">Put them side by side.</h2>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
          className="overflow-x-auto rounded-2xl border border-[var(--color-line)] bg-white"
        >
          <table className="w-full min-w-[560px] text-sm">
            <thead>
              <tr className="border-b border-[var(--color-line)]">
                <th className="p-4 text-left text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-faint)]">Metric</th>
                {sample.map((h) => (
                  <th key={h.id} className="p-4 text-left font-display text-sm font-semibold text-[var(--color-ink)]">{h.name}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-line)]">
              <tr>
                <td className="p-4 text-[var(--color-ink-faint)]">Monthly rent</td>
                {sample.map((h, i) => (
                  <td key={h.id} className="p-4 font-mono font-semibold text-[var(--color-ink)] tabular">
                    {formatINR(h.price)} {i === 0 && <Trophy size={13} className="ml-1 inline text-[var(--color-saffron)]" />}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 text-[var(--color-ink-faint)]">Rating</td>
                {sample.map((h) => (
                  <td key={h.id} className="p-4 text-[var(--color-ink)]"><StarIcon size={12} className="mr-1 inline fill-[var(--color-saffron)] text-[var(--color-saffron)]" />{h.rating}</td>
                ))}
              </tr>
              <tr>
                <td className="p-4 text-[var(--color-ink-faint)]">Distance</td>
                {sample.map((h) => (
                  <td key={h.id} className="p-4 text-[var(--color-ink)]"><MapPin size={12} className="mr-1 inline" />{h.distanceKm} km</td>
                ))}
              </tr>
            </tbody>
          </table>
        </motion.div>
        <div className="mt-8 text-center">
          <button onClick={() => navigate('/compare')} className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-ink)] px-6 py-3 text-sm font-semibold text-white">
            Open comparison tool <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </section>
  );
}

export function SafetySection() {
  return (
    <section className="border-b border-[var(--color-line)] bg-white py-20">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div>
          <p className="font-mono text-xs font-semibold uppercase tracking-widest text-[var(--color-indigo)]">Safety, quantified</p>
          <h2 className="mt-2 font-display text-3xl font-semibold text-[var(--color-ink)] sm:text-4xl">
            A safety score that actually breaks down.
          </h2>
          <p className="mt-4 max-w-md text-[var(--color-ink-soft)]">
            CCTV coverage, access control, on-site security and real user feedback — combined into one score, and shown separately so you know exactly what it's built from.
          </p>
          <div className="mt-6 flex items-center gap-2 text-sm text-[var(--color-ink-soft)]">
            <ShieldCheck size={16} className="text-[var(--color-signal)]" />
            Demo scores are labelled as estimates unless verified by HostelMate.
          </div>
        </div>
        <div className="flex items-center justify-center gap-8 rounded-2xl border border-[var(--color-line)] bg-[var(--color-paper)] p-8">
          <ScoreRing value={92} label="Safety Score" color="var(--color-signal)" size={130} />
          <div className="space-y-3 text-sm">
            <div className="flex justify-between gap-6"><span className="text-[var(--color-ink-faint)]">Security</span><span className="font-semibold text-[var(--color-ink)]">96</span></div>
            <div className="flex justify-between gap-6"><span className="text-[var(--color-ink-faint)]">CCTV</span><span className="font-semibold text-[var(--color-ink)]">90</span></div>
            <div className="flex justify-between gap-6"><span className="text-[var(--color-ink-faint)]">Access control</span><span className="font-semibold text-[var(--color-ink)]">88</span></div>
            <div className="flex justify-between gap-6"><span className="text-[var(--color-ink-faint)]">User feedback</span><span className="font-semibold text-[var(--color-ink)]">94</span></div>
          </div>
        </div>
      </div>
    </section>
  );
}

const TESTIMONIALS = [
  { name: 'Aditi Sharma', role: 'B.Tech student, moved from Ranchi to Hyderabad', text: 'I shortlisted three hostels near Gachibowli without stepping outside my old city. The comparison table settled it in ten minutes.' },
  { name: 'Rohit Meena', role: 'Software engineer, relocated to Bangalore', text: 'The safety breakdown mattered a lot to my parents. Being able to show them a real score, not just stars, helped.' },
  { name: 'Kavya Reddy', role: 'MBA student, Pune', text: 'The food section with the weekly menu is what actually made me pick my hostel over two cheaper options.' },
];

export function Testimonials() {
  return (
    <section className="border-b border-[var(--color-line)] bg-[var(--color-paper)] py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <p className="font-mono text-xs font-semibold uppercase tracking-widest text-[var(--color-indigo)]">Students on HostelMate</p>
          <h2 className="mt-2 font-display text-3xl font-semibold text-[var(--color-ink)] sm:text-4xl">Real moves, made easier.</h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.4 }}
              className="rounded-2xl border border-[var(--color-line)] bg-white p-6"
            >
              <p className="text-sm text-[var(--color-ink-soft)]">"{t.text}"</p>
              <p className="mt-4 text-sm font-semibold text-[var(--color-ink)]">{t.name}</p>
              <p className="text-xs text-[var(--color-ink-faint)]">{t.role}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ForOwners() {
  const navigate = useNavigate();
  return (
    <section className="border-b border-[var(--color-line)] bg-[var(--color-indigo-deep)] py-20 text-white">
      <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div>
          <p className="font-mono text-xs font-semibold uppercase tracking-widest text-[var(--color-saffron)]">For hostel owners</p>
          <h2 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">List your hostel where students actually search.</h2>
          <p className="mt-4 max-w-md text-white/70">
            Manage rooms, rent, availability and food menus from one dashboard, and track profile views, inquiries and conversion.
          </p>
          <button
            onClick={() => navigate('/owner')}
            className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-white px-6 py-3 text-sm font-semibold text-[var(--color-indigo-deep)]"
          >
            Go to owner dashboard <ArrowRight size={15} />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[
            ['Profile views', '1,204'], ['Inquiries', '38'], ['Saved count', '92'], ['Conversion', '6.2%'],
          ].map(([label, val]) => (
            <div key={label} className="rounded-2xl bg-white/10 p-5">
              <p className="font-mono text-2xl font-semibold tabular">{val}</p>
              <p className="mt-1 text-xs text-white/60">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FinalCTA() {
  const navigate = useNavigate();
  return (
    <section className="bg-white py-24 text-center">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <h2 className="font-display text-3xl font-semibold text-[var(--color-ink)] sm:text-4xl">
          Your next hostel is a few taps away.
        </h2>
        <p className="mt-3 text-[var(--color-ink-soft)]">No physical visits required to get started.</p>
        <button
          onClick={() => navigate('/onboarding')}
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-[var(--color-saffron)] px-8 py-4 text-sm font-semibold text-white"
        >
          Find My Hostel <ArrowRight size={16} />
        </button>
      </div>
    </section>
  );
}
