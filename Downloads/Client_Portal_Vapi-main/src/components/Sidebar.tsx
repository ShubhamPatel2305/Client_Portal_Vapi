import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  BarChart2,
  FileText,
  Settings,
  HelpCircle,
  Menu,
  Users,
  ChevronLeft,
  LogOut,
  User,
  ChevronUp,
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuthStore } from '../stores/auth';
import { useLayoutStore } from '../stores/layout';
import { usePageStore } from '../stores/pageStore';

interface SidebarProps {
  className?: string;
}

const sidebarVariants = {
  open: {
    width: '16rem',
    x: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30
    }
  },
  closed: {
    width: '5rem',
    x: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30
    }
  }
};

const itemVariants = {
  open: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30
    }
  },
  closed: {
    opacity: 0,
    x: -10,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30
    }
  }
};

const mobileMenuVariants = {
  open: {
    x: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30
    }
  },
  closed: {
    x: "-100%",
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30
    }
  }
};

export default function Sidebar({ className }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { isCollapsed, toggleSidebar } = useLayoutStore();
  const { setCurrentPage, shouldRefresh } = usePageStore();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuthStore();

  const navigationItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Analytics', path: '/analytics', icon: BarChart2 },
    { name: 'Reports', path: '/reports', icon: FileText },
    { name: 'Team', path: '/team', icon: Users },
    { name: 'Settings', path: '/settings', icon: Settings },
    { name: 'Support', path: '/support', icon: HelpCircle },
  ];

  // Handle mobile menu close on route change
  useEffect(() => {
    setIsMobileOpen(false);
    setIsProfileMenuOpen(false);
  }, [location.pathname]);

  // Handle mobile menu close on resize with debounce
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        if (window.innerWidth >= 768) {
          setIsMobileOpen(false);
          setIsProfileMenuOpen(false);
        }
      }, 100);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  // Handle click outside for profile menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavigation = (path: string) => {
    const pageName = path.substring(1); // Remove leading slash
    if (location.pathname !== path) {
      setCurrentPage(pageName);
      navigate(path, { replace: true });
    }
    if (window.innerWidth < 768) {
      setIsMobileOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <motion.button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className={cn(
          'fixed top-4 left-4 z-50 p-2 rounded-lg',
          'bg-white/90 backdrop-blur-lg shadow-lg md:hidden',
          'hover:bg-gray-100/90 transition-colors',
          isMobileOpen && 'bg-gray-100/90'
        )}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Menu className="w-5 h-5 text-gray-600" />
      </motion.button>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={isCollapsed ? "closed" : "open"}
        variants={window.innerWidth >= 768 ? sidebarVariants : mobileMenuVariants}
        className={cn(
          'fixed top-0 left-0 z-40 h-screen',
          'bg-white/95 backdrop-blur-xl',
          'border-r border-gray-200/50 shadow-xl',
          'transition-all duration-300 ease-in-out',
          'md:translate-x-0',
          'w-64 md:w-auto',
          'transform',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
          'touch-none',
          className
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="p-4 flex items-center justify-between border-b border-gray-200/50">
            <motion.div
              onClick={() => handleNavigation('/dashboard')}
              className="flex items-center gap-2 cursor-pointer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div 
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center flex-shrink-0"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-white font-bold text-lg">T</span>
              </motion.div>
              <AnimatePresence mode="wait">
                {(!isCollapsed || window.innerWidth < 768) && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent whitespace-nowrap"
                  >
                    TopEdge
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Toggle Button - Only show on desktop */}
            <motion.button
              onClick={toggleSidebar}
              className={cn(
                'p-2 rounded-full',
                'bg-white shadow-lg border border-gray-200/50',
                'hover:bg-gray-50/80 hover:shadow-md',
                'hidden md:flex items-center justify-center',
                'absolute -right-3 top-1/2 transform -translate-y-1/2'
              )}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <motion.div
                animate={{ rotate: isCollapsed ? 180 : 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <ChevronLeft className="w-4 h-4 text-gray-600" />
              </motion.div>
            </motion.button>

            {/* Mobile Close Button */}
            <motion.button
              onClick={() => setIsMobileOpen(false)}
              className={cn(
                'p-2 rounded-lg',
                'bg-gray-100/80 md:hidden',
                'hover:bg-gray-200/80'
              )}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </motion.button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-2 md:px-3 py-4 overflow-y-auto overscroll-contain">
            <ul className="space-y-0.5 md:space-y-1">
              {navigationItems.map((item) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;
                
                return (
                  <motion.li key={item.path}>
                    <motion.div
                      onClick={() => handleNavigation(item.path)}
                      className={cn(
                        'flex items-center gap-2 md:gap-3 px-2 md:px-3 py-2 md:py-2.5 rounded-xl cursor-pointer',
                        'transition-all duration-200 relative group',
                        'hover:bg-gradient-to-r hover:from-blue-50/80 hover:to-purple-50/80',
                        'active:from-blue-100/80 active:to-purple-100/80',
                        'touch-manipulation',
                        isActive && 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-600'
                      )}
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <motion.div 
                        className="flex-shrink-0 w-5 h-5"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Icon className={cn(
                          'w-full h-full transition-colors',
                          isActive ? 'text-blue-600' : 'text-gray-600 group-hover:text-blue-600'
                        )} />
                      </motion.div>
                      
                      <AnimatePresence mode="wait">
                        {(!isCollapsed || window.innerWidth < 768) && (
                          <motion.span
                            variants={itemVariants}
                            initial="closed"
                            animate="open"
                            exit="closed"
                            className={cn(
                              'text-sm font-medium whitespace-nowrap',
                              isActive ? 'text-blue-600' : 'text-gray-600 group-hover:text-blue-600'
                            )}
                          >
                            {item.name}
                          </motion.span>
                        )}
                      </AnimatePresence>

                      {/* Tooltip for collapsed state - Only show on desktop */}
                      {isCollapsed && window.innerWidth >= 768 && (
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 0, x: -10 }}
                          whileHover={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.2 }}
                          className={cn(
                            'absolute left-full ml-2 px-2 py-1',
                            'bg-gray-900/90 text-white text-xs rounded-lg',
                            'pointer-events-none whitespace-nowrap z-50',
                            'shadow-lg backdrop-blur-sm'
                          )}
                        >
                          {item.name}
                        </motion.div>
                      )}
                    </motion.div>
                  </motion.li>
                );
              })}
            </ul>
          </nav>

          {/* Profile Section */}
          <div className="border-t border-gray-200/50 p-2 md:p-3" ref={profileMenuRef}>
            <motion.button
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className={cn(
                'w-full flex items-center gap-2 md:gap-3 p-2 md:p-2.5 rounded-xl',
                'bg-gradient-to-r from-blue-50/50 to-purple-50/50',
                'hover:from-blue-100/50 hover:to-purple-100/50',
                'active:from-blue-200/50 active:to-purple-200/50',
                'border border-blue-100/50',
                'transition-all duration-200 shadow-sm',
                'touch-manipulation',
                'group relative'
              )}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div
                className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <User className="w-4 h-4 text-white" />
              </motion.div>
              
              <AnimatePresence mode="wait">
                {(!isCollapsed || window.innerWidth < 768) && (
                  <motion.div
                    variants={itemVariants}
                    initial="closed"
                    animate="open"
                    exit="closed"
                    className="flex-1 flex items-center justify-between"
                  >
                    <div className="flex flex-col items-start">
                      <span className="text-sm font-medium text-gray-900">
                        {user?.email?.split('@')[0] || 'User'}
                      </span>
                      <span className="text-xs text-gray-500">
                        {user?.email || 'user@example.com'}
                      </span>
                    </div>
                    <ChevronUp
                      className={cn(
                        'w-4 h-4 text-gray-500 transition-transform duration-300',
                        isProfileMenuOpen && 'rotate-180'
                      )}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Profile Menu */}
            <AnimatePresence>
              {isProfileMenuOpen && (!isCollapsed || window.innerWidth < 768) && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="absolute bottom-full left-2 md:left-3 right-2 md:right-3 mb-2 p-1.5 md:p-2 bg-white rounded-xl shadow-lg border border-gray-200/50 backdrop-blur-xl"
                >
                  <motion.button
                    onClick={() => {
                      logout();
                      navigate('/login');
                    }}
                    className={cn(
                      'w-full flex items-center gap-2 md:gap-3 px-2 md:px-3 py-2 md:py-2.5 rounded-lg text-sm',
                      'text-red-600 hover:bg-red-50',
                      'transition-colors duration-200'
                    )}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Log Out</span>
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.aside>

      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-30 md:hidden"
            onClick={() => setIsMobileOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
