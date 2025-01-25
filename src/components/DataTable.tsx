import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { List } from 'react-virtualized';
import { ChevronDown, ChevronUp, Search } from 'lucide-react';

interface Column<T> {
  key: keyof T;
  header: string;
  width?: number;
  render?: (value: any, item: T) => React.ReactNode;
  sortable?: boolean;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  rowHeight?: number;
  maxHeight?: number;
  onRowClick?: (item: T) => void;
}

export default function DataTable<T>({
  data,
  columns,
  rowHeight = 50,
  maxHeight = 400,
  onRowClick,
}: DataTableProps<T>) {
  const [sortConfig, setSortConfig] = useState<{
    key: keyof T;
    direction: 'asc' | 'desc';
  } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRow, setSelectedRow] = useState<number | null>(null);

  const handleSort = (key: keyof T) => {
    setSortConfig((current) => ({
      key,
      direction:
        current?.key === key && current.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const sortedData = React.useMemo(() => {
    let sortedItems = [...data];
    if (sortConfig) {
      sortedItems.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    if (searchTerm) {
      sortedItems = sortedItems.filter((item: T) =>
        Object.values(item as Record<keyof T, unknown>).some((value) =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
    return sortedItems;
  }, [data, sortConfig, searchTerm]);

  const rowRenderer = ({ index, key, style }: any) => {
    const item = sortedData[index];
    return (
      <motion.div
        key={key}
        style={style}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
        onClick={() => {
          setSelectedRow(index);
          onRowClick?.(item);
        }}
        className={`flex items-center px-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors ${
          selectedRow === index ? 'bg-indigo-50' : ''
        }`}
      >
        {columns.map((column) => (
          <div
            key={String(column.key)}
            style={{ width: column.width || 150 }}
            className="truncate"
          >
            {column.render
              ? column.render(item[column.key], item)
              : String(item[column.key])}
          </div>
        ))}
      </motion.div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      <div className="flex px-4 py-2 bg-gray-50 border-b border-gray-200">
        {columns.map((column) => (
          <div
            key={String(column.key)}
            style={{ width: column.width || 150 }}
            className={`font-medium text-gray-700 ${
              column.sortable ? 'cursor-pointer' : ''
            }`}
            onClick={() => column.sortable && handleSort(column.key)}
          >
            <div className="flex items-center space-x-1">
              <span>{column.header}</span>
              {column.sortable && (
                <div className="flex flex-col">
                  <ChevronUp
                    className={`h-3 w-3 ${
                      sortConfig?.key === column.key &&
                      sortConfig.direction === 'asc'
                        ? 'text-indigo-600'
                        : 'text-gray-400'
                    }`}
                  />
                  <ChevronDown
                    className={`h-3 w-3 ${
                      sortConfig?.key === column.key &&
                      sortConfig.direction === 'desc'
                        ? 'text-indigo-600'
                        : 'text-gray-400'
                    }`}
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <List
        width={1200}
        height={maxHeight}
        rowHeight={rowHeight}
        rowCount={sortedData.length}
        rowRenderer={rowRenderer}
        overscanRowCount={5}
      />
    </div>
  );
}