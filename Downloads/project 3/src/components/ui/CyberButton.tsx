import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

interface CyberButtonProps {
  children: React.ReactNode;
  to: string;
  primary?: boolean;
  icon?: React.ReactNode;
}

export const CyberButton: React.FC<CyberButtonProps> = ({ children, to, primary = false, icon }) => {
  const [isHovered, setIsHovered] = useState(false);
  const buttonRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    buttonRef.current.style.setProperty("--mouse-x", `${x}px`);
    buttonRef.current.style.setProperty("--mouse-y", `${y}px`);
  };

  return (
    <Link to={to}>
      <motion.div
        ref={buttonRef}
        onMouseMove={handleMouseMove}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        whileTap={{ scale: 0.95 }}
        className={`
          relative overflow-hidden rounded-lg 
          px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 
          text-sm sm:text-base
          cursor-pointer
          ${primary ? 'bg-blue-500/10' : 'bg-gray-800/50'}
          border border-blue-500/30
          hover:border-blue-500/60 transition-all duration-300
          hover:shadow-[0_0_30px_rgba(59,130,246,0.5)]
          before:absolute before:inset-0 before:opacity-0 before:hover:opacity-20
          before:bg-[radial-gradient(circle_at_var(--mouse-x)_var(--mouse-y),rgba(59,130,246,0.8),transparent_50%)]
          before:transition-opacity before:duration-300
          active:scale-95 touch-none
        `}
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-blue-500/20"
          animate={{
            x: isHovered ? ["100%", "-100%"] : "100%",
          }}
          transition={{
            duration: 1.5,
            ease: "easeInOut",
            repeat: isHovered ? Infinity : 0,
          }}
        />
        <motion.div
          className="relative flex items-center justify-center gap-1.5 sm:gap-2 text-white"
          animate={{
            scale: isHovered ? 1.05 : 1,
          }}
        >
          {children}
          {icon && (
            <motion.div
              animate={{
                rotate: isHovered ? 360 : 0,
              }}
              transition={{
                duration: 0.5,
              }}
              className="w-4 h-4 sm:w-5 sm:h-5"
            >
              {icon}
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </Link>
  );
};
