import React from 'react';
import {
  Card,
  Title,
  Text,
  Grid,
  Col,
  Metric,
  Flex,
  Badge,
  Color,
  ProgressBar,
  LineChart,
  BarList,
  Bold,
  List,
  ListItem,
  Divider,
  Subtitle,
} from '@tremor/react';
import { motion } from 'framer-motion';
import { format, subDays } from 'date-fns';
import {
  TrendingUp,
  TrendingDown,
  Clock,
  MessageCircle,
  User,
  CheckCircle,
  XCircle,
  AlertCircle,
} from 'lucide-react';
import { CallData } from '../../pages/Reports';

interface Props {
  data: CallData[];
}

const AdvancedAnalytics: React.FC<Props> = ({ data }) => {
  // Calculate engagement metrics
  const averageMessagesPerCall = data.reduce((acc, call) => {
    return acc + (call.messages?.length || 0);
  }, 0) / data.length;

  const averageCallDuration = data.reduce((acc, call) => {
    if (call.endedAt) {
      const duration = (new Date(call.endedAt).getTime() - new Date(call.startedAt).getTime()) / 1000;
      return acc + duration;
    }
    return acc;
  }, 0) / data.filter(call => call.endedAt).length;

  // Calculate success metrics
  const successRate = (data.filter(call => 
    call.status === 'completed'
  ).length / data.length) * 100;

  // Calculate hourly distribution
  const hourlyDistribution = data.reduce((acc: { [key: string]: number }, call) => {
    const hour = new Date(call.startedAt).getHours();
    acc[hour] = (acc[hour] || 0) + 1;
    return acc;
  }, {});

  const peakHour = Object.entries(hourlyDistribution)
    .reduce((a, b) => a[1] > b[1] ? a : b)[0];

  // Calculate recent trends
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), i);
    return {
      date: format(date, 'MMM dd'),
      calls: data.filter(call => 
        format(new Date(call.startedAt), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
      ).length,
      success: data.filter(call => 
        format(new Date(call.startedAt), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd') &&
        call.status === 'completed'
      ).length,
    };
  }).reverse();

  // Calculate user engagement patterns
  const messagePatterns = data.reduce((acc: any[], call) => {
    const userMessages = call.messages?.filter(m => m.role === 'user').length || 0;
    const assistantMessages = call.messages?.filter(m => m.role === 'assistant').length || 0;
    
    acc.push({
      name: format(new Date(call.startedAt), 'MMM dd HH:mm'),
      value: userMessages + assistantMessages,
      color: userMessages > assistantMessages ? 'emerald' : 'blue',
    });
    
    return acc;
  }, []).slice(-5);

  // Calculate success analysis metrics
  const totalCalls = data.length;
  const completedCalls = data.filter(call => call.status === 'completed').length;
  const failedCalls = data.filter(call => call.status === 'failed').length;
  const inProgressCalls = totalCalls - completedCalls - failedCalls;

  // Calculate user interaction insights
  const totalMessages = data.reduce((acc, call) => acc + (call.messages?.length || 0), 0);
  const avgUserMessagesPerCall = data.reduce((acc, call) => {
    const userMessages = call.messages?.filter(m => m.role === 'user').length || 0;
    return acc + userMessages;
  }, 0) / totalCalls;

  const longestCall = Math.max(...data.map(call => 
    call.endedAt 
      ? (new Date(call.endedAt).getTime() - new Date(call.startedAt).getTime()) / 1000 / 60 
      : 0
  ));

  const metrics = [
    {
      title: 'Average Messages',
      metric: averageMessagesPerCall.toFixed(1),
      icon: MessageCircle,
      color: 'blue' as Color,
    },
    {
      title: 'Success Rate',
      metric: `${successRate.toFixed(1)}%`,
      icon: CheckCircle,
      color: 'emerald' as Color,
    },
    {
      title: 'Avg Duration',
      metric: `${(averageCallDuration / 60).toFixed(1)}m`,
      icon: Clock,
      color: 'violet' as Color,
    },
    {
      title: 'Peak Hour',
      metric: `${peakHour}:00`,
      icon: TrendingUp,
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
        {metrics.map((item) => (
          <motion.div
            key={item.title}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card decoration="top" decorationColor={item.color}>
              <Flex alignItems="start">
                <div>
                  <Text>{item.title}</Text>
                  <Metric>{item.metric}</Metric>
                </div>
                <item.icon className="h-6 w-6" color={item.color} />
              </Flex>
            </Card>
          </motion.div>
        ))}
      </Grid>

      <Grid numItems={1} numItemsSm={2} className="gap-6">
        <Card>
          <Title>Weekly Call Trends</Title>
          <LineChart
            className="mt-6 h-72"
            data={last7Days}
            index="date"
            categories={["calls", "success"]}
            colors={["blue", "emerald"]}
            valueFormatter={(value: number) => `${value} calls`}
            showLegend
          />
        </Card>
        <Card>
          <Title>Recent Engagement Patterns</Title>
          <BarList
            data={messagePatterns}
            className="mt-6"
            valueFormatter={(value: number) => `${value} messages`}
          />
        </Card>
      </Grid>

      <Grid numItems={1} numItemsSm={2} className="gap-6">
        <Card>
          <Title>Success Analysis</Title>
          <div className="mt-6">
            <Flex>
              <Text>Overall Success Rate</Text>
              <Text>{successRate.toFixed(1)}%</Text>
            </Flex>
            <ProgressBar value={successRate} color="emerald" className="mt-2" />
            <div className="mt-4">
              <List>
                <ListItem>
                  <span>Completed Calls</span>
                  <Badge icon={CheckCircle} color="emerald">
                    {completedCalls}
                  </Badge>
                </ListItem>
                <ListItem>
                  <span>Failed Calls</span>
                  <Badge icon={XCircle} color="rose">
                    {failedCalls}
                  </Badge>
                </ListItem>
                <ListItem>
                  <span>In Progress</span>
                  <Badge icon={Clock} color="blue">
                    {inProgressCalls}
                  </Badge>
                </ListItem>
              </List>
            </div>
          </div>
        </Card>
        <Card>
          <Title>User Interaction Insights</Title>
          <div className="mt-6">
            <Grid numItems={1} numItemsSm={2} className="gap-4">
              <div>
                <Subtitle>Message Distribution</Subtitle>
                <Metric className="mt-2">
                  {totalMessages}
                </Metric>
                <Text>Total Messages</Text>
              </div>
              <div>
                <Subtitle>User Engagement</Subtitle>
                <Metric className="mt-2">
                  {avgUserMessagesPerCall.toFixed(1)}
                </Metric>
                <Text>Avg User Messages/Call</Text>
              </div>
            </Grid>
            <Divider />
            <div className="mt-4">
              <Text>
                <Bold>Peak Activity Time:</Bold> {peakHour}:00 - {(parseInt(peakHour) + 1).toString().padStart(2, '0')}:00
              </Text>
              <Text className="mt-2">
                <Bold>Longest Call:</Bold>{' '}
                {longestCall.toFixed(1)} minutes
              </Text>
            </div>
          </div>
        </Card>
      </Grid>
    </motion.div>
  );
};

export default AdvancedAnalytics;
