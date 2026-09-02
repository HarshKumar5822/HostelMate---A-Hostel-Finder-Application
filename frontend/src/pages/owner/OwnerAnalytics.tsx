import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const inquirySource = [
  { name: 'Discover search', value: 42 }, { name: 'Map view', value: 21 },
  { name: 'City page', value: 15 }, { name: 'AI Assistant', value: 12 }, { name: 'Direct link', value: 8 },
];

export default function OwnerAnalytics() {
  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <h1 className="font-display text-2xl font-semibold text-[var(--color-ink)]">Analytics</h1>
      <p className="mt-1 text-sm text-[var(--color-ink-soft)]">Where your inquiries are coming from (demo data).</p>

      <div className="mt-6 rounded-2xl border border-[var(--color-line)] bg-white p-5">
        <h3 className="mb-4 font-display text-base font-semibold text-[var(--color-ink)]">Inquiry sources</h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={inquirySource} layout="vertical" margin={{ left: 40 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-line)" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 11 }} />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={120} />
            <Tooltip />
            <Bar dataKey="value" fill="var(--color-indigo)" radius={[0, 6, 6, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <p className="mt-6 text-xs text-[var(--color-ink-faint)]">
        Connect a backend to replace this demo data with live inquiry and conversion tracking.
      </p>
    </div>
  );
}
