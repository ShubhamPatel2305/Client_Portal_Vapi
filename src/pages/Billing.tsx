import { useState, useEffect, Fragment } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, Lock } from 'lucide-react';
import { BillingStats } from '../components/billing/BillingStats';
import { CallAnalytics } from '../components/billing/CallAnalytics';
import { Dialog, Transition } from '@headlessui/react';

// Mock data generator with daily stats
const generateMonthlyData = (month: number) => {
  const daysInMonth = new Date(2024, month + 1, 0).getDate();
  
  return {
    calls: {
      total: Math.floor(Math.random() * 1000) + 500,
      inbound: Math.floor(Math.random() * 600) + 300,
      outbound: Math.floor(Math.random() * 400) + 200,
      avgDuration: Math.floor(Math.random() * 300) + 120,
      cost: (Math.random() * 1000 + 500).toFixed(2),
      details: Array.from({ length: 20 }, (_, i) => ({
        id: `CALL-${i + 1}`,
        date: new Date(2024, month, Math.floor(Math.random() * 28) + 1),
        duration: Math.floor(Math.random() * 600) + 60,
        type: Math.random() > 0.5 ? 'Inbound' : 'Outbound',
        cost: (Math.random() * 10).toFixed(2),
        status: Math.random() > 0.1 ? 'Completed' : 'Failed'
      })),
      dailyStats: Array.from({ length: daysInMonth }, (_, i) => ({
        date: new Date(2024, month, i + 1),
        totalCalls: Math.floor(Math.random() * 50) + 20,
        avgDuration: Math.floor(Math.random() * 10) + 2,
        cost: (Math.random() * 100).toFixed(2)
      }))
    }
  };
};

export default function Billing() {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [monthlyData, setMonthlyData] = useState(generateMonthlyData(selectedMonth));
  const [showComingSoon, setShowComingSoon] = useState(false);

  useEffect(() => {
    setMonthlyData(generateMonthlyData(selectedMonth));
  }, [selectedMonth]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Billing & Usage</h1>
          <p className="text-gray-600">Monitor your call usage and costs</p>
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

      <BillingStats data={monthlyData} />
      <CallAnalytics 
        data={monthlyData} 
        selectedMonth={selectedMonth}
        onMonthChange={setSelectedMonth}
      />

      <Transition appear show={showComingSoon} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setShowComingSoon(false)}>
          <Transition.Child
            as={Fragment}
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
                as={Fragment}
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
    </div>
  );
}