import { motion, useScroll, useTransform } from 'framer-motion';
import { Clock, DollarSign, Database, Settings, Zap, Sparkles, Shield, Users, BarChart, Brain } from 'lucide-react';
import { useRef } from 'react';

const benefits = [
  {
    icon: Brain,
    title: "AI-Powered Solutions",
    description: "Leverage cutting-edge AI technology to automate and enhance your business processes.",
    gradient: "from-purple-500 to-indigo-500",
    delay: 0,
    direction: "left"
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Bank-grade security with end-to-end encryption and compliance with industry standards.",
    gradient: "from-blue-500 to-cyan-500",
    delay: 0.1,
    direction: "right"
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Seamlessly work together with unlimited team members and real-time updates.",
    gradient: "from-green-500 to-emerald-500",
    delay: 0.2,
    direction: "left"
  },
  {
    icon: BarChart,
    title: "Advanced Analytics",
    description: "Get detailed insights and metrics to track your business performance.",
    gradient: "from-orange-500 to-red-500",
    delay: 0.3,
    direction: "right"
  },
  {
    icon: Clock,
    title: "24/7 Support",
    description: "Round-the-clock customer support to help you with any issues.",
    gradient: "from-pink-500 to-rose-500",
    delay: 0.4,
    direction: "left"
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Optimized performance ensuring quick response times and smooth operation.",
    gradient: "from-yellow-500 to-amber-500",
    delay: 0.5,
    direction: "right"
  },
];

const PricingBenefits = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Transform values for parallax and rotation effects
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 5]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <motion.section
      ref={containerRef}
      className="relative py-32 overflow-hidden"
      style={{
        opacity,
        scale,
      }}
    >
      {/* Background Grid */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(circle at center, rgba(124, 58, 237, 0.1) 0%, rgba(0,0,0,0) 70%)",
          y,
          rotate,
        }}
      >
        <motion.div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(124, 58, 237, 0.05) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(124, 58, 237, 0.05) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />
      </motion.div>
      
      

      {/* Decorative Elements */}
      {/* Top Left Large Purple Orb */}
      <motion.div
        className="absolute left-0 top-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[160px]"
        style={{ 
          y: useTransform(scrollYProgress, [0, 1], ["-20%", "-80%"]),
          x: useTransform(scrollYProgress, [0, 1], ["-20%", "-40%"])
        }}
      />

      {/* Top Right Medium Blue Orb */}
      <motion.div
        className="absolute right-1/4 top-1/6 w-[400px] h-[400px] bg-blue-500/15 rounded-full blur-[140px]"
        style={{ 
          y: useTransform(scrollYProgress, [0, 1], ["0%", "60%"]),
          scale: useTransform(scrollYProgress, [0, 1], [1, 1.2])
        }}
      />

      {/* Center Left Pink Orb */}
      <motion.div
        className="absolute left-1/6 top-1/2 w-[350px] h-[350px] bg-pink-500/10 rounded-full blur-[120px]"
        style={{ 
          y: useTransform(scrollYProgress, [0, 1], ["-25%", "25%"]),
          x: useTransform(scrollYProgress, [0, 1], ["-10%", "10%"])
        }}
      />

      {/* Center Right Violet Orb */}
      <motion.div
        className="absolute right-1/6 top-1/2 w-[300px] h-[300px] bg-violet-500/12 rounded-full blur-[130px]"
        style={{ 
          y: useTransform(scrollYProgress, [0, 1], ["20%", "-20%"]),
          scale: useTransform(scrollYProgress, [0, 1], [0.9, 1.1])
        }}
      />

      {/* Bottom Left Indigo Orb */}
      <motion.div
        className="absolute left-1/4 bottom-1/4 w-[450px] h-[450px] bg-indigo-500/10 rounded-full blur-[150px]"
        style={{ 
          y: useTransform(scrollYProgress, [0, 1], ["0%", "-40%"]),
          rotate: useTransform(scrollYProgress, [0, 1], ["0deg", "15deg"])
        }}
      />

      {/* Bottom Right Cyan Orb */}
      <motion.div
        className="absolute right-0 bottom-0 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[140px]"
        style={{ 
          y: useTransform(scrollYProgress, [0, 1], ["40%", "-20%"]),
          x: useTransform(scrollYProgress, [0, 1], ["20%", "-20%"])
        }}
      />

      {/* Content Container */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center max-w-3xl mx-auto mb-24"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.h2
            className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent"
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          >
            Why Choose Our Platform?
          </motion.h2>
          <motion.p
            className="text-gray-400 text-lg"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Experience the power of our platform with these amazing benefits
          </motion.p>
        </motion.div>

        {/* Benefits List */}
        <div className="space-y-32">
          {benefits.map((benefit, index) => {
            const isLeft = benefit.direction === "left";
            return (
              <motion.div
                key={index}
                className={`flex ${isLeft ? 'justify-start' : 'justify-end'}`}
                initial={{ 
                  opacity: 0, 
                  x: isLeft ? -100 : 100,
                  scale: 0.8
                }}
                whileInView={{ 
                  opacity: 1, 
                  x: 0,
                  scale: 1
                }}
                exit={{ 
                  opacity: 0,
                  x: isLeft ? -100 : 100,
                  scale: 0.8
                }}
                viewport={{ 
                  once: false,
                  amount: 0.8,
                  margin: "-100px"
                }}
                transition={{ 
                  duration: 0.9, 
                  delay: benefit.delay,
                  ease: [0.16, 1, 0.3, 1]
                }}
              >
                <motion.div 
                  className="relative max-w-xl group"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Card */}
                  <motion.div
                    className="relative p-8 rounded-2xl backdrop-blur-xl border border-white/10 bg-black/50 h-full overflow-hidden"
                    transition={{ duration: 0.2 }}
                  >
                    {/* Icon */}
                    <motion.div
                      className={`relative w-16 h-16 rounded-xl bg-gradient-to-r ${benefit.gradient} p-0.5 mb-6`}
                      whileHover={{ rotate: [0, -5, 5, 0] }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="w-full h-full bg-black rounded-xl flex items-center justify-center">
                        <benefit.icon className="w-8 h-8 text-white" />
                      </div>
                    </motion.div>

                    {/* Content */}
                    <h3 className="text-2xl font-bold text-white mb-4">{benefit.title}</h3>
                    <p className="text-gray-400">{benefit.description}</p>

                    {/* Hover Effects */}
                    <motion.div
                      className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100"
                      initial={false}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="absolute top-1/2 left-0 w-1.5 h-1.5 bg-purple-400/50 rounded-full animate-ping" />
                      <div className="absolute bottom-0 right-1/2 w-1.5 h-1.5 bg-blue-400/50 rounded-full animate-ping delay-100" />
                      <div className="absolute top-0 right-0 w-1.5 h-1.5 bg-indigo-400/50 rounded-full animate-ping delay-200" />
                    </motion.div>
                  </motion.div>

                  {/* Star Effect on Hover */}
                  <motion.div
                    className="absolute inset-0 pointer-events-none"
                    initial={false}
                  >
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-white rounded-full opacity-0 group-hover:opacity-100"
                        style={{
                          left: `${Math.random() * 100}%`,
                          top: `${Math.random() * 100}%`,
                        }}
                        animate={{
                          scale: [0, 1.5, 0],
                          opacity: [0, 1, 0],
                        }}
                        transition={{
                          duration: 1.5,
                          delay: i * 0.2,
                          repeat: Infinity,
                          repeatDelay: Math.random() * 2,
                        }}
                      />
                    ))}
                  </motion.div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>

    </motion.section>
  );
};

export default PricingBenefits;
