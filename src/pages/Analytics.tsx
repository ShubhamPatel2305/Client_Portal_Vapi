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
import toast from 'react-hot-toast';
import StatCard from '../components/StatCard';

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

const fetchAnalyticsData = async (startDate: Date, endDate: Date): Promise<AnalyticsData> => {
  try {
    // Use startDate and endDate to fetch data for the specified time range
    console.log(`Fetching data from ${startDate.toISOString()} to ${endDate.toISOString()}`);
    
    // Mock data - replace with actual API call
    return {
      timeSeriesData: [{
        timestamp: new Date().toISOString(),
        callCount: 100,
        avgDuration: 5,
        totalCost: 500,
        activeUsers: 50
      }],
      callMetrics: {
        total: 1234,
        answered: 1000,
        missed: 234,
        avgDuration: 180,
        successRate: 81,
        peakTime: '14:00',
        avgResponseTime: '45s',
        responseTimeTrend: 5.2,
        performanceData: [],
        errorBreakdown: [],
        typeDistribution: [],
        hourlyDistribution: []
      },
      userMetrics: {
        total: 500,
        active: 350,
        new: 50,
        engagementData: [],
        satisfaction: 4.5,
        satisfactionTrend: 0.3
      },
      regionalData: [],
      anomalies: []
    };
  } catch (error) {
    console.error('Error fetching analytics data:', error);
    throw error;
  }
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

  const refreshData = async () => {
    try {
      setLoading(true);
      const startDate = dateRange.from
        ? startOfDay(dateRange.from)
        : subDays(new Date(), parseInt(selectedTimeRange));
      const endDate = dateRange.to
        ? endOfDay(dateRange.to)
        : new Date();

      const analyticsData = await fetchAnalyticsData(startDate, endDate);
      setData(analyticsData);
      toast.success('Analytics data refreshed');
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      toast.error('Failed to refresh analytics data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, [selectedTimeRange, dateRange]);

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
        <RefreshCw className="w-6 h-6 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <Title>Analytics</Title>
          <Text>Detailed insights about your call center performance</Text>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
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
    </motion.div>
  );
}