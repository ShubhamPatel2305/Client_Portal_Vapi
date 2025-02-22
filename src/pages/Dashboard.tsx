import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { fetchVapiCalls, VapiCall, fetchAnalytics } from '../services/vapiService';
import {
  Calendar,
  Bell,
  Download,
  PhoneCall,
  Search,
  BarChart2,
  Clock,
  DollarSign,
  TrendingUp,
  TrendingDown,
  PhoneOff,
  Phone,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { format } from 'date-fns';
import LoadingSpinner from '../components/LoadingSpinner';
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
  DonutChart,
  AreaChart,
  BarChart,
  TextInput,
  Select,
  SelectItem,
  Table,
  TableHead,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell,
  Badge,
} from '@tremor/react';

import ExportModal from '../components/modals/ExportModal';
// import ScheduleModal from '../components/modals/ScheduleModal';
// import AlertSettingsModal from '../components/modals/AlertSettingsModal';
import CallDetailsModal from '../components/modals/CallDetailsModal';
import { fetchDashboardData } from '../lib/api';
import { Analytics } from '../lib/api/vapiService';
import { useAuthStore } from '../stores/auth';
import { usePageStore } from '../stores/pageStore';

// Add these utility functions at the top of the file
const formatMonthYear = (dateStr: string): string => {
  try {
    // Handle empty or invalid input
    if (!dateStr || typeof dateStr !== 'string') {
      return 'Invalid Date';
    }

    // Check if the date string is in YYYY-MM format
    if (!/^\d{4}-\d{2}$/.test(dateStr)) {
      return dateStr;
    }

    const [year, month] = dateStr.split('-').map(num => parseInt(num, 10));
    
    // Validate year and month
    if (isNaN(year) || isNaN(month) || month < 1 || month > 12) {
      return dateStr;
    }

    const date = new Date(year, month - 1);
    
    // Double check if the date is valid
    if (isNaN(date.getTime())) {
      return dateStr;
    }

    return format(date, 'MMMM yyyy');
  } catch (error) {
    console.error('Date formatting error:', error);
    return dateStr; // Return original string if formatting fails
  }
};

const formatDateTime = (dateString: string): string => {
  try {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return format(date, 'MMM d, yyyy h:mm a');
  } catch (error) {
    console.error('DateTime formatting error:', error);
    return dateString;
  }
};

const getCurrentMonthKey = (): string => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth()).padStart(2, '0')}`;
};

const getAllMonthsInRange = (data: Analytics | null): string[] => {
  if (!data?.monthlyTrend) return [];
  
  return [...new Set(data.monthlyTrend.map(item => item.date))]
    .sort((a, b) => {
      const [yearA, monthA] = a.split('-').map(Number);
      const [yearB, monthB] = b.split('-').map(Number);
      return (yearB * 12 + monthB) - (yearA * 12 + monthA);
    });
};

const containerVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.3, staggerChildren: 0.1 } },
  exit: { opacity: 0 },
};

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, y: 20 },
};

const NoDataMessage = () => (
  <div className="text-center py-8">
    <Text>No data available for the selected period.</Text>
  </div>
);

const calculateTotals = (monthlyData: any[] | undefined) => {
  if (!monthlyData || monthlyData.length === 0) {
    return {
      totalCalls: 0,
      totalCost: 0,
      avgCostPerCall: 0,
    };
  }

  const totals = monthlyData.reduce(
    (acc, curr) => ({
      totalCalls: acc.totalCalls + curr.calls,
      totalCost: acc.totalCost + curr.cost,
    }),
    { totalCalls: 0, totalCost: 0 }
  );

  return {
    ...totals,
    avgCostPerCall: totals.totalCalls > 0 ? totals.totalCost / totals.totalCalls : 0,
  };
};

export default function Dashboard() {
  const [data, setData] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  // const [showScheduleModal, setShowScheduleModal] = useState(false);
  // const [showAlertModal, setShowAlertModal] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [calls, setCalls] = useState<VapiCall[]>([]);
  const [loadingCalls, setLoadingCalls] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCall, setSelectedCall] = useState<VapiCall | null>(null);
  const [showCallModal, setShowCallModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [callFilters, setCallFilters] = useState({
    status: 'all',
    duration: 'all',
    cost: 'all',
    date: 'all'
  });
  const { user } = useAuthStore();
  const { shouldRefresh, updateLastRefresh } = usePageStore();

  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    const loadCalls = async () => {
      setLoadingCalls(true);
      try {
        const callsData = await fetchVapiCalls();
        setCalls(callsData);
      } catch (error) {
        console.error('Error loading calls:', error);
      } finally {
        setLoadingCalls(false);
      }
    };
  
    loadCalls();
  }, []);

  const getFirstName = (displayName: string | null) => {
    if (!displayName) return '';
    return displayName.split(' ')[0];
  };

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const result = await fetchDashboardData();
      if (result) {
        setData(result);
        updateLastRefresh('dashboard');
      } else {
        console.log('No dashboard data available');
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    try {
      setIsRefreshing(true);
      const newData = await fetchDashboardData();
      if (newData) {
        setData(newData);
        updateLastRefresh('dashboard');
      } else {
        console.log('No dashboard data available');
      }
    } catch (error) {
      console.error('Error refreshing dashboard data:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []); 

  useEffect(() => {
    if (shouldRefresh('dashboard')) {
      refreshData();
    }
  }, [shouldRefresh]); 

  if (loading) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center">
        <LoadingSpinner size={60} />
        <p className="text-gray-500 animate-pulse font-medium mt-4">Loading dashboard data...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center">
        <p className="text-gray-500 font-medium">No dashboard data available</p>
        <Button
          onClick={refreshData}
          disabled={isRefreshing}
          className="mt-4"
        >
          Retry Loading
        </Button>
      </div>
    );
  }

  // Filter all calls first, then paginate
  const filteredCalls = calls.filter(call => {
    const matchesSearch = searchQuery === '' || 
      (call.customer?.number || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (call.analysis?.summary || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = callFilters.status === 'all' || call.status.toLowerCase() === callFilters.status;
    
    const matchesDuration = callFilters.duration === 'all' || (() => {
      const duration = Math.round(
        (new Date(call.endedAt).getTime() - new Date(call.startedAt).getTime()) / 1000
      );
      switch(callFilters.duration) {
        case 'very-short': return duration < 60; // < 1 minute
        case 'short': return duration >= 60 && duration < 300; // 1-5 minutes
        case 'medium': return duration >= 300; // > 5 minutes
        default: return true;
      }
    })();

    const matchesCost = callFilters.cost === 'all' || (() => {
      const cost = call.cost;
      switch(callFilters.cost) {
        case 'very-low': return cost < 0.5; // < $0.5
        case 'low': return cost >= 0.5 && cost < 5; // $0.5-$5
        case 'medium': return cost >= 5; // > $5
        default: return true;
      }
    })();

    const matchesDate = callFilters.date === 'all' || (() => {
      const callDate = new Date(call.startedAt);
      const now = new Date();
      
      const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay()); // Start of week (Sunday)
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      switch(callFilters.date) {
        case 'today':
          return callDate >= startOfToday;
        case 'week':
          return callDate >= startOfWeek;
        case 'month':
          return callDate >= startOfMonth;
        default:
          return true;
      }
    })();

    return matchesSearch && matchesStatus && matchesDuration && matchesCost && matchesDate;
  }).sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()); // Sort by most recent first

  const totalPages = Math.ceil(filteredCalls.length / ITEMS_PER_PAGE);
  const paginatedCalls = filteredCalls.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <motion.div 
      className="min-h-screen bg-white p-6 relative z-0"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={containerVariants}
    >
      {/* Header Section */}
      <motion.div 
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 relative z-10"
        variants={fadeInUp}
      >
        <div className="relative">
          <div className="relative space-y-2">
            <div className="flex flex-col">
              <Title className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {user?.displayName ? `${getFirstName(user.displayName)}'s Dashboard` : 'Dashboard'}
              </Title>
              <Text className="text-lg text-gray-500 flex items-center gap-2 mt-2">
                <span className="font-medium">Last updated: {format(new Date(), 'MMM d, yyyy, h:mm a')}</span>
                {user?.email && (
                  <span className="text-sm px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full font-medium">
                    {user.email}
                  </span>
                )}
              </Text>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              icon={Calendar}
              variant="secondary"
              onClick={() => setShowScheduleModal(true)}
            >
              Schedule
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              icon={Bell}
              variant="secondary"
              onClick={() => setShowAlertModal(true)}
            >
              Alerts
            </Button>
          </motion.div> */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              icon={Download}
              variant="secondary"
              onClick={() => setShowExportModal(true)}
            >
              Export
            </Button>
          </motion.div>
          <div className="h-8 w-px bg-gray-200" /> {/* Divider */}
          <motion.button
            onClick={refreshData}
            disabled={isRefreshing}
            className={`relative flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium transition-all
              ${isRefreshing 
                ? 'bg-indigo-400 cursor-not-allowed' 
                : 'bg-indigo-600 hover:bg-indigo-700 active:scale-95'
              }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isRefreshing ? (
              <>
                <LoadingSpinner size={24} color="#ffffff" />
                <span>Refreshing...</span>
              </>
            ) : (
              <>
                <motion.svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                  animate={isRefreshing ? { rotate: 360 } : {}}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
                  />
                </motion.svg>
                <span>Refresh</span>
              </>
            )}
          </motion.button>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <Grid numItems={1} numItemsSm={2} numItemsLg={4} className="gap-6 mb-8 relative z-20">
        <motion.div 
          variants={fadeInUp}
          whileHover={{ scale: 1.03, zIndex: 30 }}
          className="relative"
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Card 
            className="bg-gray-50 border border-gray-200 hover:border-gray-300 shadow-lg hover:shadow-xl transition-all duration-300 relative"
            decoration="top"
            decorationColor="orange"
          >
            <div className="flex items-center justify-between">
              <div className="rounded-full bg-orange-100 p-3">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
              {data && (
                <div className={`flex items-center gap-1 text-sm ${data.totalCallMinutesTrend < 0 ? 'text-red-600' : 'text-green-600'}`}>
                  <span>{data.totalCallMinutesTrend.toFixed(1)}%</span>
                  <TrendingUp className={`h-4 w-4 ${data.totalCallMinutesTrend < 0 ? 'rotate-180' : ''}`} />
                </div>
              )}
            </div>
            <div className="mt-4">
              <Text className="text-gray-600">Total Call Minutes</Text>
              <Title className="text-3xl font-bold text-gray-900">
                {data?.totalCallMinutes.toFixed(1)}
              </Title>
            </div>
          </Card>
        </motion.div>

        <motion.div 
          variants={fadeInUp}
          whileHover={{ scale: 1.03, zIndex: 30 }}
          className="relative"
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Card 
            className="bg-gray-50 border border-gray-200 hover:border-gray-300 shadow-lg hover:shadow-xl transition-all duration-300 relative"
            decoration="top"
            decorationColor="blue"
          >
            <div className="flex items-center justify-between">
              <div className="rounded-full bg-blue-100 p-3">
                <PhoneCall className="h-6 w-6 text-blue-600" />
              </div>
              {data && (
                <div className={`flex items-center gap-1 text-sm ${data.numberOfCallsTrend < 0 ? 'text-red-600' : 'text-green-600'}`}>
                  <span>{data.numberOfCallsTrend.toFixed(1)}%</span>
                  <TrendingUp className={`h-4 w-4 ${data.numberOfCallsTrend < 0 ? 'rotate-180' : ''}`} />
                </div>
              )}
            </div>
            <div className="mt-4">
              <Text className="text-gray-600">Number of Calls</Text>
              <Title className="text-3xl font-bold text-gray-900">
                {data?.numberOfCalls}
              </Title>
            </div>
          </Card>
        </motion.div>

        <motion.div 
          variants={fadeInUp}
          whileHover={{ scale: 1.03, zIndex: 30 }}
          className="relative"
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Card 
            className="bg-gray-50 border border-gray-200 hover:border-gray-300 shadow-lg hover:shadow-xl transition-all duration-300 relative"
            decoration="top"
            decorationColor="green"
          >
            <div className="flex items-center justify-between">
              <div className="rounded-full bg-green-100 p-3">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              {data && (
                <div className={`flex items-center gap-1 text-sm ${data.totalSpentTrend < 0 ? 'text-red-600' : 'text-green-600'}`}>
                  <span>{data.totalSpentTrend.toFixed(1)}%</span>
                  <TrendingUp className={`h-4 w-4 ${data.totalSpentTrend < 0 ? 'rotate-180' : ''}`} />
                </div>
              )}
            </div>
            <div className="mt-4">
              <Text className="text-gray-600">Total Spent</Text>
              <Title className="text-3xl font-bold text-gray-900">
                ${data?.totalSpent.toFixed(2)}
              </Title>
            </div>
          </Card>
        </motion.div>

        <motion.div 
          variants={fadeInUp}
          whileHover={{ scale: 1.03, zIndex: 30 }}
          className="relative"
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Card 
            className="bg-gray-50 border border-gray-200 hover:border-gray-300 shadow-lg hover:shadow-xl transition-all duration-300 relative"
            decoration="top"
            decorationColor="purple"
          >
            <div className="flex items-center justify-between">
              <div className="rounded-full bg-purple-100 p-3">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
              {data && (
                <div className={`flex items-center gap-1 text-sm ${data.avgCostPerCallTrend < 0 ? 'text-red-600' : 'text-green-600'}`}>
                  <span>{data.avgCostPerCallTrend.toFixed(1)}%</span>
                  <TrendingUp className={`h-4 w-4 ${data.avgCostPerCallTrend < 0 ? 'rotate-180' : ''}`} />
                </div>
              )}
            </div>
            <div className="mt-4">
              <Text className="text-gray-600">Average Cost per Call</Text>
              <Title className="text-3xl font-bold text-gray-900">
                ${data?.avgCostPerCall.toFixed(2)}
              </Title>
            </div>
          </Card>
        </motion.div>
      </Grid>

      {/* Tab Navigation */}
      <TabGroup className="relative z-10">
        <TabList className="mt-8 mb-6">
          <Tab icon={BarChart2} className="gap-2">Overview</Tab>
          <Tab icon={PhoneCall} className="gap-2">Calls</Tab>
        </TabList>

        <TabPanels>
          {/* Overview Panel */}
          <TabPanel>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="relative z-10"
            >
              <Grid numItems={1} numItemsMd={2} className="gap-6 mb-6">
                {/* Call Distribution Chart */}
                <motion.div
                  whileHover={{ scale: 1.01, zIndex: 30 }}
                  className="relative"
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Card className="bg-gray-50 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 relative">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <Title className="text-2xl font-bold">
                          Total Call Ended
                        </Title>
                      </div>
                      <div className="flex items-center gap-4">
                        {data?.callDistribution.map((item, index) => (
                          <div key={item.name} className="flex items-center gap-2">
                            <div 
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: index === 0 ? "#ef4444" : index === 1 ? "#10b981" : "#f59e0b" }}
                            />
                            <Text className="text-sm text-gray-600">
                              {item.name.split('-')[0]}
                            </Text>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex justify-center relative group">
                      <div className="relative w-full max-w-[300px]">
                        <DonutChart
                          data={data?.callDistribution || []}
                          category="value"
                          index="name"
                          valueFormatter={(value: number) => `${value.toFixed(1)}%`}
                          colors={["#ef4444", "#10b981", "#f59e0b"]}
                          showAnimation={true}
                          className="h-[300px]"
                          showTooltip={false}
                          showLabel={false}
                        />
                        <div 
                          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/95 p-4 rounded-lg shadow-lg border border-gray-100"
                        >
                          {data?.callDistribution.map((item, index) => (
                            <div 
                              key={item.name}
                              className="flex items-center gap-2 mb-2 last:mb-0"
                            >
                              <div 
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: index === 0 ? "#ef4444" : index === 1 ? "#10b981" : "#f59e0b" }}
                              />
                              <div className="flex items-center gap-2">
                                <Text className="text-gray-900 font-medium">
                                  {item.count}
                                </Text>
                                <Text className="text-gray-600">
                                  {item.name.split('-').join(' ')}
                                </Text>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-1 gap-4">
                      <Card className="bg-white/50 border border-gray-100">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-indigo-100 rounded-lg">
                            <PhoneOff className="h-5 w-5 text-indigo-600" />
                          </div>
                          <div>
                            <Text className="text-sm text-gray-600">Total Calls Ended</Text>
                            <Title className="text-lg font-bold text-gray-900">
                              {data?.callDistribution.reduce((acc, curr) => acc + curr.count, 0) || 0}
                            </Title>
                          </div>
                        </div>
                      </Card>
                    </div>
                  </Card>
                </motion.div>

                {/* Monthly Trend Card */}
                <motion.div
                  whileHover={{ scale: 1.01, zIndex: 30 }}
                  className="relative"
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Card className="bg-gray-50 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 relative">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <Title className="text-2xl font-bold text-gray-900">Monthly Trend</Title>
                        <Text className="text-sm text-gray-600">Call volume and cost analysis over time</Text>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-indigo-500" />
                          <Text className="text-sm text-gray-600">Calls</Text>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-emerald-400" />
                          <Text className="text-sm text-gray-600">Cost</Text>
                        </div>
                      </div>
                    </div>

                    <div className="h-[300px] w-full pl-4" style={{ minWidth: '200px', minHeight: '200px' }}>
                      {data?.monthlyTrend && data.monthlyTrend.length > 0 ? (
                        <AreaChart
                          className="h-full w-full"
                          data={data.monthlyTrend
                            .filter(item => !selectedMonth || item.date === selectedMonth)
                            .sort((a, b) => a.date.localeCompare(b.date))
                            .map(item => ({
                              date: formatMonthYear(item.date),
                              calls: item.calls,
                              cost: item.cost
                            }))}
                          index="date"
                          categories={["calls", "cost"]}
                          colors={["indigo", "emerald"]}
                          valueFormatter={(value: number) => value.toFixed(2)}
                          showLegend={false}
                          showAnimation={true}
                          showGridLines={false}
                          showXAxis={true}
                          showYAxis={true}
                          yAxisWidth={40}
                          startEndOnly={false}
                          autoMinValue={true}
                          connectNulls={true}
                          onValueChange={(v) => console.log(v)}
                          customTooltip={({ payload }) => {
                            if (!payload || !Array.isArray(payload) || payload.length === 0) return null;
                            
                            const date = payload[0]?.payload?.date;
                            const calls = payload[0]?.value;
                            const cost = payload[1]?.value;
                            
                            if (!date || typeof calls === 'undefined') return null;

                            return (
                              <div className="rounded-lg border border-gray-100 bg-white p-4 shadow-lg">
                                <div className="font-medium text-gray-900">
                                  {date}
                                </div>
                                <div className="mt-1 font-medium text-gray-600">
                                  <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-indigo-500" />
                                    <Text className="text-sm text-gray-600">
                                      {calls} calls
                                    </Text>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-emerald-400" />
                                    <Text className="text-sm text-gray-600">
                                      ${typeof cost === 'number' ? cost.toFixed(2) : '0.00'} cost
                                    </Text>
                                  </div>
                                </div>
                              </div>
                            );
                          }}
                        />
                      ) : (
                        <NoDataMessage />
                      )}
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <Card 
                        className="bg-white/50 border border-gray-100 hover:shadow-lg transition-all duration-300"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-indigo-100/80 rounded-lg">
                            <TrendingUp className="h-5 w-5 text-indigo-600" />
                          </div>
                          <div>
                            <Text className="text-sm text-gray-600">Total Calls</Text>
                            <Title className="text-lg font-bold text-gray-900 flex items-baseline gap-1">
                              {data?.numberOfCalls || 0}
                              <span className="text-xs font-normal text-gray-500">calls</span>
                            </Title>
                          </div>
                        </div>
                      </Card>

                      <Card 
                        className="bg-white/50 border border-gray-100 hover:shadow-lg transition-all duration-300"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-emerald-100/80 rounded-lg">
                            <DollarSign className="h-5 w-5 text-emerald-600" />
                          </div>
                          <div>
                            <Text className="text-sm text-gray-600">Total Cost</Text>
                            <Title className="text-lg font-bold text-gray-900 flex items-baseline gap-1">
                              ${data?.totalSpent.toFixed(2) || '0.00'}
                              <span className="text-xs font-normal text-gray-500">USD</span>
                            </Title>
                          </div>
                        </div>
                      </Card>
                    </div>
                  </Card>
                </motion.div>
              </Grid>

              {/* Cost Analysis */}
              <motion.div
                whileHover={{ scale: 1.01, zIndex: 30 }}
                className="grid gap-6 relative"
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card className="bg-gray-50 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 relative">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <Title className="text-2xl font-bold text-gray-900">Cost Analysis</Title>
                      <Text className="text-sm text-gray-600">Monthly breakdown of calls and costs</Text>
                    </div>
                    <div className="flex items-center gap-4">
                      <Select
                        value={selectedMonth}
                        onValueChange={setSelectedMonth}
                        className="w-48"
                      >
                        <SelectItem value="">All Months</SelectItem>
                        {getAllMonthsInRange(data).map((monthKey) => (
                          <SelectItem 
                            key={monthKey} 
                            value={monthKey}
                          >
                            {formatMonthYear(monthKey)}
                          </SelectItem>
                        ))}
                      </Select>
                    </div>
                  </div>

                  <div className="h-[300px] w-full pl-4" style={{ minWidth: '200px', minHeight: '200px' }}>
                    {data?.monthlyTrend && data.monthlyTrend.length > 0 ? (
                      <BarChart
                        className="h-full w-full"
                        data={data.monthlyTrend
                          .filter(item => !selectedMonth || item.date === selectedMonth)
                          .sort((a, b) => a.date.localeCompare(b.date))
                          .map(item => ({
                            month: formatMonthYear(item.date),
                            calls: item.calls,
                            cost: item.cost,
                            rawDate: item.date
                          }))}
                        index="month"
                        categories={["calls", "cost"]}
                        colors={["violet", "emerald"]}
                        valueFormatter={(value: number) => {
                          const category = value >= 1 ? 'calls' : 'cost';
                          return category === 'calls' 
                            ? `${Math.round(value)} calls`
                            : Intl.NumberFormat('en-US', {
                                style: 'currency',
                                currency: 'USD',
                                minimumFractionDigits: 2,
                              }).format(value);
                        }}
                        showLegend={true}
                        showAnimation={true}
                        showGridLines={false}
                        showXAxis={true}
                        showYAxis={true}
                        yAxisWidth={60}
                        customTooltip={({ payload }) => {
                          if (!payload?.[0]) return null;
                          const { month, calls, cost } = payload[0].payload;
                          
                          return (
                            <div className="rounded-lg border border-gray-100 bg-white p-4 shadow-lg">
                              <div className="font-medium text-gray-900">
                                {month}
                              </div>
                              <div className="mt-1 space-y-1">
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 rounded-full bg-violet-500" />
                                  <Text className="text-sm font-medium text-gray-600">
                                    {calls} calls
                                  </Text>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 rounded-full bg-emerald-400" />
                                  <Text className="text-sm font-medium text-gray-600">
                                    ${typeof cost === 'number' ? cost.toFixed(2) : '0.00'} cost
                                  </Text>
                                </div>
                              </div>
                            </div>
                          );
                        }}
                      />
                    ) : (
                      <NoDataMessage />
                    )}
                  </div>

                  <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    {(() => {
                      const filteredData = selectedMonth
                        ? data?.monthlyTrend?.filter(item => item.date === selectedMonth)
                        : data?.monthlyTrend;
                      
                      const totals = calculateTotals(filteredData);

                      return (
                        <>
                          <Card 
                            className="bg-white/50 border border-gray-100 hover:shadow-lg transition-all duration-300"
                          >
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-violet-100/80 rounded-lg">
                                <PhoneCall className="h-5 w-5 text-violet-600" />
                              </div>
                              <div>
                                <Text className="text-sm text-gray-600">Total Calls</Text>
                                <Title className="text-lg font-bold text-gray-900 flex items-baseline gap-1">
                                  {totals.totalCalls}
                                  <span className="text-xs font-normal text-gray-500">calls</span>
                                </Title>
                              </div>
                            </div>
                          </Card>

                          <Card 
                            className="bg-white/50 border border-gray-100 hover:shadow-lg transition-all duration-300"
                          >
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-violet-100/80 rounded-lg">
                                <DollarSign className="h-5 w-5 text-violet-600" />
                              </div>
                              <div>
                                <Text className="text-sm text-gray-600">Total Cost</Text>
                                <Title className="text-lg font-bold text-gray-900 flex items-baseline gap-1">
                                  ${totals.totalCost.toFixed(2)}
                                  <span className="text-xs font-normal text-gray-500">USD</span>
                                </Title>
                              </div>
                            </div>
                          </Card>

                          <Card 
                            className="bg-white/50 border border-gray-100 hover:shadow-lg transition-all duration-300"
                          >
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-violet-100/80 rounded-lg">
                                <TrendingUp className="h-5 w-5 text-violet-600" />
                              </div>
                              <div>
                                <Text className="text-sm text-gray-600">Avg Cost/Call</Text>
                                <Title className="text-lg font-bold text-gray-900 flex items-baseline gap-1">
                                  ${totals.avgCostPerCall.toFixed(2)}
                                  <span className="text-xs font-normal text-gray-500">USD</span>
                                </Title>
                              </div>
                            </div>
                          </Card>
                        </>
                      );
                    })()}
                  </div>
                </Card>
              </motion.div>
            </motion.div>
          </TabPanel>

         {/* Calls Panel */}
         <TabPanel>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="bg-gray-50 border border-gray-200 shadow-lg">
                <div className="space-y-6">
                  {/* Header and Filters */}
                  <div className="flex flex-col space-y-4">
                    <div className="flex items-center justify-between">
                      <Title>Recent Calls</Title>
                      <div className="flex items-center gap-2">
                        <TextInput
                          icon={Search}
                          placeholder="Search calls..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-64"
                        />
                        <Badge
                          color="blue"
                          size="xl"
                        >
                          {filteredCalls.length} Calls
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-3 bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-500">Status:</span>
                        <Select
                          value={callFilters.status}
                          onValueChange={(value) => setCallFilters(prev => ({ ...prev, status: value }))}
                          className="w-36"
                        >
                          <SelectItem value="all">All Status</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="failed">Failed</SelectItem>
                          <SelectItem value="in-progress">In Progress</SelectItem>
                        </Select>
                      </div>

                      <div className="h-6 w-px bg-gray-300" />

                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-500">Duration:</span>
                        <Select
                          value={callFilters.duration}
                          onValueChange={(value) => setCallFilters(prev => ({ ...prev, duration: value }))}
                          className="w-36"
                        >
                          <SelectItem value="all">All Durations</SelectItem>
                          <SelectItem value="very-short">&lt; 1 min</SelectItem>
                          <SelectItem value="short">1-5 min</SelectItem>
                          <SelectItem value="medium">&gt; 5 min</SelectItem>
                        </Select>
                      </div>

                      <div className="h-6 w-px bg-gray-300" />

                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-500">Cost:</span>
                        <Select
                          value={callFilters.cost}
                          onValueChange={(value) => setCallFilters(prev => ({ ...prev, cost: value }))}
                          className="w-36"
                        >
                          <SelectItem value="all">All Costs</SelectItem>
                          <SelectItem value="very-low">&lt; $0.5</SelectItem>
                          <SelectItem value="low">$0.5-$5</SelectItem>
                          <SelectItem value="medium">&gt; $5</SelectItem>
                        </Select>
                      </div>

                      <div className="h-6 w-px bg-gray-300" />

                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-500">Time:</span>
                        <Select
                          value={callFilters.date}
                          onValueChange={(value) => setCallFilters(prev => ({ ...prev, date: value }))}
                          className="w-36"
                        >
                          <SelectItem value="all">All Time</SelectItem>
                          <SelectItem value="today">Today</SelectItem>
                          <SelectItem value="week">This Week</SelectItem>
                          <SelectItem value="month">This Month</SelectItem>
                        </Select>
                      </div>

                      {(callFilters.status !== 'all' || 
                        callFilters.duration !== 'all' || 
                        callFilters.cost !== 'all' || 
                        callFilters.date !== 'all' ||
                        searchQuery !== '') && (
                        <>
                          <div className="h-6 w-px bg-gray-300" />
                          <Button
                            variant="light"
                            color="gray"
                            onClick={() => {
                              setCallFilters({
                                status: 'all',
                                duration: 'all',
                                cost: 'all',
                                date: 'all'
                              });
                              setSearchQuery('');
                            }}
                            icon={X}
                          >
                            Clear Filters
                          </Button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Calls Table */}
                  {loadingCalls ? (
                    <div className="flex justify-center items-center py-8">
                      <LoadingSpinner size={40} />
                    </div>
                  ) : filteredCalls.length > 0 ? (
                    <>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableHeaderCell>Phone Number</TableHeaderCell>
                            <TableHeaderCell>Date & Time</TableHeaderCell>
                            <TableHeaderCell>Duration</TableHeaderCell>
                            <TableHeaderCell>Cost</TableHeaderCell>
                            <TableHeaderCell>Status</TableHeaderCell>
                            <TableHeaderCell>Actions</TableHeaderCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {paginatedCalls.map((call) => (
                            <TableRow 
                              key={call.id}
                            >
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Phone className="w-4 h-4 text-gray-400" />
                                  <span className="font-medium">{call.customer?.number || 'Unknown'}</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex flex-col">
                                  <span>{format(new Date(call.startedAt), 'MMM d, yyyy')}</span>
                                  <span className="text-sm text-gray-500">{format(new Date(call.startedAt), 'h:mm a')}</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                {(() => {
                                  const duration = Math.round(
                                    (new Date(call.endedAt).getTime() - new Date(call.startedAt).getTime()) / 1000
                                  );
                                  const minutes = Math.floor(duration / 60);
                                  const seconds = duration % 60;
                                  return (
                                    <div className="flex items-center gap-1">
                                      <Clock className="w-4 h-4 text-gray-400" />
                                      <span>{minutes}:{seconds.toString().padStart(2, '0')}</span>
                                    </div>
                                  );
                                })()}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-1">
                                  <DollarSign className="w-4 h-4 text-gray-400" />
                                  <span>{call.cost.toFixed(2)}</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge
                                  color={
                                    call.status === 'completed' ? 'green' :
                                    call.status === 'failed' ? 'red' : 'yellow'
                                  }
                                  className="capitalize"
                                >
                                  {call.status}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Button
                                  size="xs"
                                  variant="secondary"
                                  onClick={() => {
                                    setSelectedCall(call);
                                    setShowCallModal(true);
                                  }}
                                >
                                  View Details
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>

                       {/* Pagination */}
                       {totalPages > 1 && (
                        <div className="flex justify-between items-center mt-6 px-2">
                          <div className="text-sm text-gray-500">
                            Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredCalls.length)} of {filteredCalls.length} calls
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              size="xs"
                              variant="secondary"
                              disabled={currentPage === 1}
                              onClick={() => handlePageChange(currentPage - 1)}
                              icon={ChevronLeft}
                            >
                              Previous
                            </Button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                              <Button
                                key={page}
                                size="xs"
                                variant={currentPage === page ? "primary" : "secondary"}
                                onClick={() => handlePageChange(page)}
                              >
                                {page}
                              </Button>
                            ))}
                            <Button
                              size="xs"
                              variant="secondary"
                              disabled={currentPage === totalPages}
                              onClick={() => handlePageChange(currentPage + 1)}
                              icon={ChevronRight}
                            >
                              Next
                            </Button>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-12">
                      <div className="flex flex-col items-center gap-3">
                        <PhoneOff className="w-12 h-12 text-gray-400" />
                        <Text>No calls found matching your filters.</Text>
                        <Button
                          variant="light"
                          onClick={() => {
                            setCallFilters({
                              status: 'all',
                              duration: 'all',
                              cost: 'all',
                              date: 'all'
                            });
                            setSearchQuery('');
                          }}
                        >
                          Clear Filters
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          </TabPanel>
        </TabPanels>
      </TabGroup>

      {/* Modals */}
      <ExportModal 
        isOpen={showExportModal} 
        onClose={() => setShowExportModal(false)}
        data={data}
      />
      {/* <ScheduleModal 
        isOpen={showScheduleModal} 
        onClose={() => setShowScheduleModal(false)}
        onSchedule={(scheduleData) => {
          console.log('Schedule data:', scheduleData);
          setShowScheduleModal(false);
        }}
      />
      <AlertSettingsModal 
        isOpen={showAlertModal} 
        onClose={() => setShowAlertModal(false)}
        onSave={(alertSettings) => {
          console.log('Alert settings:', alertSettings);
          setShowAlertModal(false);
        }}
      /> */}
      {selectedCall && (
        <CallDetailsModal
          call={selectedCall}
          isOpen={showCallModal}
          onClose={() => {
            setShowCallModal(false);
            setSelectedCall(null);
          }}
        />
      )}
    </motion.div>
  );
}