import { useMemo } from 'react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, ScatterChart, Scatter,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
} from 'recharts';
import { motion } from 'framer-motion';
import { HOSTELS, getCityStats } from '../data';
import { formatINR } from '../utils/format';
import { FACILITY_META } from '../data/facilities';
import type { Facility } from '../types';

const COLORS = ['#33389B', '#FF7A29', '#16915F', '#C98A00', '#C4404B', '#8A8F9C'];

function ChartCard({ title, children, className = '' }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }}
      className={`rounded-2xl border border-[var(--color-line)] bg-white p-5 ${className}`}
    >
      <h3 className="mb-4 font-display text-base font-semibold text-[var(--color-ink)]">{title}</h3>
      {children}
    </motion.div>
  );
}

export default function Insights() {
  const cityStats = getCityStats();

  const avgRent = Math.round(HOSTELS.reduce((s, h) => s + h.price, 0) / HOSTELS.length);
  const avgRating = (HOSTELS.reduce((s, h) => s + h.rating, 0) / HOSTELS.length).toFixed(1);
  const avgDistance = (HOSTELS.reduce((s, h) => s + h.distanceKm, 0) / HOSTELS.length).toFixed(1);

  const rentByArea = useMemo(() => {
    const map = new Map<string, { total: number; count: number }>();
    HOSTELS.forEach((h) => {
      const cur = map.get(h.locality) || { total: 0, count: 0 };
      cur.total += h.price; cur.count += 1;
      map.set(h.locality, cur);
    });
    return Array.from(map.entries())
      .map(([locality, v]) => ({ locality, rent: Math.round(v.total / v.count) }))
      .sort((a, b) => b.rent - a.rent)
      .slice(0, 8);
  }, []);

  const ratingDistribution = useMemo(() => {
    const buckets = [0, 0, 0, 0, 0];
    HOSTELS.forEach((h) => { buckets[Math.min(4, Math.floor(h.rating) - 1)]++; });
    return [
      { name: '3★', value: buckets[2] },
      { name: '4★', value: buckets[3] },
      { name: '5★', value: buckets[4] },
    ];
  }, []);

  const facilityAvailability = useMemo(() => {
    const keys: Facility[] = ['wifi', 'ac', 'laundry', 'cctv', 'security', 'studyRoom', 'parking', 'gym'];
    return keys.map((f) => ({
      name: FACILITY_META[f].label,
      pct: Math.round((HOSTELS.filter((h) => h.facilities.includes(f)).length / HOSTELS.length) * 100),
    }));
  }, []);

  const roomTypeDistribution = useMemo(() => {
    const map = new Map<string, number>();
    HOSTELS.forEach((h) => h.roomTypes.forEach((r) => map.set(r.label, (map.get(r.label) || 0) + 1)));
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, []);

  const priceVsRating = useMemo(() => HOSTELS.map((h) => ({ x: h.price, y: h.rating })), []);

  const density = useMemo(() => cityStats.map((c) => ({ name: c.city, hostels: c.hostelCount })), [cityStats]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="font-display text-2xl font-semibold text-[var(--color-ink)]">Hostel Insights</h1>
      <p className="mt-1 text-sm text-[var(--color-ink-soft)]">Aggregated analytics from HostelMate's current listings.</p>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          ['Average Hostel Rent', formatINR(avgRent)],
          ['Average Rating', `${avgRating}/5`],
          ['Available Hostels', HOSTELS.filter((h) => h.availability !== 'full').length.toString()],
          ['Average Distance', `${avgDistance} km`],
        ].map(([label, val]) => (
          <div key={label} className="rounded-2xl border border-[var(--color-line)] bg-white p-5">
            <p className="text-xs text-[var(--color-ink-faint)]">{label}</p>
            <p className="mt-1 font-mono text-2xl font-semibold text-[var(--color-ink)] tabular">{val}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <ChartCard title="Average rent by area (top 8)">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={rentByArea} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-line)" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="locality" tick={{ fontSize: 11 }} width={90} />
              <Tooltip formatter={(v: any) => formatINR(Number(v))} />
              <Bar dataKey="rent" fill="var(--color-indigo)" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Rating distribution">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={ratingDistribution} dataKey="value" nameKey="name" outerRadius={90} label>
                {ratingDistribution.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Facility availability (%)">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={facilityAvailability}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-line)" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} angle={-20} textAnchor="end" height={60} />
              <YAxis tick={{ fontSize: 11 }} unit="%" />
              <Tooltip />
              <Bar dataKey="pct" fill="var(--color-signal)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Room type distribution">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={roomTypeDistribution} dataKey="value" nameKey="name" outerRadius={90} innerRadius={45} label>
                {roomTypeDistribution.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Price vs rating">
          <ResponsiveContainer width="100%" height={260}>
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-line)" />
              <XAxis type="number" dataKey="x" name="Price" tick={{ fontSize: 11 }} tickFormatter={(v) => `₹${v / 1000}k`} />
              <YAxis type="number" dataKey="y" name="Rating" domain={[3, 5]} tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v: any, n: any) => [n === 'Price' ? formatINR(Number(v)) : v, n]} cursor={{ strokeDasharray: '3 3' }} />
              <Scatter data={priceVsRating} fill="var(--color-saffron)" />
            </ScatterChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Hostel density by city">
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={density}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-line)" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Line type="monotone" dataKey="hostels" stroke="var(--color-indigo)" strokeWidth={2.5} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <p className="mt-6 text-xs text-[var(--color-ink-faint)]">
        Figures are derived from HostelMate's current demo dataset and update as listings are added or verified.
      </p>
    </div>
  );
}
