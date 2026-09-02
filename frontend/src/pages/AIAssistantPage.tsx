import { useEffect, useRef, useState } from 'react';
import { Sparkles, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { HOSTELS } from '../data';
import { formatINR, formatDistance } from '../utils/format';
import type { Hostel } from '../types';

interface ChatMessage { id: string; role: 'user' | 'assistant'; text: string; hostels?: Hostel[]; }

const SUGGESTIONS = [
  'Find me a girls hostel near Gachibowli under ₹9000 with food',
  'Which hostel is best for students?',
  'Which area is cheaper for hostels?',
  'AC hostel under ₹10000 in Koramangala',
];

function mockAnswer(query: string): ChatMessage {
  const q = query.toLowerCase();
  const genderWanted = q.includes('girl') ? 'girls' : q.includes('boy') ? 'boys' : null;
  const budgetMatch = q.match(/(\d{3,6})/);
  const budget = budgetMatch ? parseInt(budgetMatch[1], 10) : null;
  const cityKeywords = ['gachibowli', 'kukatpally', 'madhapur', 'koramangala', 'whitefield', 'hitech city', 'hyderabad', 'bangalore', 'pune', 'delhi'];
  const loc = cityKeywords.find((c) => q.includes(c));

  let pool = [...HOSTELS];
  if (genderWanted) pool = pool.filter((h) => h.gender === genderWanted);
  if (budget) pool = pool.filter((h) => h.price <= budget);
  if (loc) pool = pool.filter((h) => h.locality.toLowerCase().includes(loc) || h.city.toLowerCase().includes(loc));
  if (q.includes('food')) pool = pool.filter((h) => h.food.included);
  if (q.includes('ac')) pool = pool.filter((h) => h.facilities.includes('ac'));

  pool.sort((a, b) => b.rating - a.rating);
  const top = pool.slice(0, 4);

  if (top.length === 0) {
    return { id: crypto.randomUUID(), role: 'assistant', text: "I couldn't find an exact match in the current dataset. Try widening the budget or location." };
  }
  return { id: crypto.randomUUID(), role: 'assistant', text: 'Here are the closest matches from current listings:', hostels: top };
}

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 'w', role: 'assistant', text: "Ask me things like \"AC hostel under ₹10000 near Koramangala.\" Responses are generated from local demo data — this page is architected to plug into a real AI/NLP service." },
  ]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => { scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' }); }, [messages]);

  const send = async (text: string) => {
    if (!text.trim()) return;
    setMessages((m) => [...m, { id: crypto.randomUUID(), role: 'user', text }]);
    setInput('');

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${apiUrl}/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: text }),
      });
      const data = await res.json();
      if (data.success && data.reply) {
        setMessages((m) => [
          ...m,
          {
            id: crypto.randomUUID(),
            role: 'assistant',
            text: data.reply,
            hostels: data.hostels,
          },
        ]);
        return;
      }
    } catch (e) {
      // Fallback to local matcher
    }

    setTimeout(() => setMessages((m) => [...m, mockAnswer(text)]), 350);
  };

  return (
    <div className="mx-auto flex h-[calc(100vh-64px)] max-w-3xl flex-col px-4 py-6 sm:px-6">
      <div className="mb-4 flex items-center gap-2">
        <Sparkles size={18} className="text-[var(--color-saffron)]" />
        <h1 className="font-display text-xl font-semibold text-[var(--color-ink)]">HostelMate AI Assistant</h1>
      </div>

      <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto rounded-2xl border border-[var(--color-line)] bg-white p-5">
        {messages.map((m) => (
          <div key={m.id} className={m.role === 'user' ? 'flex justify-end' : 'flex justify-start'}>
            <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${m.role === 'user' ? 'bg-[var(--color-ink)] text-white' : 'bg-[var(--color-paper)] text-[var(--color-ink)]'}`}>
              <p>{m.text}</p>
              {m.hostels && (
                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                  {m.hostels.map((h) => (
                    <button key={h.id} onClick={() => navigate(`/hostel/${h.id}`)} className="rounded-xl border border-[var(--color-line)] bg-white p-2.5 text-left hover:border-[var(--color-indigo)]">
                      <p className="text-xs font-semibold text-[var(--color-ink)]">{h.name}</p>
                      <p className="text-[11px] text-[var(--color-ink-faint)]">{h.locality} · {formatDistance(h.distanceKm)} · {formatINR(h.price)}/mo</p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="my-3 flex flex-wrap gap-2">
        {SUGGESTIONS.map((s) => (
          <button key={s} onClick={() => send(s)} className="rounded-full border border-[var(--color-line)] px-3 py-1.5 text-xs text-[var(--color-ink-soft)] hover:border-[var(--color-indigo)]">{s}</button>
        ))}
      </div>

      <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="flex items-center gap-2">
        <input
          value={input} onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about hostels, rent, food, safety..."
          className="flex-1 rounded-full border border-[var(--color-line)] px-4 py-3 text-sm outline-none focus:border-[var(--color-indigo)]"
        />
        <button type="submit" className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-ink)] text-white"><Send size={16} /></button>
      </form>
    </div>
  );
}
