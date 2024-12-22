import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export const ScrollingTextSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const x1 = useTransform(scrollYProgress, [0, 1], [0, -1000]);
  const x2 = useTransform(scrollYProgress, [0, 1], [0, 1000]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.95, 1, 1, 0.95]);

  return (
    <motion.section
      ref={containerRef}
      className="relative bg-black h-[60vh] flex flex-col items-center justify-center overflow-hidden py-20"
      style={{ opacity, scale }}
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:5rem_5rem] pointer-events-none z-10" />
      
      {/* First line */}
      <div className="w-full mb-4 translate-x-[10%]">
        <motion.div
          className="whitespace-nowrap will-change-transform"
          style={{ x: x1 }}
        >
          <h2 className="text-[80px] md:text-[130px] font-semibold tracking-tight text-white/20"
              style={{ 
                fontFamily: "-apple-system, 'SF Pro Display', sans-serif",
                fontFeatureSettings: '"ss01" on, "ss02" on'
              }}>
            Revolutionizing Development
          </h2>
        </motion.div>
      </div>

      {/* Second line */}
      <div className="w-full translate-x-[10%]">
        <motion.div
          className="whitespace-nowrap will-change-transform"
          style={{ x: x2 }}
        >
          <h2 className="text-[80px] md:text-[130px] font-semibold tracking-tight text-white/20"
              style={{ 
                fontFamily: "-apple-system, 'SF Pro Display', sans-serif",
                fontFeatureSettings: '"ss01" on, "ss02" on'
              }}>
            With AI Intelligence
          </h2>
        </motion.div>
      </div>

      {/* Subtle grain texture overlay */}
      <div 
        className="absolute inset-0 opacity-[0.15] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
    </motion.section>
  );
};

export default ScrollingTextSection;
