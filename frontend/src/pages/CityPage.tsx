import { useParams, useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { getCityStats, HOSTELS } from '../data';
import { formatINR } from '../utils/format';
import HostelCard from '../components/hostel/HostelCard';

export default function CityPage() {
  const { city } = useParams();
  const navigate = useNavigate();
  const stats = getCityStats().find((c) => c.city === city);
  const hostels = HOSTELS.filter((h) => h.city === city).slice(0, 9);

  const areaRent = Array.from(
    new Set(HOSTELS.filter((h) => h.city === city).map((h) => h.locality))
  ).map((loc) => {
    const list = HOSTELS.filter((h) => h.city === city && h.locality === loc);
    return { area: loc, rent: Math.round(list.reduce((s, h) => s + h.price, 0) / list.length) };
  });

  if (!stats) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <p className="font-display text-xl font-semibold text-[var(--color-ink)]">City not found</p>
        <button onClick={() => navigate('/discover')} className="mt-6 rounded-full bg-[var(--color-ink)] px-5 py-2.5 text-sm font-semibold text-white">Back to Discover</button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-semibold text-[var(--color-ink)]">{stats.city} Hostel Market</h1>
      <p className="mt-1 text-sm text-[var(--color-ink-soft)]">Popular areas: {stats.popularAreas.join(', ')}</p>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          ['Total Hostels', stats.hostelCount.toString()],
          ['Average Rent', formatINR(stats.avgRent)],
          ['Average Rating', `${stats.avgRating}/5`],
          ['Average Safety Score', `${stats.avgSafety}/100`],
        ].map(([label, val]) => (
          <div key={label} className="rounded-2xl border border-[var(--color-line)] bg-white p-5">
            <p className="text-xs text-[var(--color-ink-faint)]">{label}</p>
            <p className="mt-1 font-mono text-2xl font-semibold text-[var(--color-ink)] tabular">{val}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {[
          ['Wi-Fi availability', stats.wifiPct],
          ['AC availability', stats.acPct],
          ['Food availability', stats.foodPct],
        ].map(([label, pct]) => (
          <div key={label as string} className="rounded-2xl border border-[var(--color-line)] bg-white p-5">
            <div className="mb-2 flex justify-between text-sm"><span className="text-[var(--color-ink-soft)]">{label}</span><span className="font-semibold text-[var(--color-ink)]">{pct}%</span></div>
            <div className="h-1.5 rounded-full bg-[var(--color-line)]"><div className="h-full rounded-full bg-[var(--color-indigo)]" style={{ width: `${pct}%` }} /></div>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-[var(--color-line)] bg-white p-5">
        <h3 className="mb-4 font-display text-base font-semibold text-[var(--color-ink)]">Average rent by area</h3>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={areaRent}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-line)" vertical={false} />
            <XAxis dataKey="area" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip formatter={(v: any) => formatINR(Number(v))} />
            <Bar dataKey="rent" fill="var(--color-indigo)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-8">
        <h2 className="mb-4 font-display text-xl font-semibold text-[var(--color-ink)]">Hostels in {stats.city}</h2>
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {hostels.map((h, i) => <HostelCard key={h.id} hostel={h} index={i} />)}
        </div>
      </div>
    </div>
  );
}
