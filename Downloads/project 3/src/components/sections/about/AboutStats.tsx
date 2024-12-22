import React from 'react';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';

interface StatItemProps {
  number: number;
  label: string;
  suffix?: string;
  index: number;
}

const StatItem: React.FC<StatItemProps> = ({ number, label, suffix = '', index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="backdrop-blur-xl bg-gradient-to-br from-white/[0.01] via-purple-500/[0.02] to-blue-500/[0.01] rounded-2xl p-6 sm:p-8 border border-white/[0.05] hover:bg-white/[0.05] transition-all duration-300 group"
    >
      <div className="relative z-10">
        <div className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 sm:mb-3 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text group-hover:from-blue-300 group-hover:to-pink-300 transition-all duration-300">
          <CountUp end={number} duration={2.5} suffix={suffix} />
        </div>
        <div className="text-gray-400 text-base sm:text-lg group-hover:text-gray-300 transition-colors duration-300">
          {label}
        </div>
      </div>
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </motion.div>
  );
};

const AboutStats: React.FC = () => {
  const stats = [
    { number: 95, label: 'Client Satisfaction Rate', suffix: '%' },
    { number: 50, label: 'Global Partners', suffix: '+' },
    { number: 1000, label: 'Projects Completed', suffix: '+' },
    { number: 24, label: 'Industry Awards', suffix: '' }
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 sm:mb-24"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">
            <span className="text-white">Our</span>{' '}
            <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 text-transparent bg-clip-text">Impact</span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto">
            Measurable results that showcase our commitment to excellence
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 max-w-7xl mx-auto">
          {stats.map((stat, index) => (
            <StatItem
              key={stat.label}
              number={stat.number}
              label={stat.label}
              suffix={stat.suffix}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutStats;
