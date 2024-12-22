import React from 'react';
import { motion } from 'framer-motion';

interface MilestoneProps {
  year: string;
  title: string;
  description: string;
  index: number;
}

const Milestone: React.FC<MilestoneProps> = ({ year, title, description, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{
        duration: 1.5,
        delay: index * 0.5,
        ease: [0.25, 0.1, 0.25, 1]
      }}
      className="relative mb-20 md:mb-32 group"
    >
      {/* Connecting Line */}
      <motion.div 
        initial={{ height: 0 }}
        whileInView={{ height: "100%" }}
        viewport={{ once: true }}
        transition={{
          duration: 1.5,
          delay: index * 0.5,
          ease: "easeOut"
        }}
        className="absolute left-0 top-0 w-[2px] origin-top hidden md:block"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-purple-500 via-blue-500 to-transparent animate-gradient" />
      </motion.div>
      
      {/* Content Container */}
      <div className="relative md:pl-16 pl-0"> {/* Adjusted padding for mobile */}
        {/* Content Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 1,
            delay: index * 0.5 + 0.4
          }}
          className="relative backdrop-blur-xl bg-white/[0.02] rounded-2xl p-6 md:p-10 border border-white/[0.05] 
                     transform transition-all duration-500 hover:bg-white/[0.05] hover:border-white/[0.1] 
                     hover:shadow-2xl hover:shadow-purple-500/10 group-hover:translate-x-2
                     md:ml-0 mx-4" // Added margin for mobile
        >
          {/* Year with floating effect */}
          <motion.div
            animate={{
              y: [0, -8, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="inline-block mb-4 md:mb-6"
          >
            <h3 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 
                          text-transparent bg-clip-text bg-300% animate-gradient-x">
              {year}
            </h3>
          </motion.div>
          
          {/* Title with reveal effect */}
          <motion.h4
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 1,
              delay: index * 0.5 + 0.6
            }}
            className="text-xl md:text-3xl font-semibold mb-3 md:mb-4 text-white group-hover:text-purple-300 transition-colors duration-500"
          >
            {title}
          </motion.h4>
          
          {/* Description with typing effect */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{
              duration: 1.5,
              delay: index * 0.5 + 0.8
            }}
            className="text-base md:text-xl text-gray-400 max-w-2xl leading-relaxed group-hover:text-gray-300 transition-colors duration-500"
          >
            {description}
          </motion.p>

          {/* Decorative elements */}
          <div className="absolute -right-2 -bottom-2 w-24 h-24 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </motion.div>
      </div>
    </motion.div>
  );
};

const AboutTimeline: React.FC = () => {
  const timelineData = [
    {
      year: '2020',
      title: 'Our Beginning',
      description: 'Founded with a vision to revolutionize AI technology and make it accessible to everyone.'
    },
    {
      year: '2021',
      title: 'Rapid Growth',
      description: 'Expanded our team and capabilities, serving clients across multiple industries.'
    },
    {
      year: '2022',
      title: 'Global Expansion',
      description: 'Established international presence and partnerships with leading tech companies.'
    },
    {
      year: '2023',
      title: 'Innovation Milestone',
      description: 'Launched groundbreaking AI solutions and received industry recognition.'
    }
  ];

  return (
    <section className="relative py-20 md:py-32 bg-black overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900 to-black opacity-50" />
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.07) 0%, transparent 50%)'
        }} />
      </div>

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with Enhanced Animation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2 }}
          className="text-center mb-16 md:mb-24"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="inline-block mb-4 md:mb-6"
          >
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold">
              <span className="text-white">Our</span>{' '}
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 text-transparent bg-clip-text animate-gradient-x bg-300%">
                Journey
              </span>
            </h2>
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-lg md:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed"
          >
            A timeline of our achievements and milestones
          </motion.p>
        </motion.div>

        {/* Timeline */}
        <div className="max-w-5xl mx-auto">
          <div className="space-y-16 md:space-y-24">
            {timelineData.map((milestone, index) => (
              <Milestone
                key={milestone.year}
                year={milestone.year}
                title={milestone.title}
                description={milestone.description}
                index={index}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full blur-3xl"
            style={{
              width: `${400 + i * 100}px`,
              height: `${400 + i * 100}px`,
              background: `radial-gradient(circle at center, 
                ${i === 0 ? 'rgba(139, 92, 246, 0.03)' : 
                  i === 1 ? 'rgba(236, 72, 153, 0.03)' : 
                  i === 2 ? 'rgba(59, 130, 246, 0.03)' :
                  'rgba(147, 51, 234, 0.03)'} 0%, transparent 70%)`,
              left: `${i * 25}%`,
              top: `${i * 15}%`,
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
              x: [0, 50, 0],
              y: [0, 30, 0],
            }}
            transition={{
              duration: 15 + i * 2,
              repeat: Infinity,
              delay: i * 5,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </section>
  );
};

export default AboutTimeline;
