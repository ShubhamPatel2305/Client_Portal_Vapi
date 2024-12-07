import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@tremor/react';
import { Download, FileText } from 'lucide-react';

interface Invoice {
  id: string;
  date: Date;
  amount: number;
  status: 'paid' | 'pending' | 'failed';
}

interface InvoiceListProps {
  invoices: Invoice[];
  onDownload: (invoiceId: string) => void;
}

export default function InvoiceList({ invoices, onDownload }: InvoiceListProps) {
  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-900">Billing History</h3>
        <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
          View All
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Invoice</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Date</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Amount</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
              <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Action</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice, index) => (
              <motion.tr
                key={invoice.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="border-b border-gray-200 hover:bg-gray-50"
              >
                <td className="py-4 px-4">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-900">{invoice.id}</span>
                  </div>
                </td>
                <td className="py-4 px-4 text-sm text-gray-600">
                  {invoice.date.toLocaleDateString()}
                </td>
                <td className="py-4 px-4 text-sm text-gray-900">
                  ${invoice.amount.toFixed(2)}
                </td>
                <td className="py-4 px-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    invoice.status === 'paid' ? 'bg-green-100 text-green-800' :
                    invoice.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                  </span>
                </td>
                <td className="py-4 px-4 text-right">
                  <button
                    onClick={() => onDownload(invoice.id)}
                    className="text-indigo-600 hover:text-indigo-700"
                  >
                    <Download className="h-5 w-5" />
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}