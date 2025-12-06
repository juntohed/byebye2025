'use client';

import { useState, useEffect, useRef } from 'react';
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
  const wallRef = useRef<HTMLDivElement>(null);

  const topMemory = memories.reduce((a, b) => (a.likes > b.likes ? a : b), memories[0]);

  const handleSubmit = async () => {
    if (!input.trim()) return alert('Write something!');
    setSubmitting(true);
    await supabase
      .from('memories')
      .insert({ content: input.trim(), author: author.trim() || 'anonymous' });
    setInput(''); setAuthor(''); await fetchMemories();
    setSubmitting(false);
    // scroll to bottom after new memory appears
    setTimeout(() => wallRef.current?.scrollIntoView({ behavior: 'smooth' }), 150);
  };

  const likeMemory = async (m: Memory) => {
    await supabase.from('memories').update({ likes: m.likes + 1 }).eq('id', m.id);
    fetchMemories();
  };

  const cardColors = ['bg-yellow-200', 'bg-pink-200', 'bg-green-200', 'bg-blue-200', 'bg-purple-200'];
  const cardRotate = ['rotate-1', '-rotate-1', 'rotate-2', '-rotate-2', 'rotate-0'];
  const getSize = (t: string) => (t.length > 200 ? 'col-span-2 row-span-2' : t.length > 100 ? 'row-span-2' : '');

  return (
    <>
      <CountdownBar />
      <div className="pt-16 min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 p-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-black text-center mb-4 text-amber-900">SGN Memory Wall 2025</h1>
          <p className="text-center text-amber-700 mb-12 text-xl">What were the best moments for you?</p>

          {/* top memory */}
          {topMemory && topMemory.likes > 0 && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="mb-12 p-8 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-2xl shadow-xl border-2 border-amber-300"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">🏆</span>
                <span className="font-bold text-amber-800 text-lg">Most loved memory</span>
              </div>
              <p className="text-gray-800 italic text-lg">“{topMemory.content}”</p>
              <div className="text-sm text-amber-700 mt-3">— {topMemory.author} · ❤️ {topMemory.likes}</div>
            </motion.div>
          )}

          {/* form */}
          <div className="mb-12">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Share your funniest / proudest / weirdest 2025 moment in SGN..."
              className="w-full p-6 rounded-2xl border border-amber-200 resize-none focus:outline-none focus:ring-4 focus:ring-amber-300"
              rows={5}
            />
            <input
              value={author}
              onChange={(e) => setAuthor(e.target.value.slice(0, 20))}
              placeholder="Your name (optional)"
              className="w-full mt-4 p-4 rounded-2xl border border-amber-200 focus:outline-none focus:ring-4 focus:ring-amber-300"
              maxLength={20}
            />
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className={`mt-6 w-full px-8 py-4 rounded-2xl font-bold text-white text-xl transition transform active:scale-95 ${
                submitting ? 'bg-gray-400' : 'bg-amber-500 hover:bg-amber-600'
              }`}
            >
              {submitting ? 'Posting...' : 'Pin It to the Wall!'}
            </button>
          </div>

          {/* wall with scroll anchor */}
          <div ref={wallRef} className="relative w-full mx-auto bg-amber-100/70 backdrop-blur-sm border-2 border-amber-200 rounded-3xl p-8">
            {memories.length === 0 && (
              <div className="grid place-items-center h-80 text-amber-700 text-lg">The wall is empty… for now 📝</div>
            )}

            {/* auto-height rows → cards collapse when “Show less” */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 auto-rows-[max-content]">
              <AnimatePresence>
                {memories.map((m, i) => (
                  <MemoryCard
                    key={m.id}
                    memory={m}
                    color={cardColors[i % cardColors.length]}
                    rotate={cardRotate[i % cardRotate.length]}
                    size={getSize(m.content)}
                    onLike={() => likeMemory(m)}
                  />
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ---------- sub-component: truncate + expand + compact size ---------- */
function MemoryCard({
  memory,
  color,
  rotate,
  size,
  onLike,
}: {
  memory: Memory;
  color: string;
  rotate: string;
  size: string;
  onLike: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const TRUNCATE_AT = 120;

  const needsTruncate = memory.content.length > TRUNCATE_AT;
  const displayText = expanded
    ? memory.content
    : needsTruncate
    ? `${memory.content.slice(0, TRUNCATE_AT)}…`
    : memory.content;

  // BIG only when expanded; otherwise natural height
  const cardSize = expanded ? 'col-span-2 row-span-2' : size;

  return (
    <motion.div
      layout
      className={`
        ${color} ${cardSize} ${rotate}
        p-5 rounded-2xl shadow-lg border border-white/60
        flex flex-col justify-between
        hover:shadow-2xl hover:scale-105 transition transform
      `}
    >
      <p className="text-gray-800 leading-relaxed break-words">{displayText}</p>

      {needsTruncate && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-xs text-amber-700 font-semibold mt-2 self-start hover:text-amber-900"
        >
          {expanded ? 'Show less' : 'Read more'}
        </button>
      )}

      {/* like + author on same line, no wrap */}
      <div className="flex items-center justify-between text-xs text-gray-600 mt-4">
        <button
          onClick={onLike}
          className="flex items-center gap-1 text-pink-600 hover:text-pink-800 font-bold whitespace-nowrap"
        >
          ❤️ {memory.likes}
        </button>
        <span className="italic truncate">{memory.author}</span>
      </div>
    </motion.div>
  );
}