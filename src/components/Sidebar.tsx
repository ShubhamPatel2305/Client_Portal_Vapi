import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  LineChart,
  FileText,
  Settings,
  HelpCircle,
  Menu,
  Users,
  ChevronLeft,
  LogOut,
  User,
  ChevronUp,
  BarChart3,
  DollarSign,
  Bot,
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuthStore } from '../stores/auth';
import { useLayoutStore } from '../stores/layout';
import { usePageStore } from '../stores/pageStore';
import ProfileMenu from './ProfileMenu';

interface SidebarProps {
  className?: string;
}

const sidebarVariants = {
  open: {
    width: "var(--sidebar-width)",
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1],
      type: "tween"
    }
  },
  closed: {
    width: "var(--sidebar-collapsed-width)",
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1],
      type: "tween"
    }
  }
};

const itemVariants = {
  open: {
    opacity: 1,
    x: 0,
    display: "block",
    transition: {
      duration: 0.2,
      ease: "easeOut"
    }
  },
  closed: {
    opacity: 0,
    x: -4,
    transitionEnd: {
      display: "none"
    },
    transition: {
      duration: 0.2,
      ease: "easeIn"
    }
  }
};

const mobileMenuVariants = {
  open: {
    x: 0,
    transition: {
      duration: 0.2,
      ease: "easeOut"
    }
  },
  closed: {
    x: "-100%",
    transition: {
      duration: 0.2,
      ease: "easeIn"
    }
  }
};

export default function Sidebar({ className }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { isCollapsed, toggleSidebar } = useLayoutStore();
  const { setCurrentPage } = usePageStore();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuthStore();

  const navigationItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Vapi Analytics', path: '/vapi', icon: LineChart },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'Reports', path: '/reports', icon: FileText },
    { name: 'Billing', path: '/billing', icon: DollarSign },
    { name: 'AI Calling', path: '/ai-calling', icon: Bot },
    { name: 'Team', path: '/team', icon: Users },
    { name: 'Settings', path: '/settings', icon: Settings },
    { name: 'Support', path: '/support', icon: HelpCircle },
  ];

  useEffect(() => {
    setIsMobileOpen(false);
    setIsProfileMenuOpen(false);
  }, [location.pathname]);

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
    const pageName = path.substring(1);
    if (location.pathname !== path) {
      setCurrentPage(pageName);
      navigate(path, { replace: true });
    }
    if (window.innerWidth < 768) {
      setIsMobileOpen(false);
    }
  };

  const firstName = user?.displayName?.split(' ')[0] || user?.email?.split('@')[0] || '';

  return (
    <>
      <style>
        {`
          :root {
            --sidebar-width: 16rem;
            --sidebar-collapsed-width: 5rem;
            --sidebar-duration: 0.3s;
          }

          @media (max-width: 768px) {
            :root {
              --sidebar-width: 16rem;
              --sidebar-collapsed-width: 0rem;
            }
          }

          .sidebar-content {
            width: var(--sidebar-width);
            transition: width var(--sidebar-duration) ease;
          }

          .sidebar-collapsed .sidebar-content {
            width: var(--sidebar-collapsed-width);
          }

          .nav-item {
            position: relative;
            transition: all var(--sidebar-duration) ease;
          }

          .nav-item:hover {
            transform: translateX(4px);
          }

          .nav-icon {
            min-width: 1.5rem;
            min-height: 1.5rem;
            transition: transform var(--sidebar-duration) ease;
          }

          .nav-text {
            transition: opacity var(--sidebar-duration) ease, transform var(--sidebar-duration) ease;
          }

          .sidebar-collapsed .nav-icon {
            transform: scale(1.1);
          }

          .nav-tooltip {
            position: absolute;
            left: calc(100% + 1rem);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 0.5rem;
            border-radius: 0.5rem;
            font-size: 0.875rem;
            opacity: 0;
            transform: translateX(-0.5rem);
            pointer-events: none;
            transition: all 0.2s ease;
            white-space: nowrap;
            z-index: 50;
          }

          .sidebar-collapsed .nav-item:hover .nav-tooltip {
            opacity: 1;
            transform: translateX(0);
          }
        `}
      </style>

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

      <motion.aside
        initial={false}
        animate={isCollapsed ? "closed" : "open"}
        variants={window.innerWidth >= 768 ? sidebarVariants : mobileMenuVariants}
        className={cn(
          'sidebar fixed top-0 left-0 z-40 h-screen',
          'bg-white/95 backdrop-blur-xl',
          'border-r border-gray-200/50',
          'transition-[box-shadow] duration-150',
          'md:translate-x-0',
          'transform',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
          'touch-none',
          isCollapsed ? 'shadow-sm sidebar-collapsed' : 'shadow-xl',
          className
        )}
        style={{
          width: isCollapsed ? 'var(--sidebar-collapsed-width)' : 'var(--sidebar-width)'
        }}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 flex items-center justify-between border-b border-gray-200/50">
            <motion.div
              onClick={() => handleNavigation('/')}
              className="flex items-center gap-3 cursor-pointer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <img 
                src="/src/assets/Logo asset 4.png" 
                alt="Logo" 
                className="w-10 h-10 object-contain transition-transform duration-300"
                style={{
                  transform: isCollapsed ? 'scale(0.9)' : 'scale(1)'
                }}
              />
              <AnimatePresence mode="wait">
                {(!isCollapsed || window.innerWidth < 768) && (
                  <motion.span
                    variants={itemVariants}
                    initial="closed"
                    animate="open"
                    exit="closed"
                    className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent whitespace-nowrap"
                  >
                    TopEdge
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.div>

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
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <ChevronLeft className="w-4 h-4 text-gray-600" />
              </motion.div>
            </motion.button>

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

          <nav className="flex-1 px-2 md:px-3 py-4 overflow-y-auto overscroll-contain">
            <ul className="space-y-1">
              {navigationItems.map((item) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;
                
                return (
                  <motion.li key={item.path} className="nav-item">
                    <motion.div
                      onClick={() => handleNavigation(item.path)}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer',
                        'transition-colors duration-200',
                        'hover:bg-gradient-to-r hover:from-blue-50/80 hover:to-purple-50/80',
                        'active:from-blue-100/80 active:to-purple-100/80',
                        'touch-manipulation',
                        isActive && 'bg-gradient-to-r from-blue-50 to-purple-50'
                      )}
                    >
                      <div className="nav-icon">
                        <Icon className={cn(
                          'w-5 h-5 transition-colors',
                          isActive ? 'text-blue-600' : 'text-gray-600 group-hover:text-blue-600'
                        )} />
                      </div>
                      
                      <AnimatePresence mode="wait">
                        {(!isCollapsed || window.innerWidth < 768) && (
                          <motion.span
                            variants={itemVariants}
                            initial="closed"
                            animate="open"
                            exit="closed"
                            className={cn(
                              'nav-text text-sm font-medium whitespace-nowrap',
                              isActive ? 'text-blue-600' : 'text-gray-600'
                            )}
                          >
                            {item.name}
                          </motion.span>
                        )}
                      </AnimatePresence>

                      {isCollapsed && window.innerWidth >= 768 && (
                        <div className="nav-tooltip">
                          {item.name}
                        </div>
                      )}
                    </motion.div>
                  </motion.li>
                );
              })}
            </ul>
          </nav>

          <div
            ref={profileMenuRef}
            className={cn(
              "relative mt-auto border-t border-gray-200",
              isCollapsed && "border-transparent"
            )}
          >
            <motion.button
              className={cn(
                "w-full p-3 flex items-center space-x-3 hover:bg-gray-50 transition-all duration-200",
                isProfileMenuOpen && "bg-gray-50"
              )}
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                {user?.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={firstName}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <User className="w-4 h-4 text-white" />
                )}
              </div>
              <motion.div
                variants={itemVariants}
                animate={isCollapsed ? "closed" : "open"}
                className="flex-grow min-w-0"
              >
                <div className="flex items-center justify-between">
                  <div className="truncate">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {firstName}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {user?.email}
                    </p>
                  </div>
                  <motion.div
                    animate={{ rotate: isProfileMenuOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronUp className="w-4 h-4 text-gray-500" />
                  </motion.div>
                </div>
              </motion.div>
            </motion.button>

            {/* Profile Menu */}
            <ProfileMenu
              isOpen={isProfileMenuOpen}
              onClose={() => setIsProfileMenuOpen(false)}
              firstName={firstName}
            />
          </div>
        </div>
      </motion.aside>
    </>
  );
}
