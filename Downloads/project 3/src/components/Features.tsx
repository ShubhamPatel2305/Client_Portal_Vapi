import { motion } from 'framer-motion';
import { User2, Settings2, Shield } from 'lucide-react';

const features = [
  {
    icon: User2,
    title: "User-friendly",
    description: "Our intuitive interface ensures a seamless experience, making advanced AI technology accessible to everyone."
  },
  {
    icon: Settings2,
    title: "Seamless integration",
    description: "Effortlessly integrate our AI solutions into your existing workflows with our comprehensive API and documentation."
  },
  {
    icon: Shield,
    title: "Secure & safe",
    description: "Enterprise-grade security measures ensure your data and AI operations remain protected and compliant."
  }
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 50
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.215, 0.610, 0.355, 1.000]
    }
  }
};

export default function Features() {
  return (
    <section className="relative w-full min-h-[80vh] sm:min-h-screen flex items-center py-12 sm:py-16 md:py-20 overflow-hidden">
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-[#001233] to-black" />
      
      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-12 items-center"
        >
          {/* Left side - Title */}
          <motion.div
            variants={itemVariants}
            className="space-y-4 sm:space-y-6"
          >
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-light tracking-tight text-white">
              Features
            </h2>
            <p className="text-gray-400 text-base sm:text-lg max-w-xl">
              Experience the power of next-generation AI technology with our comprehensive suite of features designed for modern businesses.
            </p>
          </motion.div>

          {/* Right side - Features */}
          <motion.div
            variants={containerVariants}
            className="space-y-6 sm:space-y-8 bg-black/30 backdrop-blur-lg rounded-xl sm:rounded-2xl md:rounded-3xl p-4 sm:p-6 md:p-8 border border-white/10"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                className="flex items-start space-x-3 sm:space-x-4"
              >
                <div className="flex-shrink-0 p-2 sm:p-3 bg-blue-500/10 rounded-lg sm:rounded-xl">
                  <feature.icon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
                </div>
                <div className="space-y-1 sm:space-y-2">
                  <h3 className="text-lg sm:text-xl font-medium text-white">
                    {feature.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-400">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
