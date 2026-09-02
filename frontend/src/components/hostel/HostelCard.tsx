import { motion } from 'framer-motion';
import { Heart, Scale, BadgeCheck, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Hostel } from '../../types';
import Rating from '../common/Rating';
import GenderBadge from '../common/GenderBadge';
import AvailabilityBadge from '../common/AvailabilityBadge';
import { FacilityChip } from '../common/FacilityBadge';
import { formatINR, formatDistance } from '../../utils/format';
import { useCollections } from '../../hooks/useCollections';

export default function HostelCard({ hostel, index = 0 }: { hostel: Hostel; index?: number }) {
  const navigate = useNavigate();
  const { isSaved, toggleSaved, isComparing, toggleCompare } = useCollections();
  const saved = isSaved(hostel.id);
  const comparing = isComparing(hostel.id);

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: Math.min(index, 8) * 0.04, ease: 'easeOut' }}
      whileHover={{ y: -3 }}
      className="group overflow-hidden rounded-2xl border border-[var(--color-line)] bg-white shadow-[var(--shadow-card)] transition-shadow hover:shadow-[var(--shadow-pop)]"
    >
      <div className="relative">
        <button onClick={() => navigate(`/hostel/${hostel.id}`)} className="block w-full">
          <img
            src={hostel.images[0]}
            alt={hostel.name}
            className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </button>
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          <GenderBadge gender={hostel.gender} />
          {hostel.verified && (
            <span className="inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-semibold text-[var(--color-indigo)]">
              <BadgeCheck size={12} /> Verified
            </span>
          )}
        </div>
        <div className="absolute right-3 top-3 flex gap-1.5">
          <motion.button
            whileTap={{ scale: 0.8 }}
            onClick={(e) => { e.stopPropagation(); toggleSaved(hostel.id); }}
            aria-label="Save hostel"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-[var(--color-ink)] shadow-sm"
          >
            <Heart size={16} className={saved ? 'fill-[var(--color-rose)] text-[var(--color-rose)]' : ''} />
          </motion.button>
          <button
            onClick={(e) => { e.stopPropagation(); toggleCompare(hostel.id); }}
            aria-label="Add to compare"
            className={`flex h-9 w-9 items-center justify-center rounded-full shadow-sm ${
              comparing ? 'bg-[var(--color-indigo)] text-white' : 'bg-white/95 text-[var(--color-ink)]'
            }`}
          >
            <Scale size={15} />
          </button>
        </div>
      </div>

      <button onClick={() => navigate(`/hostel/${hostel.id}`)} className="block w-full p-4 text-left">
        <div className="mb-1 flex items-start justify-between gap-2">
          <h3 className="font-display text-base font-semibold leading-snug text-[var(--color-ink)]">{hostel.name}</h3>
        </div>
        <div className="mb-2 flex items-center gap-2 text-xs text-[var(--color-ink-faint)]">
          <Rating value={hostel.rating} count={hostel.reviewCount} />
          <span>·</span>
          <span className="inline-flex items-center gap-1"><MapPin size={12} /> {formatDistance(hostel.distanceKm)}</span>
        </div>

        <div className="mb-3 flex flex-wrap gap-1.5">
          {hostel.facilities.slice(0, 4).map((f) => <FacilityChip key={f} facility={f} />)}
        </div>

        <div className="flex items-center justify-between border-t border-[var(--color-line)] pt-3">
          <div>
            <p className="font-mono text-lg font-semibold text-[var(--color-ink)] tabular">
              {formatINR(hostel.price)}<span className="text-xs font-normal text-[var(--color-ink-faint)]">/month</span>
            </p>
            <AvailabilityBadge status={hostel.availability} beds={hostel.bedsAvailable} />
          </div>
          <span className="rounded-full border border-[var(--color-line)] px-3 py-1.5 text-xs font-medium text-[var(--color-ink)] group-hover:border-[var(--color-indigo)] group-hover:text-[var(--color-indigo)]">
            View details
          </span>
        </div>
      </button>
    </motion.article>
  );
}
