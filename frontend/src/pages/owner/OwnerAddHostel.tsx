import { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { FACILITY_META, FACILITY_LIST } from '../../data/facilities';
import type { Facility } from '../../types';

export default function OwnerAddHostel() {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const toggle = (f: Facility) => setFacilities((prev) => (prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]));

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center px-4 py-24 text-center">
        <CheckCircle2 size={40} className="mb-3 text-[var(--color-signal)]" />
        <p className="font-display text-xl font-semibold text-[var(--color-ink)]">Listing submitted</p>
        <p className="mt-1 text-sm text-[var(--color-ink-soft)]">Your hostel will appear once it's reviewed. (Demo form — no data was actually saved.)</p>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <h1 className="font-display text-2xl font-semibold text-[var(--color-ink)]">Add Hostel</h1>
      <p className="mt-1 text-sm text-[var(--color-ink-soft)]">List your hostel so students can find it on HostelMate.</p>

      <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="mt-6 max-w-2xl space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[var(--color-ink-soft)]">Hostel name</label>
            <input required className="w-full rounded-lg border border-[var(--color-line)] px-3.5 py-2.5 text-sm outline-none focus:border-[var(--color-indigo)]" placeholder="e.g. UrbanNest Student Living" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[var(--color-ink-soft)]">Gender</label>
            <select required className="w-full rounded-lg border border-[var(--color-line)] px-3.5 py-2.5 text-sm outline-none focus:border-[var(--color-indigo)]">
              <option value="">Select</option>
              <option value="boys">Boys</option>
              <option value="girls">Girls</option>
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[var(--color-ink-soft)]">City</label>
            <input required className="w-full rounded-lg border border-[var(--color-line)] px-3.5 py-2.5 text-sm outline-none focus:border-[var(--color-indigo)]" placeholder="Hyderabad" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[var(--color-ink-soft)]">Locality</label>
            <input required className="w-full rounded-lg border border-[var(--color-line)] px-3.5 py-2.5 text-sm outline-none focus:border-[var(--color-indigo)]" placeholder="Gachibowli" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[var(--color-ink-soft)]">Monthly rent (starting)</label>
            <input required type="number" className="w-full rounded-lg border border-[var(--color-line)] px-3.5 py-2.5 text-sm outline-none focus:border-[var(--color-indigo)]" placeholder="8500" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[var(--color-ink-soft)]">Contact phone</label>
            <input required className="w-full rounded-lg border border-[var(--color-line)] px-3.5 py-2.5 text-sm outline-none focus:border-[var(--color-indigo)]" placeholder="+91 98765 43210" />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold text-[var(--color-ink-soft)]">Description</label>
          <textarea rows={3} className="w-full rounded-lg border border-[var(--color-line)] px-3.5 py-2.5 text-sm outline-none focus:border-[var(--color-indigo)]" placeholder="Tell students what makes this hostel a good fit..." />
        </div>

        <div>
          <label className="mb-2 block text-xs font-semibold text-[var(--color-ink-soft)]">Facilities</label>
          <div className="flex flex-wrap gap-2">
            {FACILITY_LIST.map((f) => (
              <button
                type="button"
                key={f}
                onClick={() => toggle(f)}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium ${facilities.includes(f) ? 'border-[var(--color-indigo)] bg-[var(--color-indigo-soft)] text-[var(--color-indigo)]' : 'border-[var(--color-line)] text-[var(--color-ink-soft)]'}`}
              >
                {FACILITY_META[f].label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold text-[var(--color-ink-soft)]">Images</label>
          <div className="rounded-xl border-2 border-dashed border-[var(--color-line-strong)] p-8 text-center text-sm text-[var(--color-ink-faint)]">
            Drag & drop images here, or click to upload (demo — not wired to storage)
          </div>
        </div>

        <button type="submit" className="rounded-full bg-[var(--color-ink)] px-6 py-3 text-sm font-semibold text-white">Submit listing</button>
      </form>
    </div>
  );
}
