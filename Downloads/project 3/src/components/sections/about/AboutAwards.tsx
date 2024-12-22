import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface AwardProps {
  title: string;
  organization: string;
  year: string;
  description: string;
  index: number;
}

const Award: React.FC<AwardProps> = ({ title, organization, year, description, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: index * 0.2 }}
      className="glass-effect rounded-3xl p-8 hover-lift"
    >
      <div className="flex items-start gap-6">
        <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
          <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
        </div>
        <div>
          <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-sm mb-4">
            {year}
          </span>
          <h3 className="text-2xl font-bold mb-2 gradient-text">{title}</h3>
          <p className="text-lg text-gray-300 mb-4">{organization}</p>
          <p className="text-gray-400 leading-relaxed">{description}</p>
        </div>
      </div>
    </motion.div>
  );
};

const AboutAwards: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);

  const awards = [
    {
      title: "Most Innovative AI Company",
      organization: "Tech Innovation Awards",
      year: "2023",
      description: "Recognized for groundbreaking advancements in artificial intelligence and machine learning technologies."
    },
    {
      title: "Excellence in AI Ethics",
      organization: "Global AI Summit",
      year: "2023",
      description: "Awarded for our commitment to ethical AI development and responsible innovation practices."
    },
    {
      title: "Best AI Platform",
      organization: "Enterprise Technology Awards",
      year: "2022",
      description: "Our flagship platform recognized for its exceptional performance and user experience."
    },
    {
      title: "AI Breakthrough Award",
      organization: "International Tech Awards",
      year: "2022",
      description: "Honored for developing revolutionary AI solutions that transform business operations."
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
            Recognition & Awards
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Celebrating our achievements and contributions to the AI industry
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {awards.map((award, index) => (
            <Award
              key={award.title}
              {...award}
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

export default AboutAwards;
