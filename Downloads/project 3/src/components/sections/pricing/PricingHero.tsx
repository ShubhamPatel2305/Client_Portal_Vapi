import { motion, useScroll, useTransform, cubicBezier } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useRef } from 'react';
import { ChevronRight, Coins, CreditCard, Gem, Crown, Wallet } from 'lucide-react';

const PricingHero = () => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Custom easing curve for ultra-smooth animations
  const smoothEasing = cubicBezier(0.4, 0.0, 0.2, 1);

  // Optimized transform values for smoother animations
  const y = useTransform(scrollYProgress, 
    [0, 0.6], 
    ["0%", "30%"], 
    { ease: smoothEasing }
  );

  const opacity = useTransform(scrollYProgress, 
    [0, 0.4], 
    [1, 0], 
    { ease: smoothEasing }
  );

  const scale = useTransform(scrollYProgress, 
    [0, 0.4], 
    [1, 0.95], 
    { ease: smoothEasing }
  );

  // Background icons configuration with optimized animations
  const backgroundIcons = [
    // Extra large crown in background
    { 
      Icon: Crown, 
      size: 96, 
      brightness: 0.4, 
      color: '#FFD700', 
      position: { top: '5%', left: '8%' }, 
      rotation: 15,
      delay: 0.2,
      floatRange: 30,
      duration: 8,
      scale: 1
    },
    // Large gem in top-right
    { 
      Icon: Gem, 
      size: 84, 
      brightness: 0.5, 
      color: '#9F7AEA', 
      position: { top: '15%', right: '12%' }, 
      rotation: -20,
      delay: 0.3,
      floatRange: 25,
      duration: 7.5,
      scale: 0.9
    },
    // Medium coins
    { 
      Icon: Coins, 
      size: 64, 
      brightness: 0.95, 
      color: '#F6E05E', 
      position: { bottom: '30%', left: '20%' }, 
      rotation: 25,
      delay: 0.4,
      floatRange: 20,
      duration: 7,
      scale: 1
    },
    // Small wallet
    { 
      Icon: Wallet, 
      size: 48, 
      brightness: 0.85, 
      color: '#B794F4', 
      position: { bottom: '20%', right: '25%' }, 
      rotation: -15,
      delay: 0.5,
      floatRange: 15,
      duration: 6.5,
      scale: 1
    },
    // Medium crown
    { 
      Icon: Crown, 
      size: 60, 
      brightness: 0.8, 
      color: '#FBD38D', 
      position: { top: '60%', left: '15%' }, 
      rotation: 30,
      delay: 0.6,
      floatRange: 20,
      duration: 7.5,
      scale: 1
    }
  ];

  return (
    <motion.section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, ease: smoothEasing }}
      style={{ opacity, scale }}
    >
      {/* Background Elements */}
      <div className="absolute inset-0">
        <motion.div 
          className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-900/20 rounded-full blur-[150px]"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.2, scale: 1 }}
          transition={{ duration: 2, ease: smoothEasing }}
        />
        <motion.div 
          className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-900/20 rounded-full blur-[120px]"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.15, scale: 1 }}
          transition={{ duration: 2, delay: 0.5, ease: smoothEasing }}
        />
      </div>

      {/* Background Icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {backgroundIcons.map((item, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              ...item.position,
              zIndex: 10 - i,
            }}
            initial={{ 
              opacity: 0, 
              scale: 0,
              y: 50,
              rotate: item.rotation - 10,
            }}
            animate={{ 
              opacity: item.brightness,
              scale: item.scale,
              y: 0,
              rotate: item.rotation,
            }}
            transition={{
              duration: 1.2,
              delay: item.delay,
              ease: smoothEasing
            }}
          >
            <motion.div
              animate={{
                y: [-item.floatRange/2, item.floatRange/2, -item.floatRange/2],
                rotate: [item.rotation - 5, item.rotation + 5, item.rotation - 5],
                scale: [1, 1.02, 1]
              }}
              transition={{
                duration: item.duration,
                repeat: Infinity,
                ease: "linear",
                times: [0, 0.5, 1]
              }}
              style={{
                filter: `brightness(${item.brightness}) drop-shadow(0 0 30px ${item.color}40)`,
              }}
            >
              <item.Icon 
                style={{ 
                  width: item.size,
                  height: item.size,
                  color: item.color,
                }}
              />
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Main Heading */}
        <motion.h1 
          className="text-6xl md:text-7xl font-bold mb-8 leading-tight"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          style={{ y, opacity }}
        >
          <span className="inline-block bg-gradient-to-r from-white via-purple-200 to-yellow-200 bg-clip-text text-transparent">
            Pricing Plans for Every Business
          </span>
        </motion.h1>

        <motion.p 
          className="text-gray-400 text-xl max-w-3xl mx-auto mb-12"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          style={{ y, opacity }}
        >
          Transform your business with our AI-powered solutions. Choose the perfect plan that scales with your needs.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div 
          className="flex flex-col sm:flex-row items-center justify-center gap-8"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          style={{ y, opacity }}
        >
          {/* Get Started Button */}
          <motion.button
            onClick={() => navigate('/book')}
            className="relative group px-10 py-5 rounded-xl text-white font-medium text-lg overflow-hidden"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Button Background with Enhanced Gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/90 via-purple-700/90 to-purple-800/90 rounded-xl" />
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 via-yellow-500/30 to-purple-500/30 opacity-0 group-hover:opacity-100 transition-all duration-500" />
            
            {/* Button Content */}
            <span className="relative z-10 flex items-center gap-3">
              Get Started Today
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </span>

            {/* Circular Explosion Animation on Hover */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(8)].map((_, i) => {
                const angle = (i / 8) * Math.PI * 2;
                const radius = 100;
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;
                
                return (
                  <motion.div
                    key={i}
                    className="absolute left-1/2 top-1/2"
                    initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                    whileHover={{
                      opacity: [0, 1, 0],
                      scale: [0.5, 1.5, 0],
                      x: [0, x],
                      y: [0, y],
                    }}
                    transition={{
                      duration: 1,
                      delay: i * 0.05,
                      repeat: Infinity,
                    }}
                  >
                    <Gem className="w-6 h-6 text-yellow-400" />
                  </motion.div>
                );
              })}
            </div>
          </motion.button>

          {/* View Pricing Button */}
          <div className="relative">
            {/* Save Badge */}
            <motion.div
              className="absolute -top-8 right-0 bg-gradient-to-r from-green-500 to-emerald-500 px-4 py-1 rounded-full text-sm font-medium text-white flex items-center gap-1 shadow-lg"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <Gem className="w-4 h-4" />
              Save 20%
            </motion.div>
            
            <motion.button
              onClick={() => {
                const pricingSection = document.getElementById('pricing-plans');
                if (pricingSection) {
                  pricingSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="relative group px-10 py-5 rounded-xl text-white font-medium text-lg overflow-hidden"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Enhanced Button Border Gradient */}
              <div className="absolute inset-0 rounded-xl p-[1px]">
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/30 via-yellow-500/30 to-purple-500/30 opacity-0 group-hover:opacity-100 transition-all duration-500" />
                <div className="absolute inset-[1px] rounded-[10px] bg-black group-hover:bg-purple-950/20 transition-colors duration-500" />
              </div>

              {/* Button Content */}
              <span className="relative z-10 flex items-center gap-3">
                View Pricing
                <CreditCard className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
              </span>

              {/* Circular Explosion Animation on Hover */}
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(8)].map((_, i) => {
                  const angle = (i / 8) * Math.PI * 2;
                  const radius = 80;
                  const x = Math.cos(angle) * radius;
                  const y = Math.sin(angle) * radius;
                  
                  return (
                    <motion.div
                      key={i}
                      className="absolute left-1/2 top-1/2"
                      initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                      whileHover={{
                        opacity: [0, 1, 0],
                        scale: [0.5, 1.2, 0],
                        x: [0, x],
                        y: [0, y],
                      }}
                      transition={{
                        duration: 0.8,
                        delay: i * 0.05,
                        repeat: Infinity,
                      }}
                    >
                      <Coins className="w-5 h-5 text-purple-400" />
                    </motion.div>
                  );
                })}
              </div>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default PricingHero;
