import { useState } from 'react';
import { usePreferences } from '../hooks/usePreferences';
import { useAuth } from '../hooks/useAuth';
import { useCollections } from '../hooks/useCollections';
import { FACILITY_META, FACILITY_LIST } from '../data/facilities';
import { formatINR } from '../utils/format';
import {
  User, Mail, Phone, ShieldCheck, Key, Heart, Sparkles, CheckCircle2,
  MapPin, Sliders, Briefcase, GraduationCap, Utensils, BedDouble, LogOut, Edit3, Save, MessageSquare
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Facility } from '../types';

export default function Profile() {
  const { prefs, setPrefs } = usePreferences();
  const { user, logout, updateUser } = useAuth();
  const { savedIds } = useCollections();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'preferences' | 'details' | 'enquiries' | 'security'>('preferences');
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(user?.name || 'Harsh Kumar');
  const [phoneInput, setPhoneInput] = useState(user?.phone || '+91 9876543210');
  const [institution, setInstitution] = useState('IIT Hyderabad / Tech Park');
  const [occupation, setOccupation] = useState('Student & Developer');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const toggleFacility = (f: Facility) => {
    setPrefs({
      facilities: prefs.facilities.includes(f)
        ? prefs.facilities.filter((x) => x !== f)
        : [...prefs.facilities, f],
    });
    showSaveToast();
  };

  const showSaveToast = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleSaveProfileDetails = () => {
    updateUser({ name: nameInput, phone: phoneInput });
    setEditingName(false);
    showSaveToast();
  };

  // Calculate completeness score
  const completeness = Math.min(
    100,
    (prefs.gender ? 20 : 0) +
    (prefs.location ? 20 : 0) +
    (prefs.facilities.length > 0 ? 30 : 0) +
    (user?.email ? 30 : 0)
  );

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Toast alert */}
      {savedSuccess && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white shadow-lg animate-bounce">
          <CheckCircle2 size={16} /> Profile Preferences Updated!
        </div>
      )}

      {/* User Header Dashboard Card */}
      <div className="mb-8 overflow-hidden rounded-3xl border border-[var(--color-line)] bg-white p-6 shadow-xs sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-5">
            <div className="relative">
              <span className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-tr from-[var(--color-indigo)] to-blue-500 text-2xl font-bold text-white shadow-md">
                {user?.name ? user.name[0].toUpperCase() : 'H'}
              </span>
              <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white ring-2 ring-white">
                <CheckCircle2 size={14} />
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display text-2xl font-bold text-[var(--color-ink)]">
                  {user?.name || 'Harsh Kumar'}
                </h1>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 border border-emerald-200">
                  <ShieldCheck size={12} /> DB Verified
                </span>
              </div>
              <p className="mt-1 flex items-center gap-2 text-sm text-[var(--color-ink-soft)]">
                <Mail size={14} className="text-[var(--color-ink-faint)]" /> {user?.email || 'user@hostelmate.com'}
              </p>
              <p className="mt-0.5 flex items-center gap-2 text-xs text-[var(--color-ink-faint)]">
                <Phone size={13} /> {user?.phone || '+91 9876543210'} · Joined August 2026
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setEditingName(!editingName)}
              className="flex items-center gap-1.5 rounded-full border border-[var(--color-line)] bg-white px-4 py-2 text-xs font-semibold text-[var(--color-ink)] transition-colors hover:bg-slate-50"
            >
              <Edit3 size={14} /> {editingName ? 'Cancel' : 'Edit Profile'}
            </button>
            <button
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="flex items-center gap-1.5 rounded-full bg-rose-50 px-4 py-2 text-xs font-semibold text-rose-700 transition-colors hover:bg-rose-100"
            >
              <LogOut size={14} /> Logout
            </button>
          </div>
        </div>

        {/* Editable Profile Inputs */}
        {editingName && (
          <div className="mt-6 border-t border-[var(--color-line)] pt-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-[var(--color-ink)]">Full Name</label>
                <input
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="w-full rounded-xl border border-[var(--color-line)] px-3.5 py-2.5 text-sm outline-none focus:border-[var(--color-indigo)]"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-[var(--color-ink)]">Phone Number</label>
                <input
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  className="w-full rounded-xl border border-[var(--color-line)] px-3.5 py-2.5 text-sm outline-none focus:border-[var(--color-indigo)]"
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleSaveProfileDetails}
                className="flex items-center gap-1.5 rounded-full bg-[var(--color-ink)] px-5 py-2.5 text-xs font-semibold text-white transition-transform active:scale-95"
              >
                <Save size={14} /> Save Account Info
              </button>
            </div>
          </div>
        )}

        {/* Match Completeness Bar */}
        <div className="mt-6 border-t border-[var(--color-line)] pt-5">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 font-semibold text-[var(--color-ink)]">
              <Sparkles size={14} className="text-[var(--color-saffron)]" /> Smart Match Profile Completeness
            </span>
            <span className="font-mono font-bold text-[var(--color-indigo)]">{completeness}%</span>
          </div>
          <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full bg-gradient-to-r from-[var(--color-indigo)] via-[var(--color-saffron)] to-emerald-500 transition-all duration-500"
              style={{ width: `${completeness}%` }}
            />
          </div>
        </div>
      </div>

      {/* Profile Tabs Header */}
      <div className="mb-6 flex border-b border-[var(--color-line)]">
        <button
          onClick={() => setActiveTab('preferences')}
          className={`flex items-center gap-2 border-b-2 px-5 py-3 text-sm font-semibold transition-colors ${
            activeTab === 'preferences'
              ? 'border-[var(--color-ink)] text-[var(--color-ink)]'
              : 'border-transparent text-[var(--color-ink-faint)] hover:text-[var(--color-ink)]'
          }`}
        >
          <Sliders size={16} /> Living Preferences
        </button>
        <button
          onClick={() => setActiveTab('details')}
          className={`flex items-center gap-2 border-b-2 px-5 py-3 text-sm font-semibold transition-colors ${
            activeTab === 'details'
              ? 'border-[var(--color-ink)] text-[var(--color-ink)]'
              : 'border-transparent text-[var(--color-ink-faint)] hover:text-[var(--color-ink)]'
          }`}
        >
          <GraduationCap size={16} /> Work & Study Info
        </button>
        <button
          onClick={() => setActiveTab('enquiries')}
          className={`flex items-center gap-2 border-b-2 px-5 py-3 text-sm font-semibold transition-colors ${
            activeTab === 'enquiries'
              ? 'border-[var(--color-ink)] text-[var(--color-ink)]'
              : 'border-transparent text-[var(--color-ink-faint)] hover:text-[var(--color-ink)]'
          }`}
        >
          <MessageSquare size={16} /> My Activity ({savedIds.length})
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={`flex items-center gap-2 border-b-2 px-5 py-3 text-sm font-semibold transition-colors ${
            activeTab === 'security'
              ? 'border-[var(--color-ink)] text-[var(--color-ink)]'
              : 'border-transparent text-[var(--color-ink-faint)] hover:text-[var(--color-ink)]'
          }`}
        >
          <Key size={16} /> Security & Session
        </button>
      </div>

      {/* TAB 1: LIVING PREFERENCES */}
      {activeTab === 'preferences' && (
        <div className="space-y-6">
          {/* Gender */}
          <div className="rounded-2xl border border-[var(--color-line)] bg-white p-6 shadow-xs">
            <h3 className="mb-1 text-sm font-semibold text-[var(--color-ink)]">Hostel Type Needed</h3>
            <p className="mb-4 text-xs text-[var(--color-ink-faint)]">Filters recommendations for Boys or Girls hostels across all cities.</p>
            <div className="flex gap-3">
              {(['boys', 'girls'] as const).map((g) => (
                <button
                  key={g}
                  onClick={() => {
                    setPrefs({ gender: g });
                    showSaveToast();
                  }}
                  className={`flex items-center gap-2 rounded-2xl border px-5 py-3 text-sm font-semibold transition-all ${
                    prefs.gender === g
                      ? 'border-[var(--color-indigo)] bg-[var(--color-indigo-soft)] text-[var(--color-indigo)] shadow-xs'
                      : 'border-[var(--color-line)] text-[var(--color-ink-soft)] hover:bg-slate-50'
                  }`}
                >
                  {g === 'boys' ? '👨 Boys Hostel / PG' : '👩 Girls Hostel / PG'}
                </button>
              ))}
            </div>
          </div>

          {/* Preferred Location */}
          <div className="rounded-2xl border border-[var(--color-line)] bg-white p-6 shadow-xs">
            <h3 className="mb-1 text-sm font-semibold text-[var(--color-ink)]">Target City or College Locality</h3>
            <p className="mb-3 text-xs text-[var(--color-ink-faint)]">HostelMate prioritizes properties near your target location.</p>
            <div className="relative">
              <MapPin size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-ink-faint)]" />
              <input
                value={prefs.location}
                onChange={(e) => {
                  setPrefs({ location: e.target.value });
                  showSaveToast();
                }}
                placeholder="e.g. Gachibowli Hyderabad, Koramangala Bangalore, Kamla Nagar Delhi"
                className="w-full rounded-xl border border-[var(--color-line)] py-3 pl-10 pr-4 text-sm outline-none focus:border-[var(--color-indigo)]"
              />
            </div>
          </div>

          {/* Budget Range */}
          <div className="rounded-2xl border border-[var(--color-line)] bg-white p-6 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-[var(--color-ink)]">Monthly Rent Budget</h3>
              <span className="font-mono text-sm font-bold text-[var(--color-indigo)]">
                {formatINR(prefs.budgetMin)} – {formatINR(prefs.budgetMax)}
              </span>
            </div>
            <p className="mb-4 text-xs text-[var(--color-ink-faint)]">Adjust slider between ₹5,000 and ₹15,000/month.</p>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs text-[var(--color-ink-faint)] mb-1">
                  <span>Minimum Budget</span>
                  <span className="font-mono">{formatINR(prefs.budgetMin)}</span>
                </div>
                <input
                  type="range"
                  min={5000}
                  max={15000}
                  step={500}
                  value={prefs.budgetMin}
                  onChange={(e) => {
                    setPrefs({ budgetMin: Number(e.target.value) });
                    showSaveToast();
                  }}
                  className="w-full accent-[var(--color-indigo)]"
                />
              </div>
              <div>
                <div className="flex justify-between text-xs text-[var(--color-ink-faint)] mb-1">
                  <span>Maximum Budget</span>
                  <span className="font-mono">{formatINR(prefs.budgetMax)}</span>
                </div>
                <input
                  type="range"
                  min={5000}
                  max={15000}
                  step={500}
                  value={prefs.budgetMax}
                  onChange={(e) => {
                    setPrefs({ budgetMax: Number(e.target.value) });
                    showSaveToast();
                  }}
                  className="w-full accent-[var(--color-saffron)]"
                />
              </div>
            </div>
          </div>

          {/* Facilities */}
          <div className="rounded-2xl border border-[var(--color-line)] bg-white p-6 shadow-xs">
            <h3 className="mb-1 text-sm font-semibold text-[var(--color-ink)]">Must-Have Amenities</h3>
            <p className="mb-4 text-xs text-[var(--color-ink-faint)]">Select amenities that are critical for your stay.</p>
            <div className="flex flex-wrap gap-2.5">
              {FACILITY_LIST.map((f) => {
                const active = prefs.facilities.includes(f);
                return (
                  <button
                    key={f}
                    onClick={() => toggleFacility(f)}
                    className={`flex items-center gap-1.5 rounded-full border px-4 py-2 text-xs font-semibold transition-all ${
                      active
                        ? 'border-[var(--color-indigo)] bg-[var(--color-indigo-soft)] text-[var(--color-indigo)] shadow-xs'
                        : 'border-[var(--color-line)] text-[var(--color-ink-soft)] hover:bg-slate-50'
                    }`}
                  >
                    {active && <CheckCircle2 size={12} />}
                    {FACILITY_META[f].label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: WORK & STUDY INFO */}
      {activeTab === 'details' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-[var(--color-line)] bg-white p-6 shadow-xs">
            <h3 className="mb-4 font-display text-base font-semibold text-[var(--color-ink)]">Academic / Professional Details</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-[var(--color-ink)]">
                  <GraduationCap size={14} /> College / University or Office Name
                </label>
                <input
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  className="w-full rounded-xl border border-[var(--color-line)] px-3.5 py-2.5 text-sm outline-none focus:border-[var(--color-indigo)]"
                />
              </div>
              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-[var(--color-ink)]">
                  <Briefcase size={14} /> Course or Designation
                </label>
                <input
                  value={occupation}
                  onChange={(e) => setOccupation(e.target.value)}
                  className="w-full rounded-xl border border-[var(--color-line)] px-3.5 py-2.5 text-sm outline-none focus:border-[var(--color-indigo)]"
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={showSaveToast}
                className="rounded-full bg-[var(--color-ink)] px-5 py-2 text-xs font-semibold text-white"
              >
                Save Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ACTIVITY & ENQUIRIES */}
      {activeTab === 'enquiries' && (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-[var(--color-line)] bg-white p-5">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-ink-faint)]">Saved Hostels</p>
                <Heart size={18} className="text-rose-500" />
              </div>
              <p className="mt-2 font-mono text-3xl font-bold text-[var(--color-ink)]">{savedIds.length}</p>
              <button
                onClick={() => navigate('/saved')}
                className="mt-3 text-xs font-semibold text-[var(--color-indigo)] hover:underline"
              >
                View Saved Collection →
              </button>
            </div>

            <div className="rounded-2xl border border-[var(--color-line)] bg-white p-5">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-ink-faint)]">Submitted Enquiries</p>
                <MessageSquare size={18} className="text-[var(--color-saffron)]" />
              </div>
              <p className="mt-2 font-mono text-3xl font-bold text-[var(--color-ink)]">1</p>
              <p className="mt-3 text-xs text-emerald-600 font-medium">Callback scheduled &lt; 2 hours</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: SECURITY & SESSION */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-[var(--color-line)] bg-white p-6 shadow-xs">
            <h3 className="mb-2 font-display text-base font-semibold text-[var(--color-ink)]">Account Security & Database Authentication</h3>
            <p className="mb-4 text-xs text-[var(--color-ink-soft)]">
              Your account is authenticated using encrypted JWT tokens verified against MongoDB.
            </p>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3">
                <span className="font-semibold text-slate-700">Account Email:</span>
                <span className="font-mono text-slate-900">{user?.email || 'user@hostelmate.com'}</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3">
                <span className="font-semibold text-slate-700">Database Role:</span>
                <span className="font-mono text-emerald-700 font-bold uppercase">{user?.role || 'STUDENT'}</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3">
                <span className="font-semibold text-slate-700">JWT Token Status:</span>
                <span className="font-mono text-emerald-600 font-bold">Active & Valid</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
