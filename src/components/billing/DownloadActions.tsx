import React, { useState } from 'react';
import { Download } from 'lucide-react';
import { motion } from 'framer-motion';
import { billingApi } from '../../lib/api/billing';
import { format } from 'date-fns';

interface DownloadActionsProps {
  monthlyData: any;
  selectedMonth: number;
}

export const DownloadActions: React.FC<DownloadActionsProps> = ({ monthlyData, selectedMonth }) => {
  const [isLoading, setIsLoading] = useState<{ [key: string]: boolean }>({
    report: false,
    invoice: false
  });

  const downloadFile = async (blob: Blob, filename: string) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  // const handleDownloadReport = async () => {
  //   try {
  //     setIsLoading(prev => ({ ...prev, report: true }));
  //     const blob = await billingApi.downloadReport(selectedMonth);
  //     const filename = `billing-report-${format(new Date(2024, selectedMonth), 'MMMM-yyyy')}.pdf`;
  //     await downloadFile(blob, filename);
  //   } catch (error) {
  //     console.error('Error downloading report:', error);
  //   } finally {
  //     setIsLoading(prev => ({ ...prev, report: false }));
  //   }
  // };

  const handleDownloadInvoice = async () => {
    try {
      setIsLoading(prev => ({ ...prev, invoice: true }));
      const blob = await billingApi.downloadInvoice(selectedMonth);
      const filename = `invoice-${format(new Date(2024, selectedMonth), 'MMMM-yyyy')}.pdf`;
      await downloadFile(blob, filename);
    } catch (error) {
      console.error('Error downloading invoice:', error);
    } finally {
      setIsLoading(prev => ({ ...prev, invoice: false }));
    }
  };

  return (
    <div className="flex gap-4 mt-4">
      {/* <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleDownloadReport}
        disabled={isLoading.report}
        className={`flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
          isLoading.report ? 'opacity-75 cursor-not-allowed' : ''
        }`}
      >
        <Download className="w-4 h-4" />
        {isLoading.report ? 'Generating Report...' : 'Download Report'}
      </motion.button> */}

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleDownloadInvoice}
        disabled={isLoading.invoice}
        className={`flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
          isLoading.invoice ? 'opacity-75 cursor-not-allowed' : ''
        }`}
      >
        <Download className="w-4 h-4" />
        {isLoading.invoice ? 'Generating Invoice...' : 'Download Invoice'}
      </motion.button>
    </div>
  );
};
