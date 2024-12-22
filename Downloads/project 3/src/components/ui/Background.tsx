import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Hexagon } from 'lucide-react';

const ParticleField = memo(() => {
  const particles = Array(30).fill(null); // Reduced for better mobile performance
  const colors = ['#60A5FA', '#818CF8', '#A78BFA', '#F472B6'];
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-1 w-1 sm:h-1.5 sm:w-1.5 rounded-full blur-[1px] sm:blur-[2px]"
          style={{
            background: colors[i % colors.length],
          }}
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
          }}
          animate={{
            x: [null, Math.random() * window.innerWidth],
            y: [null, Math.random() * window.innerHeight],
            scale: [1, 1.2, 1],
            opacity: [0.15, 0.4, 0.15],
          }}
          transition={{
            duration: Math.random() * 15 + 15, // Reduced duration for better mobile performance
            repeat: Infinity,
            ease: "linear"
          }}
        />
      ))}
    </div>
  );
});

const GridBackground = memo(() => {
  return (
    <div className="absolute inset-0">
      <div className="absolute inset-0 bg-grid-pattern opacity-5 sm:opacity-10" />
      <div className="absolute inset-0 bg-gradient-radial from-transparent to-slate-900/90 sm:to-slate-900/80" />
    </div>
  );
});

const FloatingHexagons = memo(() => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array(3).fill(null).map((_, i) => ( // Reduced for better mobile performance
        <motion.div
          key={i}
          className="absolute"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            rotateZ: [0, 360],
            y: [0, -20, 0],
            opacity: [0.05, 0.2, 0.05],
          }}
          transition={{
            duration: 15 + i * 2, // Reduced duration for better mobile performance
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <Hexagon className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 text-blue-500/20" />
        </motion.div>
      ))}
    </div>
  );
});

export const Background = memo(() => {
  return (
    <div className="fixed inset-0 -z-10">
      <GridBackground />
      <ParticleField />
      <FloatingHexagons />
    </div>
  );
});
