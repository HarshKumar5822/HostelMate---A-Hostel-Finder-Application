import type { SafetyBreakdown } from '../../types';
import ScoreRing from '../common/ScoreRing';
import { Camera, ShieldCheck, Fingerprint, Flame, PhoneCall, UserCheck } from 'lucide-react';

export default function SafetySection({ score, breakdown }: { score: number; breakdown: SafetyBreakdown }) {
  const items = [
    { icon: Camera, label: 'CCTV', value: breakdown.cctvCoverage },
    { icon: ShieldCheck, label: 'Security Guard', value: breakdown.security },
    { icon: Fingerprint, label: 'Access Control', value: breakdown.accessControl },
    { icon: UserCheck, label: 'User Feedback', value: breakdown.userFeedback },
  ];
  return (
    <div className="rounded-2xl border border-[var(--color-line)] bg-white p-6">
      <div className="flex flex-col items-center gap-6 sm:flex-row">
        <ScoreRing value={score} label="Safety Score" color="var(--color-signal)" size={120} />
        <div className="grid flex-1 grid-cols-2 gap-4">
          {items.map((it) => (
            <div key={it.label} className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-signal-soft)]">
                <it.icon size={16} className="text-[var(--color-signal)]" />
              </span>
              <div>
                <p className="text-xs text-[var(--color-ink-faint)]">{it.label}</p>
                <p className="text-sm font-semibold text-[var(--color-ink)] tabular">{it.value}/100</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-5 grid grid-cols-2 gap-3 border-t border-[var(--color-line)] pt-5 text-xs text-[var(--color-ink-soft)] sm:grid-cols-4">
        <span className="inline-flex items-center gap-1.5"><Flame size={13} /> Fire safety on-site</span>
        <span className="inline-flex items-center gap-1.5"><PhoneCall size={13} /> Emergency contact posted</span>
        <span className="inline-flex items-center gap-1.5"><UserCheck size={13} /> Warden on premises</span>
        <span className="inline-flex items-center gap-1.5"><ShieldCheck size={13} /> Entry rules enforced</span>
      </div>
      <p className="mt-4 text-[11px] text-[var(--color-ink-faint)]">
        Safety score is a demo estimate combining security infrastructure and review signals — not an official certification.
      </p>
    </div>
  );
}
