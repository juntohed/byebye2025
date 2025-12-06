'use client';

import { useEffect, useState } from 'react';
import CountdownBar from '@/components/CountdownBar';
import confetti from 'canvas-confetti';
import { motion } from 'framer-motion';

export default function YesPage() {
  const [played, setPlayed] = useState(false);

  useEffect(() => {
    // confetti explosion
    confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 } });
    // optional sound (uncomment if you add the file to /public)
    // new Audio('/sounds/pikachu-cheer.mp3').play();
    setPlayed(true);
  }, []);

  return (
    <>
      <CountdownBar />
      <div className="pt-16 min-h-screen bg-gradient-to-b from-yellow-100 to-orange-100 flex flex-col items-center justify-center p-6 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          className="mb-8"
        >
          <img src="/images/pikachu-pikachu-meme.gif" 
          alt="Party Pikachu" 
          className="mx-auto w-72 md:w-200" />
        </motion.div>

        <motion.h1
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-orange-600 mb-4"
        >
          Yay! Pikachu’s already packing his party hat 🎉
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-xl text-amber-800 mb-8"
        >
          See you on Dec 10, 5:30 PM (SGT)
        </motion.p>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex gap-4"
        >
          <a
            href="/board"
            className="px-16 py-8 bg-amber-500 text-white rounded-full font-bold text-2xl hover:bg-amber-600 transition transform active:scale-95"
          >
            Share your best 2025 SGN memories
          </a>
          <button
            onClick={() => confetti({ particleCount: 200, spread: 120 })}
            className="px-16 py-8 bg-pink-500 text-white rounded-full font-bold text-2xl hover:bg-pink-600 transition transform active:scale-95"
          >
            More Confetti!
          </button>
        </motion.div>
      </div>
    </>
  );
}