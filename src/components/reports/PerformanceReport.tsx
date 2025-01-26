import { Card, Title, Text, Grid, AreaChart, DonutChart, BarChart, LineChart, Metric, Badge, Color, ProgressBar, Flex, Subtitle } from '@tremor/react';
import { format, subDays, isSameDay } from 'date-fns';
import { TrendingUp, TrendingDown, Clock, PhoneCall, DollarSign, Target, Activity, MessageCircle, Timer } from 'lucide-react';
import { motion } from 'framer-motion';
import type { CallData } from '../../types/CallData';
import { useMemo } from 'react';

interface Props {
  data: CallData[];
}

interface Metrics {
  avgResponseTime: number;
  totalCalls: number;
  successRate: number;
  avgMessagesPerCall: number;
}

const calculateMetrics = (data: CallData[]): Metrics => {
  const totalCalls = data.length;
  const successfulCalls = data.filter(call => call.status === 'ended' && call.endedReason === 'customer-ended-call').length;
  
  return {
    avgResponseTime: data.reduce((sum, call) => sum + (call.analysis?.averageResponseTime || 0), 0) / totalCalls,
    totalCalls,
    successRate: (successfulCalls / totalCalls) * 100,
    avgMessagesPerCall: data.reduce((sum, call) => sum + (call.messages?.length || 0), 0) / totalCalls
  };
};

const PerformanceReport: React.FC<Props> = ({ data }) => {
  // Calculate daily metrics
  const dailyMetrics = Object.entries(data.reduce((acc, call) => {
    const date = format(new Date(call.startedAt), 'MMM dd');
    if (!acc[date]) {
      acc[date] = {
        date,
        duration: 0,
        calls: 0,
        cost: 0
      };
    }
    
    const duration = call.endedAt 
      ? (new Date(call.endedAt).getTime() - new Date(call.startedAt).getTime()) / 1000 
      : 0;
    acc[date].duration += duration / 60; // Convert to minutes
    acc[date].calls += 1;
    acc[date].cost += call.cost || 0;
    return acc;
  }, {} as Record<string, { date: string; duration: number; calls: number; cost: number }>))
  .map(([_, metrics]) => ({
    date: metrics.date,
    Duration: Number(metrics.duration.toFixed(1)),
    Calls: metrics.calls,
    Cost: Number(metrics.cost.toFixed(4))
  }))
  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const maxDuration = Math.max(...dailyMetrics.map(d => d.Duration));
  const maxCalls = Math.max(...dailyMetrics.map(d => d.Calls));
  const maxCost = Math.max(...dailyMetrics.map(d => d.Cost));
  const yAxisMax = Math.ceil(Math.max(maxDuration, maxCalls, maxCost) * 1.2); // Add 20% padding

  // Calculate success rate distribution
  const totalCalls = data.length;
  const successfulCalls = data.filter(call => 
    call.status === 'ended' && call.endedReason === 'customer-ended-call'
  ).length;

  // Calculate trends
  const today = new Date();
  const todayCalls = data.filter(call => isSameDay(new Date(call.startedAt), today)).length;
  const yesterdayCalls = data.filter(call => isSameDay(new Date(call.startedAt), subDays(today, 1))).length;
  const callsTrend = yesterdayCalls ? ((todayCalls - yesterdayCalls) / yesterdayCalls) * 100 : 0;

  // Calculate total duration and average duration per call
  const totalDuration = useMemo(() => {
    const totalDuration = data.reduce((acc, call) => {
      const duration = call.endedAt 
        ? (new Date(call.endedAt).getTime() - new Date(call.startedAt).getTime()) / 1000 
        : 0;
      return acc + duration;
    }, 0);

    const avgDurationPerCall = totalDuration / data.length;
    const totalMinutes = totalDuration / 60;

    const previousDayData = data.filter(call => {
      const callDate = new Date(call.startedAt);
      const yesterday = subDays(new Date(), 1);
      return isSameDay(callDate, yesterday);
    });

    const previousDayDuration = previousDayData.reduce((acc, call) => {
      const duration = call.endedAt 
        ? (new Date(call.endedAt).getTime() - new Date(call.startedAt).getTime()) / 1000 
        : 0;
      return acc + duration;
    }, 0) / 60;

    const durationChange = previousDayDuration ? ((totalMinutes - previousDayDuration) / previousDayDuration) * 100 : 0;

    return {
      totalDuration: totalMinutes.toFixed(1),
      avgDurationPerCall: avgDurationPerCall.toFixed(1),
      durationChange: durationChange.toFixed(1)
    };
  }, [data]);

  // Calculate average response time
  let totalResponseTime = 0;
  let validResponseCount = 0;

  data.forEach(call => {
    if (call.messages && Array.isArray(call.messages) && call.messages.length >= 2) {
      const messages = [...call.messages].sort((a, b) => 
        (a.timestamp || a.time || 0) - (b.timestamp || b.time || 0)
      );

      const firstUserMsg = messages.find(m => m.role === 'user');
      const firstBotMsg = messages.find(m => 
        (m.role === 'bot' || m.role === 'assistant') && 
        (m.timestamp || m.time || 0) > (firstUserMsg?.timestamp || firstUserMsg?.time || 0)
      );

      if (firstUserMsg && firstBotMsg) {
        const userTime = firstUserMsg.timestamp || firstUserMsg.time || 0;
        const botTime = firstBotMsg.timestamp || firstBotMsg.time || 0;
        
        if (botTime > userTime) {
          const responseTime = (botTime - userTime) / (1000 * 60); // Convert to minutes
          if (responseTime > 0 && responseTime < 1) { // Filter out responses over 1 minute
            totalResponseTime += responseTime;
            validResponseCount++;
          }
        }
      }
    }
  });

  const avgResponseTime = validResponseCount > 0 ? totalResponseTime / validResponseCount : 0;

  // Calculate peak hours
  const hourlyDistribution = data.reduce((acc: { [key: string]: number }, call) => {
    const hour = new Date(call.startedAt).getHours();
    acc[hour] = (acc[hour] || 0) + 1;
    return acc;
  }, {});

  const peakHoursData = Object.entries(hourlyDistribution).map(([hour, count]) => ({
    hour: `${hour}:00`,
    calls: count,
  }));

  // Calculate message patterns
  const messagePatterns = data.reduce((acc: { [key: string]: number }, call) => {
    if (call.messages) {
      const userMessages = call.messages.filter(m => m.role === 'user').length;
      acc['1-2'] = userMessages <= 2 ? (acc['1-2'] || 0) + 1 : acc['1-2'] || 0;
      acc['3-5'] = (userMessages > 2 && userMessages <= 5) ? (acc['3-5'] || 0) + 1 : acc['3-5'] || 0;
      acc['6+'] = userMessages > 5 ? (acc['6+'] || 0) + 1 : acc['6+'] || 0;
    }
    return acc;
  }, {});

  const messagePatternData = Object.entries(messagePatterns).map(([range, count]) => ({
    range,
    count,
    percentage: (count / totalCalls) * 100,
  }));

  const metrics = calculateMetrics(data);

  const performanceMetrics = [
    {
      title: 'Success Rate',
      metric: `${((successfulCalls / totalCalls) * 100).toFixed(1)}%`,
      icon: Target,
      trend: callsTrend,
      color: 'emerald' as Color,
    },
    {
      title: 'Total Duration',
      metric: (
        <div className="flex items-baseline">
          <span>{totalDuration.totalDuration}</span>
          <span className="ml-1 text-sm text-gray-500">minutes</span>
        </div>
      ),
      icon: Clock,
      trend: Number(totalDuration.durationChange),
      color: 'blue' as Color,
    },
    {
      title: 'Avg Duration',
      metric: (
        <div className="flex items-baseline">
          <span>{totalDuration.avgDurationPerCall}</span>
          <span className="ml-1 text-sm text-gray-500">s/percall</span>
        </div>
      ),
      icon: Timer,
      trend: 0,
      color: 'violet' as Color,
    },
    {
      title: 'Avg Response Time',
      metric: (
        <div className="flex items-baseline">
          <span>{(Number(avgResponseTime) * 60).toFixed(1)}</span>
          <span className="ml-1 text-sm text-gray-500">s</span>
        </div>
      ),
      icon: Clock,
      trend: 0,
      color: 'blue' as Color,
    },
    {
      title: 'Call Volume',
      metric: totalCalls.toString(),
      icon: PhoneCall,
      trend: callsTrend,
      color: 'violet' as Color,
    },
    {
      title: 'Avg Cost/Call',
      metric: `$${((data.reduce((sum, call) => sum + (call.cost || 0), 0)) / totalCalls || 0).toFixed(4)}`,
      icon: DollarSign,
      trend: 0,
      color: 'amber' as Color,
    },
    {
      title: 'Avg Response Time',
      metric: metrics.avgResponseTime.toFixed(2),
      icon: Clock,
      trend: 0,
      color: 'blue' as Color,
    },
    {
      title: 'Success Rate',
      metric: metrics.successRate.toFixed(1),
      icon: Target,
      trend: 0,
      color: 'emerald' as Color,
    },
    {
      title: 'Avg Messages/Call',
      metric: metrics.avgMessagesPerCall.toFixed(1),
      icon: MessageCircle,
      trend: 0,
      color: 'cyan' as Color,
    },
  ];

  const valueFormatter = (value: number, category?: string) => {
    if (category === 'avgResponseTime') return `${value.toFixed(2)}s`;
    if (category === 'successRate') return `${value.toFixed(1)}%`;
    return value.toFixed(1);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <Grid numItems={1} numItemsSm={2} numItemsLg={4} className="gap-6">
        {performanceMetrics.map((metric) => (
          <motion.div
            key={metric.title}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card decoration="top" decorationColor={metric.color} className="hover:shadow-lg transition-shadow">
              <Flex alignItems="start">
                <div className="truncate">
                  <Text className="truncate">{metric.title}</Text>
                  <Metric className="truncate">{metric.metric}</Metric>
                </div>
                <Badge
                  icon={metric.trend >= 0 ? TrendingUp : TrendingDown}
                  color={metric.trend >= 0 ? "emerald" : "red"}
                >
                  {Math.abs(metric.trend).toFixed(1)}%
                </Badge>
              </Flex>
              <Flex className="mt-4">
                <metric.icon className="h-4 w-4 text-gray-500" />
                <Text className="ml-2 truncate text-gray-500">vs. previous day</Text>
              </Flex>
            </Card>
          </motion.div>
        ))}
      </Grid>

      <Grid numItems={1} numItemsSm={2} className="gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <Title>Call Volume Trends</Title>
          <AreaChart
            className="mt-4 h-72"
            data={dailyMetrics}
            index="date"
            categories={['Calls']}
            colors={['blue']}
            valueFormatter={(value: number) => `${Math.round(value)} calls`}
          />
        </Card>
        <Card className="hover:shadow-lg transition-shadow">
          <Title>Peak Hours Distribution</Title>
          <BarChart
            className="mt-4 h-72"
            data={peakHoursData}
            index="hour"
            categories={['calls']}
            colors={['violet']}
            valueFormatter={(value: number) => `${value} calls`}
          />
        </Card>
      </Grid>

      <Grid numItems={1} numItemsSm={2} className="gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <Title>Call Success Distribution</Title>
          <DonutChart
            className="mt-4 h-48"
            data={[
              { name: 'Successful Calls', value: successfulCalls },
              { name: 'Failed Calls', value: totalCalls - successfulCalls },
            ]}
            category="value"
            index="name"
            colors={['emerald', 'rose']}
            valueFormatter={(value: number) => `${value} calls`}
          />
          <div className="mt-4">
            <Flex className="mt-2">
              <Text>Success Rate</Text>
              <Text>{((successfulCalls / totalCalls) * 100).toFixed(1)}%</Text>
            </Flex>
            <ProgressBar value={(successfulCalls / totalCalls) * 100} color="emerald" className="mt-2" />
          </div>
        </Card>
        <Card className="hover:shadow-lg transition-shadow">
          <Title>Message Exchange Patterns</Title>
          <BarChart
            className="mt-4 h-48"
            data={messagePatternData}
            index="range"
            categories={['count']}
            colors={['cyan']}
            valueFormatter={(value: number) => `${value} calls`}
          />
          <div className="mt-4">
            <Text>Message Exchanges per Call</Text>
            {messagePatternData.map((pattern) => (
              <div key={pattern.range} className="mt-2">
                <Flex>
                  <Text>{pattern.range} messages</Text>
                  <Text>{pattern.percentage.toFixed(1)}%</Text>
                </Flex>
                <ProgressBar value={pattern.percentage} color="cyan" className="mt-1" />
              </div>
            ))}
          </div>
        </Card>
      </Grid>

      <Card className="hover:shadow-lg transition-shadow">
        <Title>Daily Performance Metrics</Title>
        <Subtitle className="mt-2">Combined view of duration and cost metrics</Subtitle>
        <AreaChart
          className="mt-4 h-72"
          data={dailyMetrics}
          index="date"
          categories={['Duration', 'Calls', 'Cost']}
          colors={['blue', 'emerald', 'amber']}
          valueFormatter={valueFormatter}
          maxValue={yAxisMax}
          showLegend
          showGridLines
          showXAxis
          showYAxis
          curveType="monotone"
        />
      </Card>
    </motion.div>
  );
};

export default PerformanceReport;
