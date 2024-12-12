import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@tremor/react';
import {
  CreditCard,
  Check,
  Shield,
  Zap,
  Download,
  AlertCircle,
  Lock,
  RefreshCw,
  PieChart,
  TrendingUp,
  Calendar,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const usageData = [
  { month: 'Jan', usage: 2500, limit: 5000 },
  { month: 'Feb', usage: 3200, limit: 5000 },
  { month: 'Mar', usage: 4100, limit: 5000 },
  { month: 'Apr', usage: 3800, limit: 5000 },
];

const plans = [
  {
    name: 'Starter',
    price: '$29',
    features: [
      '5,000 API calls/month',
      'Basic analytics',
      'Email support',
      '2 Team members',
      'Basic reporting',
    ],
    priceId: 'price_starter',
    current: false,
  },
  {
    name: 'Pro',
    price: '$79',
    features: [
      '25,000 API calls/month',
      'Advanced analytics',
      'Priority support',
      '5 Team members',
      'Advanced reporting',
      'Custom integrations',
    ],
    priceId: 'price_pro',
    current: true,
  },
  {
    name: 'Enterprise',
    price: '$199',
    features: [
      '100,000 API calls/month',
      'Custom analytics',
      '24/7 support',
      'Unlimited team members',
      'Custom reporting',
      'API access',
      'Dedicated account manager',
    ],
    priceId: 'price_enterprise',
    current: false,
  },
];

const invoices = [
  { id: 'INV-001', date: '2024-04-01', amount: '$79.00', status: 'Paid' },
  { id: 'INV-002', date: '2024-03-01', amount: '$79.00', status: 'Paid' },
  { id: 'INV-003', date: '2024-02-01', amount: '$79.00', status: 'Paid' },
];

export default function Billing() {
  const [loading, setLoading] = useState<string | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [currentUsage, setCurrentUsage] = useState(3800);
  const [usageLimit] = useState(5000);
  const [showInvoiceDetails, setShowInvoiceDetails] = useState<string | null>(null);

  const handleUpgrade = async (priceId: string, planName: string) => {
    try {
      setLoading(planName);
      // Implement your payment logic here
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setShowPaymentModal(true);
    } catch (error) {
      console.error('Payment failed:', error);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 p-4 sm:p-6 pt-20 lg:pt-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Billing & Usage</h1>
          <p className="mt-2 text-gray-600">
            Manage your subscription and monitor your usage
          </p>
        </div>

        {/* Usage Overview */}
        <Card className="mb-8 p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Usage Overview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Current Usage</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {currentUsage.toLocaleString()}
                  </p>
                </div>
                <PieChart className="h-8 w-8 text-indigo-600" />
              </div>
              <div className="mt-2 h-2 rounded-full">
                <div
                  className="h-2 bg-indigo-600 rounded-full transition-all duration-500"
                  style={{ width: `${(currentUsage / usageLimit) * 100}%` }}
                />
              </div>
              <p className="text-sm text-gray-500 mt-2">
                {((currentUsage / usageLimit) * 100).toFixed(1)}% of{' '}
                {usageLimit.toLocaleString()} limit
              </p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Daily Average</p>
                  <p className="text-2xl font-bold text-gray-900">127</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
              <p className="text-sm text-green-600 mt-2">
                ↑ 12% from last week
              </p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Days Remaining</p>
                  <p className="text-2xl font-bold text-gray-900">16</p>
                </div>
                <Calendar className="h-8 w-8 text-orange-600" />
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Billing cycle ends May 15
              </p>
            </div>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={usageData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="usage"
                  stroke="#4F46E5"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="limit"
                  stroke="#E5E7EB"
                  strokeWidth={1}
                  strokeDasharray="5 5"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Subscription Plans */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Subscription Plans
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <Card
                  className={`h-full ${
                    plan.current
                      ? 'border-2 border-indigo-600 shadow-indigo-100'
                      : 'shadow-lg'
                  }`}
                >
                  <div className="p-6">
                    {plan.current && (
                      <span className="inline-block px-3 py-1 text-xs font-semibold text-indigo-600 bg-indigo-50 rounded-full mb-4">
                        Current Plan
                      </span>
                    )}
                    <h3 className="text-xl font-bold text-gray-900">
                      {plan.name}
                    </h3>
                    <p className="mt-4">
                      <span className="text-4xl font-bold text-gray-900">
                        {plan.price}
                      </span>
                      <span className="text-gray-500">/month</span>
                    </p>
                    <ul className="mt-6 space-y-4">
                      {plan.features.map((feature, index) => (
                        <li
                          key={index}
                          className="flex items-center text-gray-600"
                        >
                          <Check className="h-5 w-5 text-green-500 mr-2" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <button
                      onClick={() => handleUpgrade(plan.priceId, plan.name)}
                      disabled={plan.current || loading === plan.name}
                      className={`mt-8 w-full py-2 px-4 rounded-lg flex items-center justify-center ${
                        plan.current
                          ? 'bg-gray-100 text-gray-600 cursor-default'
                          : loading === plan.name
                          ? 'bg-indigo-500 text-white cursor-wait'
                          : 'bg-indigo-600 text-white hover:bg-indigo-700'
                      } transition-colors`}
                    >
                      {loading === plan.name ? (
                        <>
                          <RefreshCw className="animate-spin mr-2" />
                          Loading...
                        </>
                      ) : plan.current ? (
                        'Current Plan'
                      ) : (
                        'Upgrade Plan'
                      )}
                    </button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Payment Methods */}
        <Card className="mb-8 p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Payment Methods
          </h2>
          <div className="space-y-4">
            <div className="flex items-center">
              <CreditCard className="h-8 w-8 text-gray-700" />
              <span className="ml-3 text-gray-700">Visa **** 1234</span>
            </div>
            <div className="flex items-center">
              <CreditCard className="h-8 w-8 text-gray-700" />
              <span className="ml-3 text-gray-700">MasterCard **** 5678</span>
            </div>
            <div className="flex items-center">
              <CreditCard className="h-8 w-8 text-gray-700" />
              <span className="ml-3 text-gray-700">PayPal</span>
            </div>
          </div>
        </Card>

        {/* Security Information */}
        <Card className="mb-8 p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Security Information
          </h2>
          <div className="flex items-center">
            <Shield className="h-8 w-8 text-gray-700" />
            <p className="ml-3 text-gray-700">
              All transactions are encrypted and secure. We comply with PCI DSS
              standards to protect your payment information.
            </p>
          </div>
        </Card>

        {/* Billing History */}
        <Card className="mb-8 p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Billing History
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">
                    Invoice ID
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">
                    Date
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">
                    Amount
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">
                    Status
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice) => (
                  <tr key={invoice.id} className="border-b hover:bg-gray-50">
                    <td className="py-4 px-4 text-sm text-gray-900">{invoice.id}</td>
                    <td className="py-4 px-4 text-sm text-gray-600">
                      {invoice.date}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-900">
                      {invoice.amount}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">
                      {invoice.status}
                    </td>
                    <td className="py-4 px-4">
                      <button
                        onClick={() => setShowInvoiceDetails(invoice.id)}
                        className="text-indigo-600 hover:text-indigo-700"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Invoice Details Modal */}
        <AnimatePresence>
          {showInvoiceDetails && (
            <motion.div
              className="fixed inset-0 flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowInvoiceDetails(null)} />
              <motion.div
                className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full relative z-10"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
              >
                <h3 className="text-lg font-semibold mb-4">Invoice Details</h3>
                <p className="text-sm text-gray-600">
                  Invoice ID: {showInvoiceDetails}
                </p>
                <p className="text-sm text-gray-600">
                  Date:{' '}
                  {invoices.find((inv) => inv.id === showInvoiceDetails)?.date}
                </p>
                <p className="text-sm text-gray-600">
                  Amount:{' '}
                  {invoices.find((inv) => inv.id === showInvoiceDetails)?.amount}
                </p>
                <p className="text-sm text-gray-600">
                  Status:{' '}
                  {invoices.find((inv) => inv.id === showInvoiceDetails)?.status}
                </p>
                <button
                  onClick={() => setShowInvoiceDetails(null)}
                  className="mt-4 w-full py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Close
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}