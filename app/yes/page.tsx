'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import CountdownBar from '@/components/CountdownBar';
import confetti from 'canvas-confetti';
import { motion } from 'framer-motion';

const DURATION = 3000; // 3 s

export default function YesPage() {
  const router = useRouter();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // instant confetti
    confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 } });

    // animate progress bar
    let frame = 0;
    const totalFrames = DURATION / 16; // ~60 fps
    const tick = () => {
      frame++;
      setProgress(frame / totalFrames);
      if (frame < totalFrames) {
        requestAnimationFrame(tick);
      } else {
        router.replace('/board'); // go to wall
      }
    };
    requestAnimationFrame(tick);
  }, [router]);

  return (
    <>
      <CountdownBar />
      <div
        className="pt-16 min-h-screen flex flex-col items-center justify-center p-4 text-center relative"
        style={{
            backgroundImage: 'url(/images/nyan-cat.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
        }}
    >
        {/* giant Cat */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        >
          <img
            src="/images/nyan-cat.gif"
            alt="Nyan Cat"
            className="w-100 md:w-100"
          />
        </motion.div>

        {/* huge headline */}
        <motion.h1
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-orange-600"
        >
          Share some memories! 🎉
        </motion.h1>

        {/* progress bar */}
        <div className="w-full max-w-md">
          <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-emerald-400"
              initial={{ width: 0 }}
              animate={{ width: `${progress * 100}%` }}
              transition={{ duration: 0.05 }}
            />
          </div>
          <p className="text-sm text-neutral-600 mt-2">Heading to the Memory Wall…</p>
        </div>

        {/* manual skip (optional) */}
        <button
          onClick={() => router.push('/board')}
          className="px-6 py-3 bg-neutral-800 text-white rounded-full font-bold hover:bg-neutral-700 transition"
        >
          Skip
        </button>
      </div>
    </>
  );
}