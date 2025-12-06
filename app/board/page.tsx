'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import CountdownBar from '@/components/CountdownBar';
import { motion, AnimatePresence } from 'framer-motion';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Memory = {
  id: number;
  content: string;
  created_at: string;
  likes: number;
  author: string;
};

/* ---------- hooks ---------- */
const useMemories = () => {
  const [memories, setMemories] = useState<Memory[]>([]);
  const fetchM = async () => {
    const { data } = await supabase
      .from('memories')
      .select('*')
      .order('created_at', { ascending: false });
    setMemories(data || []);
  };
  useEffect(() => {
    fetchM();
    const i = setInterval(fetchM, 10000);
    return () => clearInterval(i);
  }, []);
  return [memories, fetchM] as const;
};

/* ---------- main ---------- */
export default function BoardPage() {
  const [memories, fetchMemories] = useMemories();
  const [input, setInput] = useState('');
  const [author, setAuthor] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const topMemory = memories.reduce((a, b) => (a.likes > b.likes ? a : b), memories[0]);

  const handleSubmit = async () => {
    if (!input.trim()) return alert('Write something!');
    setSubmitting(true);
    await supabase
      .from('memories')
      .insert({ content: input.trim(), author: author.trim() || 'anonymous' });
    setInput(''); setAuthor(''); fetchMemories();
    setSubmitting(false);
  };

  const likeMemory = async (m: Memory) => {
    await supabase.from('memories').update({ likes: m.likes + 1 }).eq('id', m.id);
    fetchMemories();
  };

  const cardColors = ['bg-yellow-200', 'bg-pink-200', 'bg-green-200', 'bg-blue-200', 'bg-purple-200'];
  const cardRotate = ['rotate-1', '-rotate-1', 'rotate-2', '-rotate-2', 'rotate-0'];
  const getSize = (t: string) => (t.length > 200 ? 'col-span-2 row-span-2' : t.length > 100 ? 'row-span-2' : 'row-span-1');

  return (
    <>
      <CountdownBar />
      <div className="pt-16 min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 p-6">
        <h1 className="text-4xl md:text-5xl font-black text-center mb-2 text-amber-900">Memory Wall 2025</h1>
        <p className="text-center text-amber-700 mb-8 text-lg">Best story wins a mystery prize 🎁</p>

        {topMemory && topMemory.likes > 0 && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="max-w-3xl mx-auto mb-10 p-6 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-2xl shadow-lg border-2 border-amber-300"
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">🏆</span>
              <span className="font-bold text-amber-800">Most loved memory</span>
            </div>
            <p className="text-gray-800 italic">“{topMemory.content}”</p>
            <div className="text-sm text-amber-700 mt-2">— {topMemory.author} · ❤️ {topMemory.likes}</div>
          </motion.div>
        )}

        <div className="max-w-2xl mx-auto mb-10">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Share your funniest / proudest / weirdest 2025 moment in Singapore..."
            className="w-full p-4 rounded-xl border border-amber-200 resize-none focus:outline-none focus:ring-4 focus:ring-amber-300"
            rows={4}
          />
          <input
            value={author}
            onChange={(e) => setAuthor(e.target.value.slice(0, 20))}
            placeholder="Your name (optional)"
            className="w-full mt-3 p-3 rounded-xl border border-amber-200 focus:outline-none focus:ring-4 focus:ring-amber-300"
            maxLength={20}
          />
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className={`mt-4 w-full px-6 py-3 rounded-xl font-bold text-white text-lg transition transform active:scale-95 ${
              submitting ? 'bg-gray-400' : 'bg-amber-500 hover:bg-amber-600'
            }`}
          >
            {submitting ? 'Posting...' : 'Pin It to the Wall!'}
          </button>
        </div>

        <div className="relative w-full max-w-7xl mx-auto bg-amber-100 border-2 border-amber-200 rounded-2xl p-6">
          {memories.length === 0 && (
            <div className="grid place-items-center h-64 text-amber-600">The wall is empty… for now 📝</div>
          )}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 auto-rows-[minmax(140px,max-content)]">
            <AnimatePresence>
              {memories.map((m, i) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  layout
                  className={`
                    ${cardColors[i % cardColors.length]}
                    ${getSize(m.content)}
                    ${cardRotate[i % cardRotate.length]}
                    p-4 rounded-xl shadow-md border border-white/60
                    flex flex-col justify-between
                    hover:shadow-xl hover:scale-105 transition transform
                  `}
                >
                  <p className="text-gray-800 leading-snug break-words">{m.content}</p>
                  <div className="flex items-center justify-between text-xs text-gray-600 mt-3">
                    <button
                      onClick={() => likeMemory(m)}
                      className="flex items-center gap-1 text-pink-600 hover:text-pink-800 font-bold"
                    >
                      ❤️ {m.likes}
                    </button>
                    <span className="italic">{m.author}</span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            </div>
        </div>
      </div>
    </>
  );
}