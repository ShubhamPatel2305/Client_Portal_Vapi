import React from 'react';
import { Card, Title } from '@tremor/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, FileText, Calendar } from 'lucide-react';
import { AreaChart, BarChart } from '@tremor/react';
import { generateAnalyticsReport, generateInvoice } from '../../utils/pdfGenerators';
import { format } from 'date-fns';

interface CallAnalyticsProps {
  data: any;
  selectedMonth: number;
  onMonthChange: (month: number) => void;
}

const chartVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5 }
  },
  exit: { 
    opacity: 0,
    y: -20,
    transition: { duration: 0.3 }
  }
};

export const CallAnalytics: React.FC<CallAnalyticsProps> = ({ data, selectedMonth, onMonthChange }) => {
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                     'July', 'August', 'September', 'October', 'November', 'December'];

  // Format the daily stats data for the chart
  const formattedDailyStats = data.calls.dailyStats.map((stat: any) => ({
    date: format(new Date(stat.date), 'MMM dd'),
    totalCalls: stat.totalCalls,
    avgDuration: stat.avgDuration
  }));

  const handleDownloadReport = () => {
    const reportData = {
      totalCalls: data.calls.total,
      inboundCalls: data.calls.inbound,
      outboundCalls: data.calls.outbound,
      avgDuration: Math.floor(data.calls.avgDuration / 60),
      totalCost: parseFloat(data.calls.cost),
      successRate: 95,
      dailyStats: data.calls.dailyStats.map((stat: any) => ({
        date: format(new Date(stat.date), 'MMM dd'),
        totalCalls: stat.totalCalls
      })),
      callDetails: data.calls.details
    };

    const doc = generateAnalyticsReport(reportData);
    doc.save(`analytics-report-${monthNames[selectedMonth]}-2024.pdf`);
  };

  const handleDownloadInvoice = () => {
    const invoiceData = {
      invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
      client: {
        name: 'Your Company Name',
        address: '123 Business Street',
        city: 'San Francisco, CA 94105',
        email: 'billing@yourcompany.com'
      },
      date: new Date().toISOString(),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      billingPeriod: `${monthNames[selectedMonth]} 2024`,
      services: [
        {
          name: 'Inbound Calls',
          quantity: data.calls.inbound,
          rate: 0.05,
          amount: data.calls.inbound * 0.05
        },
        {
          name: 'Outbound Calls',
          quantity: data.calls.outbound,
          rate: 0.07,
          amount: data.calls.outbound * 0.07
        }
      ],
      subtotal: parseFloat(data.calls.cost),
      tax: parseFloat(data.calls.cost) * 0.1,
      total: parseFloat(data.calls.cost) * 1.1
    };

    const doc = generateInvoice(invoiceData);
    doc.save(`invoice-${monthNames[selectedMonth]}-2024.pdf`);
  };

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <motion.div
            key={selectedMonth}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <Title>Call Analytics - {monthNames[selectedMonth]} 2024</Title>
          </motion.div>
          <div className="flex items-center space-x-4">
            <div className="relative inline-flex items-center">
              <Calendar className="absolute left-3 w-5 h-5 text-gray-500 pointer-events-none" />
              <select
                value={selectedMonth}
                onChange={(e) => onMonthChange(Number(e.target.value))}
                className="pl-10 pr-4 py-2 appearance-none bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 font-medium min-w-[180px]"
              >
                {monthNames.map((month, idx) => (
                  <option key={idx} value={idx}>{month}</option>
                ))}
              </select>
              <div className="absolute right-3 pointer-events-none">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleDownloadReport}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Report
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleDownloadInvoice}
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200"
            >
              <FileText className="w-4 h-4 mr-2" />
              Generate Invoice
            </motion.button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={`trends-${selectedMonth}`}
              variants={chartVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white rounded-lg p-4"
            >
              <h3 className="text-lg font-semibold mb-4">Daily Call Trends</h3>
              <AreaChart
                className="h-72"
                data={formattedDailyStats}
                index="date"
                categories={['totalCalls', 'avgDuration']}
                colors={['blue', 'green']}
                valueFormatter={(value) => value.toString()}
                showLegend={true}
              />
            </motion.div>
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.div
              key={`types-${selectedMonth}`}
              variants={chartVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white rounded-lg p-4"
            >
              <h3 className="text-lg font-semibold mb-4">Call Distribution</h3>
              <BarChart
                className="h-72"
                data={[
                  {
                    name: 'Call Types',
                    'Inbound Calls': data.calls.inbound,
                    'Outbound Calls': data.calls.outbound,
                    'Missed Calls': Math.floor(Math.random() * 50),
                    'Failed Calls': Math.floor(Math.random() * 20)
                  }
                ]}
                index="name"
                categories={['Inbound Calls', 'Outbound Calls', 'Missed Calls', 'Failed Calls']}
                colors={['emerald', 'blue', 'amber', 'rose']}
                valueFormatter={(value) => value.toString()}
                showLegend={true}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Call Details</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-blue-100">
                  <th className="px-4 py-2 text-left">Call ID</th>
                  <th className="px-4 py-2 text-left">Date</th>
                  <th className="px-4 py-2 text-left">Type</th>
                  <th className="px-4 py-2 text-left">Duration</th>
                  <th className="px-4 py-2 text-left">Cost</th>
                  <th className="px-4 py-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {data.calls.details.map((call: any, index: number) => (
                  <motion.tr
                    key={call.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td className="px-4 py-2">{call.id}</td>
                    <td className="px-4 py-2">{format(new Date(call.date), 'MM/dd/yyyy')}</td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        call.type === 'Inbound' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {call.type}
                      </span>
                    </td>
                    <td className="px-4 py-2">{formatDuration(call.duration)}</td>
                    <td className="px-4 py-2">${call.cost}</td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        call.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {call.status}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Card>
    </div>
  );
};
