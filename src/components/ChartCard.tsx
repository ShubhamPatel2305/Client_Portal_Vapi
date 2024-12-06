import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, Title, AreaChart, BarChart, DonutChart } from '@tremor/react';
import { MoreVertical } from 'lucide-react';

export interface ChartCardProps {
  title: string;
  chartData?: any[];
  chartType?: 'area' | 'bar' | 'donut';
  index?: string;
  categories?: string[];
  colors?: string[];
  children?: React.ReactNode;
  delay?: number;
  menuItems?: Array<{ label: string; action: () => void }>;
}

export default function ChartCard({ 
  title, 
  chartData = [], 
  chartType = 'area',
  index = 'date',
  categories = ['value'],
  colors = ['indigo', 'cyan', 'fuchsia', 'amber'],
  children, 
  delay = 0, 
  menuItems 
}: ChartCardProps) {
  const [showMenu, setShowMenu] = useState(false);

  const renderChart = () => {
    if (!chartData || chartData.length === 0) {
      return (
        <div className="h-72 mt-4 flex items-center justify-center text-gray-400">
          No data available
        </div>
      );
    }

    switch (chartType) {
      case 'bar':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <BarChart
              className="h-72 mt-4"
              data={chartData}
              index={index}
              categories={categories}
              colors={colors}
              showAnimation={true}
              animationDuration={1500}
              showLegend={true}
              showGridLines={false}
              startEndOnly={true}
              showXAxis={true}
              showYAxis={true}
            />
          </motion.div>
        );
      case 'donut':
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <DonutChart
              className="h-72 mt-4"
              data={chartData}
              category="value"
              index="name"
              colors={colors}
              showAnimation={true}
              animationDuration={1500}
              showLabel={true}
              valueFormatter={(value) => `${value.toFixed(1)}%`}
            />
          </motion.div>
        );
      default:
        return (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <AreaChart
              className="h-72 mt-4"
              data={chartData}
              index={index}
              categories={categories}
              colors={colors}
              showAnimation={true}
              animationDuration={1500}
              showLegend={true}
              showGridLines={false}
              startEndOnly={true}
              curveType="natural"
              showXAxis={true}
              showYAxis={true}
            />
          </motion.div>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
    >
      <Card className="relative">
        <div className="flex justify-between items-center">
          <Title>{title}</Title>
          {menuItems && (
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <MoreVertical className="w-5 h-5 text-gray-500" />
              </button>
              <AnimatePresence>
                {showMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 z-10"
                  >
                    <div className="py-1">
                      {menuItems.map((item, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            item.action();
                            setShowMenu(false);
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
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