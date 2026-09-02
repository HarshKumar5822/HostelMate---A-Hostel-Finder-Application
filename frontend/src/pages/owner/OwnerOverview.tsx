import { motion } from 'framer-motion';
import { Eye, Search, Heart, Inbox, TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { HOSTELS } from '../../data';

const trend = [
  { day: 'Mon', views: 120 }, { day: 'Tue', views: 156 }, { day: 'Wed', views: 142 },
  { day: 'Thu', views: 190 }, { day: 'Fri', views: 210 }, { day: 'Sat', views: 260 }, { day: 'Sun', views: 232 },
];

const METRICS = [
  { label: 'Profile Views', value: '1,204', icon: Eye },
  { label: 'Search Impressions', value: '8,340', icon: Search },
  { label: 'Saved Count', value: '92', icon: Heart },
  { label: 'Inquiries', value: '38', icon: Inbox },
  { label: 'Conversion Rate', value: '6.2%', icon: TrendingUp },
];

export default function OwnerOverview() {
  const myHostels = HOSTELS.slice(0, 4);
  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <h1 className="font-display text-2xl font-semibold text-[var(--color-ink)]">Overview</h1>
      <p className="mt-1 text-sm text-[var(--color-ink-soft)]">Demo analytics for hostels listed under your account.</p>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {METRICS.map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
            className="rounded-2xl border border-[var(--color-line)] bg-white p-5"
          >
            <m.icon size={16} className="text-[var(--color-indigo)]" />
            <p className="mt-2 font-mono text-2xl font-semibold text-[var(--color-ink)] tabular">{m.value}</p>
            <p className="text-xs text-[var(--color-ink-faint)]">{m.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 rounded-2xl border border-[var(--color-line)] bg-white p-5">
        <h3 className="mb-4 font-display text-base font-semibold text-[var(--color-ink)]">Profile views this week</h3>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={trend}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-line)" />
            <XAxis dataKey="day" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Line type="monotone" dataKey="views" stroke="var(--color-saffron)" strokeWidth={2.5} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6">
        <h3 className="mb-3 font-display text-base font-semibold text-[var(--color-ink)]">Your listings</h3>
        <div className="space-y-3">
          {myHostels.map((h) => (
            <div key={h.id} className="flex items-center gap-4 rounded-2xl border border-[var(--color-line)] bg-white p-4">
              <img src={h.images[0]} alt={h.name} className="h-14 w-14 rounded-lg object-cover" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-[var(--color-ink)]">{h.name}</p>
                <p className="text-xs text-[var(--color-ink-faint)]">{h.locality}, {h.city}</p>
              </div>
              <span className="rounded-full bg-[var(--color-signal-soft)] px-2.5 py-1 text-[11px] font-medium text-[var(--color-signal)]">Active</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
