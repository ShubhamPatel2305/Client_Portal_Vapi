import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronRight, Brain } from 'lucide-react';
import Logo from './Logo';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/services', label: 'Services' },
    { path: '/pricing', label: 'Pricing' },
    { path: '/contact', label: 'Contact' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setScrolled(offset > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const containerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.2
      }
    }
  };

  const mobileMenuVariants = {
    hidden: { 
      opacity: 0,
      x: '100%',
      scale: 0.95,
      rotate: 5
    },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
        staggerChildren: 0.1
      }
    },
    exit: {
      opacity: 0,
      x: '100%',
      scale: 0.95,
      rotate: -5,
      transition: {
        duration: 0.3
      }
    }
  };

  const menuItemVariants = {
    hidden: { 
      opacity: 0,
      x: 50,
      rotate: 5
    },
    visible: {
      opacity: 1,
      x: 0,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    },
    exit: {
      opacity: 0,
      x: 50,
      rotate: -5
    }
  };

  return (
    <>
      <motion.nav
        className={`fixed w-full z-50 transition-all duration-300 ${
          scrolled ? 'py-3 bg-black/80 backdrop-blur-xl border-b border-white/10' : 'py-5 bg-transparent'
        }`}
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link to="/" className="relative group md:block hidden">
              <Logo />
            </Link>
            
            {/* Mobile Logo Text */}
            <Link to="/" className="md:hidden block">
              <span className="text-xl font-bold text-white">TopEdge</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <motion.div
                  key={item.path}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to={item.path}
                    className={`relative group px-4 py-2 ${
                      location.pathname === item.path
                        ? 'text-white'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <span className="relative z-10">{item.label}</span>
                    {location.pathname === item.path && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-violet-600/10 to-indigo-600/10 rounded-lg"
                        layoutId="navBackground"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-violet-500 to-indigo-500 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
                    />
                  </Link>
                </motion.div>
              ))}
              
              {/* Book Appointment Button */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  to="/booking"
                  className="relative inline-flex items-center px-6 py-2.5 rounded-lg
                    bg-white/10 backdrop-blur-sm border border-white/20
                    hover:bg-white/15 hover:border-white/30
                    text-white font-medium
                    transition-all duration-300
                    group"
                >
                  <span className="relative z-10">Book Appointment</span>
                  <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </motion.div>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              className="md:hidden relative z-50 p-2 rounded-lg bg-black/50 backdrop-blur-xl border border-white/10"
              onClick={() => setIsOpen(!isOpen)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <AnimatePresence mode="wait">
                {isOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="w-6 h-6 text-white" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="w-6 h-6 text-white" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-40 md:hidden"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={mobileMenuVariants}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/90 backdrop-blur-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

            {/* Menu Content */}
            <motion.div
              className="absolute right-0 top-0 bottom-0 w-80 bg-black/95 backdrop-blur-xl border-l border-white/10 p-8"
              variants={mobileMenuVariants}
            >
              {/* Mobile Menu Header */}
              <div className="flex items-center justify-between mb-8">
                <motion.div
                  variants={menuItemVariants}
                  className="flex items-center space-x-2"
                >
                  <div className="relative">
                    <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 opacity-50 blur" />
                    <div className="relative bg-black rounded-lg p-1.5">
                      <Brain className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-lg font-bold bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
                      TopEdge
                    </span>
                  </div>
                </motion.div>
              </div>

              <div className="flex flex-col space-y-6">
                {navItems.map((item) => (
                  <motion.div
                    key={item.path}
                    variants={menuItemVariants}
                  >
                    <Link
                      to={item.path}
                      className={`relative group block py-3 px-4 rounded-lg ${
                        location.pathname === item.path
                          ? 'text-white bg-gradient-to-r from-violet-600/10 to-indigo-600/10'
                          : 'text-gray-400 hover:text-white'
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      <motion.span
                        className="relative z-10 block"
                        whileHover={{ x: 10 }}
                        transition={{ duration: 0.2 }}
                      >
                        {item.label}
                      </motion.span>
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-violet-500 to-indigo-500 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
                      />
                    </Link>
                  </motion.div>
                ))}

                {/* Mobile Book Appointment Button */}
                <motion.div
                  variants={menuItemVariants}
                  className="pt-4"
                >
                  <Link
                    to="/booking"
                    className="relative group block"
                    onClick={() => setIsOpen(false)}
                  >
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-lg opacity-70 blur group-hover:opacity-100 transition duration-300" />
                    <div className="relative p-4 bg-black rounded-lg flex items-center justify-between border border-white/10 group-hover:border-white/20">
                      <span className="text-white">Book Appointment</span>
                      <motion.div
                        animate={{
                          x: [0, 5, 0],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        <ChevronRight className="w-5 h-5 text-white" />
                      </motion.div>
                    </div>
                  </Link>
                </motion.div>
              </div>

              {/* Mobile Menu Footer */}
              <motion.div
                className="absolute bottom-8 left-8 right-8"
                variants={menuItemVariants}
              >
                <div className="p-4 rounded-xl bg-gradient-to-r from-violet-600/10 to-indigo-600/10 backdrop-blur-xl border border-white/10">
                  <p className="text-sm text-gray-400 text-center">
                    Stay ahead with TopEdge
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;

