import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';

const features = [
  {
    title: "Smart Suggestions",
    description: "Get intelligent code suggestions powered by advanced AI algorithms. Our system learns from millions of code patterns to provide context-aware recommendations.",
    icon: "",
    color: "from-blue-500 to-purple-500",
    delay: 0.2
  },
  {
    title: "Code Analysis",
    description: "Deep understanding of your codebase with real-time semantic analysis. Identify patterns, potential issues, and optimization opportunities instantly.",
    icon: "",
    color: "from-purple-500 to-pink-500",
    delay: 0.4
  },
  {
    title: "Auto Complete",
    description: "Lightning-fast code completion that understands your context. Save time with intelligent suggestions that help you write better code faster.",
    icon: "",
    color: "from-pink-500 to-red-500",
    delay: 0.6
  }
];

const ProductShowcase = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const scale = useTransform(scrollYProgress, [0, 0.5], [0.8, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 0.5], [100, 0]);

  return (
    <section 
      ref={sectionRef}
      className="relative min-h-[80vh] sm:min-h-[90vh] md:min-h-screen py-16 sm:py-20 md:py-24 lg:py-32 overflow-hidden sf-pro-display bg-black"
    >
      {/* Content Container */}
      <motion.div 
        className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full"
        style={{ scale, opacity, y }}
      >
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16 md:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <motion.div 
              className="inline-flex items-center mb-4 sm:mb-6"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <div className="relative px-4 py-2 rounded-full border border-purple-500/30 bg-purple-500/10">
                <motion.span 
                  className="relative text-sm sm:text-base text-purple-300 font-medium"
                  animate={{
                    opacity: [0.5, 1, 0.5],
                    scale: [0.98, 1.02, 0.98],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  Experience the Future
                </motion.span>
              </div>
            </motion.div>
            
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 sm:mb-6 bg-gradient-to-r from-white to-white/80 text-transparent bg-clip-text">
              Revolutionize Your Development
            </h2>
            <p className="max-w-2xl mx-auto text-gray-400 text-lg sm:text-xl">
              Experience seamless AI integration with our cutting-edge development platform
            </p>
          </motion.div>
        </div>

   
         

          {/* Feature Highlights - Mobile Optimized */}
          <div className="mt-8 sm:mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {[
              { title: "AI-Powered", description: "Smart code suggestions" },
              { title: "Real-time", description: "Instant collaboration" },
              { title: "Secure", description: "Enterprise-grade security" }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                className="relative p-4 sm:p-6 rounded-xl bg-black/50 border border-purple-500/20 backdrop-blur-sm"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ scale: 1.02, backgroundColor: "rgba(0,0,0,0.6)" }}
              >
                <h3 className="text-lg sm:text-xl font-semibold bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-400 text-sm sm:text-base">
                  {feature.description}
                </p>
              </motion.div>
            ))}
        </div>

        {/* Product Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mt-8 sm:mt-12 md:mt-16">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.8, 
                delay: feature.delay,
                type: "spring",
                stiffness: 100
              }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="relative group"
            >
              <div 
                className="absolute -inset-0.5 bg-gradient-to-r opacity-50 sm:opacity-75 group-hover:opacity-100 transition-all duration-500 blur-md sm:blur-lg"
                style={{
                  backgroundImage: `linear-gradient(to right, ${feature.color.split(' ')[1]}, ${feature.color.split(' ')[3]})`
                }}
              />
              <div className="relative p-4 sm:p-6 md:p-8 bg-gray-900/80 backdrop-blur-xl rounded-lg sm:rounded-xl md:rounded-2xl border border-gray-700/50 h-full transform transition-all duration-300 group-hover:bg-gray-800/80">
                <div className="flex items-center mb-4 sm:mb-6">
                  <div className="text-3xl sm:text-4xl md:text-5xl mr-3 sm:mr-4 transform group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-semibold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    {feature.title}
                  </h3>
                </div>
                <p className="text-sm sm:text-base text-gray-400/90 leading-relaxed">
                  {feature.description}
                </p>
                <motion.div
                  className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-all duration-300"
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg
                    className="w-6 h-6 sm:w-8 sm:h-8 p-1.5 sm:p-2 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Parallax Image */}
        <motion.div
          style={{
            y: useTransform(scrollYProgress, [0, 1], [0, 150]),
          }}
          className="mt-16 sm:mt-20 md:mt-24 lg:mt-32 relative"
        >
          <div className="aspect-[16/9] rounded-lg sm:rounded-xl md:rounded-2xl lg:rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10" />
            <motion.img
              src="/src/assets/image.png"
              alt="Product showcase"
              className="w-full h-full object-cover"
              initial={{ scale: 1.1 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 1.5 }}
              loading="lazy"
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default ProductShowcase;
