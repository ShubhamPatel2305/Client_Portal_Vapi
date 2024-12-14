import React, { useState, useEffect } from 'react';
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
  Select,
  SelectItem,
  BarChart,
  Button,
  Badge,
  AreaChart,
  DonutChart,
  Metric,
} from '@tremor/react';
import { format } from 'date-fns';
import { 
  Calendar,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  Clock,
  Phone,
  DollarSign,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  Activity as ActivityIcon,
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import { fetchDashboardData } from '../lib/api';
import type { Analytics as AnalyticsType } from '../lib/api/vapiService';

// Define interface for trend data
interface TrendData {
  totalCallMinutesTrend: number;
  numberOfCallsTrend: number;
  totalSpentTrend: number;
  costPerMinuteTrend: number;
}

const timeRanges = [
  { label: 'Last 7 Days', value: '7d' },
  { label: 'Last 30 Days', value: '30d' },
  { label: 'Last 90 Days', value: '90d' },
] as const;

const OverviewMetrics: React.FC<{ data: AnalyticsType & Partial<TrendData> }> = ({ data }) => {
  const successRate = data.callDistribution?.find(d => d.name === 'Successful')?.value || 0;
  
  // Calculate metrics with proper fallbacks and formatting
  const totalCalls = data.numberOfCalls || 0;
  const avgDuration = (data.totalCallMinutes / (totalCalls || 1)).toFixed(1);
  const avgCostPerMinute = data.totalCallMinutes > 0 ? (data.totalSpent / data.totalCallMinutes) : 0;

  // Safely access nested values
  const successfulCallData = data.callDistribution?.find(d => d.name === 'Successful');
  const successValue = successfulCallData?.value ?? 0;

  return (
    <Grid numItems={1} numItemsSm={2} numItemsLg={4} className="gap-6">
      {/* Total Calls Card */}
      <motion.div 
        variants={{ initial: { opacity: 0, y: 20 }, enter: { opacity: 1, y: 0 } }}
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
              <Phone className="h-6 w-6 text-blue-600" />
            </div>
            {data.numberOfCallsTrend !== undefined && (
              <div className={`flex items-center gap-1 text-sm ${data.numberOfCallsTrend < 0 ? 'text-red-600' : 'text-green-600'}`}>
                <span>{data.numberOfCallsTrend.toFixed(1)}%</span>
                {data.numberOfCallsTrend < 0 ? (
                  <TrendingDown className="h-4 w-4" />
                ) : (
                  <TrendingUp className="h-4 w-4" />
                )}
              </div>
            )}
          </div>
          <div className="mt-4">
            <Text className="text-gray-600">Total Calls</Text>
            <Title className="text-3xl font-bold text-gray-900">
              {totalCalls}
            </Title>
          </div>
        </Card>
      </motion.div>

      {/* Success Rate Card */}
      <motion.div 
        variants={{ initial: { opacity: 0, y: 20 }, enter: { opacity: 1, y: 0 } }}
        whileHover={{ scale: 1.03, zIndex: 30 }}
        className="relative"
        transition={{ type: "spring", stiffness: 300 }}
      >
        <Card 
          className="bg-gray-50 border border-gray-200 hover:border-gray-300 shadow-lg hover:shadow-xl transition-all duration-300 relative"
          decoration="top"
          decorationColor="emerald"
        >
          <div className="flex items-center justify-between">
            <div className="rounded-full bg-emerald-100 p-3">
              <CheckCircle className="h-6 w-6 text-emerald-600" />
            </div>
            {successValue !== undefined && (
              <div className={`flex items-center gap-1 text-sm ${successValue < 0 ? 'text-red-600' : 'text-green-600'}`}>
                <span>{successValue.toFixed(1)}%</span>
                {successValue < 0 ? (
                  <TrendingDown className="h-4 w-4" />
                ) : (
                  <TrendingUp className="h-4 w-4" />
                )}
              </div>
            )}
          </div>
          <div className="mt-4">
            <Text className="text-gray-600">Success Rate</Text>
            <Title className="text-3xl font-bold text-gray-900">
              {successRate.toFixed(1)}%
            </Title>
          </div>
        </Card>
      </motion.div>

      {/* Average Duration Card */}
      <motion.div 
        variants={{ initial: { opacity: 0, y: 20 }, enter: { opacity: 1, y: 0 } }}
        whileHover={{ scale: 1.03, zIndex: 30 }}
        className="relative"
        transition={{ type: "spring", stiffness: 300 }}
      >
        <Card 
          className="bg-gray-50 border border-gray-200 hover:border-gray-300 shadow-lg hover:shadow-xl transition-all duration-300 relative"
          decoration="top"
          decorationColor="amber"
        >
          <div className="flex items-center justify-between">
            <div className="rounded-full bg-amber-100 p-3">
              <Clock className="h-6 w-6 text-amber-600" />
            </div>
            {data.totalCallMinutesTrend !== undefined && (
              <div className={`flex items-center gap-1 text-sm ${data.totalCallMinutesTrend < 0 ? 'text-red-600' : 'text-green-600'}`}>
                <span>{data.totalCallMinutesTrend.toFixed(1)}%</span>
                {data.totalCallMinutesTrend < 0 ? (
                  <TrendingDown className="h-4 w-4" />
                ) : (
                  <TrendingUp className="h-4 w-4" />
                )}
              </div>
            )}
          </div>
          <div className="mt-4">
            <Text className="text-gray-600">Average Duration</Text>
            <Title className="text-3xl font-bold text-gray-900">
              {avgDuration} min
            </Title>
          </div>
        </Card>
      </motion.div>

      {/* Cost Efficiency Card */}
      <motion.div 
        variants={{ initial: { opacity: 0, y: 20 }, enter: { opacity: 1, y: 0 } }}
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
            {data.costPerMinuteTrend !== undefined && (
              <div className={`flex items-center gap-1 text-sm ${data.costPerMinuteTrend < 0 ? 'text-red-600' : 'text-green-600'}`}>
                <span>{data.costPerMinuteTrend.toFixed(1)}%</span>
                {data.costPerMinuteTrend < 0 ? (
                  <TrendingDown className="h-4 w-4" />
                ) : (
                  <TrendingUp className="h-4 w-4" />
                )}
              </div>
            )}
          </div>
          <div className="mt-4">
            <Text className="text-gray-600">Cost Efficiency</Text>
            <Title className="text-3xl font-bold text-gray-900">
              ${avgCostPerMinute.toFixed(2)}/min
            </Title>
          </div>
        </Card>
      </motion.div>
    </Grid>
  );
};

const PerformanceTab: React.FC<{ data: AnalyticsType }> = ({ data }) => {
  // Create sample data if no data is available
  const sampleData = Array.from({ length: 7 }, (_, i) => ({
    date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toISOString(),
    calls: Math.floor(Math.random() * 4),
    cost: Math.random() * 2,
  }));

  const monthlyTrend = data.monthlyTrend?.length > 0 ? data.monthlyTrend : sampleData;

  const chartData = monthlyTrend.map(item => ({
    date: format(new Date(item.date), 'MMM d'),
    Calls: item.calls || 0,
    Cost: parseFloat((item.cost || 0).toFixed(2)),
    "Avg Duration": item.calls > 0 ? Math.round((item.cost || 0) / item.calls) : 0,
  }));

  // Generate hourly distribution
  const hourlyData = Array.from({ length: 24 }, (_, hour) => ({
    hour: `${hour.toString().padStart(2, '0')}:00`,
    calls: Math.floor(Math.random() * 3), // Sample data for visualization
  }));

  return (
    <div className="space-y-6">
      <Card className="bg-white rounded-xl shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <Title>Call Performance Trends</Title>
            <Text className="text-gray-500">Daily call metrics over time</Text>
          </div>
          <Badge color="blue" icon={TrendingUp}>
            Growing
          </Badge>
        </div>
        <AreaChart
          className="h-72 mt-4"
          data={chartData}
          index="date"
          categories={["Calls", "Cost", "Avg Duration"]}
          colors={["blue", "emerald", "amber"]}
          valueFormatter={(value) => `${value.toLocaleString()}`}
          showLegend
          showGridLines
        />
      </Card>

      <Grid numItems={1} numItemsSm={2} className="gap-6">
        <Card className="bg-white rounded-xl shadow-sm">
          <Title>Peak Hours Analysis</Title>
          <Text className="text-gray-500">Call distribution by hour</Text>
          <div className="space-y-4 mt-4">
            {hourlyData.map((item, index) => (
              <div key={item.hour}>
                <div className="flex justify-between mb-1">
                  <Text>{item.hour}</Text>
                  <Text className="font-medium">{item.calls} calls</Text>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className={`h-full ${index % 2 === 0 ? 'bg-blue-500' : 'bg-emerald-500'}`}
                    style={{ width: `${(item.calls / 3) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="bg-white rounded-xl shadow-sm">
          <Title>Cost Analysis</Title>
          <Text className="text-gray-500">Breakdown of costs</Text>
          <div className="space-y-4 mt-4">
            {[
              { category: 'Voice Calls', amount: data.totalSpent * 0.7 },
              { category: 'AI Processing', amount: data.totalSpent * 0.2 },
              { category: 'Other Services', amount: data.totalSpent * 0.1 },
            ].map((item, index) => (
              <div key={item.category}>
                <div className="flex justify-between mb-1">
                  <Text>{item.category}</Text>
                  <Text className="font-medium">${item.amount.toFixed(2)}</Text>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className={`h-full ${index % 2 === 0 ? 'bg-blue-500' : 'bg-emerald-500'}`}
                    style={{ width: `${(item.amount / data.totalSpent) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </Grid>
    </div>
  );
};

const DistributionTab: React.FC<{ data: AnalyticsType }> = ({ data }) => {
  const donutData = data.callDistribution.map(item => ({
    name: item.name,
    value: item.count,
  }));

  return (
    <Grid numItems={1} numItemsSm={2} className="gap-6">
      <Card className="transform transition-all duration-300 hover:shadow-lg">
        <Title>Call Status Distribution</Title>
        <Text className="text-gray-500">Breakdown of call outcomes</Text>
        <DonutChart
          className="h-80 mt-4"
          data={donutData}
          category="value"
          index="name"
          colors={["emerald", "red", "amber"]}
          valueFormatter={(value) => `${value.toLocaleString()} calls`}
          showAnimation
        />
      </Card>

      <Card className="transform transition-all duration-300 hover:shadow-lg">
        <Title>Key Metrics</Title>
        <div className="mt-4 space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Text>Success Rate</Text>
              <Badge color="emerald">
                {data.callDistribution.find(d => d.name === 'Successful')?.value || 0}%
              </Badge>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
              <div 
                className="h-full bg-emerald-500"
                style={{ width: `${data.callDistribution.find(d => d.name === 'Successful')?.value || 0}%` }}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Text>Average Cost per Call</Text>
              <Badge color="blue">
                ${data.avgCostPerCall.toFixed(2)}
              </Badge>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
              <div 
                className="h-full bg-blue-500"
                style={{ width: `${(data.avgCostPerCall / 2) * 100}%` }}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Text>Average Duration</Text>
              <Badge color="amber">
                {Math.round(data.totalCallMinutes / data.numberOfCalls)} min
              </Badge>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
              <div 
                className="h-full bg-amber-500"
                style={{ width: `${(data.totalCallMinutes / data.numberOfCalls / 10) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </Card>
    </Grid>
  );
};

const QualityTab: React.FC<{ data: AnalyticsType }> = ({ data }) => {
  // Calculate quality metrics
  const avgDuration = data.totalCallMinutes / data.numberOfCalls;
  const costEfficiency = data.avgCostPerCall;
  const successRate = data.callDistribution.find(d => d.name === 'Successful')?.value || 0;

  const qualityScore = Math.min(
    ((successRate / 100) * 0.4 + 
    (1 - (costEfficiency / 2)) * 0.3 + 
    (Math.min(avgDuration / 10, 1)) * 0.3) * 100,
    100
  );

  return (
    <div className="space-y-6">
      <Card className="transform transition-all duration-300 hover:shadow-lg">
        <div className="flex justify-between items-start mb-6">
          <div>
            <Title>Quality Score</Title>
            <Text className="text-gray-500">Combined performance metric</Text>
          </div>
          <div className="text-right">
            <Metric>{Math.round(qualityScore)}%</Metric>
            <Badge color={qualityScore >= 75 ? "emerald" : qualityScore >= 50 ? "amber" : "red"}>
              {qualityScore >= 75 ? "Excellent" : qualityScore >= 50 ? "Good" : "Needs Improvement"}
            </Badge>
          </div>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
          <div 
            className={`h-full ${
              qualityScore >= 75 ? 'bg-emerald-500' : 
              qualityScore >= 50 ? 'bg-amber-500' : 
              'bg-red-500'
            }`}
            style={{ width: `${qualityScore}%` }}
          />
        </div>
      </Card>

      <Grid numItems={1} numItemsSm={3} className="gap-6">
        <Card className="transform transition-all duration-300 hover:shadow-lg">
          <div className="flex flex-col items-center">
            <div className="p-4 bg-emerald-100 rounded-full mb-4">
              <CheckCircle className="h-8 w-8 text-emerald-600" />
            </div>
            <Title>Success Rate</Title>
            <Text className="font-medium mt-2">{successRate}%</Text>
            <Text className="text-gray-500 text-center mt-2">
              Of all calls completed successfully
            </Text>
          </div>
        </Card>

        <Card className="transform transition-all duration-300 hover:shadow-lg">
          <div className="flex flex-col items-center">
            <div className="p-4 bg-blue-100 rounded-full mb-4">
              <DollarSign className="h-8 w-8 text-blue-600" />
            </div>
            <Title>Cost Efficiency</Title>
            <Text className="font-medium mt-2">${costEfficiency.toFixed(2)}</Text>
            <Text className="text-gray-500 text-center mt-2">
              Average cost per call
            </Text>
          </div>
        </Card>

        <Card className="transform transition-all duration-300 hover:shadow-lg">
          <div className="flex flex-col items-center">
            <div className="p-4 bg-amber-100 rounded-full mb-4">
              <Clock className="h-8 w-8 text-amber-600" />
            </div>
            <Title>Avg Duration</Title>
            <Text className="font-medium mt-2">{Math.round(avgDuration)} min</Text>
            <Text className="text-gray-500 text-center mt-2">
              Average call duration
            </Text>
          </div>
        </Card>
      </Grid>
    </div>
  );
};

const Analytics: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [data, setData] = useState<AnalyticsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const analyticsData = await fetchDashboardData();
        setData(analyticsData);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedPeriod]);

  const refreshData = async () => {
    setIsRefreshing(true);
    try {
      const analyticsData = await fetchDashboardData();
      setData(analyticsData);
    } catch (error) {
      console.error('Error refreshing analytics:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!data) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="p-6 space-y-8 max-w-[1600px] mx-auto"
    >
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Analytics Dashboard
            </h1>
            <p className="text-lg text-gray-600 font-medium">
              Comprehensive insights and performance metrics for your voice API
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <Select
              value={selectedPeriod}
              onValueChange={setSelectedPeriod}
              className="min-w-[180px]"
            >
              {timeRanges.map((range, index) => (
                <SelectItem key={index} value={range.value} icon={Calendar} className="font-medium">
                  {range.label}
                </SelectItem>
              ))}
            </Select>
            
            <Button
              onClick={refreshData}
              disabled={isRefreshing}
              variant="secondary"
              className="bg-white hover:bg-gray-50 border border-gray-200 shadow-sm px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200"
            >
              {isRefreshing ? (
                <>
                  <LoadingSpinner size={16} />
                  <span>Refreshing...</span>
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4" />
                  <span>Refresh</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      <OverviewMetrics data={data} />

      <TabGroup>
        <TabList className="mb-8">
          <Tab icon={BarChartIcon}>Performance</Tab>
          <Tab icon={PieChartIcon}>Distribution</Tab>
          <Tab icon={ActivityIcon}>Quality</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <PerformanceTab data={data} />
          </TabPanel>
          <TabPanel>
            <DistributionTab data={data} />
          </TabPanel>
          <TabPanel>
            <QualityTab data={data} />
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </motion.div>
  );
};

export default Analytics;