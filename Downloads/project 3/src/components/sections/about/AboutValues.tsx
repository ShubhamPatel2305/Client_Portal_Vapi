import React from 'react';
import { motion } from 'framer-motion';

interface ValueCardProps {
  title: string;
  description: string;
  index: number;
}

const ValueCard: React.FC<ValueCardProps> = ({ title, description, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: index * 0.1 }}
      className="relative group"
    >
      <div className="relative backdrop-blur-xl bg-white/[0.01] rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 border border-white/[0.05] overflow-hidden transition-all duration-500 hover:bg-white/[0.02]">
        {/* Content */}
        <div className="relative z-10">
          <motion.h3
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4"
            style={{ fontFamily: "SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif" }}
          >
            {title}
          </motion.h3>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.3 }}
            className="text-gray-400 text-base sm:text-lg leading-relaxed"
            style={{ fontFamily: "SF Pro Text, -apple-system, BlinkMacSystemFont, sans-serif" }}
          >
            {description}
          </motion.p>
        </div>

        {/* Decorative elements */}
        <div className="absolute inset-0 rounded-2xl sm:rounded-3xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <motion.div
            className="absolute -inset-[100%] bg-gradient-conic from-white/[0.05] via-white/[0.02] to-white/[0.05]"
            animate={{
              rotate: [0, 360]
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </div>
      </div>
    </motion.div>
  );
};

const AboutValues: React.FC = () => {
  const values = [
    {
      title: "Innovation First",
      description: "We constantly push the boundaries of what's possible, embracing cutting-edge technologies to create revolutionary AI solutions."
    },
    {
      title: "User-Centric Design",
      description: "Every decision we make is guided by our commitment to creating intuitive, accessible, and impactful user experiences."
    },
    {
      title: "Ethical AI",
      description: "We develop AI with strong ethical principles, ensuring transparency, fairness, and responsibility in everything we create."
    },
    
  ];

  return (
    <section className="relative py-16 sm:py-24 md:py-32 bg-black overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900 to-black opacity-50" />
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.05) 0%, transparent 50%)'
        }} />
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16 sm:mb-24"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">
              <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 text-transparent bg-clip-text">Our Core</span>{' '}
              <span className="text-white">Values</span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto">
              The principles that guide our innovation and shape our future
            </p>
          </motion.div>

          {/* Values Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {values.map((value, index) => (
              <ValueCard
                key={value.title}
                title={value.title}
                description={value.description}
                index={index}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutValues;
