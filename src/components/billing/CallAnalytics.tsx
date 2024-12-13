import React from 'react';
import { Card, Title } from '@tremor/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, FileText, Calendar } from 'lucide-react';
import { AreaChart, BarChart } from '@tremor/react';
import { generateAnalyticsReport, generateInvoice } from '../../utils/pdfGenerators';

interface CallAnalyticsProps {
  data: any;
  selectedMonth: number;
  onMonthChange: (month: number) => void;
}

export const CallAnalytics: React.FC<CallAnalyticsProps> = ({ data, selectedMonth, onMonthChange }) => {
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                     'July', 'August', 'September', 'October', 'November', 'December'];

  // Chart data for call trends
  const callTrends = Array.from({ length: 30 }, (_, i) => ({
    date: `${monthNames[selectedMonth]} ${i + 1}`,
    'Total Calls': Math.floor(Math.random() * 50) + 20,
    'Average Duration (min)': Math.floor(Math.random() * 10) + 2,
  }));

  // Chart data for call types
  const callTypes = {
    labels: ['Inbound', 'Outbound', 'Missed', 'Failed'],
    data: [data.calls.inbound, data.calls.outbound, 
           Math.floor(Math.random() * 50), Math.floor(Math.random() * 20)]
  };

  const chartVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.3 }
    }
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
            <Title>Call Analytics - {monthNames[selectedMonth]} 2023</Title>
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
              onClick={() => generateAnalyticsReport(data, selectedMonth)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Report
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => generateInvoice(data, selectedMonth)}
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
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
            >
              <Title className="mb-4">Daily Call Trends</Title>
              <AreaChart
                data={callTrends}
                index="date"
                categories={['Total Calls', 'Average Duration (min)']}
                colors={['blue', 'green']}
                className="h-72"
              />
            </motion.div>
          </AnimatePresence>
          
          <AnimatePresence mode="wait">
            <motion.div
              key={`distribution-${selectedMonth}`}
              variants={chartVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <Title className="mb-4">Call Distribution</Title>
              <BarChart
                data={[
                  {
                    name: 'Call Types',
                    'Inbound Calls': callTypes.data[0],
                    'Outbound Calls': callTypes.data[1],
                    'Missed Calls': callTypes.data[2],
                    'Failed Calls': callTypes.data[3],
                  }
                ]}
                index="name"
                categories={['Inbound Calls', 'Outbound Calls', 'Missed Calls', 'Failed Calls']}
                colors={['emerald', 'blue', 'yellow', 'red']}
                className="h-72"
              />
            </motion.div>
          </AnimatePresence>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={`table-${selectedMonth}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-x-auto"
          >
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Call ID</th>
                  <th className="text-left py-3 px-4">Date</th>
                  <th className="text-left py-3 px-4">Type</th>
                  <th className="text-left py-3 px-4">Duration</th>
                  <th className="text-left py-3 px-4">Cost</th>
                  <th className="text-left py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {data.calls.details.map((call: any, idx: number) => (
                  <motion.tr
                    key={call.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: idx * 0.05 }}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="py-3 px-4">{call.id}</td>
                    <td className="py-3 px-4">{call.date.toLocaleDateString()}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        call.type === 'Inbound' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {call.type}
                      </span>
                    </td>
                    <td className="py-3 px-4">{Math.floor(call.duration / 60)}m {call.duration % 60}s</td>
                    <td className="py-3 px-4">${call.cost}</td>
                    <td className="py-3 px-4">
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
          </motion.div>
        </AnimatePresence>
      </Card>
    </div>
  );
};
