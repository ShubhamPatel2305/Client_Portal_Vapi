import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  BarChart2,
  FileText,
  Users,
  Settings,
  HelpCircle,
  Menu,
  X,
  ChevronRight,
  LogOut,
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuthStore } from '../stores/auth';

interface NavItem {
  title: string;
  path: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { title: 'Dashboard', path: '/', icon: LayoutDashboard },
  { title: 'Analytics', path: '/analytics', icon: BarChart2 },
  { title: 'Reports', path: '/reports', icon: FileText },
  { title: 'Team', path: '/team', icon: Users },
  { title: 'Settings', path: '/settings', icon: Settings },
  { title: 'Support', path: '/support', icon: HelpCircle },
];

interface SidebarProps {
  className?: string;
}

export default function Sidebar({ className }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleSignOut = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setIsCollapsed(true);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        type="button"
        aria-label="Toggle Menu"
        className="fixed top-4 right-4 z-50 p-2 rounded-lg bg-white shadow-md md:hidden"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? (
          <X className="w-6 h-6 text-gray-600" />
        ) : (
          <Menu className="w-6 h-6 text-gray-600" />
        )}
      </button>

      <div className="flex h-screen overflow-hidden">
        {/* Mobile Overlay */}
        <AnimatePresence>
          {isMobileOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/20 z-40 md:hidden"
              onClick={() => setIsMobileOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* Sidebar */}
        <motion.aside
          className={cn(
            'fixed md:sticky top-0 left-0 z-40 h-screen shrink-0',
            'bg-white border-r border-gray-200 shadow-lg',
            'transition-all duration-300 ease-in-out',
            isCollapsed ? 'w-20' : 'w-64',
            isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
            className
          )}
          initial={false}
        >
          <div className="flex flex-col h-full">
            {/* Logo Section */}
            <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
              <AnimatePresence mode="wait">
                {!isCollapsed && (
                  <motion.span
                    key="logo"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-xl font-semibold text-gray-800 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
                  >
                    Dashboard
                  </motion.span>
                )}
              </AnimatePresence>
              <button
                type="button"
                aria-label="Toggle Sidebar"
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="p-2 rounded-lg hover:bg-blue-50 hidden md:block transition-colors"
              >
                <ChevronRight
                  className={cn(
                    'w-5 h-5 text-blue-600 transition-transform duration-300',
                    isCollapsed ? 'rotate-0' : 'rotate-180'
                  )}
                />
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex flex-col gap-1 p-3 flex-grow">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      'flex items-center gap-2 px-3 py-2.5 rounded-lg transition-all duration-200 relative group',
                      'hover:bg-blue-50 active:bg-blue-100',
                      isActive ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-blue-600'
                    )}
                  >
                    <Icon className={cn(
                      'w-5 h-5 shrink-0 transition-transform duration-200',
                      'group-hover:scale-110'
                    )} />
                    <AnimatePresence mode="wait">
                      {!isCollapsed && (
                        <motion.span
                          key={item.path}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          className="text-sm font-medium"
                        >
                          {item.title}
                        </motion.span>
                      )}
                    </AnimatePresence>
                    {isActive && (
                      <motion.div
                        className="absolute inset-y-0 left-0 w-1 bg-blue-600 rounded-r"
                        layoutId="activeTab"
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 30
                        }}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Profile and Sign Out Section */}
            <div className="border-t border-gray-200 p-3 space-y-2 bg-gradient-to-b from-white to-blue-50">
              {/* User Profile */}
              <div className={cn(
                'flex items-center gap-3 p-2 rounded-lg',
                'bg-white hover:bg-blue-50 transition-colors shadow-sm'
              )}>
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-medium shadow-inner">
                  {user?.email?.[0]?.toUpperCase() || 'U'}
                </div>
                <AnimatePresence mode="wait">
                  {!isCollapsed && (
                    <motion.div
                      key="profile"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex-1 min-w-0"
                    >
                      <div className="text-sm font-medium text-gray-900 truncate">
                        {user?.email || 'User'}
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        View Profile
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Sign Out Button */}
              <button
                onClick={handleSignOut}
                className={cn(
                  'w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200',
                  'text-red-600 hover:bg-red-50 hover:text-red-700',
                  'group'
                )}
              >
                <LogOut className={cn(
                  'w-5 h-5 transition-transform duration-200',
                  'group-hover:rotate-12'
                )} />
                {!isCollapsed && (
                  <span className="text-sm font-medium">Sign Out</span>
                )}
              </button>
            </div>
          </div>
        </motion.aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0 overflow-auto">
          <div className="p-6">
            {/* Your page content goes here */}
          </div>
        </main>
      </div>
    </>
  );
}
