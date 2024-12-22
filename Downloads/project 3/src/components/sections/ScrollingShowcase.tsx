import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Code2, Blocks, Cpu, Workflow } from 'lucide-react';

const showcaseItems = [
  {
    icon: Code2,
    title: "Smart Code Generation",
    description: "AI-powered code suggestions that understand your context",
    color: "from-blue-500 to-cyan-500"
  },
  {
    icon: Blocks,
    title: "Component Library",
    description: "Extensive collection of pre-built components",
    color: "from-purple-500 to-pink-500"
  },
  {
    icon: Cpu,
    title: "Neural Processing",
    description: "Advanced AI algorithms for optimal performance",
    color: "from-orange-500 to-red-500"
  },
  {
    icon: Workflow,
    title: "Workflow Automation",
    description: "Streamline your development process",
    color: "from-green-500 to-emerald-500"
  }
];

export const ScrollingShowcase = () => {
  const { scrollYProgress } = useScroll();
  
  return (
    <section className="relative min-h-screen py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
            Innovative Features
          </h2>
        </motion.div>

        <div className="relative">
          {showcaseItems.map((item, index) => {
            const yProgress = useTransform(
              scrollYProgress,
              [index * 0.25, (index + 1) * 0.25],
              [100, 0]
            );
            const opacityProgress = useTransform(
              scrollYProgress,
              [index * 0.25, (index + 0.1) * 0.25],
              [0, 1]
            );

            return (
              <motion.div
                key={item.title}
                className="mb-40 relative"
                style={{
                  opacity: opacityProgress,
                  y: yProgress
                }}
              >
                <div className="flex items-center gap-8">
                  <motion.div
                    className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <item.icon className="w-12 h-12 text-white" />
                  </motion.div>
                  <div className="flex-1">
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                      {item.title}
                    </h3>
                    <p className="text-gray-400 text-lg">
                      {item.description}
                    </p>
                  </div>
                </div>

                <motion.div
                  className="absolute -inset-4 -z-10 rounded-xl"
                  style={{
                    background: `radial-gradient(circle at 50% 50%, ${item.color.split(' ')[1].replace('to-', '')}33, transparent 70%)`
                  }}
                  animate={{
                    opacity: [0.3, 0.5, 0.3],
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
