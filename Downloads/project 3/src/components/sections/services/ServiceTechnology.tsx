import { motion, useScroll, useTransform } from 'framer-motion';
import { Database, Cloud, Lock, Cpu, Network, BarChart } from 'lucide-react';
import { useRef } from 'react';

const ServiceTechnology = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const technologies = [
    {
      name: "Cloud Infrastructure",
      description: "Scalable and secure cloud solutions",
      icon: Cloud,
      color: "from-sky-400 to-blue-500"
    },
    {
      name: "Database Management",
      description: "Efficient data storage and retrieval",
      icon: Database,
      color: "from-emerald-400 to-green-500"
    },
    {
      name: "Security",
      description: "Enterprise-grade security protocols",
      icon: Lock,
      color: "from-rose-400 to-red-500"
    },
    {
      name: "Processing Power",
      description: "High-performance computing",
      icon: Cpu,
      color: "from-amber-400 to-orange-500"
    },
    {
      name: "Neural Networks",
      description: "Advanced AI architectures",
      icon: Network,
      color: "from-violet-400 to-purple-500"
    },
    {
      name: "Analytics",
      description: "Real-time data insights",
      icon: BarChart,
      color: "from-cyan-400 to-teal-500"
    }
  ];

  return (
    <section ref={containerRef} className="relative py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-6 text-white sf-pro-display">
            Our Technology
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Cutting-edge technologies powering our solutions
          </p>
        </motion.div>

        {/* Hexagon Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {technologies.map((tech, index) => {
            const Icon = tech.icon;
            return (
              <motion.div
                key={tech.name}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="group relative"
              >
                {/* Hexagon Shape */}
                <div className="relative">
                  {/* Background Glow */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${tech.color} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500`} />
                  
                  {/* Content Container */}
                  <div className="relative bg-black/40 backdrop-blur-sm p-8 clip-hexagon border border-white/10 group-hover:border-white/20 transition-all duration-500">
                    {/* Icon Container */}
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.8 }}
                      className={`w-16 h-16 mx-auto mb-6 relative`}
                    >
                      {/* Rotating border */}
                      <div className={`absolute inset-0 bg-gradient-to-r ${tech.color} rounded-full animate-spin-slow opacity-75`} />
                      {/* Icon background */}
                      <div className="absolute inset-0.5 bg-black rounded-full flex items-center justify-center">
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                    </motion.div>

                    {/* Text Content */}
                    <div className="text-center relative z-10">
                      <motion.h3
                        className={`text-xl font-bold mb-2 bg-gradient-to-r ${tech.color} bg-clip-text text-transparent`}
                      >
                        {tech.name}
                      </motion.h3>
                      <p className="text-gray-400">
                        {tech.description}
                      </p>
                    </div>

                    {/* Particle Effects */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                      {[...Array(5)].map((_, i) => (
                        <motion.div
                          key={i}
                          className={`absolute w-1 h-1 rounded-full bg-gradient-to-r ${tech.color}`}
                          animate={{
                            x: [0, Math.random() * 100 - 50],
                            y: [0, Math.random() * 100 - 50],
                            scale: [1, 0],
                            opacity: [1, 0],
                          }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            delay: i * 0.2,
                          }}
                          style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Add some CSS for hexagon clip path */}
      <style jsx>{`
        .clip-hexagon {
          clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
        }
        .animate-spin-slow {
          animation: spin 4s linear infinite;
        }
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </section>
  );
};

export default ServiceTechnology;
