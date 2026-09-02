import type { RoomOption } from '../../types';
import { formatINR } from '../../utils/format';
import AvailabilityBadge from '../common/AvailabilityBadge';
import { FacilityChip } from '../common/FacilityBadge';
import { useNavigate } from 'react-router-dom';

export default function RoomCard({ room, hostelId }: { room: RoomOption; hostelId?: string }) {
  const navigate = useNavigate();

  const handleEnquire = () => {
    if (hostelId) {
      navigate(`/enquire/${hostelId}?room=${room.type}`);
    }
  };

  return (
    <div className="flex flex-col justify-between rounded-2xl border border-[var(--color-line)] bg-white p-5">
      <div>
        <div className="flex items-start justify-between">
          <h4 className="font-display text-base font-semibold text-[var(--color-ink)]">{room.label}</h4>
          <p className="font-mono text-lg font-semibold text-[var(--color-ink)] tabular">{formatINR(room.price)}<span className="text-xs font-normal text-[var(--color-ink-faint)]">/mo</span></p>
        </div>
        <p className="mt-1 text-xs text-[var(--color-ink-faint)]">Occupancy: {room.occupancy} {room.occupancy > 1 ? 'people' : 'person'}</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {room.facilities.slice(0, 5).map((f) => <FacilityChip key={f} facility={f} />)}
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between border-t border-[var(--color-line)] pt-3">
        <AvailabilityBadge status={room.availability} beds={room.bedsAvailable} />
        <button
          onClick={handleEnquire}
          disabled={room.availability === 'full'}
          className="rounded-full bg-[var(--color-ink)] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[var(--color-indigo)] disabled:cursor-not-allowed disabled:opacity-40"
        >
          {room.availability === 'full' ? 'Full' : 'Enquire'}
        </button>
      </div>
    </div>
  );
}
