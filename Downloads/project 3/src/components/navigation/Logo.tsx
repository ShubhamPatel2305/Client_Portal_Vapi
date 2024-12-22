import { motion } from 'framer-motion';
import { Brain } from 'lucide-react';

const Logo = () => {
  return (
    <motion.div 
      className="flex items-center space-x-2"
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        className="relative"
        animate={{
          rotate: [0, 10, -10, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 opacity-50 blur" />
        <div className="relative bg-black rounded-lg p-2">
          <Brain className="w-8 h-8 text-white" />
        </div>
      </motion.div>
      
      <div className="flex flex-col">
        <span className="text-2xl font-bold bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
          TopEdge
        </span>
        <span className="text-xs text-gray-400">
          make sure you're not behind the world
        </span>
      </div>
    </motion.div>
  );
};

export default Logo;
