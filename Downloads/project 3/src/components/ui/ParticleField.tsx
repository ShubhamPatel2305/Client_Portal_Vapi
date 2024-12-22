import React, { useCallback } from 'react';
import { motion, useTransform, useSpring, useMotionValue } from 'framer-motion';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
}

export const ParticleField = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothMouseX = useSpring(mouseX, { damping: 50, stiffness: 400 });
  const smoothMouseY = useSpring(mouseY, { damping: 50, stiffness: 400 });

  const particles: Particle[] = React.useMemo(() => {
    return Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      color: [
        'rgba(96, 165, 250, 0.7)',
        'rgba(129, 140, 248, 0.7)',
        'rgba(167, 139, 250, 0.7)',
        'rgba(244, 114, 182, 0.7)'
      ][Math.floor(Math.random() * 4)]
    }));
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    mouseX.set(x);
    mouseY.set(y);
  }, [mouseX, mouseY]);

  return (
    <div 
      className="absolute inset-0 overflow-hidden pointer-events-none"
      onMouseMove={handleMouseMove}
    >
      {particles.map((particle) => {
        const x = useTransform(
          smoothMouseX,
          [0, 1],
          [particle.x - 10, particle.x + 10]
        );
        const y = useTransform(
          smoothMouseY,
          [0, 1],
          [particle.y - 10, particle.y + 10]
        );

        return (
          <motion.div
            key={particle.id}
            className="absolute rounded-full"
            style={{
              x: x.get() + '%',
              y: y.get() + '%',
              width: particle.size,
              height: particle.size,
              backgroundColor: particle.color,
              filter: 'blur(2px)',
              willChange: 'transform',
            }}
            animate={{
              opacity: [0.4, 0.8, 0.4],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        );
      })}
    </div>
  );
};
