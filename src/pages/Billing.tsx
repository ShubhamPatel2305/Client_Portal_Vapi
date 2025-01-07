import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BillingStats } from '../components/billing/BillingStats';
import { CallAnalytics } from '../components/billing/CallAnalytics';
import { vapiService } from '../lib/api/vapiService';
import { startOfMonth, endOfMonth } from 'date-fns';
import { CreditCard, Lock } from 'lucide-react';
import { Dialog, Transition } from '@headlessui/react';
import type { Analytics } from '../lib/api/vapiService';

interface MonthlyTrend {
  date: string;
  calls: number;
  cost: number;
}

interface CallDistribution {
  name: string;
  count: number;
  color: string;
  trend: string;
}

interface RecentCall {
  id: string;
  phoneNumber: string;
  type: string;
  status: string;
  duration: number;
  cost: number;
  date: string;
}

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

interface TransformedData {
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
}

const Billing: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [showComingSoon, setShowComingSoon] = useState(false);
  const [monthlyData, setMonthlyData] = useState<Record<number, Analytics>>({});
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isMonthLoading, setIsMonthLoading] = useState(false);
  const [transformedData, setTransformedData] = useState<TransformedData | null>(null);

  const transformAnalyticsData = useCallback((data: Analytics): TransformedData => ({
    calls: {
      total: data.numberOfCalls,
      inbound: data.callDistribution.find((d: CallDistribution) => d.name === 'inbound')?.count || 0,
      outbound: data.callDistribution.find((d: CallDistribution) => d.name === 'outbound')?.count || 0,
      avgDuration: Math.round(data.totalCallMinutes * 60 / data.numberOfCalls),
      cost: data.totalSpent.toFixed(2),
      details: data.recentCalls.map((call: RecentCall) => ({
        id: call.id,
        type: call.type,
        startedAt: call.date,
        endedAt: call.date,
        cost: call.cost,
        status: call.status,
        endedReason: 'completed'
      })).sort((a: CallDetail, b: CallDetail) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()),
      dailyStats: data.monthlyTrend.map((trend: MonthlyTrend) => ({
        date: new Date(trend.date),
        totalCalls: trend.calls,
        avgDuration: data.totalCallMinutes * 60 / trend.calls,
        cost: trend.cost.toFixed(2)
      })).sort((a: { date: Date }, b: { date: Date }) => a.date.getTime() - b.date.getTime()),
      callDistribution: data.callDistribution.map((dist: CallDistribution) => ({
        name: dist.name,
        value: dist.count,
        trend: dist.trend,
        color: dist.color
      }))
    }
  }), []);

  const fetchMonthData = useCallback(async (month: number) => {
    if (monthlyData[month]) {
      setTransformedData(transformAnalyticsData(monthlyData[month]));
      return;
    }

    try {
      setIsMonthLoading(true);
      const startDate = startOfMonth(new Date(new Date().getFullYear(), month));
      const endDate = endOfMonth(new Date(new Date().getFullYear(), month));
      const analyticsData = await vapiService.getAnalytics(startDate, endDate);
      
      setMonthlyData(prev => ({ ...prev, [month]: analyticsData }));
      setTransformedData(transformAnalyticsData(analyticsData));
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setIsMonthLoading(false);
    }
  }, [monthlyData, transformAnalyticsData]);

  useEffect(() => {
    const initializeData = async () => {
      await fetchMonthData(selectedMonth);
      setIsInitialLoading(false);
    };

    initializeData();
  }, []);

  useEffect(() => {
    if (!isInitialLoading) {
      fetchMonthData(selectedMonth);
    }
  }, [selectedMonth, isInitialLoading, fetchMonthData]);

  if (isInitialLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex items-center justify-center min-h-screen"
      >
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="p-6 max-w-7xl mx-auto"
    >
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-5xl font-bold text-gradient-to-r from-indigo-600 to-blue-1000">Billing & Usage</h1>
          <p className="text-gray-500">Monitor your call usage and costs</p>
        </div>
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowComingSoon(true)}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600/50 to-blue-600/50 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 opacity-75 cursor-not-allowed"
          >
            <CreditCard className="w-5 h-5 mr-2" />
            <span>Make Payment</span>
            <Lock className="w-4 h-4 ml-2" />
          </motion.button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={selectedMonth}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className={isMonthLoading ? 'opacity-50 pointer-events-none' : ''}
        >
          {transformedData && (
            <>
              <BillingStats data={transformedData} />
              <CallAnalytics 
                data={transformedData} 
                selectedMonth={selectedMonth}
                onMonthChange={setSelectedMonth}
              />
            </>
          )}
        </motion.div>
      </AnimatePresence>

      <Transition appear show={showComingSoon} as={React.Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setShowComingSoon(false)}>
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/30" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={React.Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <div className="text-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1, rotate: 360 }}
                      transition={{ type: "spring", duration: 1.5 }}
                      className="mx-auto flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full"
                    >
                      <Lock className="w-8 h-8 text-blue-600" />
                    </motion.div>
                    <Dialog.Title as="h3" className="mt-4 text-lg font-medium leading-6 text-gray-900">
                      Coming Soon!
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        We're working hard to bring you this feature. Stay tuned for updates!
                      </p>
                    </div>
                    <div className="mt-4">
                      <button
                        type="button"
                        className="inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                        onClick={() => setShowComingSoon(false)}
                      >
                        Got it, thanks!
                      </button>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </motion.div>
  );
};

export default Billing;
