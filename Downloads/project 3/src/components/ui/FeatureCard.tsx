import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { useInView as useInViewFromFramer } from 'framer-motion';

interface FeatureCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  index: number;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({ icon: Icon, title, description, index }) => {
  const ref = useRef(null);
  const inView = useInViewFromFramer(ref, {
    once: true,
    amount: 0.2
  });

  const cardVariants = {
    hidden: { 
      opacity: 0,
      y: 50,
      rotateX: 45
    },
    visible: { 
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        duration: 0.8,
        delay: index * 0.2,
        ease: [0.215, 0.61, 0.355, 1]
      }
    }
  };

  return (
    <motion.div
      ref={ref}
      variants={cardVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      className="relative group perspective-1000"
    >
      <motion.div
        className="absolute -inset-1 sm:-inset-2 bg-gradient-to-r from-cyan-500 via-purple-500 to-blue-500 rounded-lg opacity-0 group-hover:opacity-30 blur-lg sm:blur-xl transition-all duration-500"
        animate={{
          rotate: [0, 360],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      <div className="relative bg-gray-900/50 backdrop-blur-xl p-4 sm:p-6 md:p-8 rounded-lg border border-blue-500/20 group-hover:border-blue-500/40 transition-all duration-300 transform-gpu group-hover:translate-y-[-5px] sm:group-hover:translate-y-[-10px] group-hover:shadow-2xl">
        <motion.div
          whileHover={{
            scale: 1.2,
            rotate: 360,
          }}
          transition={{
            duration: 0.5,
          }}
          className="flex justify-center"
        >
          <Icon className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-blue-500 mb-4 sm:mb-6" />
        </motion.div>
        <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
          {title}
        </h3>
        <p className="text-sm sm:text-base text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
          {description}
        </p>
      </div>
    </motion.div>
  );
};
