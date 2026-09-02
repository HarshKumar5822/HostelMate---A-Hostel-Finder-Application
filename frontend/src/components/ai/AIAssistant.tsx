import { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Sparkles, X, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { HOSTELS } from '../../data';
import { formatINR, formatDistance } from '../../utils/format';
import type { Hostel } from '../../types';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  hostels?: Hostel[];
}

const SUGGESTIONS = [
  'Find me a girls hostel near Gachibowli under ₹7000 with food',
  'Which hostel is best for students?',
  'Which area is cheaper for hostels?',
  'Is a hostel with a 4.5 rating worth the price?',
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

  pool.sort((a, b) => b.rating - a.rating);
  const top = pool.slice(0, 3);

  if (q.includes('worth')) {
    return {
      id: crypto.randomUUID(),
      role: 'assistant',
      text: "I can break that down on any hostel's detail page under \"Is This Hostel Worth It?\" — it scores value, location, facilities, food and safety from available data. Open a hostel and tap the analyzer to see the full breakdown.",
    };
  }

  if (q.includes('cheaper') || q.includes('cheap')) {
    return {
      id: crypto.randomUUID(),
      role: 'assistant',
      text: 'Based on current listings, Kukatpally, Electronic City and Sector 62 tend to run cheaper than Gachibowli, Koramangala or DLF Phase 3 for similar room types. Check the Insights tab for area-level rent comparisons.',
    };
  }

  if (top.length === 0) {
    return {
      id: crypto.randomUUID(),
      role: 'assistant',
      text: "I couldn't find an exact match in the current dataset. Try widening the budget or location — or open Discover to adjust filters manually.",
    };
  }

  return {
    id: crypto.randomUUID(),
    role: 'assistant',
    text: `Here's what matches best right now:`,
    hostels: top,
  };
}

export default function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 'welcome', role: 'assistant', text: "Hi, I'm the HostelMate assistant. Ask me things like \"girls hostel near Gachibowli under ₹7000 with food.\" (Responses right now are generated from local demo data, not a live AI model.)" },
  ]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, open]);

  const send = (text: string) => {
    if (!text.trim()) return;
    const userMsg: ChatMessage = { id: crypto.randomUUID(), role: 'user', text };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    setTimeout(() => setMessages((m) => [...m, mockAnswer(text)]), 450);
  };

  return (
    <>
      <motion.button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-20 right-4 z-50 flex items-center gap-2 rounded-full bg-[var(--color-ink)] px-4 py-3.5 text-sm font-semibold text-white shadow-[var(--shadow-pop)] md:bottom-6 md:right-6"
        whileTap={{ scale: 0.94 }}
        whileHover={{ scale: 1.03 }}
      >
        <Sparkles size={17} className="text-[var(--color-saffron)]" />
        Ask HostelMate AI
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="fixed bottom-0 right-0 z-50 flex h-[85vh] w-full flex-col overflow-hidden border border-[var(--color-line)] bg-white shadow-[var(--shadow-pop)] sm:bottom-6 sm:right-6 sm:h-[600px] sm:w-[400px] sm:rounded-2xl"
          >
            <div className="flex items-center justify-between border-b border-[var(--color-line)] bg-[var(--color-indigo)] px-4 py-3.5 text-white">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-[var(--color-saffron)]" />
                <span className="font-display text-sm font-semibold">HostelMate AI</span>
              </div>
              <button onClick={() => setOpen(false)} aria-label="Close assistant">
                <X size={18} />
              </button>
            </div>

            <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
              {messages.map((m) => (
                <div key={m.id} className={m.role === 'user' ? 'flex justify-end' : 'flex justify-start'}>
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm ${
                      m.role === 'user'
                        ? 'bg-[var(--color-ink)] text-white'
                        : 'bg-[var(--color-paper)] text-[var(--color-ink)]'
                    }`}
                  >
                    <p>{m.text}</p>
                    {m.hostels && (
                      <div className="mt-2 space-y-2">
                        {m.hostels.map((h) => (
                          <button
                            key={h.id}
                            onClick={() => { setOpen(false); navigate(`/hostel/${h.id}`); }}
                            className="block w-full rounded-xl border border-[var(--color-line)] bg-white p-2.5 text-left hover:border-[var(--color-indigo)]"
                          >
                            <p className="text-xs font-semibold text-[var(--color-ink)]">{h.name}</p>
                            <p className="text-[11px] text-[var(--color-ink-faint)]">
                              {h.locality}, {h.city} · {formatDistance(h.distanceKm)} · {formatINR(h.price)}/mo · ⭐ {h.rating}
                            </p>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {messages.length < 3 && (
              <div className="flex flex-wrap gap-2 border-t border-[var(--color-line)] px-4 py-3">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="rounded-full border border-[var(--color-line)] px-3 py-1.5 text-xs text-[var(--color-ink-soft)] hover:border-[var(--color-indigo)] hover:text-[var(--color-indigo)]"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            <form
              onSubmit={(e) => { e.preventDefault(); send(input); }}
              className="flex items-center gap-2 border-t border-[var(--color-line)] p-3"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about hostels, rent, food, safety..."
                className="flex-1 rounded-full border border-[var(--color-line)] bg-[var(--color-paper)] px-4 py-2.5 text-sm outline-none focus:border-[var(--color-indigo)]"
              />
              <button
                type="submit"
                aria-label="Send"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-ink)] text-white"
              >
                <Send size={16} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
