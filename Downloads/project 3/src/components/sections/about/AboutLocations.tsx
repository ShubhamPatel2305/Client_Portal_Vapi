import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface LocationProps {
  city: string;
  country: string;
  address: string;
  image: string;
  index: number;
}

const Location: React.FC<LocationProps> = ({ city, country, address, image, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: index * 0.2 }}
      className="group perspective"
    >
      <div className="relative h-[400px] transform-gpu transition-all duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
        {/* Front */}
        <div className="absolute inset-0">
          <div className="relative h-full glass-effect rounded-3xl overflow-hidden">
            <img
              src={image}
              alt={city}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <h3 className="text-3xl font-bold mb-2">{city}</h3>
              <p className="text-xl text-gray-300">{country}</p>
            </div>
          </div>
        </div>

        {/* Back */}
        <div className="absolute inset-0 [transform:rotateY(180deg)] [backface-visibility:hidden]">
          <div className="h-full glass-effect rounded-3xl p-8 flex flex-col justify-center items-center text-center">
            <h3 className="text-3xl font-bold mb-4 gradient-text">{city}</h3>
            <p className="text-xl text-gray-300 mb-6">{country}</p>
            <p className="text-gray-400 leading-relaxed">{address}</p>
            <button className="mt-8 px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-300">
              Visit Office
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const AboutLocations: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);

  const locations = [
    {
      city: "San Francisco",
      country: "United States",
      address: "100 Market Street, Suite 500, San Francisco, CA 94105",
      image: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2342&q=80"
    },
    {
      city: "London",
      country: "United Kingdom",
      address: "123 Tech City, Old Street, London EC1V 9NR",
      image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80"
    },
    {
      city: "Tokyo",
      country: "Japan",
      address: "1-1-1 Shibuya, Shibuya City, Tokyo 150-0002",
      image: "https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2336&q=80"
    },
    {
      city: "Singapore",
      country: "Singapore",
      address: "1 Raffles Place, #20-61, Tower 2, Singapore 048616",
      image: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2344&q=80"
    }
  ];

  return (
    <section className="relative py-32 bg-black overflow-hidden" ref={containerRef}>
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900 to-black opacity-50" />
        <motion.div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.05) 0%, transparent 50%)',
            y
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-6 gradient-text">
            Global Presence
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Our offices around the world, bringing AI innovation to every corner of the globe
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {locations.map((location, index) => (
            <Location
              key={location.city}
              {...location}
              index={index}
            />
          ))}
        </div>
      </div>

      {/* Floating particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white/10 rounded-full"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
          }}
          animate={{
            y: [null, Math.random() * window.innerHeight]
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      ))}
    </section>
  );
};

export default AboutLocations;
