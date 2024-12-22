import { motion } from 'framer-motion';

const ScrollIndicator = () => {
  return (
    <motion.div
      className="flex justify-center items-center"
      initial={{ opacity: 0 }}
      animate={{ 
        opacity: [0.5, 1, 0.5],
        y: [0, 10, 0]
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      <div className="flex flex-col items-center space-y-1.5 sm:space-y-2">
        <span className="text-xs sm:text-sm text-gray-400 uppercase tracking-widest">Scroll</span>
        <div className="w-5 h-8 sm:w-6 sm:h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-1.5 sm:p-2">
          <motion.div
            className="w-0.5 sm:w-1 h-1.5 sm:h-2 bg-white rounded-full"
            animate={{
              y: [0, 8, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default ScrollIndicator;
