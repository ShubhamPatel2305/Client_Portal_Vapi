import { useState, useEffect, useMemo } from 'react';
import {
  Card,
  Title,
  Text,
  AreaChart,
  BarChart, 
  Grid,
  Select,
  SelectItem,
  DateRangePicker,
  DateRangePickerValue,
  DonutChart,
  List,
  ListItem,
  Button,
  Col,
} from '@tremor/react';
import {
  Zap,
  AlertTriangle,
  Clock,
  Globe,
  Users,
  RefreshCw,
} from 'lucide-react';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';
import { motion } from 'framer-motion';
import LoadingSpinner from '../components/LoadingSpinner';
import StatCard from '../components/StatCard';
import { usePageStore } from '../stores/pageStore';
import { showToast } from '../components/Toast';
import { vapiService } from '../lib/api/vapiService';

interface AnalyticsDataPoint {
  timestamp: string;
  callCount: number;
  avgDuration: number;
  totalCost: number;
  activeUsers: number;
}

interface CallMetrics {
  total: number;
  answered: number;
  missed: number;
  avgDuration: number;
  successRate: number;
  peakTime: string;
  avgResponseTime: string;
  responseTimeTrend: number;
  performanceData: Array<{ name: string; value: number }>;
  errorBreakdown: Array<{ name: string; value: number }>;
  typeDistribution: Array<{ name: string; value: number }>;
  hourlyDistribution: Array<{ hour: number; calls: number }>;
}

interface UserMetrics {
  total: number;
  active: number;
  new: number;
  engagementData: Array<{ category: string; value: number }>;
  satisfaction: number;
  satisfactionTrend: number;
}

interface RegionalData {
  region: string;
  calls: number;
  percentage: number;
  value: number;
}

interface AnalyticsData {
  timeSeriesData: AnalyticsDataPoint[];
  callMetrics: CallMetrics;
  userMetrics: UserMetrics;
  regionalData: RegionalData[];
  anomalies: Array<{
    description: string;
    timestamp: string;
  }>;
}

interface Analytics {
  monthlyTrend: Array<{ date: string; calls: number; cost: number }>;
  numberOfCalls: number;
  callDistribution: Array<{ name: string; value: number; count: number }>;
  totalCallMinutes: number;
  numberOfCallsTrend: number;
}

const colors = {
  blue: 'blue',
  cyan: 'cyan',
  violet: 'violet',
  fuchsia: 'fuchsia',
  amber: 'amber',
  emerald: 'emerald',
  rose: 'rose',
  slate: 'slate',
} as const;

const timeRanges = [
  { value: '24h', label: 'Last 24 Hours' },
  { value: '7d', label: 'Last 7 Days' },
  { value: '30d', label: 'Last 30 Days' },
  { value: '90d', label: 'Last 90 Days' },
  { value: 'custom', label: 'Custom Range' },
];

const metrics = [
  { value: 'calls', label: 'Call Volume' },
  { value: 'duration', label: 'Call Duration' },
  { value: 'cost', label: 'Cost' },
  { value: 'users', label: 'Active Users' },
];

// Convert Analytics data from API to our AnalyticsData format
const mapAnalyticsToData = (analytics: Analytics): AnalyticsData => {
  // Create time series data from monthly trend
  const timeSeriesData = analytics.monthlyTrend.map(item => ({
    timestamp: item.date,
    callCount: item.calls,
    avgDuration: 0, // Calculate from total duration / calls
    totalCost: item.cost,
    activeUsers: 0 // This will need to come from a different metric
  }));

  // Extract call metrics
  const callMetrics = {
    total: analytics.numberOfCalls,
    answered: analytics.callDistribution.find(d => d.name === 'success')?.count || 0,
    missed: analytics.callDistribution.find(d => d.name === 'failed')?.count || 0,
    avgDuration: Math.round(analytics.totalCallMinutes / analytics.numberOfCalls) || 0,
    successRate: (analytics.callDistribution.find(d => d.name === 'success')?.value || 0) * 100,
    peakTime: '14:00', // This would need to come from a different metric
    avgResponseTime: '45s', // This would need to come from a different metric
    responseTimeTrend: analytics.numberOfCallsTrend,
    performanceData: analytics.callDistribution.map(d => ({ 
      name: d.name, 
      value: d.value 
    })),
    errorBreakdown: analytics.callDistribution.filter(d => d.name === 'failed').map(d => ({
      name: d.name,
      value: d.count
    })),
    typeDistribution: analytics.callDistribution.map(d => ({
      name: d.name,
      value: d.count
    })),
    hourlyDistribution: [] // This would need to come from a different metric
  };

  // Extract user metrics (these are placeholder values as they're not in the API response)
  const userMetrics = {
    total: 100,
    active: 80,
    new: 20,
    engagementData: [],
    satisfaction: 4.5,
    satisfactionTrend: 0.2
  };

  // Extract regional data (this is a placeholder as it's not in the API response)
  const regionalData: RegionalData[] = [
    {
      region: 'North America',
      calls: analytics.numberOfCalls * 0.4,
      percentage: 40,
      value: analytics.numberOfCalls * 0.4
    },
    {
      region: 'Europe',
      calls: analytics.numberOfCalls * 0.3,
      percentage: 30,
      value: analytics.numberOfCalls * 0.3
    },
    {
      region: 'Asia',
      calls: analytics.numberOfCalls * 0.2,
      percentage: 20,
      value: analytics.numberOfCalls * 0.2
    },
    {
      region: 'Other',
      calls: analytics.numberOfCalls * 0.1,
      percentage: 10,
      value: analytics.numberOfCalls * 0.1
    }
  ];

  // Create anomalies from significant trends
  const anomalies = [
    {
      description: analytics.numberOfCallsTrend > 10 ? 'Significant increase in call volume' : 
                   analytics.numberOfCallsTrend < -10 ? 'Significant decrease in call volume' : 
                   'Normal call volume',
      timestamp: new Date().toISOString()
    }
  ];

  return {
    timeSeriesData,
    callMetrics,
    userMetrics,
    regionalData,
    anomalies
  };
};

const containerVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.3, staggerChildren: 0.1 } },
  exit: { opacity: 0 },
};

const itemVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
};

export default function Analytics() {
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');
  const [dateRange, setDateRange] = useState<DateRangePickerValue>({
    from: subDays(new Date(), 7),
    to: new Date(),
  });
  const [selectedMetric, setSelectedMetric] = useState('calls');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { updateLastRefresh } = usePageStore();

  const refreshData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const startDate = dateRange.from
        ? startOfDay(dateRange.from)
        : subDays(new Date(), parseInt(selectedTimeRange));
      const endDate = dateRange.to
        ? endOfDay(dateRange.to)
        : new Date();

      const analyticsData = await vapiService.getAnalytics(startDate, endDate);
      if (!analyticsData) {
        throw new Error('No data received from the API');
      }
      
      const transformedData = mapAnalyticsToData(analyticsData);
      setData(transformedData);
      updateLastRefresh('analytics');
      showToast('Analytics data refreshed');
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch analytics data';
      setError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, [selectedTimeRange, dateRange.from, dateRange.to]);

  const timeSeriesChart = useMemo(() => {
    if (!data?.timeSeriesData) return null;

    const valueKey = {
      calls: 'callCount',
      duration: 'avgDuration',
      cost: 'totalCost',
      users: 'activeUsers',
    }[selectedMetric] as string; // Ensure valueKey is always a string

    const valueFormatter = {
      calls: (value: number) => `${value} calls`,
      duration: (value: number) => `${value} min`,
      cost: (value: number) => `$${value.toFixed(2)}`,
      users: (value: number) => `${value} users`,
    }[selectedMetric];

    return (
      <Card className="mt-4">
        <div className="flex justify-between items-center mb-4">
          <Title>Trend Analysis</Title>
          <div className="flex items-center gap-2">
            <Select value={selectedMetric} onValueChange={setSelectedMetric}>
              {metrics.map((metric) => (
                <SelectItem key={metric.value} value={metric.value}>
                  {metric.label}
                </SelectItem>
              ))}
            </Select>
          </div>
        </div>
        <AreaChart
          data={data.timeSeriesData}
          index="timestamp"
          categories={[valueKey]}
          colors={[colors.blue]}
          valueFormatter={valueFormatter}
          showLegend={false}
          showAnimation={true}
          className="h-72"
        />
      </Card>
    );
  }, [data?.timeSeriesData, selectedMetric]);

  const anomalyDetection = useMemo(() => {
    if (!data?.anomalies?.length) return null;

    return (
      <Card className="mt-4">
        <Title>Anomaly Detection</Title>
        <Text className="mt-2">Unusual patterns detected in your data</Text>
        <List className="mt-4">
          {data.anomalies.map((anomaly, idx) => (
            <ListItem key={idx}>
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <span>{anomaly.description}</span>
              </div>
              <Text>{format(new Date(anomaly.timestamp), 'PPp')}</Text>
            </ListItem>
          ))}
        </List>
      </Card>
    );
  }, [data?.anomalies]);

  const performanceMetrics = useMemo(() => {
    if (!data?.callMetrics || !data?.userMetrics) return null;

    return (
      <Grid numItems={1} numItemsSm={2} numItemsLg={3} className="gap-4 mt-4">
        <Col>
          <Card>
            <Title>Call Performance</Title>
            <DonutChart
              data={[
                { name: 'Successful', value: data.callMetrics.successRate },
                { name: 'Failed', value: 100 - data.callMetrics.successRate },
              ]}
              category="value"
              index="name"
              colors={[colors.emerald, colors.rose]}
              className="mt-4 h-40"
            />
            <div className="mt-4">
              <Text>Success Rate</Text>
              <Title>{data.callMetrics.successRate}%</Title>
            </div>
          </Card>
        </Col>
        <Col>
          <Card>
            <Title>User Engagement</Title>
            <BarChart
              data={data.userMetrics.engagementData}
              index="category"
              categories={['value']}
              colors={[colors.violet]}
              className="mt-4 h-40"
            />
          </Card>
        </Col>
        <Col>
          <Card>
            <Title>Regional Distribution</Title>
            <DonutChart
              data={data.regionalData}
              category="value"
              index="region"
              colors={Object.values(colors)}
              className="mt-4 h-40"
            />
          </Card>
        </Col>
      </Grid>
    );
  }, [data?.callMetrics, data?.userMetrics, data?.regionalData]);

  const insightsSummary = useMemo(() => {
    if (!data) return null;

    return (
      <Card className="mt-4">
        <Title>Key Insights</Title>
        <Grid numItems={1} numItemsSm={2} numItemsLg={4} className="gap-4 mt-4">
          <StatCard
            title="Peak Usage Time"
            value={data.callMetrics.peakTime}
            icon={Clock}
            trend={{ value: 0, label: 'Consistent' }}
          />
          <StatCard
            title="Avg Response Time"
            value={data.callMetrics.avgResponseTime}
            icon={Zap}
            trend={{ value: data.callMetrics.responseTimeTrend, label: 'from last month' }}
          />
          <StatCard
            title="Active Regions"
            value={data.regionalData.length}
            icon={Globe}
            trend={{ value: 0, label: 'Stable' }}
          />
          <StatCard
            title="User Satisfaction"
            value={`${data.userMetrics.satisfaction}%`}
            icon={Users}
            trend={{ value: data.userMetrics.satisfactionTrend, label: 'from last month' }}
          />
        </Grid>
      </Card>
    );
  }, [data]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingSpinner size={50} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4 text-center">
        <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
        <h2 className="text-xl font-semibold mb-2">Error Loading Analytics</h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <Button onClick={refreshData}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-screen bg-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Analytics</h1>
            <p className="mt-1 text-sm text-gray-600">
              Detailed insights about your call center performance
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Select
              value={selectedTimeRange}
              onValueChange={setSelectedTimeRange}
              className="w-40"
            >
              {timeRanges.map((range) => (
                <SelectItem key={range.value} value={range.value}>
                  {range.label}
                </SelectItem>
              ))}
            </Select>
            {selectedTimeRange === 'custom' && (
              <DateRangePicker
                value={dateRange}
                onValueChange={setDateRange}
                className="max-w-md mx-auto"
              />
            )}
            <Button
              icon={RefreshCw}
              variant="secondary"
              onClick={refreshData}
              loading={loading}
            >
              Refresh
            </Button>
          </div>
        </div>

        {timeSeriesChart}
        {anomalyDetection}
        {performanceMetrics}
        {insightsSummary}
      </div>
    </motion.div>
  );
}