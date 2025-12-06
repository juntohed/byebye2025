'use client';

import CountdownBar from '@/components/CountdownBar';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import LayeredBg from '@/components/LayeredBg';

export default function HomePage() {
  const router = useRouter();

  const moveNoButton = () => {
    const btn = document.getElementById('noButton');
    if (!btn) return;
    const pad = 20;
    const maxX = window.innerWidth - btn.offsetWidth - pad;
    const maxY = window.innerHeight - btn.offsetHeight - pad;
    btn.style.position = 'fixed';
    btn.style.left = `${Math.random() * maxX + pad}px`;
    btn.style.top = `${Math.random() * maxY + pad}px`;
  };

  return (
    <>
      <CountdownBar />
      <LayeredBg />
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="pt-16 min-h-screen flex flex-col items-center justify-center p-4 text-center relative z-10"
      >
        {/* bigger GIF */}
        <div className="mb-6 w-full max-w-lg">
          <img
            src="/images/begging.gif"
            alt="Pikachu"
            className="mx-auto w-72 md:w-100"
          />
        </div>

        {/* tighter, bolder headline */}
        <h1 className="text-6xl md:text-7xl font-black text-center mb-3 tracking-tight leading-none">
          Are We Saying
          <br />
          <span className="text-pink-800">#BYEBYE2025</span> Together?
        </h1>

        {/* closer CTA block */}
        <div className="flex gap-8 items-center justify-center mt-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/yes')}
            className="px-16 py-8 bg-pink-500 text-white rounded-full font-black text-2xl hover:bg-pink-600 transition shadow-xl"
          >
            Yes!
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            id="noButton"
            onMouseOver={moveNoButton}
            onClick={moveNoButton}
            className="px-16 py-8 bg-gray-300 text-gray-800 rounded-full font-black text-2xl relative cursor-pointer transition shadow-xl"
          >
            No
          </motion.button>
        </div>
      </motion.div>
    </>
  );
}