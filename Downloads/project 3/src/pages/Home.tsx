import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { HeroSection } from '../components/sections/HeroSection';
import ComparisonSection from '../components/sections/ComparisonSection';
import AIAgentSection from '../components/sections/AIAgentSection';
import { StatsSection } from '../components/sections/StatsSection';
import { CTASection } from '../components/sections/CTASection';
import { ParticleField } from '../components/ui/ParticleField';
import ProductShowcase from '../components/sections/ProductShowcase';
import DevelopmentProcess from '../components/sections/DevelopmentProcess';
import InfiniteIconsSection from '../components/sections/InfiniteIconsSection';
import Footer from '../components/Footer';

const ScrollingText = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const x1 = useTransform(scrollYProgress, [0, 1], [150, -500]);
  const x2 = useTransform(scrollYProgress, [0, 1], [-500, 500]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1, 0.9]);

  return (
    <motion.section
      ref={containerRef}
      className="relative bg-black min-h-[80vh] sm:min-h-[90vh] md:min-h-screen flex flex-col items-center justify-center py-8 sm:py-12 md:py-20"
      style={{ opacity }}
    >
      {/* Background grid */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:2rem_2rem] sm:bg-[size:3rem_3rem] md:bg-[size:5rem_5rem] pointer-events-none" />
      
      {/* Container for better text positioning */}
      <div className="max-w-[100vw] w-full mx-auto relative px-3 sm:px-4">
        {/* First text line */}
        <div className="overflow-hidden mb-3 sm:mb-4 md:mb-8">
          <motion.div
            className="flex items-center justify-start"
            style={{ x: x1, scale }}
          >
            <h2 
              className="text-[min(10vw,6rem)] sm:text-[min(12vw,8rem)] md:text-[8vw] font-semibold whitespace-nowrap"
              style={{
                fontFamily: "-apple-system, 'SF Pro Display', sans-serif",
                fontFeatureSettings: '"ss01" on, "ss02" on',
                background: 'linear-gradient(to right, #fff 40%, #666 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                letterSpacing: '-0.02em'
              }}
            >
              Revolutionizing Development
            </h2>
          </motion.div>
        </div>

        {/* Second text line */}
        <div className="overflow-hidden">
          <motion.div
            className="flex items-center justify-end"
            style={{ x: x2, scale }}
          >
            <h2 
              className="text-[min(10vw,6rem)] sm:text-[min(12vw,8rem)] md:text-[8vw] font-semibold whitespace-nowrap"
              style={{
                fontFamily: "-apple-system, 'SF Pro Display', sans-serif",
                fontFeatureSettings: '"ss01" on, "ss02" on',
                background: 'linear-gradient(to right, #666 0%, #fff 60%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                letterSpacing: '-0.02em'
              }}
            >
              With AI Intelligence
            </h2>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

const InvisibleApproachSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const imageY = useTransform(scrollYProgress, [0, 1], [-50, 50]);
  const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.7, 1, 0.7]);
  const imageRotate = useTransform(scrollYProgress, [0, 1], [-5, 5]);
  const textY1 = useTransform(scrollYProgress, [0, 1], [-20, 20]);
  const textY2 = useTransform(scrollYProgress, [0, 1], [20, -20]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.3, 1, 1, 0.3]);

  return (
    <section
      ref={sectionRef}
      className="relative h-[70vh] sm:h-[80vh] md:h-[90vh] flex items-center justify-center overflow-hidden bg-black py-12 sm:py-16 md:py-20 mb-12 sm:mb-16 md:mb-20"
    >
      {/* Background grid */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:3rem_3rem] sm:bg-[size:4rem_4rem] md:bg-[size:5rem_5rem] pointer-events-none" />
      
      <div className="container mx-auto px-3 sm:px-4 relative">
        {/* Text container */}
        <div className="relative z-10 text-center">
          <motion.h2 
            className="text-[clamp(3rem,40vw,6rem)] sm:text-[clamp(2rem,10vw,8rem)] md:text-[clamp(2.5rem,12vw,11rem)] font-bold tracking-tight leading-none mb-2 sm:mb-4"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontFamily: "-apple-system, 'SF Pro Display', sans-serif",
              background: 'linear-gradient(to right, #fff 20%, #666 80%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              letterSpacing: '-0.02em',
              y: textY1
            }}
          >
            Multi Level
          </motion.h2>
          <motion.h2 
            className="text-[clamp(3rem,40vw,6rem)] sm:text-[clamp(2rem,10vw,8rem)] md:text-[clamp(2.5rem,12vw,11rem)] font-bold tracking-tight leading-none"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontFamily: "-apple-system, 'SF Pro Display', sans-serif",
              background: 'linear-gradient(to right, #666 20%, #fff 80%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              letterSpacing: '-0.02em',
              y: textY2
            }}
          >
            Super Agent
          </motion.h2>
        </div>

        {/* Image container */}
        <motion.div 
          ref={imageRef}
          className="absolute top-1/2 left-1/2 w-[min(35vw,170px)] sm:w-[min(70vw,300px)] md:w-[min(80vw,350px)] h-[min(35vw,170px)] sm:h-[min(70vw,300px)] md:h-[min(80vw,350px)] z-20"
          initial={{ scale: 0, opacity: 0, rotate: -20 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ 
            duration: 1,
            delay: 0.2,
            ease: [0.16, 1, 0.3, 1]
          }}
          style={{
            x: '-50%',
            y: '-50%',
            scale: imageScale,
            opacity,
            rotate: imageRotate,
            transform: 'translate(-50%, -50%)'
          }}
        >
          <div 
            className="w-full h-full bg-contain bg-center bg-no-repeat"
            style={{ 
              backgroundImage: "url('src/assets/1.png')",
              filter: 'drop-shadow(0 0 20px rgba(59, 130, 246, 0.2)) sm:drop-shadow(0 0 25px rgba(59, 130, 246, 0.25)) md:drop-shadow(0 0 30px rgba(59, 130, 246, 0.3))'
            }}
          />
        </motion.div>
      </div>
    </section>
  );
};

const Home = () => {
  const { scrollYProgress } = useScroll();
  const progressBarWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transform origin-left z-50"
        style={{ scaleX: progressBarWidth }}
      />

      {/* Grid Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Grid Lines */}
        <div className="absolute inset-0">
          {/* Vertical Lines */}
          <div 
            className="absolute inset-0" 
            style={{
              backgroundImage: `repeating-linear-gradient(to right, rgb(255 255 255 / 0.02) 0px, rgb(255 255 255 / 0.02) 1px, transparent 1px, transparent calc(100% / 40))`,
              backgroundSize: '100% 100%'
            }}
          />
          
          {/* Horizontal Lines */}
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: `repeating-linear-gradient(to bottom, rgb(255 255 255 / 0.02) 0px, rgb(255 255 255 / 0.02) 1px, transparent 1px, transparent calc(100% / 40))`,
              backgroundSize: '100% 100%'
            }}
          />
        </div>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/50 to-black" />
        
        {/* Animated Glow Effects */}
        <motion.div
          className="absolute top-1/4 -left-1/4 w-96 h-96 bg-violet-500/30 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute -bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/30 rounded-full blur-3xl"
          animate={{
            y: [-50, 50, -50],
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
      </div>

      {/* Particle Effect */}
      <div className="fixed inset-0 pointer-events-none">
        <ParticleField />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <HeroSection />
        <div className="relative bg-black">
          <ScrollingText />

          {/* Reduced spacing in mobile view */}
          <div className="mt-8 sm:mt-16 md:mt-24">
            <InvisibleApproachSection />
          </div>

          {/* Reduced spacing in mobile view */}
          <div className="mt-8 sm:mt-16 md:mt-24">
            <AIAgentSection />
          </div>

          {/* Reduced spacing in mobile view */}
          <div className="mt-8 sm:mt-16 md:mt-24">
            <StatsSection />
          </div>
          <ComparisonSection />
          <InfiniteIconsSection />
          <ProductShowcase />
          <DevelopmentProcess />
          <CTASection />
        </div>
      </div>

    </div>
  );
};

export default Home;