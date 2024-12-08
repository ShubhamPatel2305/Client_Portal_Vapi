import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Card,
  Title,
  Text,
  Tab,
  TabList,
  TabGroup,
  TabPanel,
  TabPanels,
  AreaChart,
  BarChart,
  DonutChart,
  Badge,
  Grid,
  Flex,
  Metric,
  ProgressBar,
  Select,
  SelectItem,
} from '@tremor/react';
import { vapiService } from '../services/vapiService';
import { format, subDays } from 'date-fns';
import LoadingSpinner from '../components/LoadingSpinner';

const timeRanges = [
  { value: '7d', label: 'Last 7 Days' },
  { value: '30d', label: 'Last 30 Days' },
  { value: '90d', label: 'Last 90 Days' },
];

const Analytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [assistantId] = useState('56c7f0f1-a068-4f7f-ae52-33bb86c3896d');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAnalytics();
  }, [timeRange, assistantId]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const days = parseInt(timeRange);
      const endDate = new Date();
      const startDate = subDays(endDate, days);

      const analyticsData = await vapiService.getAnalytics({
        start_date: format(startDate, 'yyyy-MM-dd'),
        end_date: format(endDate, 'yyyy-MM-dd'),
        assistant_id: assistantId,
      });

      setAnalytics(analyticsData);
    } catch (error: any) {
      console.error('Failed to fetch analytics:', error);
      setError(error.message || 'Failed to fetch analytics data');
      setAnalytics(null);
    } finally {
      setLoading(false);
    }
  };

  const processCallsByStatus = (calls: any[]) => {
    return calls.reduce((acc: Record<string, number>, call: any) => {
      const status = call.status || 'unknown';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});
  };

  const processCallsByDate = (calls: any[]) => {
    return calls.reduce((acc: Record<string, number>, call: any) => {
      const date = format(new Date(call.created_at), 'yyyy-MM-dd');
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner size={40} />
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Text>Failed to load analytics data.</Text>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 space-y-6"
    >
      {error && (
        <Card className="mt-4">
          <Text color="red">{error}</Text>
        </Card>
      )}

      {loading ? (
        <Card className="mt-4">
          <Text>Loading analytics data...</Text>
        </Card>
      ) : analytics ? (
        <div>
          <div className="flex justify-between items-center">
            <div>
              <Title className="text-2xl font-bold">Vapi Analytics</Title>
              <Text>Comprehensive insights into your AI caller performance</Text>
            </div>
            <Select
              value={timeRange}
              onValueChange={setTimeRange}
              className="w-40"
            >
              {timeRanges.map((range) => (
                <SelectItem key={range.value} value={range.value}>
                  {range.label}
                </SelectItem>
              ))}
            </Select>
          </div>

          <TabGroup>
            <TabList className="mb-8">
              <Tab>Overview</Tab>
              <Tab>Performance</Tab>
              <Tab>Quality</Tab>
              <Tab>Issues</Tab>
            </TabList>

            <TabPanels>
              <TabPanel>
                <Grid numItems={1} numItemsSm={2} numItemsLg={3} className="gap-6">
                  <Card decoration="top" decorationColor="blue">
                    <Text>Total Calls</Text>
                    <Metric>{analytics.total_calls?.toLocaleString()}</Metric>
                    <Flex className="mt-4">
                      <Text>Success Rate</Text>
                      <Badge color="emerald">
                        {((analytics.callsByStatus?.completed || 0) / analytics.total_calls * 100).toFixed(1)}%
                      </Badge>
                    </Flex>
                    <ProgressBar 
                      value={(analytics.callsByStatus?.completed || 0) / analytics.total_calls * 100} 
                      color="blue" 
                      className="mt-3" 
                    />
                  </Card>

                  <Card decoration="top" decorationColor="green">
                    <Text>Average Duration</Text>
                    <Metric>{Math.round(analytics.average_duration / 60)}m {Math.round(analytics.average_duration % 60)}s</Metric>
                    <Flex className="mt-4">
                      <Text>Efficiency</Text>
                      <Badge color="emerald">+5.2%</Badge>
                    </Flex>
                    <ProgressBar value={80} color="green" className="mt-3" />
                  </Card>

                  <Card decoration="top" decorationColor="purple">
                    <Text>Average Latency</Text>
                    <Metric>{Math.round(analytics.averageLatency)}ms</Metric>
                    <Flex className="mt-4">
                      <Text>Performance</Text>
                      <Badge color="emerald">Good</Badge>
                    </Flex>
                    <ProgressBar value={85} color="purple" className="mt-3" />
                  </Card>
                </Grid>

                <Card className="mt-6">
                  <Title>Call Volume Trends</Title>
                  <AreaChart
                    className="mt-4 h-72"
                    data={Object.entries(analytics.callsByDate).map(([date, count]) => ({
                      date,
                      calls: count,
                    }))}
                    index="date"
                    categories={["calls"]}
                    colors={["blue"]}
                  />
                </Card>
              </TabPanel>

              <TabPanel>
                <Grid numItems={1} numItemsSm={2} className="gap-6">
                  <Card>
                    <Title>Call Status Distribution</Title>
                    <DonutChart
                      className="mt-4 h-40"
                      data={Object.entries(analytics.callsByStatus).map(([status, count]) => ({
                        name: status,
                        value: count,
                      }))}
                      category="value"
                      index="name"
                      colors={["emerald", "blue", "red"]}
                    />
                  </Card>

                  <Card>
                    <Title>Cost Analysis</Title>
                    <BarChart
                      className="mt-4 h-40"
                      data={[
                        { type: "Total Cost", amount: analytics.total_cost },
                        { type: "Avg Cost/Call", amount: analytics.total_cost / analytics.total_calls },
                      ]}
                      index="type"
                      categories={["amount"]}
                      colors={["blue"]}
                      valueFormatter={(value) => `$${value.toFixed(2)}`}
                    />
                  </Card>
                </Grid>
              </TabPanel>

              <TabPanel>
                <Grid numItems={1} numItemsSm={2} className="gap-6">
                  <Card>
                    <Title>Success Rate Over Time</Title>
                    <AreaChart
                      className="mt-4 h-60"
                      data={Object.entries(analytics.callsByDate).map(([date, count]) => ({
                        date,
                        "Success Rate": (analytics.callsByStatus?.completed || 0) / (count as number) * 100,
                      }))}
                      index="date"
                      categories={["Success Rate"]}
                      colors={["emerald"]}
                      valueFormatter={(value) => `${value.toFixed(1)}%`}
                    />
                  </Card>

                  <Card>
                    <Title>Performance Metrics</Title>
                    <div className="space-y-4 mt-4">
                      <div>
                        <Flex justifyContent="between" className="mb-2">
                          <Text>Average Response Time</Text>
                          <Text>{Math.round(analytics.averageLatency)}ms</Text>
                        </Flex>
                        <ProgressBar value={85} color="blue" />
                      </div>
                      <div>
                        <Flex justifyContent="between" className="mb-2">
                          <Text>Completion Rate</Text>
                          <Text>
                            {((analytics.callsByStatus?.completed || 0) / analytics.total_calls * 100).toFixed(1)}%
                          </Text>
                        </Flex>
                        <ProgressBar 
                          value={(analytics.callsByStatus?.completed || 0) / analytics.total_calls * 100} 
                          color="emerald" 
                        />
                      </div>
                    </div>
                  </Card>
                </Grid>
              </TabPanel>

              <TabPanel>
                <Grid numItems={1} numItemsSm={2} className="gap-6">
                  <Card>
                    <Title>Error Analysis</Title>
                    <BarChart
                      className="mt-4 h-60"
                      data={Object.entries(analytics.callsByStatus)
                        .filter(([status]) => status !== 'completed')
                        .map(([status, count]) => ({
                          status,
                          count,
                        }))}
                      index="status"
                      categories={["count"]}
                      colors={["red"]}
                    />
                  </Card>

                  <Card>
                    <Title>Cost Efficiency</Title>
                    <div className="space-y-4 mt-4">
                      <div>
                        <Flex justifyContent="between" className="mb-2">
                          <Text>Cost per Successful Call</Text>
                          <Text>
                            ${(analytics.total_cost / (analytics.callsByStatus?.completed || 1)).toFixed(2)}
                          </Text>
                        </Flex>
                        <ProgressBar value={75} color="emerald" />
                      </div>
                      <div>
                        <Flex justifyContent="between" className="mb-2">
                          <Text>Success/Cost Ratio</Text>
                          <Text>
                            {((analytics.callsByStatus?.completed || 0) / analytics.total_cost).toFixed(2)}
                          </Text>
                        </Flex>
                        <ProgressBar value={80} color="blue" />
                      </div>
                    </div>
                  </Card>
                </Grid>
              </TabPanel>
            </TabPanels>
          </TabGroup>
        </div>
      ) : null}
    </motion.div>
  );
};

export default Analytics;