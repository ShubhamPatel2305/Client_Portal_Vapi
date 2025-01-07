import React from 'react';
import { Card, Title } from '@tremor/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, FileText, Calendar } from 'lucide-react';
import { AreaChart, BarChart } from '@tremor/react';
import { generateAnalyticsReport, generateInvoice } from '../../utils/pdfGenerators';
import { format } from 'date-fns';

interface CallDetail {
  id: string;
  type: string;
  startedAt: string;
  endedAt: string;
  cost: number;
  status: string;
  endedReason?: string;
  costBreakdown?: any;
}

interface CallAnalyticsProps {
  data: {
    calls: {
      total: number;
      inbound: number;
      outbound: number;
      avgDuration: number;
      cost: string;
      details: CallDetail[];
      dailyStats: Array<{
        date: Date;
        totalCalls: number;
        avgDuration: number;
        cost: string;
      }>;
      callDistribution: Array<{
        name: string;
        value: number;
        trend: string;
        color: string;
      }>;
    };
  };
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
  const formattedDailyStats = data.calls.dailyStats.map(stat => ({
    date: format(stat.date, 'MMM dd'),
    'Total Calls': stat.totalCalls,
    'Average Duration (min)': Math.round(stat.avgDuration / 60)
  }));

  // Format call distribution data for the chart
  const callDistributionData = [{
    name: 'Call Types',
    ...Object.fromEntries(data.calls.callDistribution.map(dist => [
      dist.name.charAt(0).toUpperCase() + dist.name.slice(1) + ' Calls',
      dist.value
    ]))
  }];

  const callDistributionColors = data.calls.callDistribution.map(dist => dist.color);
  const callDistributionCategories = data.calls.callDistribution.map(
    dist => dist.name.charAt(0).toUpperCase() + dist.name.slice(1) + ' Calls'
  );

  const handleDownloadReport = () => {
    const reportData = {
      totalCalls: data.calls.total,
      inboundCalls: data.calls.inbound,
      outboundCalls: data.calls.outbound,
      avgDuration: Math.floor(data.calls.avgDuration / 60),
      totalCost: parseFloat(data.calls.cost),
      successRate: data.calls.callDistribution.find(d => d.name === 'success')?.value || 0,
      dailyStats: data.calls.dailyStats.map(stat => ({
        date: format(stat.date, 'MMM dd'),
        totalCalls: stat.totalCalls
      })),
      callDetails: data.calls.details.map(call => ({
        id: call.id,
        date: format(new Date(call.startedAt), 'MMM dd, yyyy HH:mm'),
        type: call.type,
        duration: new Date(call.endedAt).getTime() - new Date(call.startedAt).getTime(),
        cost: call.cost,
        status: call.status
      }))
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
      services: data.calls.callDistribution.map(dist => ({
        name: `${dist.name.charAt(0).toUpperCase() + dist.name.slice(1)} Calls`,
        quantity: dist.value,
        rate: dist.name === 'inbound' ? 0.05 : 0.07,
        amount: dist.value * (dist.name === 'inbound' ? 0.05 : 0.07)
      })),
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
                categories={['Total Calls', 'Average Duration (min)']}
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
                data={callDistributionData}
                index="name"
                categories={callDistributionCategories}
                colors={callDistributionColors}
                valueFormatter={(value) => value.toString()}
                showLegend={true}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4">Call Details</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cost</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.calls.details.map((call) => {
                  const duration = new Date(call.endedAt).getTime() - new Date(call.startedAt).getTime();
                  const durationInSeconds = Math.floor(duration / 1000);
                  
                  return (
                    <tr key={call.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {format(new Date(call.startedAt), 'MMM dd, yyyy HH:mm')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {call.type === 'webCall' ? 'Web Call' : call.type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDuration(durationInSeconds)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${call.cost.toFixed(3)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          call.status === 'ended' ? 'bg-green-100 text-green-800' :
                          call.status === 'failed' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {call.status.charAt(0).toUpperCase() + call.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </Card>
    </div>
  );
};
