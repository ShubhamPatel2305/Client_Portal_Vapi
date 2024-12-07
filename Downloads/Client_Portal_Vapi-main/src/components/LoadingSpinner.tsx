import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  size?: number;
  color?: string;
}

export default function LoadingSpinner({ size = 40, color = '#4F46E5' }: LoadingSpinnerProps) {
  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* Outer spinning circle */}
      <motion.div
        className="absolute inset-0"
        style={{
          border: `3px solid ${color}`,
          borderRadius: '50%',
          borderTopColor: 'transparent',
        }}
        animate={{
          rotate: 360
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      
      {/* Inner pulsing circle */}
      <motion.div
        className="absolute inset-0 m-auto"
        style={{
          width: size * 0.4,
          height: size * 0.4,
          backgroundColor: color,
          borderRadius: '50%',
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.6, 1, 0.6],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Orbiting dots */}
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          className="absolute"
          style={{
            width: size * 0.15,
            height: size * 0.15,
            borderRadius: '50%',
            backgroundColor: color,
            opacity: 0.4,
          }}
          animate={{
            rotate: 360,
            opacity: [0.4, 0.8, 0.4]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear",
            delay: index * 0.3
          }}
        />
      ))}
    </div>
  );
}
