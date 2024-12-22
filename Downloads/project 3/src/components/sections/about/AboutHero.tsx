import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';

const AboutHero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section ref={containerRef} className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* Parallax Background */}
      <motion.div 
        className="absolute inset-0"
        style={{ y }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900 to-black opacity-50" />
        <motion.div 
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          style={{
            background: 'radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.05) 0%, transparent 50%)'
          }}
        />
      </motion.div>

      {/* Animated Grid Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 grid grid-cols-8 gap-1 opacity-20">
          {[...Array(64)].map((_, i) => (
            <motion.div
              key={i}
              className="aspect-square bg-white/10 rounded-lg"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.5,
                delay: i * 0.02,
                ease: "easeOut"
              }}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <motion.div
        className="container mx-auto px-4 relative z-10"
        style={{ opacity, scale }}
      >
        <motion.div
          className="text-center max-w-4xl mx-auto"
          style={{ y: textY }}
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 sm:mb-8"
          >
            <span className="text-white">Shaping the </span>
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 text-transparent bg-clip-text">Future</span>
            <br />
            <span className="text-white">of </span>
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">AI</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-400 mb-12 leading-relaxed"
          >
            We're on a mission to revolutionize the way humans interact with artificial intelligence,
            making it more accessible, ethical, and impactful for everyone.
          </motion.p>

          {/* Buttons Container */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          >
            {/* Learn More Button */}
            <Link 
              to="/services" 
              className="group relative inline-flex items-center justify-center"
            >
              <motion.div
                className="absolute -inset-1 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 opacity-70 blur-lg group-hover:opacity-100 transition-opacity duration-500"
                initial={{ scale: 0.95 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              />
              <motion.div
                className="relative inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white bg-black rounded-full border border-purple-500 hover:border-transparent transition-colors duration-300"
                whileHover={{ y: -2 }}
                whileTap={{ y: 1 }}
              >
                <span className="mr-2">Learn More</span>
                <motion.svg 
                  className="w-5 h-5" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                  initial={{ x: 0 }}
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </motion.svg>
              </motion.div>
            </Link>

            {/* Get in Touch Button */}
            <Link 
              to="/contact" 
              className="group relative inline-flex items-center justify-center"
            >
              <motion.div
                className="absolute -inset-1 rounded-full bg-gradient-to-r from-blue-500 to-teal-400 opacity-70 blur-lg group-hover:opacity-100 transition-opacity duration-500"
                initial={{ scale: 0.95 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              />
              <motion.div
                className="relative inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white bg-black rounded-full border border-blue-500 hover:border-transparent transition-colors duration-300"
                whileHover={{ y: -2 }}
                whileTap={{ y: 1 }}
              >
                <span className="mr-2">Get in Touch</span>
                <motion.svg 
                  className="w-5 h-5" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                  initial={{ x: 0 }}
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l4 4m0 0l4-4M7 12v9m6-9v9" />
                </motion.svg>
              </motion.div>
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Enhanced Floating Particles */}
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white/10 rounded-full"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            scale: Math.random() * 0.5 + 0.5
          }}
          animate={{
            y: [null, Math.random() * window.innerHeight],
            x: [null, Math.random() * window.innerWidth],
            opacity: [0.5, 0.8, 0.5],
            scale: [1, Math.random() * 0.5 + 0.5, 1]
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            ease: "linear",
            opacity: {
              duration: Math.random() * 2 + 2,
              repeat: Infinity,
              ease: "sinInOut"
            },
            scale: {
              duration: Math.random() * 4 + 4,
              repeat: Infinity,
              ease: "sinInOut"
            }
          }}
        />
      ))}

      {/* Enhanced Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: 0.8, 
          delay: 1,
          repeat: Infinity,
          repeatType: "reverse"
        }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-400 w-full max-w-[200px] mx-auto text-center"
        style={{
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          bottom: '2rem',
          width: 'auto',
          minWidth: '120px'
        }}
      >
        <span className="text-sm whitespace-nowrap">Scroll to explore</span>
        <motion.svg
          animate={{
            y: [0, 8, 0]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="w-6 h-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
        </motion.svg>
      </motion.div>
    </section>
  );
};

export default AboutHero;
