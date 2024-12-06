import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
}

export default function Tooltip({
  content,
  children,
  position = 'top',
  delay = 200,
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    const id = setTimeout(() => setIsVisible(true), delay);
    setTimeoutId(id);
  };

  const handleMouseLeave = () => {
    if (timeoutId) clearTimeout(timeoutId);
    setIsVisible(false);
  };

  const getPositionStyles = () => {
    switch (position) {
      case 'top':
        return { bottom: '100%', left: '50%', transform: 'translateX(-50%)' };
      case 'bottom':
        return { top: '100%', left: '50%', transform: 'translateX(-50%)' };
      case 'left':
        return { right: '100%', top: '50%', transform: 'translateY(-50%)' };
      case 'right':
        return { left: '100%', top: '50%', transform: 'translateY(-50%)' };
      default:
        return {};
    }
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.1 }}
            className="absolute z-50 px-3 py-2 text-sm text-white bg-gray-900 rounded-lg shadow-lg whitespace-nowrap"
            style={{
              ...getPositionStyles(),
              margin: '8px',
            }}
          >
            {content}
            <div
              className="absolute w-2 h-2 bg-gray-900 transform rotate-45"
              style={{
                ...(position === 'top' && {
                  bottom: '-4px',
                  left: '50%',
                  marginLeft: '-4px',
                }),
                ...(position === 'bottom' && {
                  top: '-4px',
                  left: '50%',
                  marginLeft: '-4px',
                }),
                ...(position === 'left' && {
                  right: '-4px',
                  top: '50%',
                  marginTop: '-4px',
                }),
                ...(position === 'right' && {
                  left: '-4px',
                  top: '50%',
                  marginTop: '-4px',
                }),
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}