import { Card, Grid, Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow, Text, Title, DonutChart, AreaChart } from '@tremor/react';
import { motion } from 'framer-motion';
import { Phone, Clock, DollarSign, Activity } from 'lucide-react';
import { Analytics } from '../../lib/api/vapiService';

interface CallAnalyticsReportProps {
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

export default function CallAnalyticsReport({ data }: CallAnalyticsReportProps) {
  if (!data) return null;

  const callMetrics = [
    {
      title: 'Total Calls',
      value: data.numberOfCalls,
      icon: Phone,
      trend: data.numberOfCallsTrend,
      color: 'blue',
    },
    {
      title: 'Avg Duration',
      value: Math.round(data.totalCallMinutes / data.numberOfCalls),
      icon: Clock,
      trend: data.totalCallMinutesTrend,
      suffix: ' mins',
      color: 'emerald',
    },
    {
      title: 'Success Rate',
      value: (data.callDistribution.find(d => d.name === 'success')?.value || 0),
      icon: Activity,
      trend: Number(data.callDistribution.find(d => d.name === 'success')?.trend || 0),
      suffix: '%',
      color: 'violet',
    },
    {
      title: 'Avg Cost',
      value: data.avgCostPerCall,
      icon: DollarSign,
      trend: data.avgCostPerCallTrend,
      prefix: '$',
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
        {callMetrics.map((metric) => (
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
                <metric.icon className={`w-5 h-5 text-${metric.color}-500`} />
              </div>
              <div className="mt-2">
                <Title className={`text-2xl font-bold text-${metric.color}-900`}>
                  {metric.prefix}
                  {typeof metric.value === 'number'
                    ? metric.value.toFixed(2)
                    : metric.value}
                  {metric.suffix}
                </Title>
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
            <Title className="mb-4">Call Distribution</Title>
            <DonutChart
              data={data.callDistribution}
              category="value"
              index="name"
              valueFormatter={(number) => `${number.toFixed(1)}%`}
              colors={['emerald', 'rose', 'amber']}
              showAnimation={true}
              className="h-60"
            />
          </Card>
        </motion.div>

        <motion.div variants={itemAnimation}>
          <Card className="p-4">
            <Title className="mb-4">Monthly Call Volume</Title>
            <AreaChart
              data={data.monthlyCallData}
              index="date"
              categories={['totalCalls']}
              colors={['blue']}
              valueFormatter={(number) =>
                number.toLocaleString('en-US', {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })
              }
              showLegend={false}
              showAnimation={true}
              className="h-60"
            />
          </Card>
        </motion.div>
      </Grid>

      <motion.div variants={itemAnimation}>
        <Card className="overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <Title>Recent Calls</Title>
          </div>
          <Table>
            <TableHead>
              <TableRow>
                <TableHeaderCell>Date</TableHeaderCell>
                <TableHeaderCell>Phone Number</TableHeaderCell>
                <TableHeaderCell>Type</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell>Duration</TableHeaderCell>
                <TableHeaderCell>Cost</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.recentCalls.map((call) => (
                <TableRow key={call.id} className="hover:bg-gray-50">
                  <TableCell>
                    {new Date(call.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{call.phoneNumber}</TableCell>
                  <TableCell>
                    <Text
                      className={
                        call.type === 'inbound'
                          ? 'text-emerald-600'
                          : 'text-blue-600'
                      }
                    >
                      {call.type}
                    </Text>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        call.status === 'success'
                          ? 'bg-emerald-100 text-emerald-800'
                          : call.status === 'failed'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {call.status}
                    </span>
                  </TableCell>
                  <TableCell>{Math.round(call.duration / 60)} mins</TableCell>
                  <TableCell>${call.cost.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </motion.div>
    </motion.div>
  );
}
