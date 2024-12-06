import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, X } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ExportModal({ isOpen, onClose }: ExportModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-lg p-6 w-full max-w-md"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Export Report</h2>
              <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-4 border border-gray-200 rounded-lg hover:border-indigo-500 cursor-pointer">
                <div className="flex items-center">
                  <FileText className="h-6 w-6 text-indigo-600 mr-3" />
                  <div>
                    <h3 className="font-medium">PDF Report</h3>
                    <p className="text-sm text-gray-500">Export as PDF document</p>
                  </div>
                </div>
              </div>

              <div className="p-4 border border-gray-200 rounded-lg hover:border-indigo-500 cursor-pointer">
                <div className="flex items-center">
                  <FileText className="h-6 w-6 text-indigo-600 mr-3" />
                  <div>
                    <h3 className="font-medium">Excel Spreadsheet</h3>
                    <p className="text-sm text-gray-500">Export as XLSX file</p>
                  </div>
                </div>
              </div>

              <div className="p-4 border border-gray-200 rounded-lg hover:border-indigo-500 cursor-pointer">
                <div className="flex items-center">
                  <FileText className="h-6 w-6 text-indigo-600 mr-3" />
                  <div>
                    <h3 className="font-medium">CSV File</h3>
                    <p className="text-sm text-gray-500">Export as CSV file</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500"
              >
                Cancel
              </button>
              <button className="ml-3 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
                Export
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}