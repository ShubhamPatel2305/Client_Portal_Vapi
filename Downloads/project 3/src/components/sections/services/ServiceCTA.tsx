import { motion } from 'framer-motion';
import { ChevronRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const ServiceCTA = () => {
  return (
    <section className="relative py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="relative rounded-3xl overflow-hidden"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {/* Background */}
          <div className="absolute inset-0">
            {/* Dark gradient background */}
            <div className="absolute inset-0 bg-gradient-to-r from-zinc-900 via-slate-900 to-zinc-900" />
            
            {/* Subtle grid pattern */}
            <div className="absolute inset-0 bg-grid-white/[0.02]" />
          </div>

          {/* Content */}
          <div className="relative px-8 py-20 sm:px-16 sm:py-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="max-w-3xl mx-auto text-center"
            >
              <motion.h2
                className="text-4xl md:text-5xl font-bold mb-6 text-white sf-pro-display"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                Ready to Transform Your Business?
              </motion.h2>
              
              <motion.p
                className="text-xl text-gray-300 mb-10"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Get started with our AI solutions today and stay ahead of the competition
              </motion.p>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                <Link
                  to="/booking"
                  className="group relative inline-flex items-center"
                >
                  <motion.div
                    className="relative flex items-center px-8 py-4 bg-white/10 backdrop-blur-sm rounded-xl 
                              border border-white/20 hover:bg-white/15 hover:border-white/30 
                              transition-colors duration-300"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Sparkles className="w-5 h-5 mr-2 text-white" />
                    <span className="text-white font-medium">Get Started</span>
                    <ChevronRight className="ml-2 w-5 h-5 text-white group-hover:translate-x-1 transition-transform duration-300" />
                  </motion.div>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ServiceCTA;
