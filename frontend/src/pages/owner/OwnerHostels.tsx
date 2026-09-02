import { useState } from 'react';
import { HOSTELS } from '../../data';
import { formatINR } from '../../utils/format';
import AvailabilityBadge from '../../components/common/AvailabilityBadge';
import { Pencil, MessageSquare } from 'lucide-react';

export default function OwnerHostels() {
  const [hostels] = useState(HOSTELS.slice(0, 4));

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <h1 className="font-display text-2xl font-semibold text-[var(--color-ink)]">My Hostels</h1>
      <p className="mt-1 text-sm text-[var(--color-ink-soft)]">Manage rent, availability, food menu and rules for each listing.</p>

      <div className="mt-6 space-y-4">
        {hostels.map((h) => (
          <div key={h.id} className="rounded-2xl border border-[var(--color-line)] bg-white p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex gap-4">
                <img src={h.images[0]} alt={h.name} className="h-20 w-20 rounded-xl object-cover" />
                <div>
                  <p className="font-display text-base font-semibold text-[var(--color-ink)]">{h.name}</p>
                  <p className="text-xs text-[var(--color-ink-faint)]">{h.locality}, {h.city}</p>
                  <div className="mt-2"><AvailabilityBadge status={h.availability} beds={h.bedsAvailable} /></div>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-line)] px-3.5 py-2 text-xs font-medium text-[var(--color-ink)]">
                  <Pencil size={13} /> Edit
                </button>
                <button className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-line)] px-3.5 py-2 text-xs font-medium text-[var(--color-ink)]">
                  <MessageSquare size={13} /> Reviews
                </button>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 border-t border-[var(--color-line)] pt-4 sm:grid-cols-4">
              <div>
                <p className="text-xs text-[var(--color-ink-faint)]">Rent (single)</p>
                <p className="font-mono text-sm font-semibold tabular">{formatINR(h.roomTypes[0]?.price ?? h.price)}</p>
              </div>
              <div>
                <p className="text-xs text-[var(--color-ink-faint)]">Rooms listed</p>
                <p className="font-mono text-sm font-semibold tabular">{h.roomTypes.length}</p>
              </div>
              <div>
                <p className="text-xs text-[var(--color-ink-faint)]">Facilities</p>
                <p className="font-mono text-sm font-semibold tabular">{h.facilities.length}</p>
              </div>
              <div>
                <p className="text-xs text-[var(--color-ink-faint)]">Rating</p>
                <p className="font-mono text-sm font-semibold tabular">{h.rating}/5</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
