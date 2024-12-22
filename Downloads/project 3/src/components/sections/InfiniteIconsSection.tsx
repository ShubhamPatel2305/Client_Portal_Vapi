import { motion } from 'framer-motion';
import React from 'react';

const images = [
  {
    src: '/ai-images/ai-brain.webp',
    alt: 'Digital AI Brain',
    color: '#4ade80'
  },
  {
    src: '/ai-images/futuristic-ai.webp',
    alt: 'Futuristic AI Interface',
    color: '#60a5fa'
  },
  {
    src: '/ai-images/robot-hand.webp',
    alt: 'Robot Hand',
    color: '#f472b6'
  },
  {
    src: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop',
    alt: 'AI Network',
    color: '#818cf8'
  },
  {
    src: '/ai-images/ai-art.webp',
    alt: 'AI Generated Art',
    color: '#fb923c'
  },
  {
    src: 'https://images.unsplash.com/photo-1544256718-3bcf237f3974?w=800&auto=format&fit=crop',
    alt: 'Neural Network',
    color: '#f43f5e'
  }
];

const InfiniteIconsSection = () => {
  return (
    <div className="relative h-60 sm:h-72 md:h-80 lg:h-96 bg-black overflow-hidden">
      {/* Single row of images moving left */}
      <div className="absolute w-full h-full flex items-center">
        <motion.div
          className="flex gap-4 sm:gap-6 md:gap-8 lg:gap-12 items-center"
          initial={{ x: 0 }}
          animate={{
            x: [-3200, 0], // Increased movement range for smoother loop
          }}
          transition={{
            duration: 40, // Slowed down animation for better viewing
            repeat: Infinity,
            ease: "linear",
            repeatType: "loop"
          }}
        >
          {/* Triple the images to create seamless loop */}
          {[...images, ...images, ...images].map((image, index) => (
            <div
              key={index}
              className="relative w-48 h-48 sm:w-60 sm:h-60 md:w-72 md:h-72 lg:w-80 lg:h-80 group"
            >
              <div 
                className="absolute inset-0 rounded-lg sm:rounded-xl md:rounded-2xl lg:rounded-3xl overflow-hidden transform transition-all duration-300 group-hover:scale-105"
                style={{ boxShadow: `0 0 20px ${image.color}20 sm:0 0 30px ${image.color}25 md:0 0 40px ${image.color}30` }}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-50" />
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 md:p-5 lg:p-6 text-white text-sm sm:text-base md:text-lg font-medium opacity-0 transform translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                  {image.alt}
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Gradient overlays for smooth fade at edges */}
      <div className="absolute inset-y-0 left-0 w-32 sm:w-40 md:w-48 lg:w-64 bg-gradient-to-r from-black to-transparent z-10" />
      <div className="absolute inset-y-0 right-0 w-32 sm:w-40 md:w-48 lg:w-64 bg-gradient-to-l from-black to-transparent z-10" />
    </div>
  );
};

export default InfiniteIconsSection;
