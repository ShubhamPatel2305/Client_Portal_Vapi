import type { FC } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, X, FileSpreadsheet, FileDown } from 'lucide-react';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: any;
}

export default function ExportModal({ isOpen, onClose, data }: ExportModalProps) {
  const exportToPDF = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.text('Dashboard Report', 20, 20);
    
    // Add timestamp
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, 30);
    
    // Add statistics
    if (data) {
      const stats = [
        ['Total Call Minutes', data.totalCallMinutes.toFixed(1)],
        ['Number of Calls', data.numberOfCalls.toString()],
        ['Total Spent', `$${data.totalSpent.toFixed(2)}`],
        ['Average Cost per Call', `$${data.avgCostPerCall.toFixed(2)}`]
      ];
      
      (doc as any).autoTable({
        startY: 40,
        head: [['Metric', 'Value']],
        body: stats,
        theme: 'grid'
      });
    }
    
    doc.save('dashboard-report.pdf');
  };

  const exportToExcel = () => {
    if (!data) return;

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet([{
      'Total Call Minutes': data.totalCallMinutes,
      'Number of Calls': data.numberOfCalls,
      'Total Spent': data.totalSpent,
      'Average Cost per Call': data.avgCostPerCall
    }]);
    
    XLSX.utils.book_append_sheet(wb, ws, 'Dashboard');
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const dataBlob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(dataBlob, 'dashboard-report.xlsx');
  };

  const exportToCSV = () => {
    if (!data) return;

    const csvContent = [
      ['Metric', 'Value'],
      ['Total Call Minutes', data.totalCallMinutes],
      ['Number of Calls', data.numberOfCalls],
      ['Total Spent', data.totalSpent],
      ['Average Cost per Call', data.avgCostPerCall]
    ].map(row => row.join(',')).join('\\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, 'dashboard-report.csv');
  };

  return (
    <AnimatePresence >
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
            className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl z-50"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Export Report
              </h2>
              <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="p-4 border border-gray-200 rounded-xl hover:border-purple-500 cursor-pointer transition-colors shadow-sm hover:shadow-md"
                onClick={exportToPDF}
              >
                <div className="flex items-center">
                  <FileText className="h-6 w-6 text-purple-600 mr-3" />
                  <div>
                    <h3 className="font-medium">PDF Report</h3>
                    <p className="text-sm text-gray-500">Export as PDF document</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="p-4 border border-gray-200 rounded-xl hover:border-purple-500 cursor-pointer transition-colors shadow-sm hover:shadow-md"
                onClick={exportToExcel}
              >
                <div className="flex items-center">
                  <FileSpreadsheet className="h-6 w-6 text-purple-600 mr-3" />
                  <div>
                    <h3 className="font-medium">Excel Spreadsheet</h3>
                    <p className="text-sm text-gray-500">Export as XLSX file</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="p-4 border border-gray-200 rounded-xl hover:border-purple-500 cursor-pointer transition-colors shadow-sm hover:shadow-md"
                onClick={exportToCSV}
              >
                <div className="flex items-center">
                  <FileDown className="h-6 w-6 text-purple-600 mr-3" />
                  <div>
                    <h3 className="font-medium">CSV File</h3>
                    <p className="text-sm text-gray-500">Export as CSV file</p>
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500 transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}