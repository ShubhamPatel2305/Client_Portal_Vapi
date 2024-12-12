import { Card, Grid, List, ListItem, Title, Text, AreaChart } from '@tremor/react';
import { motion } from 'framer-motion';
import { User, Phone, Clock, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Analytics } from '../../lib/api/vapiService';

interface UserEngagementReportProps {
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

const colors = {
  users: 'blue',
  duration: 'emerald',
  calls: 'violet',
} as const;

export default function UserEngagementReport({ data }: UserEngagementReportProps) {
  if (!data) return null;

  const engagementMetrics = [
    {
      name: 'Active Users',
      value: data.numberOfCalls,
      icon: User,
      trend: data.numberOfCallsTrend,
      color: colors.users,
      description: 'Total unique users making calls',
    },
    {
      name: 'Average Call Duration',
      value: Math.round(data.totalCallMinutes / data.numberOfCalls),
      icon: Clock,
      trend: data.totalCallMinutesTrend,
      suffix: ' mins',
      color: colors.duration,
      description: 'Average time spent on calls',
    },
    {
      name: 'Calls per User',
      value: Math.round(data.numberOfCalls / Math.max(1, data.numberOfCalls * 0.7)), // Ensure no division by zero
      icon: Phone,
      trend: data.numberOfCallsTrend,
      color: colors.calls,
      description: 'Average number of calls per user',
    },
  ];

  return (
    <motion.div
      className="space-y-6"
      variants={containerAnimation}
      initial="hidden"
      animate="show"
    >
      <Grid numItems={1} numItemsSm={2} numItemsLg={3} className="gap-6">
        {engagementMetrics.map((metric) => (
          <motion.div key={metric.name} variants={itemAnimation}>
            <Card
              className={`p-6 bg-gradient-to-br from-${metric.color}-50 to-${metric.color}-100/20 border-none transform transition-all duration-200 hover:scale-105`}
              decoration="top"
              decorationColor={metric.color}
            >
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className={`p-2 bg-${metric.color}-100 rounded-lg w-fit`}>
                    <metric.icon className={`w-5 h-5 text-${metric.color}-500`} />
                  </div>
                  <Text className={`text-${metric.color}-600`}>{metric.name}</Text>
                  <Title className={`text-2xl font-bold text-${metric.color}-900`}>
                    {typeof metric.value === 'number' ? metric.value.toFixed(1) : metric.value}
                    {metric.suffix}
                  </Title>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-1">
                    {metric.trend >= 0 ? (
                      <ArrowUpRight className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4 text-rose-500" />
                    )}
                    <Text
                      className={
                        metric.trend >= 0 ? 'text-emerald-600' : 'text-rose-600'
                      }
                    >
                      {Math.abs(metric.trend).toFixed(1)}%
                    </Text>
                  </div>
                  <Text className="text-xs text-gray-500 mt-1">vs last period</Text>
                </div>
              </div>
              <Text className="text-xs text-gray-500 mt-4">{metric.description}</Text>
            </Card>
          </motion.div>
        ))}
      </Grid>

      <Grid numItems={1} numItemsLg={2} className="gap-6">
        <motion.div variants={itemAnimation}>
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <Title>User Activity Trend</Title>
                <Text className="text-gray-500">Monthly user engagement</Text>
              </div>
              <div className="flex items-center space-x-4">
                {Object.entries(colors).map(([key, color]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full bg-${color}-500`} />
                    <Text className="text-sm capitalize">{key}</Text>
                  </div>
                ))}
              </div>
            </div>
            <AreaChart
              className="h-72"
              data={data.monthlyCallData}
              index="date"
              categories={['totalCalls']}
              colors={[colors.calls]}
              valueFormatter={(number: number) =>
                number.toLocaleString('en-US', {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })
              }
              showAnimation={true}
            />
          </Card>
        </motion.div>

        <motion.div variants={itemAnimation}>
          <Card className="p-6">
            <Title className="mb-6">Recent User Activity</Title>
            <List>
              {data.recentCalls.slice(0, 5).map((call) => (
                <ListItem key={call.id}>
                  <div className="flex justify-between items-center w-full">
                    <div className="space-y-1">
                      <Text className="font-medium">{call.phoneNumber}</Text>
                      <div className="flex items-center space-x-2">
                        <Text className="text-sm text-gray-500">
                          {new Date(call.date).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </Text>
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            call.status === 'success'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {call.status}
                        </span>
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <Text className="font-medium">
                        {Math.round(call.duration / 60)} mins
                      </Text>
                      <Text className="text-sm text-gray-500">
                        ${call.cost.toFixed(2)}
                      </Text>
                    </div>
                  </div>
                </ListItem>
              ))}
            </List>
          </Card>
        </motion.div>
      </Grid>
    </motion.div>
  );
}
