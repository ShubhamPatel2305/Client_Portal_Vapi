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
  AreaChart,
  DonutChart,
  Badge,
  Grid,
  Flex,
  Metric,
  ProgressBar,
  Select,
  SelectItem,
} from '@tremor/react';
import { vapiService } from '../services/vapiService';
import { format, subDays } from 'date-fns';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  TrendingUp,
  TrendingDown,
  Phone,
  PhoneOff,
  AlertTriangle,
  CheckCircle,
  BarChart2,
  PieChart,
  Activity,
} from 'lucide-react';

interface AnalyticsData {
  total_calls: number;
  total_duration: number;
  average_duration: number;
  total_cost: number;
  calls_by_status: Record<string, number>;
  calls_by_date: Record<string, number>;
  calls: any[];
}

const timeRanges = [
  { value: '7d', label: 'Last 7 Days' },
  { value: '30d', label: 'Last 30 Days' },
  { value: '90d', label: 'Last 90 Days' },
];

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: number;
  description?: string;
  color?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  icon,
  trend,
  description,
  color = 'blue',
}) => (
  <Card className="relative overflow-hidden">
    <div className="absolute top-0 right-0 w-24 h-24 -mt-8 -mr-8 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-2xl" />
    <div className="flex items-center space-x-4">
      <div className={`p-3 bg-${color}-100 rounded-xl`}>
        {icon}
      </div>
      <div>
        <Text className="text-sm font-medium text-gray-500">{title}</Text>
        <div className="flex items-center space-x-2">
          <Metric>{value}</Metric>
          {trend !== undefined && (
            <Badge
              color={trend >= 0 ? 'emerald' : 'red'}
              icon={trend >= 0 ? TrendingUp : TrendingDown}
            >
              {Math.abs(trend)}%
            </Badge>
          )}
        </div>
        {description && (
          <Text className="text-sm text-gray-500 mt-1">{description}</Text>
        )}
      </div>
    </div>
  </Card>
);

const OverviewMetrics: React.FC<{ data: AnalyticsData }> = ({ data }) => {
  const successRate = data.calls_by_status?.completed 
    ? Math.round((data.calls_by_status.completed / data.total_calls) * 100)
    : 0;

  const failedCalls = data.calls_by_status?.failed || 0;
  
  return (
    <Grid numItems={1} numItemsSm={2} numItemsLg={4} className="gap-6">
      <MetricCard
        title="Total Calls"
        value={data.total_calls}
        icon={<Phone className="h-6 w-6 text-blue-600" />}
        description="All calls made by the AI"
      />
      <MetricCard
        title="Success Rate"
        value={`${successRate}%`}
        icon={<CheckCircle className="h-6 w-6 text-emerald-600" />}
        color="emerald"
        description="Completed calls ratio"
      />
      <MetricCard
        title="Avg Duration"
        value={`${Math.round(data.average_duration)}s`}
        icon={<Activity className="h-6 w-6 text-purple-600" />}
        color="purple"
        description="Average call length"
      />
      <MetricCard
        title="Failed Calls"
        value={failedCalls}
        icon={<PhoneOff className="h-6 w-6 text-red-600" />}
        color="red"
        description="Unsuccessful attempts"
      />
    </Grid>
  );
};

const PerformanceTab: React.FC<{ data: AnalyticsData }> = ({ data }) => {
  const chartData = Object.entries(data.calls_by_date).map(([date, count]) => ({
    date,
    'Total Calls': count,
    'Successful': data.calls.filter(call => 
      call.status === 'completed' && 
      call.created_at.split('T')[0] === date
    ).length,
    'Failed': data.calls.filter(call => 
      call.status === 'failed' && 
      call.created_at.split('T')[0] === date
    ).length,
  }));

  return (
    <div className="mt-8 space-y-6">
      <Card>
        <Title>Call Volume Trends</Title>
        <Text>Daily call distribution over time</Text>
        <AreaChart
          className="mt-4 h-72"
          data={chartData}
          index="date"
          categories={['Total Calls', 'Successful', 'Failed']}
          colors={['blue', 'emerald', 'red']}
          valueFormatter={(value) => `${value} calls`}
          showLegend
          showGridLines
          showAnimation
        />
      </Card>
    </div>
  );
};

const DistributionTab: React.FC<{ data: AnalyticsData }> = ({ data }) => {
  return (
    <div className="mt-8">
      <Card>
        <Title>Call Status Distribution</Title>
        <DonutChart
          className="mt-4 h-60"
          data={Object.entries(data.calls_by_status).map(([status, count]) => ({
            name: status,
            value: count
          }))}
          category="value"
          index="name"
          colors={['emerald', 'red', 'yellow']}
          showAnimation
        />
      </Card>
    </div>
  );
};

const QualityTab: React.FC<{ data: AnalyticsData }> = ({ data }) => {
  return (
    <div className="mt-8">
      <Grid numItems={1} numItemsSm={2} numItemsLg={3} className="gap-6">
        <Card>
          <Title>Voice Quality</Title>
          <div className="mt-4">
            <Flex>
              <Text>Clarity Score</Text>
              <Text>85%</Text>
            </Flex>
            <ProgressBar value={85} color="blue" className="mt-2" />
          </div>
        </Card>

        <Card>
          <Title>Response Time</Title>
          <div className="mt-4">
            <Flex>
              <Text>Average</Text>
              <Text>1.2s</Text>
            </Flex>
            <ProgressBar value={75} color="emerald" className="mt-2" />
          </div>
        </Card>

        <Card>
          <Title>User Satisfaction</Title>
          <div className="mt-4">
            <Flex>
              <Text>Rating</Text>
              <Text>4.5/5</Text>
            </Flex>
            <ProgressBar value={90} color="amber" className="mt-2" />
          </div>
        </Card>
      </Grid>
    </div>
  );
};

const Analytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [assistantId] = useState('56c7f0f1-a068-4f7f-ae52-33bb86c3896d');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAnalytics();
  }, [timeRange, assistantId]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const days = parseInt(timeRange);
      const endDate = new Date();
      const startDate = subDays(endDate, days);

      const data = await vapiService.getAnalytics({
        start_date: format(startDate, 'yyyy-MM-dd'),
        end_date: format(endDate, 'yyyy-MM-dd'),
        assistant_id: assistantId,
      });

      setAnalytics(data);
    } catch (err: any) {
      console.error('Failed to fetch analytics:', err);
      setError(err.message || 'Failed to fetch analytics data');
      setAnalytics(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner size={40} />
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Card className="max-w-lg">
          <div className="flex flex-col items-center space-y-4 p-6">
            <AlertTriangle className="h-12 w-12 text-yellow-500" />
            <Title className="text-center">Analytics Unavailable</Title>
            <Text className="text-center text-gray-500">
              {error || 'Could not load analytics data. Please try again later.'}
            </Text>
            <button
              onClick={loadAnalytics}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Retry Loading
            </button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 space-y-6"
    >
      <div className="flex justify-between items-center mb-8">
        <div>
          <Title className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            AI Caller Analytics Dashboard
          </Title>
          <Text className="text-gray-500">
            Comprehensive insights into your AI caller performance and metrics
          </Text>
        </div>
        <Select
          value={timeRange}
          onValueChange={setTimeRange}
          className="w-48"
        >
          {timeRanges.map((range) => (
            <SelectItem key={range.value} value={range.value}>
              {range.label}
            </SelectItem>
          ))}
        </Select>
      </div>

      <OverviewMetrics data={analytics} />

      <TabGroup>
        <TabList className="mt-8">
          <Tab icon={BarChart2}>Performance</Tab>
          <Tab icon={PieChart}>Distribution</Tab>
          <Tab icon={Activity}>Quality</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <PerformanceTab data={analytics} />
          </TabPanel>

          <TabPanel>
            <DistributionTab data={analytics} />
          </TabPanel>

          <TabPanel>
            <QualityTab data={analytics} />
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </motion.div>
  );
};

export default Analytics;