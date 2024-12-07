import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, Title, AreaChart, BarChart, DonutChart } from '@tremor/react';
import { MoreVertical } from 'lucide-react';

export interface ChartCardProps {
  title: string;
  data?: any[];
  type?: string;
  chartData?: any[];
  chartType?: 'area' | 'bar' | 'donut';
  index?: string;
  categories?: string[];
  colors?: string[];
  children?: React.ReactNode;
  delay?: number;
  menuItems?: Array<{ label: string; action: () => void }>;
  loading?: boolean;
}

export default function ChartCard({ 
  title, 
  data = [], 
  type = 'area', 
  chartData = [], 
  chartType = 'area',
  index = 'date',
  categories = ['value'],
  colors = ['indigo', 'cyan', 'fuchsia', 'amber'],
  children, 
  delay = 0, 
  menuItems,
  loading = false
}: ChartCardProps) {
  const [showMenu, setShowMenu] = useState(false);

  const renderChart = () => {
    const chartDataToUse = data.length > 0 ? data : chartData;
    const chartTypeToUse = type || chartType;

    if (loading) {
      return (
        <div className="h-72 mt-4 flex items-center justify-center text-gray-400">
          Loading...
        </div>
      );
    }

    if (!chartDataToUse || chartDataToUse.length === 0) {
      return (
        <div className="h-72 mt-4 flex items-center justify-center text-gray-400">
          No data available
        </div>
      );
    }

    switch (chartTypeToUse) {
      case 'bar':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <BarChart
              className="h-72 mt-4"
              data={chartDataToUse}
              index={index}
              categories={categories}
              colors={colors}
            />
          </motion.div>
        );
      case 'donut':
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <DonutChart
              className="h-72 mt-4"
              data={chartDataToUse}
              category="value"
              index="name"
              colors={colors}
            />
          </motion.div>
        );
      default:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <AreaChart
              className="h-72 mt-4"
              data={chartDataToUse}
              index={index}
              categories={categories}
              colors={colors}
            />
          </motion.div>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay }}
      className="relative"
    >
      <Card>
        <div className="flex justify-between items-center">
          <Title>{title}</Title>
          {menuItems && menuItems.length > 0 && (
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <MoreVertical className="h-5 w-5 text-gray-500" />
              </button>
              <AnimatePresence>
                {showMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 z-10"
                  >
                    {menuItems.map((item, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          item.action();
                          setShowMenu(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                      >
                        {item.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
        {renderChart()}
        {children}
      </Card>
    </motion.div>
  );
}