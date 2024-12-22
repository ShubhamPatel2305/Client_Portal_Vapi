import { motion } from 'framer-motion';
import { Zap, Shield, Cpu, BarChart, Cloud, Code, Brain, GitBranch } from 'lucide-react';

const ServicesFeatures = () => {
  const features = [
    {
      icon: Brain,
      title: "Neural Networks",
      description: "Advanced neural architectures for complex problem-solving",
      gradient: "from-violet-500 to-purple-500"
    },
    {
      icon: Shield,
      title: "Secure AI",
      description: "Enterprise-grade security with encrypted models",
      gradient: "from-purple-500 to-indigo-500"
    },
    {
      icon: Cpu,
      title: "Edge Computing",
      description: "Optimized AI models for edge devices",
      gradient: "from-indigo-500 to-blue-500"
    },
    {
      icon: Cloud,
      title: "Cloud Integration",
      description: "Seamless cloud deployment and scaling",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: Code,
      title: "Custom Development",
      description: "Tailored AI solutions for your needs",
      gradient: "from-cyan-500 to-teal-500"
    },
    {
      icon: BarChart,
      title: "Analytics",
      description: "Real-time insights and predictions",
      gradient: "from-teal-500 to-emerald-500"
    }
  ];

  return (
    <section className="relative py-32 overflow-hidden">
      <motion.div
        className="absolute inset-0 bg-grid-white/[0.02]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      />
      
      <div className="relative container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-6xl font-bold mb-6 bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
            Advanced Features
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Cutting-edge AI capabilities powered by the latest technology
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <motion.div
                className="group relative rounded-3xl p-8 h-full"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-black rounded-3xl transform transition-transform group-hover:scale-105" />
                <div className="absolute inset-0 bg-grid-white/[0.02] rounded-3xl" />
                <div className="relative">
                  <motion.div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.gradient} p-3 mb-6`}
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.8 }}
                  >
                    <feature.icon className="w-full h-full text-white" />
                  </motion.div>
                  <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400">
                    {feature.description}
                  </p>
                  <motion.div
                    className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-r from-violet-600/20 to-indigo-600/20 rounded-full blur-2xl"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesFeatures;
