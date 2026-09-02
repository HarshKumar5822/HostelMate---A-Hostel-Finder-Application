import type { Hostel } from '../../types';
import { usePreferences } from '../../hooks/usePreferences';
import { computeMatch } from '../../services/matching';
import ScoreRing from '../common/ScoreRing';
import ProgressBar from '../common/ProgressBar';

export default function MatchScore({ hostel }: { hostel: Hostel }) {
  const { prefs } = usePreferences();
  const match = computeMatch(hostel, prefs);

  return (
    <div className="rounded-2xl border border-[var(--color-line)] bg-white p-6">
      <p className="mb-4 font-display text-lg font-semibold text-[var(--color-ink)]">HostelMate Smart Match</p>
      <div className="flex items-center gap-6">
        <ScoreRing value={match.overall} label="Match" color="var(--color-saffron)" size={110} />
        <div className="flex-1 space-y-3">
          <ProgressBar label="Budget" value={match.budget} color="var(--color-indigo)" />
          <ProgressBar label="Location" value={match.location} color="var(--color-saffron)" />
          <ProgressBar label="Facilities" value={match.facilities} color="var(--color-signal)" />
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <ProgressBar label="Food" value={match.food} color="var(--color-amber)" />
        <ProgressBar label="Rating" value={match.rating} color="var(--color-rose)" />
      </div>
      <p className="mt-4 text-[11px] text-[var(--color-ink-faint)]">
        Based on your budget, location and preferences from onboarding — an analytical estimate, not a guarantee.
      </p>
    </div>
  );
}
