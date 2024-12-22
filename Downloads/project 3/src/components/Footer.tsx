import { motion } from 'framer-motion';
import { Facebook, Instagram, Twitter, Linkedin, Mail, Phone, MapPin, ExternalLink } from 'lucide-react';

export default function Footer() {
  const quickLinks = [
    { name: 'About Us', href: '/about' },
    { name: 'Services', href: '/services' },
    { name: 'Contact', href: '/contact' },
    { name: 'Booking', href: '/booking' },
  ];

  const services = [
    'AI Consulting',
    'Machine Learning',
    'Data Analytics',
    'Neural Networks',
  ];

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
  ];

  const contactInfo = [
    { icon: Phone, text: '(123) 456 7890', href: 'tel:+11234567890' },
    { icon: Mail, text: 'hello@reallygreatsite.com', href: 'mailto:hello@reallygreatsite.com' },
    { icon: MapPin, text: 'Silicon Valley, CA', href: '#' },
  ];

  return (
    <footer className="relative border-t border-gray-800 bg-black/90">
      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 md:gap-12">
          {/* Company Info */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4 sm:space-y-6"
          >
            <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              NeuralFlow AI
            </h3>
            <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
              Pioneering the future of artificial intelligence with cutting-edge solutions and innovative technologies.
            </p>
            <div className="flex space-x-3 sm:space-x-4">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-gray-400 hover:text-white transition-colors p-1 sm:p-0"
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-4 sm:space-y-6"
          >
            <h4 className="text-base sm:text-lg font-semibold text-white">Quick Links</h4>
            <ul className="space-y-2 sm:space-y-3">
              {quickLinks.map((link) => (
                <motion.li key={link.name}>
                  <motion.a
                    href={link.href}
                    className="text-gray-400 hover:text-white flex items-center space-x-1 group transition-colors text-sm sm:text-base"
                    whileHover={{ x: 5 }}
                  >
                    <span>{link.name}</span>
                    <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </motion.a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Services */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-4 sm:space-y-6"
          >
            <h4 className="text-base sm:text-lg font-semibold text-white">Services</h4>
            <ul className="space-y-2 sm:space-y-3">
              {services.map((service) => (
                <motion.li 
                  key={service}
                  className="text-gray-400 hover:text-white cursor-pointer text-sm sm:text-base"
                  whileHover={{ x: 5 }}
                >
                  {service}
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="space-y-4 sm:space-y-6"
          >
            <h4 className="text-base sm:text-lg font-semibold text-white">Contact Us</h4>
            <ul className="space-y-3 sm:space-y-4">
              {contactInfo.map((item) => (
                <motion.li key={item.text}>
                  <motion.a
                    href={item.href}
                    className="flex items-center space-x-2 sm:space-x-3 text-gray-400 hover:text-white group transition-colors text-sm sm:text-base"
                    whileHover={{ x: 5 }}
                  >
                    <item.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>{item.text}</span>
                  </motion.a>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Copyright */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8 sm:mt-10 md:mt-12 pt-6 sm:pt-8 border-t border-gray-800"
        >
          <p className="text-center text-gray-400 text-xs sm:text-sm">
            &copy; {new Date().getFullYear()} NeuralFlow AI. All rights reserved.
          </p>
        </motion.div>
      </div>
    </footer>
  );
}