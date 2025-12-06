'use client';
import useCountdown from '@/lib/useCountdown';

export default function CountdownBar() {
  const { d, h, m, s } = useCountdown();
  const pad = (n: number) => n.toString().padStart(2, '0');

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-center text-sm gap-2 font-mono text-neutral-700">
        <span>Party starts in:</span>
        <span className="px-2 py-1 bg-emerald-400 text-neutral-900 rounded font-bold">
          {d}d {pad(h)}h {pad(m)}m {pad(s)}s
        </span>
        <span className="text-neutral-500">Dec 10, 2025 · 5:30 PM (SGT)</span>
      </div>
    </div>
  );
}