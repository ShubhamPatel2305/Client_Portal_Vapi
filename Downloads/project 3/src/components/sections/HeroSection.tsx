import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Binary } from 'lucide-react';
import { CyberButton } from '../ui/CyberButton';
import '../../styles/animations.css';
import '../../styles/breathe.css';

export const HeroSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"]
  });

  // Section animations
  const sectionScale = useTransform(scrollYProgress,
    [0, 0.5],
    [1, 0.85]
  );

  const sectionOpacity = useTransform(scrollYProgress,
    [0, 0.5],
    [1, 0]
  );

  const sectionY = useTransform(scrollYProgress,
    [0, 0.5],
    ["0%", "5%"]
  );

  // Text animations
  const x1 = useTransform(scrollYProgress, 
    [0, 0.2, 0.4], 
    ["0%", "-10%", "-25%"]
  );
  const x2 = useTransform(scrollYProgress, 
    [0, 0.2, 0.4], 
    ["0%", "10%", "25%"]
  );

  // Background animations
  const bgScale = useTransform(scrollYProgress,
    [0, 0.5],
    [1, 1.1]
  );

  const bgOpacity = useTransform(scrollYProgress,
    [0, 0.5],
    [1, 0.3]
  );

  // Initial animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.215, 0.61, 0.355, 1]
      }
    }
  };

  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1, 0]);

  return (
    <motion.section 
      ref={sectionRef} 
      className="relative min-h-screen flex items-center justify-center overflow-hidden font-sf-pro-display"
      style={{
        scale: sectionScale,
        opacity: sectionOpacity,
        y: sectionY
      }}
    >
      {/* Background */}
      <motion.div 
        className="absolute inset-0 flex items-center justify-center"
        style={{
          scale: bgScale,
          opacity: bgOpacity
        }}
      >
        <div className="relative w-[300px] sm:w-[400px] md:w-[500px] lg:w-[600px] h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px]">
          <motion.div 
            className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500"
            animate={{
              opacity: [0.1, 0.3, 0.1],
              scale: [0.8, 1, 0.8],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{
              filter: 'blur(80px)'
            }}
          />
          <motion.div 
            className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-violet-500"
            animate={{
              opacity: [0.2, 0.4, 0.2],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5
            }}
            style={{
              filter: 'blur(60px)'
            }}
          />
        </div>
      </motion.div>

      {/* Main Content */}
      <motion.div
        ref={textRef}
        className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 md:py-32"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{ y, opacity }}
      >
        <div className="text-center">
          {/* Main Title with Scroll Animation */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-x-3 gap-y-2 overflow-hidden mb-4 sm:mb-6">
            <div className="inline-flex items-center flex-wrap justify-center">
              <motion.h1 
                className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold tracking-tight whitespace-normal sm:whitespace-nowrap text-white/90 breathe-effect"
              >
                Great to
              </motion.h1>
              <motion.h1 
                className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold tracking-tight whitespace-normal sm:whitespace-nowrap ml-0 sm:ml-4 text-white/90 breathe-effect"
              >
                GREATEST
              </motion.h1>
            </div>
          </div>

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className="text-sm md:text-base text-gray-200/90 max-w-xl mx-auto mb-6 md:mb-10 px-4"
          >
            Revolutionizing the future with cutting-edge AI solutions
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center px-4"
          >
            <motion.div 
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }}
            >
              <CyberButton 
                to="/contact" 
                primary
                icon={<ArrowRight className="ml-2 h-4 w-4" />}
              >
                Book Consultation
              </CyberButton>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }}
            >
              <CyberButton 
                to="/services" 
                primary
                icon={<Binary className="ml-2 h-4 w-4" />}
              >
                Explore Services
              </CyberButton>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Animated background particles */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          background: [
            "radial-gradient(circle at 20% 20%, rgba(124, 58, 237, 0.1) 0%, transparent 50%)",
            "radial-gradient(circle at 80% 80%, rgba(124, 58, 237, 0.1) 0%, transparent 50%)"
          ]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />
    </motion.section>
  );
};

export default HeroSection;
