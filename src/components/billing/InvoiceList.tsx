import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@tremor/react';
import { Download, FileText, Mail, Phone, User, Search, Filter, Calendar, DollarSign } from 'lucide-react';

interface Invoice {
  id: string;
  date: Date;
  amount: number;
  status: 'paid' | 'pending' | 'failed';
  items?: {
    description: string;
    quantity: number;
    rate: number;
    amount: number;
  }[];
  dueDate?: Date;
  paymentMethod?: string;
}

interface ClientInfo {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  company?: string;
  taxId?: string;
}

interface InvoiceListProps {
  invoices: Invoice[];
  clientInfo: ClientInfo;
  onDownload: (invoiceId: string) => void;
}

export default function InvoiceList({ invoices, clientInfo, onDownload }: InvoiceListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateSort, setDateSort] = useState<'asc' | 'desc'>('desc');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.amount.toString().includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  }).sort((a, b) => {
    return dateSort === 'desc' 
      ? b.date.getTime() - a.date.getTime()
      : a.date.getTime() - b.date.getTime();
  });

  return (
    <Card className="p-6 space-y-6">
      {/* Client Information Section */}
      <div className="flex justify-between items-start">
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-900">Billing History</h3>
          <div className="bg-white p-4 rounded-lg border border-gray-200 space-y-3">
            <div className="flex items-center text-gray-700">
              <User className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium">{clientInfo.name}</span>
            </div>
            <div className="flex items-center text-gray-700">
              <Mail className="w-4 h-4 mr-2" />
              <span className="text-sm">{clientInfo.email}</span>
            </div>
            {clientInfo.phone && (
              <div className="flex items-center text-gray-700">
                <Phone className="w-4 h-4 mr-2" />
                <span className="text-sm">{clientInfo.phone}</span>
              </div>
            )}
            {clientInfo.company && (
              <div className="text-sm text-gray-600 mt-2 border-t pt-2">
                <p className="font-medium">{clientInfo.company}</p>
                <p className="mt-1">{clientInfo.address}</p>
                {clientInfo.taxId && <p className="text-xs mt-1">Tax ID: {clientInfo.taxId}</p>}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex-1 min-w-[240px] max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search invoices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        <div className="flex gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
          <button
            onClick={() => setDateSort(dateSort === 'desc' ? 'asc' : 'desc')}
            className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            <Calendar className="h-4 w-4" />
            <span>{dateSort === 'desc' ? 'Newest' : 'Oldest'}</span>
          </button>
        </div>
      </div>

      {/* Invoice Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left py-3.5 px-4 text-sm font-medium text-gray-500">Invoice</th>
              <th className="text-left py-3.5 px-4 text-sm font-medium text-gray-500">Date</th>
              <th className="text-left py-3.5 px-4 text-sm font-medium text-gray-500">Due Date</th>
              <th className="text-left py-3.5 px-4 text-sm font-medium text-gray-500">Amount</th>
              <th className="text-left py-3.5 px-4 text-sm font-medium text-gray-500">Status</th>
              <th className="text-right py-3.5 px-4 text-sm font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredInvoices.map((invoice, index) => (
              <motion.tr
                key={invoice.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => setSelectedInvoice(invoice)}
              >
                <td className="py-4 px-4">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-sm font-medium text-gray-900">{invoice.id}</span>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <span className="text-sm text-gray-600">
                    {invoice.date.toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <span className="text-sm text-gray-600">
                    {invoice.dueDate?.toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    }) || '-'}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 text-gray-400 mr-1" />
                    <span className="text-sm font-medium text-gray-900">
                      {invoice.amount.toFixed(2)}
                    </span>
                  </div>
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
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onDownload(invoice.id);
                    }}
                    className="text-indigo-600 hover:text-indigo-700 p-1 rounded-full hover:bg-indigo-50 transition-colors"
                  >
                    <Download className="h-5 w-5" />
                  </motion.button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* No Results Message */}
      {filteredInvoices.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No invoices found matching your criteria</p>
        </div>
      )}

      {/* Invoice Details Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-lg font-medium text-gray-900">Invoice Details</h3>
                <button
                  onClick={() => setSelectedInvoice(null)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between border-b pb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Invoice Number</p>
                    <p className="mt-1 text-sm text-gray-900">{selectedInvoice.id}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-500">Amount</p>
                    <p className="mt-1 text-sm text-gray-900">${selectedInvoice.amount.toFixed(2)}</p>
                  </div>
                </div>

                <div className="flex justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Issue Date</p>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedInvoice.date.toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-500">Due Date</p>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedInvoice.dueDate?.toLocaleDateString() || '-'}
                    </p>
                  </div>
                </div>

                {selectedInvoice.items && (
                  <div className="mt-6">
                    <h4 className="text-sm font-medium text-gray-500 mb-4">Items</h4>
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr>
                          <th className="text-left text-xs font-medium text-gray-500">Description</th>
                          <th className="text-right text-xs font-medium text-gray-500">Quantity</th>
                          <th className="text-right text-xs font-medium text-gray-500">Rate</th>
                          <th className="text-right text-xs font-medium text-gray-500">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {selectedInvoice.items.map((item, index) => (
                          <tr key={index}>
                            <td className="py-2 text-sm text-gray-900">{item.description}</td>
                            <td className="py-2 text-sm text-gray-900 text-right">{item.quantity}</td>
                            <td className="py-2 text-sm text-gray-900 text-right">${item.rate}</td>
                            <td className="py-2 text-sm text-gray-900 text-right">${item.amount}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDownload(selectedInvoice.id);
                    }}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Invoice
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </Card>
  );
}