import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CreditCard } from 'lucide-react';
import { BillingStats } from '../components/billing/BillingStats';
import { CallAnalytics } from '../components/billing/CallAnalytics';

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
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            window.location.href = 'https://stripe.com/payment';
          }}
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <CreditCard className="w-5 h-5 mr-2" />
          <span>Make Payment</span>
        </motion.button>
      </div>

      <BillingStats data={monthlyData} />
      <CallAnalytics 
        data={monthlyData} 
        selectedMonth={selectedMonth}
        onMonthChange={setSelectedMonth}
      />
    </div>
  );
}