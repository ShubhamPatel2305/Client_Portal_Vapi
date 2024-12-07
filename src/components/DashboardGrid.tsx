import React, { useState } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { motion } from 'framer-motion';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const ResponsiveGridLayout = WidthProvider(Responsive);

interface DashboardGridProps {
  children: React.ReactNode[];
  layouts?: any;
  onLayoutChange?: (layout: any) => void;
}

export default function DashboardGrid({ children, layouts, onLayoutChange }: DashboardGridProps) {
  const [isEditing, setIsEditing] = useState(false);

  const defaultLayouts = {
    lg: children.map((_, i) => ({
      i: i.toString(),
      x: (i % 3) * 4,
      y: Math.floor(i / 3) * 4,
      w: 4,
      h: 4,
      minW: 2,
      maxW: 12,
      minH: 2,
      maxH: 8,
    })),
  };

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsEditing(!isEditing)}
        className="absolute top-4 right-4 z-10 px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-lg"
      >
        {isEditing ? 'Save Layout' : 'Edit Layout'}
      </motion.button>

      <ResponsiveGridLayout
        className="layout"
        layouts={layouts || defaultLayouts}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        rowHeight={100}
        isDraggable={isEditing}
        isResizable={isEditing}
        onLayoutChange={onLayoutChange}
        margin={[16, 16]}
      >
        {children.map((child, index) => (
          <div key={index.toString()} className="bg-white rounded-lg shadow-lg">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="h-full"
            >
              {child}
            </motion.div>
          </div>
        ))}
      </ResponsiveGridLayout>
    </div>
  );
}