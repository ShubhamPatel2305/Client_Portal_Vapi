import React from 'react';
import { motion } from 'framer-motion';

interface TeamMemberProps {
  name: string;
  role: string;
  image: string;
  index: number;
}

const TeamMember: React.FC<TeamMemberProps> = ({ name, role, image, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: index * 0.2 }}
      className="relative group"
    >
      <div className="relative overflow-hidden rounded-3xl backdrop-blur-xl bg-gradient-to-br from-white/[0.02] via-purple-500/[0.03] to-blue-500/[0.02] border border-white/[0.05] transition-all duration-500 hover:border-white/[0.2] hover:shadow-2xl hover:shadow-purple-500/10">
        {/* Image Container */}
        <div className="relative aspect-[3/4] overflow-hidden">
          <motion.div
            initial={{ scale: 1.2 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute inset-0"
          >
            <img
              src={image}
              alt={name}
              className="w-full h-full object-cover object-center transform group-hover:scale-110 transition-transform duration-700"
            />
          </motion.div>
          
          {/* Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/0 to-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/0 to-black/0 opacity-100 group-hover:opacity-0 transition-opacity duration-500" />
          
          {/* Animated Border */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <div className="absolute inset-0 border-[2px] border-white/20 rounded-3xl" />
            <motion.div
              className="absolute -inset-[100%] bg-gradient-conic from-purple-500/20 via-blue-500/20 to-purple-500/20"
              animate={{
                rotate: [0, 360]
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          </div>
        </div>

        {/* Content */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="absolute bottom-0 left-0 right-0 p-8 transform translate-y-6 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500"
        >
          <div className="relative z-10">
            <motion.h3
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-2xl sm:text-3xl font-bold mb-2"
            >
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
                {name}
              </span>
            </motion.h3>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-gray-400 text-lg group-hover:text-gray-300 transition-colors duration-500"
            >
              {role}
            </motion.p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

const AboutTeam: React.FC = () => {
  const teamMembers = [
    {
      name: 'Moksh Patel',
      role: 'CEO & Founder',
      image: '/src/assets/453644406_2194050937623549_2266230142543551148_n.jpg'
    },
    {
      name: 'Smit Tilva',
      role: 'CEO & Founder',
      image: '/team/sarah.jpg'
    }
  ];

  return (
    <section className="relative py-16 sm:py-24 md:py-32 bg-black overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900 to-black opacity-50" />
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.05) 0%, transparent 50%)'
        }} />
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 sm:mb-24"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">
            <span className="text-white">Meet Our</span>{' '}
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400 text-transparent bg-clip-text">Leaders</span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto">
            Visionaries driving innovation and excellence in AI technology
          </p>
        </motion.div>

        {/* Team Grid - Centered for 2 members */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 max-w-5xl mx-auto">
          {teamMembers.map((member, index) => (
            <TeamMember
              key={member.name}
              name={member.name}
              role={member.role}
              image={member.image}
              index={index}
            />
          ))}
        </div>
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-[500px] h-[500px] rounded-full"
            style={{
              background: `radial-gradient(circle at center, ${i === 0 ? 'rgba(139, 92, 246, 0.03)' : i === 1 ? 'rgba(236, 72, 153, 0.03)' : 'rgba(59, 130, 246, 0.03)'} 0%, transparent 70%)`,
              left: `${i * 30}%`,
              top: `${i * 20}%`,
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              delay: i * 2,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </section>
  );
};

export default AboutTeam;
