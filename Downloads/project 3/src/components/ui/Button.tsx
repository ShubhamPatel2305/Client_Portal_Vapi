import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface ButtonProps {
  children: React.ReactNode;
  to?: string;
  primary?: boolean;
  icon?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const Button = ({ children, to, primary = false, icon, className = '', onClick }: ButtonProps) => {
  const baseStyles = `
    relative inline-flex items-center gap-1.5 sm:gap-2
    px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3
    text-xs sm:text-sm font-medium
    transition-all duration-300 rounded-lg cursor-pointer
    hover:translate-y-[-2px] active:translate-y-[0px]
    touch-none select-none
    ${primary 
      ? 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800' 
      : 'bg-gray-800 text-gray-200 hover:bg-gray-700 active:bg-gray-900'}
  `;

  const content = (
    <>
      <span>{children}</span>
      {icon || (primary && <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />)}
    </>
  );

  const motionProps = {
    whileHover: { scale: 1.02 },
    whileTap: { scale: 0.98 },
    transition: { type: "spring", stiffness: 400, damping: 17 }
  };

  if (to) {
    return (
      <motion.div {...motionProps}>
        <Link to={to} className={`${baseStyles} ${className}`}>
          {content}
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.button
      {...motionProps}
      className={`${baseStyles} ${className}`}
      onClick={onClick}
    >
      {content}
    </motion.button>
  );
};
