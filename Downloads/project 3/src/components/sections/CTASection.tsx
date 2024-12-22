import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { CyberButton } from '../ui/CyberButton';

export const CTASection = () => {
  return (
    <section className="relative py-8 sm:py-12 md:py-16 overflow-hidden sf-pro-display bg-black">
      <div className="relative max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 text-center pb-4 sm:pb-6 md:pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6 md:mb-8">
            <motion.span
              className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600"
              animate={{
                textShadow: [
                  "0 0 10px rgba(59, 130, 246, 0.5)",
                  "0 0 5px rgba(59, 130, 246, 0.3)",
                  "0 0 10px rgba(59, 130, 246, 0.5)"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Ready to be Unique?
            </motion.span>
          </h2>
          <div className="flex justify-center items-center">
            <div className="hover:cursor-pointer transform hover:scale-105 transition-transform duration-300">
              <CyberButton to="/booking" primary>
                <span className="flex items-center justify-center text-sm sm:text-base">
                  Book Now!
                  <Sparkles className="ml-1 sm:ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                </span>
              </CyberButton>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
