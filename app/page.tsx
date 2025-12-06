'use client';

import CountdownBar from '@/components/CountdownBar';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import LayeredBg from '@/components/LayeredBg';

export default function HomePage() {
  const router = useRouter();
  const [noCount, setNoCount] = useState(0);
  const [showPopup, setShowPopup] = useState(false);

  const handleYes = () => router.push('/yes');

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

  const handleNo = () => {
    if (noCount >= 3) {
      setShowPopup(true); // 4th press
      return;
    }
    setNoCount((c) => c + 1);
    moveNoButton();
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
        <h1 className="text-6xl md:text-7xl font-black text-center mb-3 tracking-tight leading-none text-pink-800">
          Are We Saying<br /><span className="text-pink-900">#BYEBYE2025</span> Together?
        </h1>

        {/* Big buttons */}
        <div className="flex gap-8 items-center justify-center mt-4">
          <motion.button
            whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
            onClick={handleYes}
            className="px-16 py-8 bg-pink-500 text-white rounded-full font-black text-2xl hover:bg-pink-600 transition shadow-xl"
          >
            Yes!
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
            id="noButton"
            onClick={handleNo}
            className="px-16 py-8 bg-gray-300 text-gray-800 rounded-full font-black text-2xl relative cursor-pointer transition shadow-xl"
          >
            No
          </motion.button>
        </div>

        {/* Mobile popup after 3 presses */}
        <AnimatePresence>
          {showPopup && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              className="fixed bottom-6 left-1/2 -translate-x-1/2 w-11/12 max-w-sm bg-white/90 backdrop-blur-lg rounded-2xl p-4 shadow-2xl border border-neutral-200"
            >
              <p className="text-center text-neutral-800 font-semibold mb-3">
                Hmph! OK fine, but share some memories!
              </p>
              <button
                onClick={() => router.push('/board')}
                className="w-full px-4 py-2 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-600 transition"
              >
                Let’s go 🎉
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}