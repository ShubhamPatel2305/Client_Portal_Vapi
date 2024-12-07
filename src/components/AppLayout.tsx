import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import Sidebar from './Sidebar';
import { cn } from '../lib/utils';
import { useLayoutStore } from '../stores/layout';

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const { isCollapsed } = useLayoutStore();

  return (
    <div className="flex min-h-screen bg-gray-50/50">
      <Sidebar />
      
      {/* Main Content */}
      <motion.main 
        className={cn(
          'flex-1',
          'transition-all duration-300 ease-in-out',
          isCollapsed ? 'ml-[5rem]' : 'ml-64',
          'px-6 py-6'
        )}
        layout
      >
        <motion.div 
          className="h-full max-w-[1600px] mx-auto"
          layout
        >
          {children}
        </motion.div>
      </motion.main>
    </div>
  );
}
