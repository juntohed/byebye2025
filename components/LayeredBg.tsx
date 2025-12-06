'use client';

import { useEffect, useState } from 'react';

const IMAGES = [
  '/gradient/Gradients-orange.png', // foreground pattern
  '/gradient/Gradients-red.png', // mid-tone gradient
  '/gradient/Gradients-purpleRadial.png', // background sky
];

export default function LayeredBg() {
  const [opacities, setOpacities] = useState([0.6, 0.4, 1]); // start blend

  // gentle opacity drift every 3 s
  useEffect(() => {
    const t = setInterval(() => {
      setOpacities([
        0.5 + Math.sin(Date.now() / 1000) * 0.2,
        0.3 + Math.sin(Date.now() / 2000) * 0.2,
        1,
      ]);
    }, 100);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="fixed inset-0 -z-10">
      {IMAGES.map((src, i) => (
        <div
          key={src}
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
          style={{
            backgroundImage: `url(${src})`,
            opacity: opacities[i],
            zIndex: -i - 1, // back-to-front order
          }}
        />
      ))}
    </div>
  );
}