import { motion, useScroll, useTransform } from 'framer-motion';
import { Brain, Cpu, Network, GitBranch, Users, BarChart } from 'lucide-react';
import { useRef } from 'react';

const ServiceShowcase = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const services = [
    {
      title: "AI Integration",
      description: "Seamlessly integrate cutting-edge AI models into your existing workflows and applications.",
      icon: Brain,
      iconColor: "from-blue-400 to-cyan-400",
      titleGradient: "from-blue-100 to-cyan-100"
    },
    {
      title: "Machine Learning",
      description: "Custom ML models trained on your data for precise predictions and insights.",
      icon: Cpu,
      iconColor: "from-purple-400 to-pink-400",
      titleGradient: "from-purple-100 to-pink-100"
    },
    {
      title: "Neural Networks",
      description: "Deep learning solutions for complex pattern recognition and data analysis.",
      icon: Network,
      iconColor: "from-orange-400 to-amber-400",
      titleGradient: "from-orange-100 to-amber-100"
    },
    {
      title: "Version Control",
      description: "Advanced version control systems for your AI models and datasets.",
      icon: GitBranch,
      iconColor: "from-emerald-400 to-teal-400",
      titleGradient: "from-emerald-100 to-teal-100"
    },
    {
      title: "Team Collaboration",
      description: "Tools and platforms for seamless team collaboration on AI projects.",
      icon: Users,
      iconColor: "from-indigo-400 to-violet-400",
      titleGradient: "from-indigo-100 to-violet-100"
    },
    {
      title: "Analytics & Insights",
      description: "Comprehensive analytics and insights for your AI implementations.",
      icon: BarChart,
      iconColor: "from-rose-400 to-red-400",
      titleGradient: "from-rose-100 to-red-100"
    }
  ];

  return (
    <section ref={containerRef} className="relative py-32">
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
            Our Services
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Comprehensive AI solutions tailored to your needs
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-8 gap-y-12">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative"
              >
                <div className="relative p-8 sm:p-8 h-full bg-black/40 backdrop-blur-sm rounded-2xl border border-zinc-800">
                  {/* Icon */}
                  <div className="mb-6 sm:mb-6 mb-8">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${service.iconColor} p-0.5`}>
                      <div className="w-full h-full bg-black rounded-xl flex items-center justify-center">
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div>
                    <h3 className={`text-2xl font-bold mb-3 sm:mb-3 mb-4 bg-gradient-to-r ${service.titleGradient} bg-clip-text text-transparent`}>
                      {service.title}
                    </h3>
                    <p className="text-gray-400 leading-relaxed">
                      {service.description}
                    </p>
                  </div>

                  {/* Hover line effect */}
                  <motion.div
                    className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${service.iconColor}
                      scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServiceShowcase;
