import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Grid, Binary } from 'lucide-react';
import { FeatureCard } from '../ui/FeatureCard';

const features = [
  {
    icon: Brain,
    title: "Neural Networks",
    description: "Advanced cognitive systems that evolve with your business needs"
  },
  {
    icon: Binary,
    title: "Quantum Processing", 
    description: "Next-generation computing power at your fingertips"
  },
  {
    icon: Grid,
    title: "Synaptic Integration",
    description: "Seamless connection between human and machine intelligence"
  }
];

export const FeaturesSection = () => {
  return (
    <motion.section 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 1 }}
      viewport={{ once: true }}
      className="relative w-full min-h-screen flex items-center bg-gradient-to-b from-black to-blue-900/20"
    >
      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left side - Title */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-7xl font-light text-white">Features</h2>
          </motion.div>

          {/* Right side - Features */}
          <div className="space-y-12">
            {features.map((feature, index) => (
              <FeatureCard
                key={feature.title}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                index={index}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
};
