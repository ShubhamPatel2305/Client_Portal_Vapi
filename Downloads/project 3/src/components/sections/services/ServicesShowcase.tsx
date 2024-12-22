import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Sparkles, Zap, LineChart } from 'lucide-react';

const ServicesShowcase = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const showcaseItems = [
    {
      icon: Sparkles,
      title: "AI-Powered Analytics",
      description: "Real-time insights with predictive modeling",
      stats: [
        { value: "99.9%", label: "Accuracy" },
        { value: "500ms", label: "Response Time" }
      ],
      gradient: "from-violet-500 to-purple-500"
    },
    {
      icon: Zap,
      title: "Neural Processing",
      description: "Advanced neural networks for complex tasks",
      stats: [
        { value: "10x", label: "Faster" },
        { value: "95%", label: "Efficiency" }
      ],
      gradient: "from-purple-500 to-indigo-500"
    },
    {
      icon: LineChart,
      title: "Predictive Models",
      description: "Future-ready forecasting solutions",
      stats: [
        { value: "97%", label: "Precision" },
        { value: "24/7", label: "Monitoring" }
      ],
      gradient: "from-indigo-500 to-blue-500"
    }
  ];

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.8, 1, 1, 0.8]);

  return (
    <section ref={containerRef} className="relative py-32 overflow-hidden">
      <motion.div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(circle at 50% 50%, rgba(124, 58, 237, 0.1) 0%, rgba(0, 0, 0, 0) 50%)",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      />

      <motion.div
        className="relative container mx-auto px-4"
        style={{ y, opacity, scale }}
      >
        <div className="text-center mb-20">
          <motion.h2
            className="text-6xl font-bold mb-6 bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            AI Solutions Showcase
          </motion.h2>
          <motion.p
            className="text-xl text-gray-400 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Experience the power of our advanced AI technologies
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {showcaseItems.map((item, index) => (
            <motion.div
              key={item.title}
              className="relative group"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-violet-600/10 to-indigo-600/10 rounded-3xl blur-xl transform group-hover:scale-110 transition-transform duration-500" />
              <div className="relative bg-black/50 rounded-3xl p-8 backdrop-blur-xl border border-white/10">
                <motion.div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${item.gradient} p-3 mb-6`}
                  whileHover={{
                    rotate: 360,
                    scale: 1.1,
                  }}
                  transition={{ duration: 0.8 }}
                >
                  <item.icon className="w-full h-full text-white" />
                </motion.div>

                <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  {item.title}
                </h3>
                <p className="text-gray-400 mb-6">
                  {item.description}
                </p>

                <div className="grid grid-cols-2 gap-4">
                  {item.stats.map((stat, statIndex) => (
                    <motion.div
                      key={stat.label}
                      className="text-center p-3 rounded-xl bg-white/5"
                      whileHover={{ scale: 1.05 }}
                    >
                      <div className={`text-2xl font-bold bg-gradient-to-r ${item.gradient} bg-clip-text text-transparent`}>
                        {stat.value}
                      </div>
                      <div className="text-sm text-gray-400">
                        {stat.label}
                      </div>
                    </motion.div>
                  ))}
                </div>

                <motion.div
                  className="absolute -bottom-2 -right-2 w-32 h-32 bg-gradient-to-r from-violet-600/20 to-indigo-600/20 rounded-full blur-2xl"
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
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default ServicesShowcase;
