import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

const DevelopmentProcess = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.8, 1, 1, 0.8]);

  const steps = [
    {
      number: "01",
      title: "Connect",
      description: "Integrate our AI seamlessly into your development workflow",
      color: "from-blue-500/80 to-cyan-500/80",
      icon: "🔌"
    },
    {
      number: "02",
      title: "Analyze",
      description: "Let AI understand your codebase and development patterns",
      color: "from-purple-500/80 to-pink-500/80",
      icon: "🔍"
    },
    {
      number: "03",
      title: "Enhance",
      description: "Get intelligent suggestions and automated improvements",
      color: "from-orange-500/80 to-amber-500/80",
      icon: "⚡"
    }
  ];

  return (
    <section
      ref={sectionRef}
      className="relative py-16 sm:py-24 md:py-32 lg:py-40 bg-black overflow-hidden"
    >
      {/* Enhanced Background Effects */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(circle at center, rgba(124, 58, 237, 0.08) 0%, transparent 70%)",
          scale: useTransform(scrollYProgress, [0, 1], [1, 1.2]),
        }}
      />

      <motion.div
        className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        style={{ opacity, scale }}
      >
        {/* Enhanced Header */}
        <div className="text-center mb-12 sm:mb-16 md:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="inline-block"
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
                  Simple Process
                </motion.span>
              </div>
            </motion.div>
            
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 sm:mb-6 bg-gradient-to-r from-white to-white/80 text-transparent bg-clip-text">
              How It Works
            </h2>
            <p className="max-w-2xl mx-auto text-gray-400 text-lg sm:text-xl">
              Experience a streamlined development process with our AI-powered platform
            </p>
          </motion.div>
        </div>

        {/* Process Steps - Enhanced for Mobile */}
        <div className="relative">
          {/* Connection Lines - Hidden on Mobile */}
          <div className="hidden md:block absolute left-0 right-0 top-1/2 h-0.5 bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 md:gap-12">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                className="relative"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                {/* Mobile Progress Line */}
                {index < steps.length - 1 && (
                  <div className="md:hidden absolute left-[2.5rem] top-[5rem] bottom-[-3rem] w-0.5 bg-gradient-to-b from-purple-500/30 to-transparent" />
                )}

                <motion.div
                  className="relative p-6 sm:p-8 rounded-2xl bg-black/50 border border-purple-500/20 backdrop-blur-sm"
                  whileHover={{ scale: 1.02, backgroundColor: "rgba(0,0,0,0.6)" }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Step Number and Icon */}
                  <div className="flex items-center mb-4">
                    <motion.div
                      className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <span className="text-2xl">{step.icon}</span>
                    </motion.div>
                    <div className="ml-4">
                      <span className="text-sm text-purple-400 font-medium">Step {step.number}</span>
                      <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                        {step.title}
                      </h3>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-400 text-base sm:text-lg ml-16">
                    {step.description}
                  </p>

                  {/* Progress Indicator - Mobile Only */}
                  <motion.div
                    className="md:hidden absolute -bottom-8 left-10 text-purple-400/60 text-sm"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    {index < steps.length - 1 && "↓"}
                  </motion.div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default DevelopmentProcess;
