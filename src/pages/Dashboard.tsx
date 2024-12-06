import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Card,
  Title,
  Text,
  Tab,
  TabList,
  TabGroup,
  TabPanel,
  TabPanels,
  Grid,
  Button,
} from '@tremor/react';
import { 
  PhoneCall, 
  Calendar, 
  Bell, 
  RefreshCw, 
  Download, 
  TrendingUp,
  Users,
  Clock,
  DollarSign,
  Filter,
  Search,
} from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

import StatCard from '../components/StatCard';
import ChartCard from '../components/ChartCard';
import CallsList from '../components/CallsList';
import ExportModal from '../components/modals/ExportModal';
import ScheduleModal from '../components/modals/ScheduleModal';
import AlertSettingsModal from '../components/modals/AlertSettingsModal';
import { fetchDashboardData } from '../lib/api';
import { Analytics } from '../lib/api/vapiService';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { type: "spring", duration: 0.2 }
};

export default function Dashboard() {
  const [data, setData] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const refreshData = async () => {
    try {
      setLoading(true);
      const newData = await fetchDashboardData();
      console.log(newData);
      setData(newData);
      toast.success('Dashboard refreshed successfully');
    } catch (error) {
      toast.error('Failed to refresh data');
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
    const intervalId = setInterval(refreshData, 5 * 60 * 1000);
    return () => clearInterval(intervalId);
  }, []);

  const filteredCalls = useMemo(() => {
    if (!data?.recentCalls) return [];
    return data.recentCalls.filter((call: any) => {
      const matchesSearch = call.phoneNumber.includes(searchQuery) ||
        call.status.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = filterStatus === 'all' || call.status === filterStatus;
      return matchesSearch && matchesFilter;
    });
  }, [data?.recentCalls, searchQuery, filterStatus]);

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-4">
          <RefreshCw className="w-10 h-10 animate-spin text-indigo-600 mx-auto" />
          <Text className="text-gray-600 font-medium">Loading your dashboard...</Text>
        </div>
      </div>
    );
  }

  const handleRefresh = () => {
    refreshData();
  };

  return (
    <motion.div 
      className="w-full"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={fadeInUp}
    >
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <Title>Dashboard</Title>
          <Text className="mt-1 text-gray-500">
            Last updated: {format(new Date(), 'MMM d, yyyy, h:mm a')}
          </Text>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <Button
            icon={Calendar}
            variant="secondary"
            onClick={() => setShowScheduleModal(true)}
          >
            Schedule
          </Button>
          <Button
            icon={Bell}
            variant="secondary"
            onClick={() => setShowAlertModal(true)}
          >
            Alerts
          </Button>
          <Button
            icon={Download}
            variant="secondary"
            onClick={() => setShowExportModal(true)}
          >
            Export
          </Button>
          <Button
            icon={RefreshCw}
            variant="primary"
            loading={loading}
            onClick={handleRefresh}
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 mb-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Call Minutes"
            value={data ? data.totalCallMinutes.toFixed(1) : '0.0'}
            icon={Clock}
            trend={data?.totalCallMinutesTrend}
            loading={loading}
          />
          <StatCard
            title="Number of Calls"
            value={data ? data.numberOfCalls.toString() : '0'}
            icon={PhoneCall}
            trend={data?.numberOfCallsTrend}
            loading={loading}
          />
          <StatCard
            title="Total Spent"
            value={data ? `$${data.totalSpent.toFixed(2)}` : '$0.00'}
            icon={DollarSign}
            trend={data?.totalSpentTrend}
            loading={loading}
          />
          <StatCard
            title="Average Cost per Call"
            value={data ? `$${data.avgCostPerCall.toFixed(2)}` : '$0.00'}
            icon={TrendingUp}
            trend={data?.avgCostPerCallTrend}
            loading={loading}
          />
        </div>
      </div>

      {/* Tab Group */}
      <TabGroup className="mt-6">
        <TabList>
          <Tab icon={TrendingUp}>Overview</Tab>
          <Tab icon={PhoneCall}>Calls</Tab>
          <Tab icon={Users}>Users</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Grid numItems={1} numItemsLg={2} className="gap-6 mt-6">
              <ChartCard
                title="Call Volume Distribution"
                chartType="donut"
                chartData={data?.callDistribution || []}
                index="label"
                categories={['value']}
              />
              <ChartCard
                title="Cost Analysis"
                chartType="bar"
                chartData={data?.costAnalysis || []}
                index="date"
                categories={['value']}
              />
            </Grid>
            <Card className="mt-6">
              <ChartCard
                title="Monthly Call Trends"
                chartType="area"
                chartData={data?.monthlyCallData || []}
                index="date"
                categories={['value']}
              />
            </Card>
          </TabPanel>
          <TabPanel>
            <Card className="mt-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <Title>Recent Calls</Title>
                <div className="flex items-center gap-2">
                  <Button icon={Filter} variant="secondary">Filter</Button>
                  <Button icon={Search} variant="secondary">Search</Button>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search calls..."
                      className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Filter className="text-gray-400 w-4 h-4" />
                  <select
                    className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="all">All Status</option>
                    <option value="completed">Completed</option>
                    <option value="ongoing">Ongoing</option>
                    <option value="failed">Failed</option>
                  </select>
                </div>
              </div>
              <CallsList calls={filteredCalls} />
            </Card>
          </TabPanel>
          <TabPanel>
            {/* Users content */}
          </TabPanel>
        </TabPanels>
      </TabGroup>

      {/* Modals */}
      <ExportModal isOpen={showExportModal} onClose={() => setShowExportModal(false)} />
      <ScheduleModal isOpen={showScheduleModal} onClose={() => setShowScheduleModal(false)} />
      <AlertSettingsModal isOpen={showAlertModal} onClose={() => setShowAlertModal(false)} />
    </motion.div>
  );
}