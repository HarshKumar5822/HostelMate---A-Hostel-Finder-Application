import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, MapPin, LocateFixed } from 'lucide-react';
import StepShell from '../components/onboarding/StepShell';
import { usePreferences } from '../hooks/usePreferences';
import { FACILITY_META, FACILITY_LIST } from '../data/facilities';
import type { Facility, Gender, RoomTypeKey } from '../types';
import { CITIES } from '../data/cityMeta';

const TOTAL = 6;

const ROOM_OPTIONS: { key: RoomTypeKey; label: string; desc: string }[] = [
  { key: 'single', label: 'Single', desc: 'A room to yourself' },
  { key: 'double', label: 'Double Sharing', desc: 'Shared with 1 other' },
  { key: 'triple', label: 'Triple Sharing', desc: 'Shared with 2 others' },
  { key: 'quad', label: '4 Sharing', desc: 'Shared with 3 others' },
  { key: 'fivePlus', label: '5+ Sharing', desc: 'Budget-friendly dorms' },
];

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const { prefs, setPrefs, setOnboarded } = usePreferences();
  const navigate = useNavigate();
  const suggestions = CITIES.flatMap((c) => c.localities.map((l) => `${l}, ${c.name}`)).filter((l) =>
    prefs.location ? l.toLowerCase().includes(prefs.location.toLowerCase()) : true
  ).slice(0, 6);

  const next = () => (step < TOTAL ? setStep(step + 1) : finish());
  const back = () => (step > 1 ? setStep(step - 1) : navigate('/'));
  const finish = () => { setOnboarded(true); navigate('/discover'); };

  const canContinue = () => {
    if (step === 1) return !!prefs.gender;
    if (step === 2) return prefs.location.trim().length > 0;
    return true;
  };

  const toggleFacility = (f: Facility) =>
    setPrefs({ facilities: prefs.facilities.includes(f) ? prefs.facilities.filter((x) => x !== f) : [...prefs.facilities, f] });
  const toggleRoom = (r: RoomTypeKey) =>
    setPrefs({ roomTypes: prefs.roomTypes.includes(r) ? prefs.roomTypes.filter((x) => x !== r) : [...prefs.roomTypes, r] });

  const footer = (
    <>
      <button onClick={back} className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-ink-soft)] hover:text-[var(--color-ink)]">
        <ArrowLeft size={16} /> Back
      </button>
      <button
        onClick={next}
        disabled={!canContinue()}
        className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-ink)] px-6 py-3 text-sm font-semibold text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
      >
        {step === TOTAL ? 'See my matches' : 'Continue'} <ArrowRight size={16} />
      </button>
    </>
  );

  return (
    <AnimatePresence mode="wait">
      {step === 1 && (
        <StepShell step={1} total={TOTAL} title="Who are you looking for a hostel for?" subtitle="This helps us show hostels that clearly separate boys' and girls' residences." footer={footer}>
          <div className="grid grid-cols-2 gap-4">
            {(['boys', 'girls'] as Gender[]).map((g) => (
              <button
                key={g}
                onClick={() => setPrefs({ gender: g })}
                className={`rounded-2xl border-2 p-8 text-center transition-colors ${
                  prefs.gender === g ? 'border-[var(--color-indigo)] bg-[var(--color-indigo-soft)]' : 'border-[var(--color-line)] bg-white hover:border-[var(--color-line-strong)]'
                }`}
              >
                <span className="text-4xl">{g === 'boys' ? '👨' : '👩'}</span>
                <p className="mt-3 font-display text-lg font-semibold text-[var(--color-ink)]">{g === 'boys' ? 'Boys' : 'Girls'}</p>
              </button>
            ))}
          </div>
        </StepShell>
      )}

      {step === 2 && (
        <StepShell step={2} total={TOTAL} title="Where do you want to stay?" subtitle="Search by city, area, landmark, college or workplace." footer={footer}>
          <div className="relative">
            <MapPin size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-indigo)]" />
            <input
              autoFocus
              value={prefs.location}
              onChange={(e) => setPrefs({ location: e.target.value })}
              placeholder="Gachibowli, Kukatpally, Near Malla Reddy University…"
              className="w-full rounded-xl border border-[var(--color-line)] bg-white py-4 pl-11 pr-4 text-base outline-none focus:border-[var(--color-indigo)]"
            />
          </div>
          <button
            onClick={() => setPrefs({ location: 'Gachibowli, Hyderabad' })}
            className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-indigo)]"
          >
            <LocateFixed size={15} /> Use my current location
          </button>
          {suggestions.length > 0 && (
            <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => setPrefs({ location: s })}
                  className="rounded-lg border border-[var(--color-line)] bg-white px-3 py-2.5 text-left text-sm text-[var(--color-ink-soft)] hover:border-[var(--color-indigo)] hover:text-[var(--color-indigo)]"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </StepShell>
      )}

      {step === 3 && (
        <StepShell step={3} total={TOTAL} title="What's your monthly budget?" subtitle="Drag to set a comfortable range. You can always change this later." footer={footer}>
          <div className="rounded-2xl border border-[var(--color-line)] bg-white p-6">
            <p className="mb-6 text-center font-display text-3xl font-semibold text-[var(--color-ink)] tabular">
              ₹{prefs.budgetMin.toLocaleString('en-IN')} – ₹{prefs.budgetMax.toLocaleString('en-IN')}{prefs.budgetMax >= 15000 ? '+' : ''}
              <span className="block text-sm font-normal text-[var(--color-ink-faint)]">per month</span>
            </p>
            <div className="space-y-5">
              <div>
                <label className="mb-1 block text-xs font-medium text-[var(--color-ink-faint)]">Minimum: ₹5,000</label>
                <input
                  type="range" min={5000} max={15000} step={500}
                  value={prefs.budgetMin}
                  onChange={(e) => setPrefs({ budgetMin: Math.min(Number(e.target.value), prefs.budgetMax - 500) })}
                  className="w-full accent-[var(--color-indigo)]"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-[var(--color-ink-faint)]">Maximum: ₹15,000</label>
                <input
                  type="range" min={5000} max={15000} step={500}
                  value={prefs.budgetMax}
                  onChange={(e) => setPrefs({ budgetMax: Math.max(Number(e.target.value), prefs.budgetMin + 500) })}
                  className="w-full accent-[var(--color-saffron)]"
                />
              </div>
            </div>
          </div>
        </StepShell>
      )}

      {step === 4 && (
        <StepShell step={4} total={TOTAL} title="What room type works for you?" subtitle="Select all that you'd consider." footer={footer}>
          <div className="grid gap-3 sm:grid-cols-2">
            {ROOM_OPTIONS.map((r) => (
              <button
                key={r.key}
                onClick={() => toggleRoom(r.key)}
                className={`rounded-xl border p-4 text-left transition-colors ${
                  prefs.roomTypes.includes(r.key) ? 'border-[var(--color-indigo)] bg-[var(--color-indigo-soft)]' : 'border-[var(--color-line)] bg-white hover:border-[var(--color-line-strong)]'
                }`}
              >
                <p className="font-semibold text-[var(--color-ink)]">{r.label}</p>
                <p className="text-xs text-[var(--color-ink-faint)]">{r.desc}</p>
              </button>
            ))}
          </div>
        </StepShell>
      )}

      {step === 5 && (
        <StepShell step={5} total={TOTAL} title="Which facilities matter to you?" subtitle="We'll prioritize hostels that offer these." footer={footer}>
          <div className="flex flex-wrap gap-2">
            {FACILITY_LIST.map((f) => {
              const meta = FACILITY_META[f];
              const Icon = meta.icon;
              const active = prefs.facilities.includes(f);
              return (
                <button
                  key={f}
                  onClick={() => toggleFacility(f)}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm transition-colors ${
                    active ? 'border-[var(--color-indigo)] bg-[var(--color-indigo-soft)] text-[var(--color-indigo)]' : 'border-[var(--color-line)] bg-white text-[var(--color-ink-soft)] hover:border-[var(--color-line-strong)]'
                  }`}
                >
                  <Icon size={14} /> {meta.label}
                </button>
              );
            })}
          </div>
        </StepShell>
      )}

      {step === 6 && (
        <StepShell step={6} total={TOTAL} title="What about food?" subtitle="Tell us your meal preferences." footer={footer}>
          <div className="space-y-4">
            <label className="flex items-center justify-between rounded-xl border border-[var(--color-line)] bg-white p-4">
              <span className="text-sm font-medium text-[var(--color-ink)]">Food should be included</span>
              <input
                type="checkbox"
                checked={prefs.food.included}
                onChange={(e) => setPrefs({ food: { ...prefs.food, included: e.target.checked } })}
                className="h-5 w-5 accent-[var(--color-indigo)]"
              />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setPrefs({ food: { ...prefs.food, veg: true, nonVeg: false } })}
                className={`rounded-xl border p-4 text-sm font-medium ${!prefs.food.nonVeg ? 'border-[var(--color-indigo)] bg-[var(--color-indigo-soft)] text-[var(--color-indigo)]' : 'border-[var(--color-line)] bg-white text-[var(--color-ink-soft)]'}`}
              >
                Vegetarian only
              </button>
              <button
                onClick={() => setPrefs({ food: { ...prefs.food, veg: true, nonVeg: true } })}
                className={`rounded-xl border p-4 text-sm font-medium ${prefs.food.nonVeg ? 'border-[var(--color-indigo)] bg-[var(--color-indigo-soft)] text-[var(--color-indigo)]' : 'border-[var(--color-line)] bg-white text-[var(--color-ink-soft)]'}`}
              >
                Veg + Non-veg
              </button>
            </div>
          </div>
        </StepShell>
      )}
      <footer className="mt-8 text-center text-xs text-[var(--color-ink-faint)]">
        <span className="font-semibold text-[var(--color-ink)] bg-white px-3 py-1.5 rounded-full border border-[var(--color-line)] shadow-xs">Created By Harsh Kumar</span>
      </footer>
    </AnimatePresence>
  );
}
