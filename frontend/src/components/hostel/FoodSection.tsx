import { useState } from 'react';
import type { FoodInfo } from '../../types';
import ConfidenceTag from '../common/ConfidenceTag';
import { Sun, Sunset, Moon } from 'lucide-react';

export default function FoodSection({ food }: { food: FoodInfo }) {
  const [dayIndex, setDayIndex] = useState(new Date().getDay() === 0 ? 6 : new Date().getDay() - 1);
  const day = food.weeklyMenu[dayIndex];

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <span className="font-display text-lg font-semibold text-[var(--color-ink)]">Food</span>
        <ConfidenceTag level={food.confidence} />
        <span className="ml-auto flex items-center gap-1 text-sm text-[var(--color-ink)]">⭐ {food.rating.toFixed(1)} food rating</span>
      </div>

      <div className="mb-5 flex flex-wrap gap-2 text-xs">
        <span className={`rounded-full px-3 py-1 font-medium ${food.included ? 'bg-[var(--color-signal-soft)] text-[var(--color-signal)]' : 'bg-[var(--color-line)] text-[var(--color-ink-soft)]'}`}>
          {food.included ? 'Food Included' : 'Food Not Included'}
        </span>
        {food.veg && <span className="rounded-full bg-[var(--color-signal-soft)] px-3 py-1 font-medium text-[var(--color-signal)]">Vegetarian</span>}
        {food.nonVeg && <span className="rounded-full bg-[var(--color-amber-soft)] px-3 py-1 font-medium text-[var(--color-amber)]">Non-Vegetarian</span>}
        {food.messAvailable && <span className="rounded-full bg-[var(--color-indigo-soft)] px-3 py-1 font-medium text-[var(--color-indigo)]">Mess Available</span>}
      </div>

      <div className="mb-4 flex gap-1.5 overflow-x-auto no-scrollbar">
        {food.weeklyMenu.map((d, i) => (
          <button
            key={d.day}
            onClick={() => setDayIndex(i)}
            className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium ${
              i === dayIndex ? 'bg-[var(--color-ink)] text-white' : 'border border-[var(--color-line)] text-[var(--color-ink-soft)]'
            }`}
          >
            {d.day.slice(0, 3)}
          </button>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-[var(--color-line)] bg-white p-4">
          <p className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-[var(--color-amber)]"><Sun size={13} /> Breakfast</p>
          <p className="text-sm text-[var(--color-ink)]">{day.breakfast}</p>
        </div>
        <div className="rounded-xl border border-[var(--color-line)] bg-white p-4">
          <p className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-[var(--color-saffron)]"><Sunset size={13} /> Lunch</p>
          <p className="text-sm text-[var(--color-ink)]">{day.lunch}</p>
        </div>
        <div className="rounded-xl border border-[var(--color-line)] bg-white p-4">
          <p className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-[var(--color-indigo)]"><Moon size={13} /> Dinner</p>
          <p className="text-sm text-[var(--color-ink)]">{day.dinner}</p>
        </div>
      </div>
    </div>
  );
}
