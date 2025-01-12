import React, { useState, useMemo } from 'react';
import {
  Card,
  Title,
  Text,
  Grid,
  DonutChart,
  BarChart,
  LineChart,
  AreaChart,
  Metric,
  Flex,
  Select,
  SelectItem,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
  Badge,
  Color,
  Subtitle,
  ValueFormatter,
  Legend,
  CategoryBar,
  ProgressBar,
  Table,
  TableHead,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
} from '@tremor/react';
import { format, subDays, isSameDay, addDays } from 'date-fns';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Layers, 
  Clock, 
  Target, 
  BarChart2, 
  PieChart, 
  LineChart as LineChartIcon,
  MessageCircle,
  Phone,
  Video,
  Mic,
  Bot,
  Zap,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { CallData } from '../../pages/Reports';

interface Props {
  data: CallData[];
}

interface DayData {
  date: string;
  total: number;
  promptCost: number;
  completionCost: number;
  totalCalls: number;
  avgResponseTime: number;
  successRate: number;
  avgTokensPerCall: number;
  avgCostPerCall: number;
  transport: number;
  stt: number;
  llm: number;
  tts: number;
  vapi: number;
  ttsCharacters: number;
  messageCount: number;
  callDuration: number;
}

interface ServiceMetrics {
  llm: number;
  stt: number;
  tts: number;
  transport: number;
  vapi: number;
}

interface UsageMetrics {
  totalMessages: number;
  totalDuration: number;
  totalTTSCharacters: number;
}

const calculateServiceMetrics = (data: CallData[]): ServiceMetrics => {
  return data.reduce((acc, call) => {
    const breakdown = call.costBreakdown;
    return {
      llm: acc.llm + (breakdown.promptCost + breakdown.completionCost),
      stt: acc.stt + (call.cost * 0.2), // Estimated STT cost
      tts: acc.tts + (call.cost * 0.2), // Estimated TTS cost
      transport: acc.transport + (call.cost * 0.1), // Estimated transport cost
      vapi: acc.vapi + (call.cost * 0.1), // Estimated VAPI cost
    };
  }, { llm: 0, stt: 0, tts: 0, transport: 0, vapi: 0 });
};

const calculateUsageMetrics = (data: CallData[]): UsageMetrics => {
  return data.reduce((acc, call) => {
    const duration = call.endedAt 
      ? (new Date(call.endedAt).getTime() - new Date(call.startedAt).getTime()) / 1000 
      : 0;
    
    return {
      totalMessages: acc.totalMessages + (call.messages?.length || 0),
      totalDuration: acc.totalDuration + duration,
      totalTTSCharacters: acc.totalTTSCharacters + (call.messages?.reduce((sum, msg) => sum + msg.message.length, 0) || 0),
    };
  }, { totalMessages: 0, totalDuration: 0, totalTTSCharacters: 0 });
};

const calculateSuccessRate = (data: CallData[]): number => {
  if (data.length === 0) return 0;
  const successfulCalls = data.filter(call => call.status === 'ended' && call.endedReason === 'customer-ended-call').length;
  return (successfulCalls / data.length) * 100;
};

const CostAnalysisReport: React.FC<Props> = ({ data }) => {
  const [timeRange, setTimeRange] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [selectedMetric, setSelectedMetric] = useState<'cost' | 'usage' | 'performance'>('cost');

  // Calculate total costs and success metrics
  const {
    totalCost,
    avgCostPerCall,
    costBreakdown,
    successRate,
    totalTokens,
    costTrend,
    completedCalls,
    failedCalls,
    serviceMetrics,
    usageMetrics,
    performanceMetrics,
  } = useMemo(() => {
    const total = data.reduce((sum, call) => sum + (call.cost || 0), 0);
    const totalCalls = data.length;
    const successfulCalls = data.filter(call => call.status === 'ended' && call.endedReason === 'customer-ended-call').length;
    const success = calculateSuccessRate(data);

    // Calculate cost trend
    const today = new Date();
    const todayCalls = data.filter(call => isSameDay(new Date(call.startedAt), today));
    const yesterdayCalls = data.filter(call => isSameDay(new Date(call.startedAt), subDays(today, 1)));
    const todayCost = todayCalls.reduce((sum, call) => sum + (call.cost || 0), 0);
    const yesterdayCost = yesterdayCalls.reduce((sum, call) => sum + (call.cost || 0), 0);
    const trend = yesterdayCost ? ((todayCost - yesterdayCost) / yesterdayCost) * 100 : 0;

    // Calculate service-specific metrics
    const serviceMetrics = calculateServiceMetrics(data);

    // Calculate usage metrics
    const usageMetrics = calculateUsageMetrics(data);

    // Calculate performance metrics
    const performanceMetrics = {
      avgResponseTime: data.reduce((sum, call) => sum + (call.analysis?.averageResponseTime || 0), 0) / data.length,
      avgMessagesPerCall: usageMetrics.totalMessages / data.length,
      avgDuration: usageMetrics.totalDuration / data.length,
    };

    // Calculate token usage
    const tokens = data.reduce((acc, call) => {
      if (call.costBreakdown) {
        acc.promptTokens += call.costBreakdown.promptTokens || 0;
        acc.completionTokens += call.costBreakdown.completionTokens || 0;
        acc.totalTokens += (call.costBreakdown.llmPromptTokens || 0) + (call.costBreakdown.llmCompletionTokens || 0);
        acc.promptCost += (call.costBreakdown.llmPromptTokens || 0) * 0.00001;
        acc.completionCost += (call.costBreakdown.llmCompletionTokens || 0) * 0.00002;
      }
      return acc;
    }, {
      promptTokens: 0,
      completionTokens: 0,
      totalTokens: 0,
      promptCost: 0,
      completionCost: 0,
    });

    return {
      totalCost: total,
      avgCostPerCall: total / data.length,
      costBreakdown: tokens,
      successRate: success,
      totalTokens: tokens.totalTokens,
      costTrend: trend,
      completedCalls: successfulCalls,
      failedCalls: data.length - successfulCalls,
      serviceMetrics,
      usageMetrics,
      performanceMetrics,
    };
  }, [data]);

  // Calculate daily trends
  const getDailyData = (): DayData[] => {
    const startDate = subDays(new Date(), timeRange === 'daily' ? 7 : timeRange === 'weekly' ? 30 : 90);
    const endDate = new Date();
    const dates: Date[] = [];
    let currentDate = startDate;

    while (currentDate <= endDate) {
      dates.push(currentDate);
      currentDate = addDays(currentDate, 1);
    }

    return dates.map(date => {
      const dayCalls = data.filter(call => isSameDay(new Date(call.startedAt), date));
      const dayData: DayData = {
        date: format(date, 'MMM dd'),
        total: 0,
        promptCost: 0,
        completionCost: 0,
        totalCalls: 0,
        avgResponseTime: 0,
        successRate: 0,
        avgTokensPerCall: 0,
        avgCostPerCall: 0,
        transport: 0,
        stt: 0,
        llm: 0,
        tts: 0,
        vapi: 0,
        ttsCharacters: 0,
        messageCount: 0,
        callDuration: 0,
      };

      if (dayCalls.length > 0) {
        const totalDayCost = dayCalls.reduce((sum, call) => sum + (call.cost || 0), 0);
        const totalDayTokens = dayCalls.reduce((sum, call) => {
          const tokens = call.costBreakdown?.totalTokens || 0;
          return sum + tokens;
        }, 0);
        const completedCalls = dayCalls.filter(call => call.status === 'ended' && call.endedReason === 'customer-ended-call').length;

        dayData.total = totalDayCost;
        dayData.promptCost = dayCalls.reduce((sum, call) => sum + (call.costBreakdown?.promptCost || 0), 0);
        dayData.completionCost = dayCalls.reduce((sum, call) => sum + (call.costBreakdown?.completionCost || 0), 0);
        dayData.totalCalls = dayCalls.length;
        dayData.avgResponseTime = dayCalls.reduce((sum, call) => sum + (call.analysis?.averageResponseTime || 0), 0) / dayCalls.length;
        dayData.successRate = (completedCalls / dayCalls.length) * 100;
        dayData.avgTokensPerCall = totalDayTokens / dayCalls.length;
        dayData.avgCostPerCall = totalDayCost / dayCalls.length;
        dayData.transport = dayCalls.reduce((sum, call) => sum + (call.costBreakdown?.transport || 0), 0);
        dayData.stt = dayCalls.reduce((sum, call) => sum + (call.costBreakdown?.stt || 0), 0);
        dayData.llm = dayCalls.reduce((sum, call) => sum + (call.costBreakdown?.llm || 0), 0);
        dayData.tts = dayCalls.reduce((sum, call) => sum + (call.costBreakdown?.tts || 0), 0);
        dayData.vapi = dayCalls.reduce((sum, call) => sum + (call.costBreakdown?.vapi || 0), 0);
        dayData.ttsCharacters = dayCalls.reduce((sum, call) => sum + (call.costBreakdown?.ttsCharacters || 0), 0);
        dayData.messageCount = dayCalls.reduce((sum, call) => sum + (call.messages?.length || 0), 0);
        dayData.callDuration = dayCalls.reduce((sum, call) => sum + ((new Date(call.endedAt!).getTime() - new Date(call.startedAt).getTime()) / 1000), 0);
      }

      return dayData;
    });
  };

  const dailyData = useMemo(() => getDailyData(), [data, timeRange]);

  // Calculate cost per minute
  const costPerMinute = useMemo(() => {
    const callsWithDuration = data.filter(call => call.endedAt);
    return callsWithDuration.reduce((acc, call) => {
      const duration = (new Date(call.endedAt!).getTime() - new Date(call.startedAt).getTime()) / 1000 / 60;
      return acc + (call.cost || 0) / (duration || 1);
    }, 0) / callsWithDuration.length;
  }, [data]);

  const metrics = [
    {
      title: 'Total Cost',
      metric: `$${totalCost.toFixed(4)}`,
      icon: DollarSign,
      trend: costTrend,
      color: 'emerald' as Color,
    },
    {
      title: 'Avg Cost/Call',
      metric: `$${avgCostPerCall.toFixed(4)}`,
      icon: Target,
      trend: 0,
      color: 'blue' as Color,
    },
    {
      title: 'Cost/Minute',
      metric: `$${costPerMinute.toFixed(4)}`,
      icon: Clock,
      trend: 0,
      color: 'violet' as Color,
    },
    {
      title: 'Success Rate',
      metric: `${successRate.toFixed(1)}%`,
      icon: Layers,
      trend: 0,
      color: 'amber' as Color,
    },
  ];

  const costBreakdownData = [
    { name: 'Prompt Cost', value: costBreakdown.promptCost },
    { name: 'Completion Cost', value: costBreakdown.completionCost },
  ];

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const formatValue: ValueFormatter = (value: number) => `$${value.toFixed(4)}`;
  const formatPercentage: ValueFormatter = (value: number) => `${value.toFixed(1)}%`;
  const formatTime: ValueFormatter = (value: number) => `${value.toFixed(2)}s`;
  const formatNumber: ValueFormatter = (value: number) => value.toLocaleString();

  const formatMetric: ValueFormatter = (value: number, category?: string) => {
    if (category === 'successRate') return formatPercentage(value);
    if (category === 'avgResponseTime') return formatTime(value);
    if (category === 'totalCalls' || category === 'avgTokensPerCall') return formatNumber(value);
    return formatValue(value);
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <Grid numItems={1} numItemsSm={2} numItemsLg={4} className="gap-6">
        {selectedMetric === 'cost' && (
          <>
            <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }}>
              <Card decoration="top" decorationColor="emerald" className="hover:shadow-lg transition-shadow duration-300">
                <Flex alignItems="start">
                  <div>
                    <Text className="text-gray-600">Total Cost</Text>
                    <Metric className="font-bold text-2xl">${totalCost.toFixed(4)}</Metric>
                  </div>
                  <Badge icon={costTrend >= 0 ? TrendingUp : TrendingDown} color={costTrend >= 0 ? "emerald" : "red"}>
                    {Math.abs(costTrend).toFixed(1)}%
                  </Badge>
                </Flex>
                <ProgressBar value={75} color="emerald" className="mt-3" />
              </Card>
            </motion.div>
            <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }}>
              <Card decoration="top" decorationColor="blue" className="hover:shadow-lg transition-shadow duration-300">
                <Flex alignItems="start">
                  <div>
                    <Text className="text-gray-600">LLM Cost</Text>
                    <Metric className="font-bold text-2xl">${serviceMetrics.llm.toFixed(4)}</Metric>
                  </div>
                  <Bot className="h-6 w-6 text-blue-500" />
                </Flex>
                <ProgressBar value={serviceMetrics.llm / totalCost * 100} color="blue" className="mt-3" />
              </Card>
            </motion.div>
            <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }}>
              <Card decoration="top" decorationColor="violet" className="hover:shadow-lg transition-shadow duration-300">
                <Flex alignItems="start">
                  <div>
                    <Text className="text-gray-600">STT/TTS Cost</Text>
                    <Metric className="font-bold text-2xl">${(serviceMetrics.stt + serviceMetrics.tts).toFixed(4)}</Metric>
                  </div>
                  <Mic className="h-6 w-6 text-violet-500" />
                </Flex>
                <ProgressBar value={(serviceMetrics.stt + serviceMetrics.tts) / totalCost * 100} color="violet" className="mt-3" />
              </Card>
            </motion.div>
            <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }}>
              <Card decoration="top" decorationColor="amber" className="hover:shadow-lg transition-shadow duration-300">
                <Flex alignItems="start">
                  <div>
                    <Text className="text-gray-600">Transport Cost</Text>
                    <Metric className="font-bold text-2xl">${serviceMetrics.transport.toFixed(4)}</Metric>
                  </div>
                  <Phone className="h-6 w-6 text-amber-500" />
                </Flex>
                <ProgressBar value={serviceMetrics.transport / totalCost * 100} color="amber" className="mt-3" />
              </Card>
            </motion.div>
          </>
        )}

        {selectedMetric === 'usage' && (
          <>
            <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }}>
              <Card decoration="top" decorationColor="emerald" className="hover:shadow-lg transition-shadow duration-300">
                <Flex alignItems="start">
                  <div>
                    <Text className="text-gray-600">Total Messages</Text>
                    <Metric className="font-bold text-2xl">{usageMetrics.totalMessages.toLocaleString()}</Metric>
                  </div>
                  <MessageCircle className="h-6 w-6 text-emerald-500" />
                </Flex>
                <Text className="text-gray-500 mt-2">Avg {(usageMetrics.totalMessages / data.length).toFixed(1)} per call</Text>
              </Card>
            </motion.div>
            <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }}>
              <Card decoration="top" decorationColor="blue" className="hover:shadow-lg transition-shadow duration-300">
                <Flex alignItems="start">
                  <div>
                    <Text className="text-gray-600">Total Tokens</Text>
                    <Metric className="font-bold text-2xl">{totalTokens.toLocaleString()}</Metric>
                  </div>
                  <Bot className="h-6 w-6 text-blue-500" />
                </Flex>
                <Text className="text-gray-500 mt-2">Avg {(totalTokens / data.length).toFixed(0)} per call</Text>
              </Card>
            </motion.div>
            <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }}>
              <Card decoration="top" decorationColor="violet" className="hover:shadow-lg transition-shadow duration-300">
                <Flex alignItems="start">
                  <div>
                    <Text className="text-gray-600">TTS Characters</Text>
                    <Metric className="font-bold text-2xl">{usageMetrics.totalTTSCharacters.toLocaleString()}</Metric>
                  </div>
                  <Mic className="h-6 w-6 text-violet-500" />
                </Flex>
                <Text className="text-gray-500 mt-2">Avg {(usageMetrics.totalTTSCharacters / data.length).toFixed(0)} per call</Text>
              </Card>
            </motion.div>
            <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }}>
              <Card decoration="top" decorationColor="amber" className="hover:shadow-lg transition-shadow duration-300">
                <Flex alignItems="start">
                  <div>
                    <Text className="text-gray-600">Total Duration</Text>
                    <Metric className="font-bold text-2xl">{(usageMetrics.totalDuration / 60).toFixed(1)}m</Metric>
                  </div>
                  <Clock className="h-6 w-6 text-amber-500" />
                </Flex>
                <Text className="text-gray-500 mt-2">Avg {(usageMetrics.totalDuration / data.length).toFixed(1)}s per call</Text>
              </Card>
            </motion.div>
          </>
        )}

        {selectedMetric === 'performance' && (
          <>
            <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }}>
              <Card decoration="top" decorationColor="emerald" className="hover:shadow-lg transition-shadow duration-300">
                <Flex alignItems="start">
                  <div>
                    <Text className="text-gray-600">Success Rate</Text>
                    <Metric className="font-bold text-2xl">{successRate.toFixed(1)}%</Metric>
                  </div>
                  <Target className="h-6 w-6 text-emerald-500" />
                </Flex>
                <ProgressBar value={successRate} color="emerald" className="mt-3" />
              </Card>
            </motion.div>
            <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }}>
              <Card decoration="top" decorationColor="blue" className="hover:shadow-lg transition-shadow duration-300">
                <Flex alignItems="start">
                  <div>
                    <Text className="text-gray-600">Avg Response Time</Text>
                    <Metric className="font-bold text-2xl">{performanceMetrics.avgResponseTime.toFixed(2)}s</Metric>
                  </div>
                  <Zap className="h-6 w-6 text-blue-500" />
                </Flex>
                <ProgressBar value={100 - (performanceMetrics.avgResponseTime / 5 * 100)} color="blue" className="mt-3" />
              </Card>
            </motion.div>
            <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }}>
              <Card decoration="top" decorationColor="violet" className="hover:shadow-lg transition-shadow duration-300">
                <Flex alignItems="start">
                  <div>
                    <Text className="text-gray-600">Messages/Call</Text>
                    <Metric className="font-bold text-2xl">{performanceMetrics.avgMessagesPerCall.toFixed(1)}</Metric>
                  </div>
                  <MessageCircle className="h-6 w-6 text-violet-500" />
                </Flex>
                <ProgressBar value={performanceMetrics.avgMessagesPerCall / 20 * 100} color="violet" className="mt-3" />
              </Card>
            </motion.div>
            <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }}>
              <Card decoration="top" decorationColor="amber" className="hover:shadow-lg transition-shadow duration-300">
                <Flex alignItems="start">
                  <div>
                    <Text className="text-gray-600">Avg Duration</Text>
                    <Metric className="font-bold text-2xl">{performanceMetrics.avgDuration.toFixed(1)}s</Metric>
                  </div>
                  <Clock className="h-6 w-6 text-amber-500" />
                </Flex>
                <ProgressBar value={performanceMetrics.avgDuration / 300 * 100} color="amber" className="mt-3" />
              </Card>
            </motion.div>
          </>
        )}
      </Grid>

      <Card className="p-2 bg-white/50">
        <Flex className="space-x-2">
          <Select
            value={selectedMetric}
            onValueChange={(value: 'cost' | 'usage' | 'performance') => setSelectedMetric(value)}
            className="max-w-xs"
          >
            <SelectItem value="cost">Cost Metrics</SelectItem>
            <SelectItem value="usage">Usage Metrics</SelectItem>
            <SelectItem value="performance">Performance Metrics</SelectItem>
          </Select>
          <Select
            value={timeRange}
            onValueChange={(value: 'daily' | 'weekly' | 'monthly') => setTimeRange(value)}
            className="max-w-xs"
          >
            <SelectItem value="daily">Last 7 Days</SelectItem>
            <SelectItem value="weekly">Last 30 Days</SelectItem>
            <SelectItem value="monthly">Last 90 Days</SelectItem>
          </Select>
        </Flex>
      </Card>

      <TabGroup>
        <TabList className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm shadow-sm rounded-lg mb-6">
          <Tab icon={PieChart}>Overview</Tab>
          <Tab icon={BarChart2}>Breakdown</Tab>
          <Tab icon={LineChartIcon}>Trends</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <AnimatePresence mode="wait">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
              >
                <Grid numItems={1} numItemsSm={2} className="gap-6">
                  <Card className="hover:shadow-lg transition-shadow duration-300">
                    <Title>Service Cost Distribution</Title>
                    <Subtitle className="mt-2">Breakdown of costs by service component</Subtitle>
                    <DonutChart
                      className="mt-6"
                      data={[
                        { name: 'LLM', value: serviceMetrics.llm },
                        { name: 'STT', value: serviceMetrics.stt },
                        { name: 'TTS', value: serviceMetrics.tts },
                        { name: 'Transport', value: serviceMetrics.transport },
                        { name: 'VAPI', value: serviceMetrics.vapi },
                      ]}
                      category="value"
                      index="name"
                      valueFormatter={formatValue}
                      colors={["indigo", "violet", "cyan", "amber", "emerald"]}
                      showAnimation={true}
                      showTooltip={true}
                    />
                    <Legend
                      className="mt-6"
                      categories={['LLM', 'STT', 'TTS', 'Transport', 'VAPI']}
                      colors={["indigo", "violet", "cyan", "amber", "emerald"]}
                    />
                    <div className="mt-4 space-y-2">
                      <Flex className="border-b pb-2">
                        <Text className="font-medium">Total Cost</Text>
                        <Text className="font-semibold text-indigo-600">${totalCost.toFixed(4)}</Text>
                      </Flex>
                      <Flex className="border-b pb-2">
                        <Text className="font-medium">Success Rate</Text>
                        <Text className="font-semibold text-emerald-600">{successRate.toFixed(1)}%</Text>
                      </Flex>
                    </div>
                  </Card>
                  <Card className="hover:shadow-lg transition-shadow duration-300">
                    <Title>Success vs Cost Analysis</Title>
                    <Subtitle className="mt-2">Correlation between success rate and costs</Subtitle>
                    <div className="mt-4 space-y-4">
                      <div>
                        <Text>Success Rate</Text>
                        <Metric className="text-emerald-600">{successRate.toFixed(1)}%</Metric>
                        <CategoryBar
                          values={[successRate]}
                          colors={["emerald"]}
                          markerValue={100}
                          showAnimation={true}
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Text>Cost per Call</Text>
                        <Metric className="text-indigo-600">
                          ${(totalCost / data.length).toFixed(4)}
                        </Metric>
                        <ProgressBar value={75} color="indigo" className="mt-2" />
                      </div>
                    </div>
                  </Card>
                </Grid>

                <Card className="mt-6">
                  <Title>Recent Call Details</Title>
                  <Subtitle className="mt-2">Latest calls with cost and performance details</Subtitle>
                  <Table className="mt-6">
                    <TableHead>
                      <TableRow>
                        <TableHeaderCell>Time</TableHeaderCell>
                        <TableHeaderCell>Duration</TableHeaderCell>
                        <TableHeaderCell>Cost</TableHeaderCell>
                        <TableHeaderCell>Messages</TableHeaderCell>
                        <TableHeaderCell>Tokens</TableHeaderCell>
                        <TableHeaderCell>Status</TableHeaderCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {data.slice(0, 5).map((call) => {
                        const duration = call.endedAt 
                          ? (new Date(call.endedAt).getTime() - new Date(call.startedAt).getTime()) / 1000 
                          : 0;
                        return (
                          <TableRow key={call.id}>
                            <TableCell>{format(new Date(call.startedAt), 'MMM dd, HH:mm')}</TableCell>
                            <TableCell>{duration.toFixed(1)}s</TableCell>
                            <TableCell>${call.cost.toFixed(4)}</TableCell>
                            <TableCell>{call.messages?.length || 0}</TableCell>
                            <TableCell>
                              {((call.costBreakdown?.llmPromptTokens || 0) + (call.costBreakdown?.llmCompletionTokens || 0)).toLocaleString()}
                            </TableCell>
                            <TableCell>
                              <Badge 
                                color={call.status === 'ended' && call.endedReason === 'customer-ended-call' ? 'emerald' : 'red'}
                                size="xs"
                              >
                                {call.status}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </Card>
              </motion.div>
            </AnimatePresence>
          </TabPanel>
          <TabPanel>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <Title>Service Cost Analysis</Title>
                <Subtitle className="mt-2">Detailed breakdown of costs by service</Subtitle>
                <Grid numItems={1} numItemsSm={2} numItemsLg={3} className="gap-6 mt-6">
                  <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }}>
                    <Card decoration="left" decorationColor="indigo">
                      <Flex>
                        <Text className="font-medium">LLM Cost</Text>
                        <Text className="font-semibold text-indigo-600">${serviceMetrics.llm.toFixed(4)}</Text>
                      </Flex>
                      <Metric className="mt-2">
                        {((serviceMetrics.llm / totalCost) * 100).toFixed(1)}%
                      </Metric>
                      <CategoryBar
                        values={[serviceMetrics.llm]}
                        colors={["indigo"]}
                        className="mt-2"
                      />
                      <Text className="text-gray-500 mt-2">of total cost</Text>
                    </Card>
                  </motion.div>
                  <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }}>
                    <Card decoration="left" decorationColor="violet">
                      <Flex>
                        <Text className="font-medium">STT Cost</Text>
                        <Text className="font-semibold text-violet-600">${serviceMetrics.stt.toFixed(4)}</Text>
                      </Flex>
                      <Metric className="mt-2">
                        {((serviceMetrics.stt / totalCost) * 100).toFixed(1)}%
                      </Metric>
                      <CategoryBar
                        values={[serviceMetrics.stt]}
                        colors={["violet"]}
                        className="mt-2"
                      />
                      <Text className="text-gray-500 mt-2">of total cost</Text>
                    </Card>
                  </motion.div>
                  <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }}>
                    <Card decoration="left" decorationColor="cyan">
                      <Flex>
                        <Text className="font-medium">TTS Cost</Text>
                        <Text className="font-semibold text-cyan-600">${serviceMetrics.tts.toFixed(4)}</Text>
                      </Flex>
                      <Metric className="mt-2">
                        {((serviceMetrics.tts / totalCost) * 100).toFixed(1)}%
                      </Metric>
                      <CategoryBar
                        values={[serviceMetrics.tts]}
                        colors={["cyan"]}
                        className="mt-2"
                      />
                      <Text className="text-gray-500 mt-2">of total cost</Text>
                    </Card>
                  </motion.div>
                </Grid>

                <div className="mt-6">
                  <Title>Usage Statistics</Title>
                  <Grid numItems={1} numItemsSm={2} numItemsLg={3} className="gap-6 mt-4">
                    <Card className="hover:shadow-lg transition-shadow duration-300">
                      <Text className="font-medium">Total Messages</Text>
                      <Metric className="text-indigo-600">
                        {usageMetrics.totalMessages.toLocaleString()}
                      </Metric>
                      <Text className="text-gray-500 mt-2">
                        Avg {(usageMetrics.totalMessages / data.length).toFixed(1)} per call
                      </Text>
                      <CategoryBar
                        values={[usageMetrics.totalMessages]}
                        colors={["indigo"]}
                        className="mt-2"
                      />
                    </Card>
                    <Card className="hover:shadow-lg transition-shadow duration-300">
                      <Text className="font-medium">Total Duration</Text>
                      <Metric className="text-violet-600">
                        {(usageMetrics.totalDuration / 60).toFixed(1)} minutes
                      </Metric>
                      <Text className="text-gray-500 mt-2">
                        Avg {(usageMetrics.totalDuration / data.length).toFixed(1)}s per call
                      </Text>
                      <CategoryBar
                        values={[usageMetrics.totalDuration]}
                        colors={["violet"]}
                        className="mt-2"
                      />
                    </Card>
                    <Card className="hover:shadow-lg transition-shadow duration-300">
                      <Text className="font-medium">TTS Characters</Text>
                      <Metric className="text-cyan-600">
                        {usageMetrics.totalTTSCharacters.toLocaleString()}
                      </Metric>
                      <Text className="text-gray-500 mt-2">
                        Avg {(usageMetrics.totalTTSCharacters / data.length).toFixed(0)} per call
                      </Text>
                      <CategoryBar
                        values={[usageMetrics.totalTTSCharacters]}
                        colors={["cyan"]}
                        className="mt-2"
                      />
                    </Card>
                  </Grid>
                </div>

                <div className="mt-6">
                  <Title>Token Usage Analysis</Title>
                  <Grid numItems={1} numItemsSm={2} className="gap-6 mt-4">
                    <Card className="hover:shadow-lg transition-shadow duration-300">
                      <Title>Token Distribution</Title>
                      <DonutChart
                        className="mt-6"
                        data={[
                          { name: 'Prompt Tokens', value: costBreakdown.promptTokens },
                          { name: 'Completion Tokens', value: costBreakdown.completionTokens },
                        ]}
                        category="value"
                        index="name"
                        valueFormatter={(value) => value.toLocaleString()}
                        colors={["indigo", "violet"]}
                        showAnimation={true}
                        showTooltip={true}
                      />
                      <Legend
                        className="mt-4"
                        categories={['Prompt Tokens', 'Completion Tokens']}
                        colors={["indigo", "violet"]}
                      />
                    </Card>
                    <Card className="hover:shadow-lg transition-shadow duration-300">
                      <Title>Token Cost Distribution</Title>
                      <DonutChart
                        className="mt-6"
                        data={[
                          { name: 'Prompt Cost', value: costBreakdown.promptCost },
                          { name: 'Completion Cost', value: costBreakdown.completionCost },
                        ]}
                        category="value"
                        index="name"
                        valueFormatter={formatValue}
                        colors={["indigo", "violet"]}
                        showAnimation={true}
                        showTooltip={true}
                      />
                      <Legend
                        className="mt-4"
                        categories={['Prompt Cost', 'Completion Cost']}
                        colors={["indigo", "violet"]}
                      />
                    </Card>
                  </Grid>
                </div>
              </Card>
            </motion.div>
          </TabPanel>
          <TabPanel>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <div className="mb-6">
                  <Select
                    value={timeRange}
                    onValueChange={(value: 'daily' | 'weekly' | 'monthly') => setTimeRange(value)}
                    className="max-w-xs"
                  >
                    <SelectItem value="daily">Last 7 Days</SelectItem>
                    <SelectItem value="weekly">Last 30 Days</SelectItem>
                    <SelectItem value="monthly">Last 90 Days</SelectItem>
                  </Select>
                </div>
                <Title>Cost Trends Over Time</Title>
                <Subtitle className="mt-2">Analysis of cost patterns over time</Subtitle>
                <Grid numItems={1} numItemsSm={2} className="gap-6 mt-6">
                  <Card className="hover:shadow-lg transition-shadow duration-300">
                    <Title>Cost vs Response Time</Title>
                    <Subtitle className="mt-2">Correlation between cost and response time</Subtitle>
                    <LineChart
                      className="mt-6 h-80"
                      data={dailyData}
                      index="date"
                      categories={["total", "avgResponseTime"]}
                      colors={["blue", "amber"]}
                      valueFormatter={formatMetric}
                      showAnimation={true}
                      showTooltip={true}
                      showLegend={true}
                      curveType="natural"
                    />
                    <Legend
                      className="mt-4"
                      categories={["Cost", "Response Time"]}
                      colors={["blue", "amber"]}
                    />
                  </Card>
                  <Card className="hover:shadow-lg transition-shadow duration-300">
                    <Title>Cost Components Trend</Title>
                    <Subtitle className="mt-2">Breakdown of cost components over time</Subtitle>
                    <AreaChart
                      className="mt-6 h-80"
                      data={dailyData}
                      index="date"
                      categories={["promptCost", "completionCost"]}
                      colors={["indigo", "cyan"]}
                      valueFormatter={formatValue}
                      showAnimation={true}
                      showTooltip={true}
                      showLegend={true}
                      stack={true}
                      curveType="natural"
                    />
                    <Legend
                      className="mt-4"
                      categories={["Prompt Cost", "Completion Cost"]}
                      colors={["indigo", "cyan"]}
                    />
                  </Card>
                </Grid>

                <div className="mt-6">
                  <Grid numItems={1} numItemsSm={2} className="gap-6">
                    <Card className="hover:shadow-lg transition-shadow duration-300">
                      <Title>Calls and Tokens per Day</Title>
                      <Subtitle className="mt-2">Daily distribution of calls and token usage</Subtitle>
                      <BarChart
                        className="mt-6 h-80"
                        data={dailyData}
                        index="date"
                        categories={["totalCalls", "avgTokensPerCall"]}
                        colors={["violet", "cyan"]}
                        valueFormatter={formatMetric}
                        showAnimation={true}
                        showTooltip={true}
                        showLegend={true}
                      />
                      <Legend
                        className="mt-4"
                        categories={["Total Calls", "Avg Tokens per Call"]}
                        colors={["violet", "cyan"]}
                      />
                    </Card>
                    <Card className="hover:shadow-lg transition-shadow duration-300">
                      <Title>Success Rate Trend</Title>
                      <Subtitle className="mt-2">Daily success rate performance</Subtitle>
                      <LineChart
                        className="mt-6 h-80"
                        data={dailyData}
                        index="date"
                        categories={["successRate"]}
                        colors={["emerald"]}
                        valueFormatter={formatPercentage}
                        showAnimation={true}
                        showTooltip={true}
                        showLegend={true}
                        curveType="natural"
                      />
                      <Legend
                        className="mt-4"
                        categories={["Success Rate"]}
                        colors={["emerald"]}
                      />
                    </Card>
                  </Grid>
                </div>
              </Card>
            </motion.div>
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </motion.div>
  );
};

export default CostAnalysisReport;
