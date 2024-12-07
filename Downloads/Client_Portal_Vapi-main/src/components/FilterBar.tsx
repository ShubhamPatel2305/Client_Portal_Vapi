import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Filter, Search } from 'lucide-react';

interface FilterBarProps {
  dateRange: string;
  onDateRangeChange: (range: string) => void;
  onSearch: (query: string) => void;
  additionalFilters?: React.ReactNode;
}

export default function FilterBar({
  dateRange,
  onDateRangeChange,
  onSearch,
  additionalFilters,
}: FilterBarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-sm p-4 mb-6"
    >
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search..."
              onChange={(e) => onSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Calendar className="text-gray-400 h-5 w-5" />
          <select
            value={dateRange}
            onChange={(e) => onDateRangeChange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="last7days">Last 7 Days</option>
            <option value="last30days">Last 30 Days</option>
            <option value="thisMonth">This Month</option>
            <option value="lastMonth">Last Month</option>
            <option value="custom">Custom Range</option>
          </select>
        </div>

        {additionalFilters && (
          <div className="flex items-center space-x-2">
            <Filter className="text-gray-400 h-5 w-5" />
            {additionalFilters}
          </div>
        )}
      </div>
    </motion.div>
  );
}