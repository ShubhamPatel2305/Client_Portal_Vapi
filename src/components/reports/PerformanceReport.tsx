import { Card, Grid, Metric, Text, AreaChart, BarChart } from '@tremor/react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Analytics } from '../../lib/api/vapiService';

interface PerformanceReportProps {
  data: Analytics | null;
  loading?: boolean;
}

const containerAnimation = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      staggerChildren: 0.1,
    },
  },
};

const itemAnimation = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function PerformanceReport({ data }: PerformanceReportProps) {
  if (!data) return null;

  const metrics = [
    {
      title: 'Total Call Minutes',
      value: data.totalCallMinutes,
      trend: data.totalCallMinutesTrend,
      prefix: '',
      suffix: ' mins',
      color: 'blue',
    },
    {
      title: 'Number of Calls',
      value: data.numberOfCalls,
      trend: data.numberOfCallsTrend,
      prefix: '',
      suffix: '',
      color: 'emerald',
    },
    {
      title: 'Total Spent',
      value: data.totalSpent,
      trend: data.totalSpentTrend,
      prefix: '$',
      suffix: '',
      color: 'violet',
    },
    {
      title: 'Avg Cost per Call',
      value: data.avgCostPerCall,
      trend: data.avgCostPerCallTrend,
      prefix: '$',
      suffix: '',
      color: 'amber',
    },
  ];

  return (
    <motion.div
      className="space-y-6"
      variants={containerAnimation}
      initial="hidden"
      animate="show"
    >
      <Grid numItems={1} numItemsSm={2} numItemsLg={4} className="gap-6">
        {metrics.map((metric) => (
          <motion.div key={metric.title} variants={itemAnimation}>
            <Card
              className={`p-4 bg-gradient-to-br from-${metric.color}-50 to-${metric.color}-100/20 border-none transform transition-all duration-200 hover:scale-105`}
              decoration="top"
              decorationColor={metric.color}
            >
              <div className="flex items-center justify-between">
                <Text className={`text-${metric.color}-600 font-medium`}>
                  {metric.title}
                </Text>
                {metric.trend >= 0 ? (
                  <TrendingUp className={`w-5 h-5 text-${metric.color}-500`} />
                ) : (
                  <TrendingDown className={`w-5 h-5 text-${metric.color}-500`} />
                )}
              </div>
              <div className="mt-2">
                <Metric className={`text-${metric.color}-900`}>
                  {metric.prefix}
                  {typeof metric.value === 'number'
                    ? metric.value.toFixed(2)
                    : metric.value}
                  {metric.suffix}
                </Metric>
                <Text
                  className={`mt-1 ${
                    metric.trend >= 0 ? 'text-emerald-600' : 'text-rose-600'
                  }`}
                >
                  {metric.trend >= 0 ? '↑' : '↓'} {Math.abs(metric.trend).toFixed(1)}%
                </Text>
              </div>
            </Card>
          </motion.div>
        ))}
      </Grid>

      <Grid numItems={1} numItemsSm={2} className="gap-6">
        <motion.div variants={itemAnimation}>
          <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
              <Text className="font-medium text-gray-600">Monthly Performance</Text>
              <div className="flex items-center space-x-2">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-blue-500 mr-1" />
                  <Text className="text-sm">Calls</Text>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 mr-1" />
                  <Text className="text-sm">Cost</Text>
                </div>
              </div>
            </div>
            <AreaChart
              className="h-72 mt-4"
              data={data.monthlyCallData}
              index="date"
              categories={['totalCalls', 'totalCost']}
              colors={['blue', 'emerald']}
              valueFormatter={(number: number) =>
                `${number.toLocaleString('en-US', {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}`
              }
              showLegend={false}
              showAnimation={true}
            />
          </Card>
        </motion.div>

        <motion.div variants={itemAnimation}>
          <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
              <Text className="font-medium text-gray-600">Cost Analysis</Text>
              <div className="flex items-center space-x-2">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-violet-500 mr-1" />
                  <Text className="text-sm">Amount</Text>
                </div>
              </div>
            </div>
            <BarChart
              className="h-72 mt-4"
              data={data.costAnalysis}
              index="category"
              categories={['amount']}
              colors={['violet']}
              valueFormatter={(number: number) =>
                `$${number.toLocaleString('en-US', {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}`
              }
              showLegend={false}
              showAnimation={true}
            />
          </Card>
        </motion.div>
      </Grid>
    </motion.div>
  );
}
