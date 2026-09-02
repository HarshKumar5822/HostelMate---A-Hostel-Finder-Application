import { useParams, useNavigate, Link } from 'react-router-dom';
import { MapPin, Phone, Globe, BadgeCheck, Heart, Scale, ChevronRight } from 'lucide-react';
import { getHostelById } from '../services/hostelService';
import { REVIEWS } from '../data';
import ImageGallery from '../components/hostel/ImageGallery';
import Rating from '../components/common/Rating';
import GenderBadge from '../components/common/GenderBadge';
import AvailabilityBadge from '../components/common/AvailabilityBadge';
import ConfidenceTag from '../components/common/ConfidenceTag';
import { FacilityGrid } from '../components/common/FacilityBadge';
import RoomCard from '../components/hostel/RoomCard';
import FoodSection from '../components/hostel/FoodSection';
import SafetySection from '../components/hostel/SafetySection';
import ReviewsSection from '../components/hostel/ReviewsSection';
import MatchScore from '../components/hostel/MatchScore';
import AnalyzerButton from '../components/hostel/AnalyzerButton';
import { formatINR, formatDistance } from '../utils/format';
import { useCollections } from '../hooks/useCollections';

export default function HostelDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const hostel = id ? getHostelById(id) : undefined;
  const { isSaved, toggleSaved, isComparing, toggleCompare } = useCollections();

  if (!hostel) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <p className="font-display text-xl font-semibold text-[var(--color-ink)]">Hostel not found</p>
        <p className="mt-2 text-sm text-[var(--color-ink-soft)]">It may have been removed, or the link is incorrect.</p>
        <button onClick={() => navigate('/discover')} className="mt-6 rounded-full bg-[var(--color-ink)] px-5 py-2.5 text-sm font-semibold text-white">Back to Discover</button>
      </div>
    );
  }

  const reviews = REVIEWS.filter((r) => r.hostelId === hostel.id);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <nav className="mb-4 flex items-center gap-1.5 text-xs text-[var(--color-ink-faint)]">
        <Link to="/discover" className="hover:text-[var(--color-indigo)]">Discover</Link>
        <ChevronRight size={12} />
        <Link to={`/city/${hostel.city}`} className="hover:text-[var(--color-indigo)]">{hostel.city}</Link>
        <ChevronRight size={12} />
        <span className="text-[var(--color-ink-soft)]">{hostel.name}</span>
      </nav>

      <ImageGallery images={hostel.images} name={hostel.name} />

      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_340px]">
        <div>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <GenderBadge gender={hostel.gender} />
                {hostel.verified && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-[var(--color-indigo-soft)] px-2.5 py-1 text-[11px] font-semibold text-[var(--color-indigo)]">
                    <BadgeCheck size={12} /> Verified
                  </span>
                )}
              </div>
              <h1 className="font-display text-3xl font-semibold text-[var(--color-ink)]">{hostel.name}</h1>
              <p className="mt-2 flex items-center gap-1.5 text-sm text-[var(--color-ink-soft)]">
                <MapPin size={14} /> {hostel.address} · {formatDistance(hostel.distanceKm)} · {hostel.landmark}
              </p>
              <div className="mt-2"><Rating value={hostel.rating} count={hostel.reviewCount} /></div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => toggleSaved(hostel.id)}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--color-line)] hover:border-[var(--color-line-strong)]"
              >
                <Heart size={18} className={isSaved(hostel.id) ? 'fill-[var(--color-rose)] text-[var(--color-rose)]' : ''} />
              </button>
              <button
                onClick={() => toggleCompare(hostel.id)}
                className={`flex h-11 w-11 items-center justify-center rounded-full border ${isComparing(hostel.id) ? 'border-[var(--color-indigo)] bg-[var(--color-indigo-soft)] text-[var(--color-indigo)]' : 'border-[var(--color-line)]'}`}
              >
                <Scale size={17} />
              </button>
            </div>
          </div>

          {/* Quick stats */}
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-xl border border-[var(--color-line)] bg-white p-4">
              <p className="text-xs text-[var(--color-ink-faint)]">Monthly Rent</p>
              <p className="mt-1 font-mono text-lg font-semibold text-[var(--color-ink)] tabular">{formatINR(hostel.price)}</p>
              <ConfidenceTag level={hostel.priceConfidence} className="mt-1" />
            </div>
            <div className="rounded-xl border border-[var(--color-line)] bg-white p-4">
              <p className="text-xs text-[var(--color-ink-faint)]">Rating</p>
              <p className="mt-1 font-mono text-lg font-semibold text-[var(--color-ink)] tabular">{hostel.rating.toFixed(1)}/5</p>
            </div>
            <div className="rounded-xl border border-[var(--color-line)] bg-white p-4">
              <p className="text-xs text-[var(--color-ink-faint)]">Distance</p>
              <p className="mt-1 font-mono text-lg font-semibold text-[var(--color-ink)] tabular">{formatDistance(hostel.distanceKm)}</p>
            </div>
            <div className="rounded-xl border border-[var(--color-line)] bg-white p-4">
              <p className="text-xs text-[var(--color-ink-faint)]">Availability</p>
              <div className="mt-1.5"><AvailabilityBadge status={hostel.availability} beds={hostel.bedsAvailable} /></div>
              <ConfidenceTag level={hostel.availabilityConfidence} className="mt-1" />
            </div>
          </div>

          <p className="mt-6 text-sm leading-relaxed text-[var(--color-ink-soft)]">{hostel.description}</p>

          <div className="mt-8">
            <h2 className="mb-4 font-display text-xl font-semibold text-[var(--color-ink)]">Facilities</h2>
            <FacilityGrid facilities={hostel.facilities} />
          </div>

          <div className="mt-8">
            <h2 className="mb-4 font-display text-xl font-semibold text-[var(--color-ink)]">Room options</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {hostel.roomTypes.map((r) => <RoomCard key={r.type} room={r} hostelId={hostel.id} />)}
            </div>
          </div>

          <div className="mt-8">
            <FoodSection food={hostel.food} />
          </div>

          <div className="mt-8">
            <h2 className="mb-4 font-display text-xl font-semibold text-[var(--color-ink)]">Safety & Security</h2>
            <SafetySection score={hostel.safetyScore} breakdown={hostel.safetyBreakdown} />
          </div>

          <div className="mt-8">
            <h2 className="mb-4 font-display text-xl font-semibold text-[var(--color-ink)]">Reviews</h2>
            <ReviewsSection reviews={reviews} overallRating={hostel.rating} />
          </div>
        </div>

        <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-[var(--color-line)] bg-white p-5">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-faint)]">Contact</p>
            <p className="flex items-center gap-2 text-sm text-[var(--color-ink)]"><Phone size={14} /> {hostel.phone}</p>
            {hostel.website && <p className="mt-2 flex items-center gap-2 text-sm text-[var(--color-indigo)]"><Globe size={14} /> {hostel.website}</p>}
            <p className="mt-3 text-xs text-[var(--color-ink-faint)]">Managed by {hostel.owner}</p>
            <button
              onClick={() => navigate(`/enquire/${hostel.id}`)}
              className="mt-4 w-full rounded-full bg-[var(--color-saffron)] py-3 text-sm font-semibold text-white transition-transform active:scale-[0.99]"
            >
              Enquire Now
            </button>
          </div>

          <MatchScore hostel={hostel} />
          <AnalyzerButton hostel={hostel} />
        </aside>
      </div>
    </div>
  );
}
