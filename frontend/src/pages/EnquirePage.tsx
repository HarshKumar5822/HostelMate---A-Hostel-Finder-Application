import { useState } from 'react';
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom';
import {
  MapPin, Phone, ShieldCheck, CheckCircle2, ChevronRight,
  ArrowLeft, Utensils, Wifi, Calendar, User, MessageSquare, Send
} from 'lucide-react';
import { getHostelById } from '../services/hostelService';
import Rating from '../components/common/Rating';
import GenderBadge from '../components/common/GenderBadge';
import { FacilityChip } from '../components/common/FacilityBadge';
import { formatINR, formatDistance } from '../utils/format';

export default function EnquirePage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const roomType = searchParams.get('room');
  const navigate = useNavigate();

  const hostel = id ? getHostelById(id) : undefined;

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [moveInDate, setMoveInDate] = useState('');
  const [duration, setDuration] = useState('6 months');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!hostel) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <p className="font-display text-xl font-semibold text-[var(--color-ink)]">Hostel not found</p>
        <p className="mt-2 text-sm text-[var(--color-ink-soft)]">Please select a valid hostel from Discover.</p>
        <button onClick={() => navigate('/discover')} className="mt-6 rounded-full bg-[var(--color-ink)] px-5 py-2.5 text-sm font-semibold text-white">Back to Discover</button>
      </div>
    );
  }

  const selectedRoom = hostel.roomTypes.find((r) => r.type === roomType) || hostel.roomTypes[0];
  const monthlyRent = selectedRoom ? selectedRoom.price : hostel.price;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Navigation Breadcrumb */}
      <nav className="mb-6 flex items-center gap-1.5 text-xs text-[var(--color-ink-faint)]">
        <button onClick={() => navigate(-1)} className="inline-flex items-center gap-1 hover:text-[var(--color-indigo)]">
          <ArrowLeft size={14} /> Back
        </button>
        <ChevronRight size={12} />
        <Link to={`/hostel/${hostel.id}`} className="hover:text-[var(--color-indigo)]">{hostel.name}</Link>
        <ChevronRight size={12} />
        <span className="text-[var(--color-ink-soft)]">Hostel Enquiry & Review</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[1fr_420px]">
        {/* Left Column: Hostel Details & Inspection */}
        <div className="space-y-6">
          {/* Hostel Summary Card */}
          <div className="overflow-hidden rounded-2xl border border-[var(--color-line)] bg-white shadow-[var(--shadow-card)]">
            <div className="relative h-48 w-full sm:h-56">
              <img src={hostel.images[0]} alt={hostel.name} className="h-full w-full object-cover" />
              <div className="absolute left-3 top-3 flex gap-2">
                <GenderBadge gender={hostel.gender} />
                {hostel.verified && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-semibold text-[var(--color-indigo)]">
                    <ShieldCheck size={13} /> Verified Listing
                  </span>
                )}
              </div>
            </div>

            <div className="p-5">
              <h1 className="font-display text-2xl font-semibold text-[var(--color-ink)]">{hostel.name}</h1>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-[var(--color-ink-soft)]">
                <MapPin size={15} className="text-[var(--color-indigo)]" /> {hostel.locality}, {hostel.city} · {formatDistance(hostel.distanceKm)}
              </p>

              <div className="mt-3 flex items-center justify-between border-t border-[var(--color-line)] pt-3">
                <Rating value={hostel.rating} count={hostel.reviewCount} />
                <span className="font-mono text-lg font-semibold text-[var(--color-ink)] tabular">
                  {formatINR(monthlyRent)}<span className="text-xs font-normal text-[var(--color-ink-faint)]">/month</span>
                </span>
              </div>
            </div>
          </div>

          {/* Selected Room Option Summary */}
          {selectedRoom && (
            <div className="rounded-2xl border border-[var(--color-indigo)] bg-[var(--color-indigo-soft)]/20 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-indigo)]">Selected Room Type</span>
                  <h3 className="font-display text-lg font-semibold text-[var(--color-ink)]">{selectedRoom.label}</h3>
                  <p className="text-xs text-[var(--color-ink-soft)]">Occupancy: {selectedRoom.occupancy} {selectedRoom.occupancy > 1 ? 'people' : 'person'}</p>
                </div>
                <div className="text-right">
                  <p className="font-mono text-xl font-bold text-[var(--color-indigo)] tabular">{formatINR(selectedRoom.price)}</p>
                  <p className="text-[11px] text-[var(--color-ink-faint)]">per month</p>
                </div>
              </div>
            </div>
          )}

          {/* Detailed Hostel Inspection Highlights */}
          <div className="rounded-2xl border border-[var(--color-line)] bg-white p-5 space-y-5">
            <h2 className="font-display text-lg font-semibold text-[var(--color-ink)]">Hostel Highlights & Policies</h2>
            
            {/* Description */}
            <p className="text-sm leading-relaxed text-[var(--color-ink-soft)]">{hostel.description}</p>

            {/* Food Info */}
            <div className="rounded-xl bg-[var(--color-paper)] p-4">
              <div className="flex items-center gap-2 font-semibold text-sm text-[var(--color-ink)]">
                <Utensils size={16} className="text-[var(--color-saffron)]" />
                <span>Food & Mess ({hostel.food.included ? '3 Meals Included' : 'Mess Optional'})</span>
              </div>
              <p className="mt-1 text-xs text-[var(--color-ink-soft)]">
                {hostel.food.veg && hostel.food.nonVeg ? 'Pure Veg & Non-Veg menu options available.' : 'Pure Veg meals served daily.'} Rated {hostel.food.rating}★ by residents.
              </p>
            </div>

            {/* Facilities */}
            <div>
              <h4 className="mb-2.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--color-ink-faint)]">
                <Wifi size={14} /> Included Amenities
              </h4>
              <div className="flex flex-wrap gap-2">
                {hostel.facilities.map((f) => (
                  <FacilityChip key={f} facility={f} />
                ))}
              </div>
            </div>

            {/* Safety & Warden */}
            <div className="flex items-center justify-between rounded-xl border border-[var(--color-line)] p-3.5">
              <div>
                <p className="text-xs font-medium text-[var(--color-ink-faint)] font-mono">SAFETY SCORE</p>
                <p className="font-display text-lg font-bold text-[var(--color-ink)]">{hostel.safetyScore}/100</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-medium text-[var(--color-ink-faint)]">Hostel Warden</p>
                <p className="text-xs font-semibold text-[var(--color-ink)]">{hostel.owner}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Enquiry Form & Confirmation */}
        <div>
          <div className="sticky top-24 rounded-2xl border border-[var(--color-line)] bg-white p-6 shadow-[var(--shadow-pop)]">
            {submitted ? (
              <div className="py-6 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  <CheckCircle2 size={32} />
                </div>
                <h3 className="font-display text-xl font-semibold text-[var(--color-ink)]">Enquiry Submitted!</h3>
                <p className="mt-2 text-sm text-[var(--color-ink-soft)]">
                  Your enquiry for <span className="font-semibold">{hostel.name}</span> has been received.
                </p>

                <div className="my-5 rounded-xl border border-[var(--color-line)] bg-[var(--color-paper)] p-4 text-left text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-[var(--color-ink-faint)]">Hostel Contact:</span>
                    <span className="font-semibold text-[var(--color-ink)]">{hostel.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--color-ink-faint)]">Selected Room:</span>
                    <span className="font-semibold text-[var(--color-ink)]">{selectedRoom?.label}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--color-ink-faint)]">Expected Callback:</span>
                    <span className="font-semibold text-[var(--color-indigo)]">&lt; 2 hours</span>
                  </div>
                </div>

                <div className="space-y-2.5">
                  <a
                    href={`tel:${hostel.phone}`}
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-[var(--color-ink)] py-3 text-sm font-semibold text-white"
                  >
                    <Phone size={16} /> Call Warden Now ({hostel.phone})
                  </a>
                  <button
                    onClick={() => navigate('/discover')}
                    className="w-full rounded-full border border-[var(--color-line)] py-2.5 text-xs font-semibold text-[var(--color-ink-soft)] hover:border-[var(--color-line-strong)]"
                  >
                    Explore More Hostels
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="border-b border-[var(--color-line)] pb-3">
                  <h3 className="font-display text-lg font-semibold text-[var(--color-ink)]">Submit Hostel Enquiry</h3>
                  <p className="text-xs text-[var(--color-ink-soft)]">Get instant callback and schedule a room visit.</p>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-[var(--color-ink-faint)]">Your Full Name *</label>
                  <div className="relative">
                    <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-ink-faint)]" />
                    <input
                      required
                      type="text"
                      placeholder="e.g. Harsh Vardhan"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full rounded-xl border border-[var(--color-line)] bg-white py-2.5 pl-9 pr-3 text-sm outline-none focus:border-[var(--color-indigo)]"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-[var(--color-ink-faint)]">Phone Number *</label>
                  <div className="relative">
                    <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-ink-faint)]" />
                    <input
                      required
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full rounded-xl border border-[var(--color-line)] bg-white py-2.5 pl-9 pr-3 text-sm outline-none focus:border-[var(--color-indigo)]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-[var(--color-ink-faint)]">Move-in Date</label>
                    <div className="relative">
                      <Calendar size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-ink-faint)]" />
                      <input
                        type="date"
                        value={moveInDate}
                        onChange={(e) => setMoveInDate(e.target.value)}
                        className="w-full rounded-xl border border-[var(--color-line)] bg-white py-2.5 pl-9 pr-2 text-xs outline-none focus:border-[var(--color-indigo)]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-medium text-[var(--color-ink-faint)]">Duration</label>
                    <select
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      className="w-full rounded-xl border border-[var(--color-line)] bg-white py-2.5 px-3 text-xs outline-none focus:border-[var(--color-indigo)]"
                    >
                      <option value="3 months">3 Months</option>
                      <option value="6 months">6 Months</option>
                      <option value="1 year">1 Year</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-[var(--color-ink-faint)]">Message / Special Requests</label>
                  <div className="relative">
                    <MessageSquare size={16} className="absolute left-3 top-3 text-[var(--color-ink-faint)]" />
                    <textarea
                      rows={3}
                      placeholder="Ask about food, study room hours, bed availability, visit timing..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full rounded-xl border border-[var(--color-line)] bg-white py-2.5 pl-9 pr-3 text-xs outline-none focus:border-[var(--color-indigo)]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-[var(--color-saffron)] py-3 text-sm font-semibold text-white transition-transform active:scale-[0.99] disabled:opacity-50"
                >
                  {loading ? 'Sending Enquiry...' : 'Confirm Enquiry Request'} <Send size={15} />
                </button>

                <p className="text-[11px] text-center text-[var(--color-ink-faint)]">
                  ⚡ Direct connection to hostel warden. No spam or extra commission fees.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
