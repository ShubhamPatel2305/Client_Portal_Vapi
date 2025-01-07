import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  Activity,
  BarChart2,
  FileText,
  CreditCard,
  Users2,
  Settings2,
  HelpCircle,
  Menu,
  ChevronLeft,
  LogOut,
  User,
  ChevronUp,
  Bot,
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuthStore } from '../stores/auth';
import { useLayoutStore } from '../stores/layout';
import { usePageStore } from '../stores/pageStore';
import ProfileMenu from './ProfileMenu';

// Custom SVG icons with gradients
const DashboardIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5">
    <defs>
      <linearGradient id="dashboard-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#60A5FA" />
        <stop offset="100%" stopColor="#4F46E5" />
      </linearGradient>
    </defs>
    <path fill="url(#dashboard-gradient)" d="M2.5 4a2 2 0 012-2h15a2 2 0 012 2v16a2 2 0 01-2 2h-15a2 2 0 01-2-2V4zm2 2v12h11V6h-11zm13 0v12h2V6h-2zM5.5 8h7v2h-7V8zm0 4h7v2h-7v-2z" />
  </svg>
);

const AnalyticsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5">
    <defs>
      <linearGradient id="analytics-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#34D399" />
        <stop offset="100%" stopColor="#0D9488" />
      </linearGradient>
    </defs>
    <path fill="url(#analytics-gradient)" d="M3 13.5a1.5 1.5 0 113 0v5.25a1.5 1.5 0 01-3 0v-5.25zm6-6.75a1.5 1.5 0 113 0v12a1.5 1.5 0 01-3 0v-12zm6-3a1.5 1.5 0 113 0v15a1.5 1.5 0 01-3 0v-15z" />
  </svg>
);

const VapiAnalyticsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5">
    <defs>
      <linearGradient id="vapi-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#34D399" />
        <stop offset="100%" stopColor="#0D9488" />
      </linearGradient>
    </defs>
    <path fill="url(#vapi-gradient)" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-6a2 2 0 100-4 2 2 0 000 4z" />
    <path fill="url(#vapi-gradient)" d="M12 7v3m0 4v3m-5-5h3m4 0h3" strokeWidth="1.5" />
  </svg>
);

const ReportsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5">
    <defs>
      <linearGradient id="reports-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#F59E0B" />
        <stop offset="100%" stopColor="#EA580C" />
      </linearGradient>
    </defs>
    <path fill="url(#reports-gradient)" d="M8 3a2 2 0 00-2 2v3h12V5a2 2 0 00-2-2H8zm10 7H6v9a2 2 0 002 2h8a2 2 0 002-2v-9zM7 14a1 1 0 011-1h8a1 1 0 110 2H8a1 1 0 01-1-1zm0 3a1 1 0 011-1h8a1 1 0 110 2H8a1 1 0 01-1-1z" />
  </svg>
);

const BillingIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5">
    <defs>
      <linearGradient id="billing-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#10B981" />
        <stop offset="100%" stopColor="#059669" />
      </linearGradient>
    </defs>
    <path fill="url(#billing-gradient)" d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2zm-5 9h4v-2h-4v2z" />
  </svg>
);

const TeamIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5">
    <defs>
      <linearGradient id="team-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#EC4899" />
        <stop offset="100%" stopColor="#BE185D" />
      </linearGradient>
    </defs>
    <path fill="url(#team-gradient)" d="M12 4a4 4 0 100 8 4 4 0 000-8zM6 8a2 2 0 100 4 2 2 0 000-4zm12 0a2 2 0 100 4 2 2 0 000-4zM4 17a3 3 0 013-3h10a3 3 0 013 3v3H4v-3zm-2-3a2 2 0 114 0v4H2v-4zm18 0a2 2 0 114 0v4h-4v-4z" />
  </svg>
);

const SettingsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5">
    <defs>
      <linearGradient id="settings-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#06B6D4" />
        <stop offset="100%" stopColor="#0284C7" />
      </linearGradient>
    </defs>
    <path fill="url(#settings-gradient)" d="M19.5 12c0-.23-.01-.45-.03-.68l1.86-1.41c.4-.3.51-.86.26-1.3l-1.87-3.23a.987.987 0 00-1.25-.42l-2.15.91c-.37-.26-.76-.49-1.17-.68l-.29-2.31c-.06-.5-.49-.88-.99-.88h-3.73c-.51 0-.94.38-1 .88l-.29 2.31c-.41.19-.8.42-1.17.68l-2.15-.91c-.46-.2-1-.02-1.25.42L2.41 8.62c-.25.44-.14.99.26 1.3l1.86 1.41a7.343 7.343 0 000 1.35l-1.86 1.41c-.4.3-.51.86-.26 1.3l1.87 3.23c.25.44.79.62 1.25.42l2.15-.91c.37.26.76.49 1.17.68l.29 2.31c.06.5.49.88.99.88h3.73c.5 0 .93-.38.99-.88l.29-2.31c.41-.19.8-.42 1.17-.68l2.15.91c.46.2 1 .02 1.25-.42l1.87-3.23c.25-.44.14-.99-.26-1.3l-1.86-1.41c.03-.23.04-.45.04-.68zm-7.46 3.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z" />
  </svg>
);

const SupportIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5">
    <defs>
      <linearGradient id="support-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#D946EF" />
        <stop offset="100%" stopColor="#DB2777" />
      </linearGradient>
    </defs>
    <path fill="url(#support-gradient)" d="M12 2C6.477 2 2 6.477 2 12c0 1.82.487 3.53 1.338 5L2 22l5-1.338A9.96 9.96 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zM8 13a1 1 0 110-2 1 1 0 010 2zm4 0a1 1 0 110-2 1 1 0 010 2zm4 0a1 1 0 110-2 1 1 0 010 2z" />
  </svg>
);

const navigationItems = [
  {
    name: 'Dashboard',
    path: '/',
    icon: DashboardIcon,
    iconColor: 'from-blue-500 to-indigo-600',
    bgColor: 'from-blue-100/50 to-indigo-100/50'
  },
  {
    name: 'Ai Agent',
    path: '/vapi',
    icon: VapiAnalyticsIcon,
    iconColor: 'from-blue-500 to-cyan-600',
    bgColor: 'from-blue-100/50 to-cyan-100/50'
  },
  {
    name: 'Analytics',
    path: '/analytics',
    icon: AnalyticsIcon,
    iconColor: 'from-purple-500 to-violet-600',
    bgColor: 'from-purple-100/50 to-violet-100/50'
  },
  {
    name: 'Reports',
    path: '/reports',
    icon: ReportsIcon,
    iconColor: 'from-amber-500 to-orange-600',
    bgColor: 'from-amber-100/50 to-orange-100/50'
  },
  {
    name: 'Billing',
    path: '/billing',
    icon: BillingIcon,
    iconColor: 'from-green-500 to-emerald-600',
    bgColor: 'from-green-100/50 to-emerald-100/50'
  },
  {
    name: 'Team',
    path: '/team',
    icon: TeamIcon,
    iconColor: 'from-pink-500 to-rose-600',
    bgColor: 'from-pink-100/50 to-rose-100/50'
  },
  {
    name: 'Settings',
    path: '/settings',
    icon: SettingsIcon,
    iconColor: 'from-cyan-500 to-blue-600',
    bgColor: 'from-cyan-100/50 to-blue-100/50'
  },
  {
    name: 'Support',
    path: '/support',
    icon: SupportIcon,
    iconColor: 'from-fuchsia-500 to-pink-600',
    bgColor: 'from-fuchsia-100/50 to-pink-100/50'
  },
];

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
                      <div className={cn(
                        "nav-icon p-1.5 rounded-lg bg-gradient-to-br",
                        isActive ? item.bgColor : 'from-gray-50 to-gray-100/80',
                        "transition-all duration-300 hover:scale-105"
                      )}>
                        <Icon className={cn(
                          'w-5 h-5 transition-colors',
                          isActive 
                            ? `bg-gradient-to-r ${item.iconColor} bg-clip-text text-transparent` 
                            : 'text-gray-500 group-hover:text-blue-500'
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
                              isActive 
                                ? `bg-gradient-to-r ${item.iconColor} bg-clip-text text-transparent` 
                                : 'text-gray-500'
                            )}
                          >
                            {item.name}
                          </motion.span>
                        )}
                      </AnimatePresence>

                      {isCollapsed && window.innerWidth >= 768 && (
                        <div className={cn(
                          "nav-tooltip",
                          "bg-gradient-to-r",
                          item.bgColor,
                          "text-gray-800 font-medium"
                        )}>
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
