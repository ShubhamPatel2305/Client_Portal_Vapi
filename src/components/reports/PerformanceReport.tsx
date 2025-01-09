import { Card, Title, Text, Grid, AreaChart, DonutChart, BarChart, LineChart, Metric, Badge, Color, ProgressBar, Flex, Subtitle } from '@tremor/react';
import { format, subDays, isSameDay } from 'date-fns';
import { TrendingUp, TrendingDown, Clock, PhoneCall, DollarSign, Target, Activity, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { CallData } from '../../pages/Reports';

interface Props {
  data: CallData[];
}

const PerformanceReport: React.FC<Props> = ({ data }) => {
  // Calculate daily metrics
  const dailyMetrics = data.reduce((acc: any, call) => {
    const date = format(new Date(call.startedAt), 'yyyy-MM-dd');
    if (!acc[date]) {
      acc[date] = {
        date,
        calls: 0,
        totalCost: 0,
        successfulCalls: 0,
        avgDuration: 0,
        totalDuration: 0,
      };
    }
    
    const duration = call.endedAt 
      ? (new Date(call.endedAt).getTime() - new Date(call.startedAt).getTime()) / 1000 / 60 
      : 0;
    
    acc[date].calls += 1;
    acc[date].totalCost += call.cost || 0;
    acc[date].totalDuration += duration;
    acc[date].avgDuration = acc[date].totalDuration / acc[date].calls;
    if (call.status === 'completed') {
      acc[date].successfulCalls += 1;
    }
    
    return acc;
  }, {});

  const chartData = Object.values(dailyMetrics);

  // Calculate success rate distribution
  const totalCalls = data.length;
  const successfulCalls = data.filter(call => call.status === 'completed').length;
  const failedCalls = totalCalls - successfulCalls;

  // Calculate trends
  const today = new Date();
  const todayCalls = data.filter(call => isSameDay(new Date(call.startedAt), today)).length;
  const yesterdayCalls = data.filter(call => isSameDay(new Date(call.startedAt), subDays(today, 1))).length;
  const callsTrend = yesterdayCalls ? ((todayCalls - yesterdayCalls) / yesterdayCalls) * 100 : 0;

  // Calculate average response time
  const avgResponseTime = data.reduce((sum, call) => {
    if (call.messages && call.messages.length >= 2) {
      const firstUserMessage = call.messages.find(m => m.role === 'user');
      const firstAssistantMessage = call.messages.find(m => m.role === 'assistant');
      if (firstUserMessage && firstAssistantMessage) {
        return sum + (firstAssistantMessage.time - firstUserMessage.time);
      }
    }
    return sum;
  }, 0) / totalCalls;

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

  const performanceMetrics = [
    {
      title: 'Success Rate',
      metric: `${((successfulCalls / totalCalls) * 100 || 0).toFixed(1)}%`,
      icon: Target,
      trend: callsTrend,
      color: 'emerald' as Color,
    },
    {
      title: 'Avg Response Time',
      metric: `${avgResponseTime.toFixed(1)}s`,
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
  ];

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
            data={chartData}
            index="date"
            categories={['calls', 'successfulCalls']}
            colors={['blue', 'emerald']}
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
              { name: 'Failed Calls', value: failedCalls },
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
        <LineChart
          className="mt-4 h-72"
          data={chartData}
          index="date"
          categories={['avgDuration', 'totalCost']}
          colors={['amber', 'emerald']}
          valueFormatter={(value: number) => 
            value > 100 ? `$${value.toFixed(2)}` : `${value.toFixed(1)} min`
          }
          showLegend
        />
      </Card>
    </motion.div>
  );
};

export default PerformanceReport;
