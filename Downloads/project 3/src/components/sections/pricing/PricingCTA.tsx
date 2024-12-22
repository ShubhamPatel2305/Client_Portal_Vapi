import { motion, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, Play } from 'lucide-react';
import { useRef } from 'react';

const PricingCTA = () => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8]);

  return (
    <motion.section
      ref={containerRef}
      className="relative py-32 overflow-hidden"
      style={{
        opacity,
        scale,
      }}
    >
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-900/10 to-black" />
        
        {/* Animated Grid */}
        <motion.div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(124, 58, 237, 0.05) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(124, 58, 237, 0.05) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
          animate={{
            y: [0, -60],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "linear"
          }}
        />

        {/* Radial Gradient */}
        <motion.div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(circle at 50% 50%, rgba(124, 58, 237, 0.1), transparent 70%)",
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
      </div>

      {/* Content Container */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {/* Title */}
          <motion.h2 
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
              Ready to Transform Your Business?
            </span>
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            className="text-xl text-gray-400 mb-12 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Experience the power of AI-driven automation firsthand. Schedule a personalized demo today.
          </motion.p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="inline-block group"
          >
            <div className="relative">
              {/* Button Glow */}
              <motion.div
                className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl blur-lg group-hover:opacity-100 opacity-75 transition duration-300"
                animate={{
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              />

              {/* Main Button */}
              <motion.button
                onClick={() => navigate('/book')}
                className="relative px-8 py-4 bg-gradient-to-r from-purple-600/90 to-blue-600/90 rounded-xl text-white font-medium text-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-black"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative z-10 flex items-center gap-2">
                  <Play className="w-5 h-5" />
                  Show Demo
                  <motion.span
                    className="inline-block"
                    animate={{
                      x: [0, 4, 0]
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                  >
                    <ArrowRight className="w-5 h-5" />
                  </motion.span>
                </span>

                {/* Floating Elements */}
                <motion.div
                  className="absolute -top-8 -right-8 text-purple-300"
                  animate={{
                    y: [0, -8, 0],
                    rotate: [0, 15, 0]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                >
                  <Sparkles className="w-6 h-6" />
                </motion.div>
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Decorative Circles */}
      <motion.div
        className="absolute left-1/4 top-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />
      <motion.div
        className="absolute right-1/4 bottom-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          repeatType: "reverse",
          delay: 1
        }}
      />
    </motion.section>
  );
};

export default PricingCTA;
