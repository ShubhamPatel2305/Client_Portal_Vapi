import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useRef, useState } from 'react';

interface ComparisonFeature {
  title: string;
  description: string;
  topEdge: {
    title: string;
    description: string;
    icon: string;
  }[];
  others: {
    title: string;
    description: string;
    icon: string;
  }[];
}

const comparisonData: ComparisonFeature[] = [
  {
    title: "Development Experience",
    description: "Experience the future of development with AI-powered assistance",
    topEdge: [
      {
        title: "AI-Powered Assistance",
        description: "Get intelligent suggestions and automated refactoring in real-time as you code",
        icon: "🤖"
      },
      {
        title: "Smart Automation",
        description: "Automate repetitive tasks with AI-driven workflows and code generation",
        icon: "⚡"
      }
    ],
    others: [
      {
        title: "Manual Coding",
        description: "Write every line of code by hand with basic IDE assistance",
        icon: "💻"
      },
      {
        title: "Basic Tools",
        description: "Limited automation with standard development tools",
        icon: "🔧"
      }
    ]
  }
];

const ComparisonSection = () => {
  const containerRef = useRef<HTMLElement>(null);
  const topEdgeRef = useRef<HTMLDivElement>(null);
  const traditionalRef = useRef<HTMLDivElement>(null);
  const [hoveredSide, setHoveredSide] = useState<'left' | 'right' | null>(null);

  // Main section scroll progress
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // TopEdge section scroll progress
  const { scrollYProgress: topEdgeProgress } = useScroll({
    target: topEdgeRef,
    offset: ["start end", "end start"]
  });

  // Traditional section scroll progress
  const { scrollYProgress: traditionalProgress } = useScroll({
    target: traditionalRef,
    offset: ["start end", "end start"]
  });

  // Enhanced scroll animations
  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.9, 1, 1, 0.9]);
  const rotate = useTransform(scrollYProgress, [0, 1], [2, -2]);

  // TopEdge mobile animations
  const topEdgeScale = useTransform(topEdgeProgress, [0, 0.3, 0.7, 1], [0.95, 1.05, 1.05, 0.95]);
  const topEdgeBrightness = useTransform(topEdgeProgress, [0, 0.3, 0.7, 1], [1, 1.2, 1.2, 1]);

  // Traditional mobile animations
  const traditionalScale = useTransform(traditionalProgress, [0, 0.3, 0.7, 1], [0.95, 1.05, 1.05, 0.95]);
  const traditionalBrightness = useTransform(traditionalProgress, [0, 0.3, 0.7, 1], [1, 1.2, 1.2, 1]);

  return (
    <section 
      ref={containerRef}
      className="relative bg-black py-16 sm:py-24 md:py-32 lg:py-40 overflow-hidden"
    >
      {/* Enhanced animated background */}
      <motion.div 
        className="absolute inset-0 opacity-30"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)',
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <motion.div 
        className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        style={{ y, opacity, scale, rotateZ: rotate }}
      >
        {/* Enhanced header with animated badge */}
        <div className="text-center mb-16 sm:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center"
          >
            <motion.div 
              className="relative inline-flex items-center mb-6"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div 
                className="absolute inset-0 bg-purple-500/20 blur-xl"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <div className="relative px-6 py-2 rounded-full border border-purple-500/30 bg-purple-500/10">
                <span className="text-sm sm:text-base text-purple-300 font-medium">Experience the Future</span>
              </div>
            </motion.div>
            
            <h2 className="relative text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-4">
              <motion.span 
                className="inline-block bg-gradient-to-r from-purple-400 via-pink-500 to-purple-500 text-transparent bg-clip-text"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                TopEdge
              </motion.span>
              <motion.span 
                className="inline-block text-white/90 ml-3"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                vs Traditional
              </motion.span>
            </h2>
            
            <motion.p
              className="max-w-2xl mx-auto text-gray-400 text-lg sm:text-xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              Discover how our AI-powered development platform revolutionizes the coding experience
            </motion.p>
          </motion.div>
        </div>

        {/* Enhanced comparison grid with perspective effect */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-12 perspective-1000">
          {/* TopEdge Side */}
          <motion.div
            ref={topEdgeRef}
            className="relative group"
            onHoverStart={() => setHoveredSide('left')}
            onHoverEnd={() => setHoveredSide(null)}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-purple-500/10 to-pink-500/20 rounded-2xl blur-xl"
              animate={{
                scale: hoveredSide === 'left' ? 1.1 : 1,
                opacity: hoveredSide === 'left' ? 0.8 : 0.4,
              }}
              transition={{ duration: 0.4 }}
            />
            
            <motion.div
              className="relative overflow-hidden rounded-2xl bg-black/50 border border-purple-500/30 backdrop-blur-xl p-6 sm:p-8"
              style={{
                scale: useTransform(scrollYProgress, (value) => {
                  // Only apply scale effect on mobile
                  if (typeof window !== 'undefined' && window.innerWidth < 768) {
                    return topEdgeScale.get();
                  }
                  return hoveredSide === 'left' ? 1.02 : 1;
                }),
                filter: useTransform(scrollYProgress, (value) => {
                  // Only apply brightness effect on mobile
                  if (typeof window !== 'undefined' && window.innerWidth < 768) {
                    return `brightness(${topEdgeBrightness.get()})`;
                  }
                  return hoveredSide === 'right' ? 'brightness(0.7)' : 'brightness(1)';
                }),
                rotateY: hoveredSide === 'left' ? 2 : 0,
              }}
              transition={{ duration: 0.4 }}
            >
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <h3 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                    TopEdge Development
                  </h3>
                  <p className="text-gray-300/90">Next-generation development with AI assistance</p>
                </motion.div>
                
                {comparisonData[0].topEdge.map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: idx * 0.2 }}
                    className="relative group/item"
                  >
                    <motion.div
                      className="absolute inset-0 bg-purple-500/10 rounded-xl -z-10"
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileHover={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                    <div className="relative p-4 sm:p-6">
                      <div className="flex items-start gap-4">
                        <motion.div 
                          className="flex items-center justify-center w-12 h-12 rounded-xl bg-purple-500/20"
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        >
                          <span className="text-2xl">{item.icon}</span>
                        </motion.div>
                        <div>
                          <h4 className="text-lg sm:text-xl font-semibold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
                            {item.title}
                          </h4>
                          <p className="text-gray-300/80 mt-1">{item.description}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Traditional Side */}
          <motion.div
            ref={traditionalRef}
            className="relative group"
            onHoverStart={() => setHoveredSide('right')}
            onHoverEnd={() => setHoveredSide(null)}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-gray-600/20 via-gray-500/10 to-gray-600/20 rounded-2xl blur-xl"
              animate={{
                scale: hoveredSide === 'right' ? 1.1 : 1,
                opacity: hoveredSide === 'right' ? 0.6 : 0.3,
              }}
              transition={{ duration: 0.4 }}
            />
            
            <motion.div
              className="relative overflow-hidden rounded-2xl bg-black/50 border border-gray-700/30 backdrop-blur-xl p-6 sm:p-8"
              style={{
                scale: useTransform(scrollYProgress, (value) => {
                  // Only apply scale effect on mobile
                  if (typeof window !== 'undefined' && window.innerWidth < 768) {
                    return traditionalScale.get();
                  }
                  return hoveredSide === 'right' ? 1.02 : 1;
                }),
                filter: useTransform(scrollYProgress, (value) => {
                  // Only apply brightness effect on mobile
                  if (typeof window !== 'undefined' && window.innerWidth < 768) {
                    return `brightness(${traditionalBrightness.get()})`;
                  }
                  return hoveredSide === 'left' ? 'brightness(0.7)' : 'brightness(1)';
                }),
                rotateY: hoveredSide === 'right' ? -2 : 0,
              }}
              transition={{ duration: 0.4 }}
            >
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <h3 className="text-2xl sm:text-3xl font-bold text-gray-400 mb-2">Traditional Development</h3>
                  <p className="text-gray-500">Conventional development methods</p>
                </motion.div>
                
                {comparisonData[0].others.map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: idx * 0.2 }}
                    className="relative group/item"
                  >
                    <motion.div
                      className="absolute inset-0 bg-gray-800/50 rounded-xl -z-10"
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileHover={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                    <div className="relative p-4 sm:p-6">
                      <div className="flex items-start gap-4">
                        <motion.div 
                          className="flex items-center justify-center w-12 h-12 rounded-xl bg-gray-800/70"
                          whileHover={{ scale: 1.1, rotate: -5 }}
                          transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        >
                          <span className="text-2xl">{item.icon}</span>
                        </motion.div>
                        <div>
                          <h4 className="text-lg sm:text-xl font-semibold text-gray-400">{item.title}</h4>
                          <p className="text-gray-500 mt-1">{item.description}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default ComparisonSection;
