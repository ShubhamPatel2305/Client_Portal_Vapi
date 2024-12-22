import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Users, Code, Database, Globe } from 'lucide-react';

const ServicesStats = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const stats = [
    {
      icon: Users,
      value: "100K+",
      label: "Active Users",
      gradient: "from-violet-500 to-purple-500"
    },
    {
      icon: Code,
      value: "50M+",
      label: "Lines of Code",
      gradient: "from-purple-500 to-indigo-500"
    },
    {
      icon: Database,
      value: "99.9%",
      label: "Uptime",
      gradient: "from-indigo-500 to-blue-500"
    },
    {
      icon: Globe,
      value: "24/7",
      label: "Support",
      gradient: "from-blue-500 to-cyan-500"
    }
  ];

  const y = useTransform(scrollYProgress, [0, 1], [-100, 100]);
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="relative group"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-violet-600/10 to-indigo-600/10 rounded-3xl blur-xl transform group-hover:scale-110 transition-transform duration-500" />
              <div className="relative bg-black/50 rounded-3xl p-8 backdrop-blur-xl border border-white/10 text-center">
                <motion.div
                  className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-r ${stat.gradient} p-3 mb-6`}
                  whileHover={{
                    rotate: 360,
                    scale: 1.1,
                  }}
                  transition={{ duration: 0.8 }}
                >
                  <stat.icon className="w-full h-full text-white" />
                </motion.div>

                <motion.div
                  className={`text-4xl font-bold mb-2 bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", stiffness: 200, delay: index * 0.1 }}
                >
                  {stat.value}
                </motion.div>
                <div className="text-gray-400">
                  {stat.label}
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

export default ServicesStats;
