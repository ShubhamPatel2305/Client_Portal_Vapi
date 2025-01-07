import {
  Card,
  Title,
  Text,
  AreaChart,
  BarChart,
  DonutChart,
  Grid,
  LineChart,
  TabGroup,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Flex,
  Metric,
  ProgressBar,
  Badge,
  Color,
} from '@tremor/react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  Clock,
  PhoneCall,
  DollarSign,
  Activity,
  Target,
  BarChart2,
} from 'lucide-react';
import { format, parse, isValid, startOfDay, endOfDay } from 'date-fns';
import { Analytics } from '../../lib/api/vapiService';

interface PerformanceReportProps {
  data: Analytics;
  dateRange: { from: Date; to: Date };
}

type KPIMetric = 'successRate' | 'responseTime' | 'costEfficiency' | 'callVolume';

interface InsightType {
  metric: string;
  value: string | number;
  trend: number;
  icon: React.FC;
  color: Color;
  kpiKey: KPIMetric;
}

interface DailyMetrics {
  date: string;
  'Call Volume': number;
  'Cost': number;
  'Success Rate': number;
}

export default function PerformanceReport({ data, dateRange }: PerformanceReportProps) {
  // Filter data based on date range
  const filteredData = data.monthlyCallData.filter(month => {
    try {
      const monthDate = new Date(month.date);
      return isValid(monthDate) && 
             monthDate >= startOfDay(dateRange.from) && 
             monthDate <= endOfDay(dateRange.to);
    } catch {
      return false;
    }
  });

  // Calculate metrics from filtered data
  const totalCalls = filteredData.reduce((acc, month) => acc + month.calls.length, 0);
  const successfulCalls = filteredData.reduce((acc, month) => 
    acc + month.calls.filter(call => call.status === 'success').length, 0);
  const successRate = totalCalls > 0 ? (successfulCalls / totalCalls) * 100 : 0;

  // Calculate average response time from filtered data
  const totalMinutes = filteredData.reduce((acc, month) => 
    acc + month.calls.reduce((sum, call) => sum + call.duration, 0), 0);
  const avgResponseTime = totalCalls > 0 ? Math.round(totalMinutes / totalCalls) : 0;

  // Calculate cost efficiency from filtered data
  const totalCost = filteredData.reduce((acc, month) => acc + month.totalCost, 0);
  const successfulCallsCost = filteredData.reduce((acc, month) => 
    acc + month.calls.filter(call => call.status === 'success')
      .reduce((sum, call) => sum + call.cost, 0), 0);
  const costEfficiency = totalCost > 0 ? (successfulCallsCost / totalCost) * 100 : 0;

  // Create daily metrics
  const dailyMetrics: DailyMetrics[] = [];
  const startDate = startOfDay(dateRange.from);
  const endDate = endOfDay(dateRange.to);
  
  // Create a map to store calls by date
  const callsByDate = new Map();
  
  // Group all calls by date
  filteredData.forEach(month => {
    month.calls.forEach(call => {
      const callDate = new Date(call.timestamp);
      const dateKey = format(callDate, 'yyyy-MM-dd');
      
      if (!callsByDate.has(dateKey)) {
        callsByDate.set(dateKey, []);
      }
      callsByDate.get(dateKey).push(call);
    });
  });
  
  // Create metrics for each day in the range
  let currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    const dateKey = format(currentDate, 'yyyy-MM-dd');
    const daysCalls = callsByDate.get(dateKey) || [];
    
    const dayCallCount = daysCalls.length;
    const daySuccessCount = daysCalls.filter((call: { status: string; }) => call.status === 'success').length;
    const dayCost = daysCalls.reduce((sum: any, call: { cost: any; }) => sum + (call.cost || 0), 0);
    const daySuccessRate = dayCallCount > 0 ? (daySuccessCount / dayCallCount) * 100 : 0;

    dailyMetrics.push({
      date: format(currentDate, 'MMM d'),
      'Call Volume': dayCallCount,
      'Cost': Number(dayCost.toFixed(2)),
      'Success Rate': Number(daySuccessRate.toFixed(1))
    });

    // Move to next day
    currentDate.setDate(currentDate.getDate() + 1);
  }

  const insights: InsightType[] = [
    {
      metric: 'Success Rate',
      value: `${successRate.toFixed(1)}%`,
      trend: data.numberOfCallsTrend || 0,
      icon: Target,
      color: 'emerald',
      kpiKey: 'successRate'
    },
    {
      metric: 'Response Time',
      value: `${avgResponseTime} min`,
      trend: data.totalCallMinutesTrend || 0,
      icon: Clock,
      color: 'blue',
      kpiKey: 'responseTime'
    },
    {
      metric: 'Cost Efficiency',
      value: `${costEfficiency.toFixed(1)}%`,
      trend: data.avgCostPerCallTrend || 0,
      icon: DollarSign,
      color: 'amber',
      kpiKey: 'costEfficiency'
    },
    {
      metric: 'Call Volume',
      value: totalCalls,
      trend: ((totalCalls - (data.numberOfCalls || 0)) / (data.numberOfCalls || 1)) * 100,
      icon: PhoneCall,
      color: 'violet',
      kpiKey: 'callVolume'
    },
  ];

  // Calculate performance scores
  const kpiScores: Record<KPIMetric, number> = {
    successRate: Math.min(100, successRate),
    responseTime: Math.min(100, Math.max(0, 100 - (avgResponseTime / 5 * 100))),
    costEfficiency: Math.min(100, costEfficiency),
    callVolume: Math.min(100, totalCalls > 0 ? 100 : 0),
  };

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Grid numItems={1} numItemsSm={2} numItemsLg={4} className="gap-6">
        {insights.map((insight) => (
          <Card key={insight.metric} decoration="top" decorationColor={insight.color}>
            <Flex alignItems="start">
              <div className="truncate">
                <Text className="truncate">{insight.metric}</Text>
                <Metric className="truncate">{insight.value}</Metric>
              </div>
              <Badge
                icon={insight.trend >= 0 ? TrendingUp : TrendingDown}
                color={insight.trend >= 0 ? "emerald" : "red"}
              >
                {Math.abs(insight.trend).toFixed(1)}%
              </Badge>
            </Flex>
            <Flex className="mt-4 space-x-2">
              <Text className="truncate">Performance Score</Text>
              <Text className="truncate text-right">
                {kpiScores[insight.kpiKey].toFixed(1)}%
              </Text>
            </Flex>
            <ProgressBar
              value={kpiScores[insight.kpiKey]}
              color={insight.color}
              className="mt-2"
            />
          </Card>
        ))}
      </Grid>

      <Card>
        <Title>Performance Trends</Title>
        <TabGroup>
          <TabList className="mt-8">
            <Tab icon={BarChart2}>Call Volume</Tab>
            <Tab icon={DollarSign}>Cost Analysis</Tab>
            <Tab icon={Activity}>Success Rate</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <AreaChart
                className="mt-8 h-80"
                data={dailyMetrics}
                index="date"
                categories={["Call Volume"]}
                colors={["blue"]}
                valueFormatter={(value) => `${value} calls`}
                showAnimation={true}
                showLegend={false}
                minValue={0}
                maxValue={Math.max(...dailyMetrics.map(d => d['Call Volume'])) + 1}
              />
            </TabPanel>
            <TabPanel>
              <LineChart
                className="mt-8 h-80"
                data={dailyMetrics}
                index="date"
                categories={["Cost"]}
                colors={["emerald"]}
                valueFormatter={(value) => `$${value.toFixed(2)}`}
                showAnimation={true}
                showLegend={false}
                minValue={0}
                maxValue={Math.max(...dailyMetrics.map(d => d['Cost'])) * 1.1}
              />
            </TabPanel>
            <TabPanel>
              <BarChart
                className="mt-8 h-80"
                data={dailyMetrics}
                index="date"
                categories={["Success Rate"]}
                colors={["violet"]}
                valueFormatter={(value) => `${value.toFixed(1)}%`}
                showAnimation={true}
                showLegend={false}
                minValue={0}
                maxValue={100}
              />
            </TabPanel>
          </TabPanels>
        </TabGroup>
      </Card>

      <Grid numItems={1} numItemsSm={2} className="gap-6">
        <Card>
          <Title>Call Status Distribution</Title>
          <DonutChart
            className="mt-8 h-60"
            data={data.callDistribution}
            category="value"
            index="name"
            valueFormatter={(value) => `${value.toFixed(1)}%`}
            colors={["emerald", "red", "amber"]}
            showAnimation={true}
          />
        </Card>
        <Card>
          <Title>Cost Distribution</Title>
          <DonutChart
            className="mt-8 h-60"
            data={data.costAnalysis}
            category="amount"
            index="category"
            valueFormatter={(value) => `$${value.toFixed(2)}`}
            colors={["blue", "violet", "indigo"]}
            showAnimation={true}
          />
        </Card>
      </Grid>
    </motion.div>
  );
}
