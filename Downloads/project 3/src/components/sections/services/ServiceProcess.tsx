import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { FileSearch, Code, Zap, Rocket } from 'lucide-react';

const ServiceProcess = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.8, 1, 1, 0.8]);

  const steps = [
    {
      number: "01",
      title: "Define",
      description: "Understand your requirements and goals for AI integration",
      color: "from-blue-500/80 to-cyan-500/80"
    },
    {
      number: "02",
      title: "Design",
      description: "Craft a customized AI solution for your needs",
      color: "from-purple-500/80 to-pink-500/80"
    },
    {
      number: "03",
      title: "Train",
      description: "Prepare your AI for excellence and performance",
      color: "from-orange-500/80 to-red-500/80"
    },
    {
      number: "04",
      title: "Deploy",
      description: "Seamlessly integrate into your business workflow",
      color: "from-emerald-500/80 to-teal-500/80"
    }
  ];

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen py-24 overflow-hidden sf-pro-display bg-black"
    >
      <motion.div
        style={{ opacity, scale }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        {/* Section Title */}
        <div className="text-center mb-24">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-6xl md:text-8xl font-bold tracking-tight gradient-text"
          >
            The Process
          </motion.h2>
        </div>

        {/* Process Steps */}
        <div className="relative">
          {/* Connecting Line */}
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transform -translate-y-1/2 opacity-20" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-25 sm:gap-12 relative">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className="relative mt-24 sm:mt-0"
              >
                {/* Step Number */}
                <motion.div 
                  className="absolute -top-16 left-0 right-0"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <div className={`text-8xl font-bold bg-gradient-to-r ${step.color} bg-clip-text text-transparent`}>
                    {step.number}
                  </div>
                </motion.div>

                {/* Content */}
                <div className="relative z-10 p-8 rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800">
                  <h3 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                    {step.title}
                  </h3>
                  <p className="text-gray-400/90">
                    {step.description}
                  </p>

                  {/* Interactive Elements */}
                  <motion.div
                    className="mt-6 flex items-center space-x-2"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 + index * 0.2 }}
                  >
                    <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500" />
                    <div className="text-sm text-gray-500">Learn more</div>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default ServiceProcess;
