import type { Facility, RoomTypeKey } from '../../types';
import { FACILITY_META } from '../../data/facilities';

const ROOM_TYPES: { key: RoomTypeKey; label: string }[] = [
  { key: 'single', label: 'Single' },
  { key: 'double', label: 'Double Sharing' },
  { key: 'triple', label: 'Triple Sharing' },
  { key: 'quad', label: '4 Sharing' },
  { key: 'fivePlus', label: '5+ Sharing' },
];

const KEY_FACILITIES: Facility[] = ['wifi', 'ac', 'laundry', 'cctv', 'security', 'studyRoom', 'parking', 'powerBackup', 'attachedBathroom', 'gym'];

interface Props {
  roomTypes: RoomTypeKey[];
  onRoomTypesChange: (v: RoomTypeKey[]) => void;
  facilities: Facility[];
  onFacilitiesChange: (v: Facility[]) => void;
  foodOnly: boolean;
  onFoodOnlyChange: (v: boolean) => void;
}

export default function FilterPanel({
  roomTypes, onRoomTypesChange, facilities, onFacilitiesChange, foodOnly, onFoodOnlyChange,
}: Props) {
  const toggle = <T,>(list: T[], value: T, set: (v: T[]) => void) => {
    set(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
  };

  return (
    <div className="space-y-6">
      <div>
        <h4 className="mb-3 text-sm font-semibold text-[var(--color-ink)]">Room type</h4>
        <div className="flex flex-wrap gap-2">
          {ROOM_TYPES.map((rt) => (
            <button
              key={rt.key}
              onClick={() => toggle(roomTypes, rt.key, onRoomTypesChange)}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                roomTypes.includes(rt.key)
                  ? 'border-[var(--color-indigo)] bg-[var(--color-indigo-soft)] text-[var(--color-indigo)]'
                  : 'border-[var(--color-line)] text-[var(--color-ink-soft)] hover:border-[var(--color-line-strong)]'
              }`}
            >
              {rt.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="mb-3 text-sm font-semibold text-[var(--color-ink)]">Facilities</h4>
        <div className="flex flex-wrap gap-2">
          {KEY_FACILITIES.map((f) => (
            <button
              key={f}
              onClick={() => toggle(facilities, f, onFacilitiesChange)}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                facilities.includes(f)
                  ? 'border-[var(--color-indigo)] bg-[var(--color-indigo-soft)] text-[var(--color-indigo)]'
                  : 'border-[var(--color-line)] text-[var(--color-ink-soft)] hover:border-[var(--color-line-strong)]'
              }`}
            >
              {FACILITY_META[f].label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="mb-3 text-sm font-semibold text-[var(--color-ink)]">Food</h4>
        <label className="flex items-center gap-2.5 text-sm text-[var(--color-ink-soft)]">
          <input
            type="checkbox"
            checked={foodOnly}
            onChange={(e) => onFoodOnlyChange(e.target.checked)}
            className="h-4 w-4 rounded border-[var(--color-line-strong)] accent-[var(--color-indigo)]"
          />
          Food included only
        </label>
      </div>
    </div>
  );
}
