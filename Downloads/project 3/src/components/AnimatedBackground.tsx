import { motion } from 'framer-motion';

interface AnimatedBackgroundProps {
  className?: string;
}

const AnimatedBackground = ({ className = '' }: AnimatedBackgroundProps) => {
  return (
    <div className={`fixed inset-0 overflow-hidden pointer-events-none ${className}`}>
      {/* Black Base Background */}
      <div className="absolute inset-0 bg-black" />

      {/* Dynamic Star Field */}
      <div className="absolute inset-0">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute inset-0"
            style={{
              backgroundImage: `
                radial-gradient(1px 1px at ${20 + i * 30}% ${20 + i * 30}%, rgba(255,255,255,0.3) 0%, transparent 100%),
                radial-gradient(2px 2px at ${50 + i * 20}% ${40 + i * 20}%, rgba(255,255,255,0.2) 0%, transparent 100%),
                radial-gradient(1.5px 1.5px at ${30 + i * 25}% ${60 + i * 15}%, rgba(255,255,255,0.15) 0%, transparent 100%)
              `,
              backgroundSize: `${100 + i * 50}px ${100 + i * 50}px`,
            }}
            animate={{
              opacity: [0.5, 0.7, 0.5],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
              times: [0, 0.5, 1],
              delay: i * 2,
            }}
          />
        ))}
      </div>

      {/* Enhanced Gradient Overlays */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle at 30% 30%, rgba(56,189,248,0.08) 0%, transparent 60%)',
          filter: 'blur(60px)',
        }}
        animate={{
          opacity: [0.4, 0.6, 0.4],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle at 70% 70%, rgba(168,85,247,0.08) 0%, transparent 60%)',
          filter: 'blur(60px)',
        }}
        animate={{
          opacity: [0.4, 0.6, 0.4],
          scale: [1.2, 1, 1.2],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 5,
        }}
      />

      {/* Nebula Effect */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(139,92,246,0.05) 0%, transparent 70%)',
          filter: 'blur(90px)',
        }}
        animate={{
          opacity: [0.3, 0.5, 0.3],
          scale: [1.1, 1, 1.1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
};

export default AnimatedBackground;
