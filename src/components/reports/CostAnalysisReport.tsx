import {
  Card,
  Title,
  Text,
  Grid,
  AreaChart,
  Metric,
  Flex,
  Badge,
} from '@tremor/react';
import {
  TrendingUp,
  TrendingDown,
  PieChart,
  Brain,
  Phone,
  Video,
  Mic,
  Bot,
} from 'lucide-react';
import { motion } from 'framer-motion';
import type { CallData } from '../../types/CallData';
import { format, subDays, startOfMonth } from 'date-fns';

interface Props {
  data: CallData[];
}

function CostAnalysisReport({ data }: Props) {
  // Calculate total costs and trends
  const calculateMetrics = () => {
    // Log incoming data for debugging
    console.log('Raw data:', data);

    // Calculate total cost and breakdown
    const totalCost = data.reduce((sum, call) => {
      console.log('Call cost:', call.cost, 'Breakdown:', call.costBreakdown);
      return sum + (call.cost || 0);
    }, 0);

    // Calculate cost breakdown
    const costBreakdown = data.reduce((acc, call) => {
      if (call.costBreakdown) {
        acc.llm += Number(call.costBreakdown.llm || 0);
        acc.stt += Number(call.costBreakdown.stt || 0);
        acc.tts += Number(call.costBreakdown.tts || 0);
        acc.transport += Number(call.costBreakdown.transport || 0);
        acc.vapi += Number(call.costBreakdown.vapi || 0);
      }
      return acc;
    }, {
      llm: 0,
      stt: 0,
      tts: 0,
      transport: 0,
      vapi: 0
    });

    console.log('Total cost:', totalCost);
    console.log('Cost breakdown:', costBreakdown);

    // Calculate previous period for trend
    const thirtyDaysAgo = subDays(new Date(), 30);
    const startOfToday = startOfMonth(new Date());
    const previousPeriodData = data.filter(call => {
      const callDate = new Date(call.startedAt);
      return callDate >= thirtyDaysAgo && callDate < startOfToday;
    });

    const previousTotalCost = previousPeriodData.reduce((sum, call) => sum + (Number(call.cost) || 0), 0);
    const costTrend = previousTotalCost ? ((totalCost - previousTotalCost) / previousTotalCost) * 100 : 0;

    // Create metrics array
    const metrics = [
      {
        name: 'Total Cost',
        value: Number(totalCost).toFixed(4),
        color: 'blue',
        trend: costTrend,
        percentage: 100,
        icon: PieChart,
      },
      {
        name: 'LLM Cost',
        value: Number(costBreakdown.llm).toFixed(4),
        color: 'emerald',
        trend: totalCost ? (costBreakdown.llm / totalCost) * 100 : 0,
        percentage: totalCost ? (costBreakdown.llm / totalCost) * 100 : 0,
        icon: Brain,
      },
      {
        name: 'STT Cost',
        value: Number(costBreakdown.stt).toFixed(4),
        color: 'violet',
        trend: totalCost ? (costBreakdown.stt / totalCost) * 100 : 0,
        percentage: totalCost ? (costBreakdown.stt / totalCost) * 100 : 0,
        icon: Mic,
      },
      {
        name: 'TTS Cost',
        value: Number(costBreakdown.tts).toFixed(4),
        color: 'amber',
        trend: totalCost ? (costBreakdown.tts / totalCost) * 100 : 0,
        percentage: totalCost ? (costBreakdown.tts / totalCost) * 100 : 0,
        icon: Video,
      },
      {
        name: 'Transport Cost',
        value: Number(costBreakdown.transport).toFixed(4),
        color: 'rose',
        trend: totalCost ? (costBreakdown.transport / totalCost) * 100 : 0,
        percentage: totalCost ? (costBreakdown.transport / totalCost) * 100 : 0,
        icon: Phone,
      },
      {
        name: 'VAPI Cost',
        value: Number(costBreakdown.vapi).toFixed(4),
        color: 'cyan',
        trend: totalCost ? (costBreakdown.vapi / totalCost) * 100 : 0,
        percentage: totalCost ? (costBreakdown.vapi / totalCost) * 100 : 0,
        icon: Bot,
      },
    ];

    // Create chart data
    const chartData = data
      .sort((a, b) => new Date(a.startedAt).getTime() - new Date(b.startedAt).getTime())
      .map(call => ({
        date: format(new Date(call.startedAt), 'MMM dd'),
        total: Number(call.cost) || 0,
        llm: Number(call.costBreakdown?.llm) || 0,
        stt: Number(call.costBreakdown?.stt) || 0,
        tts: Number(call.costBreakdown?.tts) || 0,
        transport: Number(call.costBreakdown?.transport) || 0,
        vapi: Number(call.costBreakdown?.vapi) || 0,
      }));

    return { metrics, chartData };
  };

  const { metrics, chartData } = calculateMetrics();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <Grid numItems={1} numItemsSm={2} numItemsLg={3} className="gap-6">
        {metrics.map((metric, index) => (
          <motion.div key={index} whileHover={{ scale: 1.02 }}>
            <Card decoration="top" decorationColor={metric.color} className="hover:shadow-lg transition-shadow duration-300">
              <Flex alignItems="start">
                <div>
                  <Text>{metric.name}</Text>
                  <div className="mt-2">
                    <Metric>${metric.value}</Metric>
                  </div>
                  <Flex className="mt-4">
                    <Badge
                      icon={metric.trend >= 0 ? TrendingUp : TrendingDown}
                      color={metric.trend >= 0 ? 'emerald' : 'red'}
                    >
                      {metric.trend.toFixed(1)}%
                    </Badge>
                    <Text className="ml-2">{metric.percentage.toFixed(1)}% of total</Text>
                  </Flex>
                </div>
                <metric.icon className="h-8 w-8 text-gray-400" />
              </Flex>
            </Card>
          </motion.div>
        ))}
      </Grid>

      <Card>
        <Title>Cost Trends</Title>
        <AreaChart
          className="mt-6 h-80"
          data={chartData}
          index="date"
          categories={["total", "llm", "stt", "tts", "transport", "vapi"]}
          colors={["slate", "emerald", "violet", "amber", "rose", "cyan"]}
          valueFormatter={(value) => `$${value.toFixed(4)}`}
          showAnimation={true}
          showLegend={true}
          showTooltip={true}
          showXAxis={true}
          showYAxis={true}
        />
      </Card>
    </motion.div>
  );
}

export default CostAnalysisReport;
