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
  Grid,
  Select,
  SelectItem,
  Button,
  Badge,
  AreaChart,
  DonutChart,
  Metric,
} from '@tremor/react';
import { format } from 'date-fns';
import { 
  Calendar,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  Clock,
  Phone,
  DollarSign,
  PieChart as PieChartIcon,
  Activity as ActivityIcon,
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import axios from 'axios';

interface TrendData {
  totalCallMinutesTrend: number;
  numberOfCallsTrend: number;
  totalSpentTrend: number;
  costPerMinuteTrend: number;
}

interface CallData {
  costBreakdown: any;
  endedReason: string;
  id: string;
  type: string;
  startedAt: string;
  endedAt: string;
  createdAt: string;
  status: string;
  duration: number;
  cost: number;
}

interface HourlyAnalysis {
  hour: number;
  calls: number;
  successRate: number;
}

interface AnalyticsType {
  costPerMinuteTrend: undefined;
  numberOfCalls: number;
  totalCallMinutes: number;
  totalSpent: number;
  callDistribution: Array<{
    name: string;
    value: number;
  }>;
  callHistory: Array<{
    date: string;
    calls: number;
    minutes: number;
    cost: number;
  }>;
  costBreakdown: Array<{
    name: string;
    value: number;
  }>;
  qualityMetrics: Array<{
    name: string;
    value: string;
  }>;
  peakHours: Array<HourlyAnalysis>;
}

const timeRanges = [
  { label: 'Last 7 Days', value: '7d' },
  { label: 'Last 30 Days', value: '30d' },
  { label: 'Last 90 Days', value: '90d' },
  { label: 'All Time', value: 'all' },
];

interface OverviewMetricsProps {
  data: AnalyticsType;
}

const OverviewMetrics: React.FC<OverviewMetricsProps> = ({ data }) => {
  const successRate = ((data.callDistribution.find(d => d.name === 'Successful')?.value || 0) / data.numberOfCalls * 100).toFixed(1);
  const totalCalls = data.numberOfCalls || 0;
  const avgDuration = (data.totalCallMinutes / (totalCalls || 1)).toFixed(1);
  const avgCostPerMinute = data.totalCallMinutes > 0 ? (data.totalSpent / data.totalCallMinutes) : 0;
  const successfulCallData = data.callDistribution?.find(d => d.name === 'Successful');
  const successValue = successfulCallData?.value ?? 0;

  return (
    <Grid numItems={1} numItemsSm={2} numItemsLg={4} className="gap-6">
      {/* Total Calls Card */}
      <motion.div 
        variants={{ initial: { opacity: 0, y: 20 }, enter: { opacity: 1, y: 0 } }}
        whileHover={{ scale: 1.03, zIndex: 30 }}
        className="relative"
        transition={{ type: "spring", stiffness: 300 }}
      >
        <Card 
          className="bg-gray-50 border border-gray-200 hover:border-gray-300 shadow-lg hover:shadow-xl transition-all duration-300 relative"
          decoration="top"
          decorationColor="blue"
        >
          <div className="flex items-center justify-between">
            <div className="rounded-full bg-blue-100 p-3">
              <Phone className="h-6 w-6 text-blue-600" />
            </div>
            {data.numberOfCalls !== undefined && (
              <div className={`flex items-center gap-1 text-sm ${data.numberOfCalls < 0 ? 'text-red-600' : 'text-green-600'}`}>
                <span>{data.numberOfCalls.toFixed(1)}%</span>
                {data.numberOfCalls < 0 ? (
                  <TrendingDown className="h-4 w-4" />
                ) : (
                  <TrendingUp className="h-4 w-4" />
                )}
              </div>
            )}
          </div>
          <div className="mt-4">
            <Text className="text-gray-600">Total Calls</Text>
            <Title className="text-3xl font-bold text-gray-900">
              {totalCalls}
            </Title>
          </div>
        </Card>
      </motion.div>

      {/* Success Rate Card */}
      <motion.div 
        variants={{ initial: { opacity: 0, y: 20 }, enter: { opacity: 1, y: 0 } }}
        whileHover={{ scale: 1.03, zIndex: 30 }}
        className="relative"
        transition={{ type: "spring", stiffness: 300 }}
      >
        <Card 
          className="bg-gray-50 border border-gray-200 hover:border-gray-300 shadow-lg hover:shadow-xl transition-all duration-300 relative"
          decoration="top"
          decorationColor="emerald"
        >
          <div className="flex items-center justify-between">
            <div className="rounded-full bg-emerald-100 p-3">
              <CheckCircle className="h-6 w-6 text-emerald-600" />
            </div>
            {successValue !== undefined && (
              <div className={`flex items-center gap-1 text-sm ${successValue < 0 ? 'text-red-600' : 'text-green-600'}`}>
                <span>{successValue.toFixed(1)}%</span>
                {successValue < 0 ? (
                  <TrendingDown className="h-4 w-4" />
                ) : (
                  <TrendingUp className="h-4 w-4" />
                )}
              </div>
            )}
          </div>
          <div className="mt-4">
            <Text className="text-gray-600">Success Rate</Text>
            <Title className="text-3xl font-bold text-gray-900">
              {successRate}%
            </Title>
          </div>
        </Card>
      </motion.div>

      {/* Average Duration Card */}
      <motion.div 
        variants={{ initial: { opacity: 0, y: 20 }, enter: { opacity: 1, y: 0 } }}
        whileHover={{ scale: 1.03, zIndex: 30 }}
        className="relative"
        transition={{ type: "spring", stiffness: 300 }}
      >
        <Card 
          className="bg-gray-50 border border-gray-200 hover:border-gray-300 shadow-lg hover:shadow-xl transition-all duration-300 relative"
          decoration="top"
          decorationColor="amber"
        >
          <div className="flex items-center justify-between">
            <div className="rounded-full bg-amber-100 p-3">
              <Clock className="h-6 w-6 text-amber-600" />
            </div>
            {data.totalCallMinutes !== undefined && (
              <div className={`flex items-center gap-1 text-sm ${data.totalCallMinutes < 0 ? 'text-red-600' : 'text-green-600'}`}>
                <span>{data.totalCallMinutes.toFixed(1)}%</span>
                {data.totalCallMinutes < 0 ? (
                  <TrendingDown className="h-4 w-4" />
                ) : (
                  <TrendingUp className="h-4 w-4" />
                )}
              </div>
            )}
          </div>
          <div className="mt-4">
            <Text className="text-gray-600">Average Duration</Text>
            <Title className="text-3xl font-bold text-gray-900">
              {avgDuration} min
            </Title>
          </div>
        </Card>
      </motion.div>

      {/* Cost Efficiency Card */}
      <motion.div 
        variants={{ initial: { opacity: 0, y: 20 }, enter: { opacity: 1, y: 0 } }}
        whileHover={{ scale: 1.03, zIndex: 30 }}
        className="relative"
        transition={{ type: "spring", stiffness: 300 }}
      >
        <Card 
          className="bg-gray-50 border border-gray-200 hover:border-gray-300 shadow-lg hover:shadow-xl transition-all duration-300 relative"
          decoration="top"
          decorationColor="purple"
        >
          <div className="flex items-center justify-between">
            <div className="rounded-full bg-purple-100 p-3">
              <DollarSign className="h-6 w-6 text-purple-600" />
            </div>
            {data.costPerMinuteTrend !== undefined && (
              <div className={`flex items-center gap-1 text-sm ${data.costPerMinuteTrend < 0 ? 'text-red-600' : 'text-green-600'}`}>
                <span>{data.costPerMinuteTrend.toFixed(1)}%</span>
                {data.costPerMinuteTrend < 0 ? (
                  <TrendingDown className="h-4 w-4" />
                ) : (
                  <TrendingUp className="h-4 w-4" />
                )}
              </div>
            )}
          </div>
          <div className="mt-4">
            <Text className="text-gray-600">Cost Efficiency</Text>
            <Title className="text-3xl font-bold text-gray-900">
              ${avgCostPerMinute.toFixed(2)}/min
            </Title>
          </div>
        </Card>
      </motion.div>
    </Grid>
  );
};

interface PerformanceTabProps {
  data: AnalyticsType;
}

const PerformanceTab: React.FC<PerformanceTabProps> = ({ data }) => {
  const processCallHistory = (history: typeof data.callHistory) => {
    if (!history?.length) return [];
    return history.map(item => ({
      date: format(new Date(item.date), 'MMM d'),
      Calls: item.calls || 0,
      Cost: parseFloat((item.cost || 0).toFixed(2)),
      "Avg Duration": item.minutes ? (item.minutes / item.calls).toFixed(1) : "0"
    }));
  };

  const chartData = processCallHistory(data.callHistory);
  const isGrowing = chartData.length >= 2 && 
    chartData[chartData.length - 1].Calls > chartData[chartData.length - 2].Calls;

  return (
    <div className="space-y-6">
      <Card className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
        <div className="flex items-center justify-between mb-6">
          <div>
            <Title className="text-xl font-bold text-gray-900">Call Performance Trends</Title>
            <Text className="text-gray-600">Daily call metrics and performance analysis</Text>
          </div>
          <Badge color={isGrowing ? "emerald" : "blue"} 
                icon={TrendingUp}
                className="px-3 py-1 text-sm">
            {isGrowing ? 'Growing' : 'Stable'}
          </Badge>
        </div>
        <AreaChart
          className="h-72 mt-4"
          data={chartData}
          index="date"
          categories={["Calls", "Cost", "Avg Duration"]}
          colors={["blue", "emerald", "amber"]}
          valueFormatter={(value, category) => {
            if (category === "Cost") return `$${Number(value).toFixed(2)}`;
            if (category === "Avg Duration") return `${value} min`;
            return Number(value).toLocaleString();
          }}
          showLegend
          showGridLines
          minValue={0}
          yAxisWidth={65}
          showAnimation={true}
        />
      </Card>

      <Grid numItems={1} numItemsSm={2} className="gap-6">
        <motion.div 
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Card 
            className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300"
            decoration="top"
            decorationColor="blue"
          >
            <div className="flex items-center justify-between mb-6">
              <Title className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-500" />
                Peak Hours Analysis
              </Title>
              <Text className="text-sm text-gray-500">
                Based on call volume
              </Text>
            </div>
            <div className="mt-4 max-h-[350px] overflow-y-auto pr-2 space-y-4">
              {data.peakHours?.map((peak) => (
                <div key={peak.hour} 
                     className="p-4 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors duration-300">
                  <div className="flex justify-between items-center mb-3">
                    <Text className="font-medium text-gray-900">
                      {`${peak.hour.toString().padStart(2, '0')}:00 - ${(peak.hour + 1).toString().padStart(2, '0')}:00`}
                    </Text>
                    <div className="flex gap-2">
                      <Badge size="xs" color="blue">
                        {peak.calls} calls
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="h-full bg-blue-500 rounded-full transition-all duration-500"
                        style={{ 
                          width: `${(peak.calls / Math.max(...data.peakHours.map(p => p.calls))) * 100}%`,
                          boxShadow: '0 2px 4px rgba(59, 130, 246, 0.3)'
                        }}
                      />
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <Text className="text-gray-600">Success Rate</Text>
                      <Text className={`font-medium ${
                        peak.successRate >= 80 ? 'text-green-600' :
                        peak.successRate >= 50 ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {peak.successRate.toFixed(1)}%
                      </Text>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        <motion.div 
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Card 
            className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300"
            decoration="top"
            decorationColor="emerald"
          >
            <div className="flex items-center justify-between mb-6">
              <Title className="text-lg font-bold text-gray-900">Cost Analysis</Title>
              <Text className="text-sm text-gray-500">
                Service breakdown
              </Text>
            </div>
            <div className="space-y-5 mt-4">
              {[
                { category: 'Voice Calls', amount: data.totalSpent * 0.7, color: 'bg-emerald-500' },
                { category: 'AI Processing', amount: data.totalSpent * 0.2, color: 'bg-blue-500' },
                { category: 'Other Services', amount: data.totalSpent * 0.1, color: 'bg-amber-500' }
              ].map((item) => (
                <div key={item.category} className="p-4 bg-gray-50 rounded-lg hover:bg-emerald-50 transition-colors duration-300">
                  <div className="flex justify-between items-center mb-2">
                    <Text className="font-medium text-gray-900">{item.category}</Text>
                    <div className="flex items-center gap-2">
                      <Badge size="xs" color="emerald">
                        ${item.amount.toFixed(2)}
                      </Badge>
                      <Text className="text-sm text-gray-500">
                        {((item.amount / data.totalSpent) * 100).toFixed(1)}%
                      </Text>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div 
                      className={`h-full ${item.color} transition-all duration-500`}
                      style={{ 
                        width: `${(item.amount / data.totalSpent) * 100}%`,
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                  </div>
                </div>
              ))}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <Text className="font-bold text-gray-900">Total Spent</Text>
                  <Text className="font-bold text-emerald-600">
                    ${data.totalSpent.toFixed(2)}
                  </Text>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </Grid>
    </div>
  );
};

interface DistributionTabProps {
  data: AnalyticsType;
}

const DistributionTab: React.FC<DistributionTabProps> = ({ data }) => {
  return (
    <div className="space-y-6">
      <Card className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
        <div className="flex items-center justify-between mb-6">
          <div>
            <Title className="text-xl font-bold text-gray-900">Call Distribution</Title>
            <Text className="text-gray-600">Overview of call outcomes</Text>
          </div>
          <Badge color="blue" size="lg">
            {data.numberOfCalls} Total Calls
          </Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DonutChart
            className="h-52"
            data={data.callDistribution}
            category="value"
            index="name"
            valueFormatter={(value) => `${value} calls`}
            colors={["emerald", "red", "amber", "blue"]}
          />
          <div className="space-y-4">
            {data.callDistribution.map((item, index) => (
              <div key={item.name} 
                   className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-300">
                <div className="flex justify-between items-center mb-2">
                  <Text className="font-medium text-gray-900">{item.name}</Text>
                  <div className="flex items-center gap-2">
                    <Badge size="xs" 
                           color={index === 0 ? "emerald" : 
                                  index === 1 ? "red" : 
                                  index === 2 ? "amber" : "blue"}>
                      {item.value} calls
                    </Badge>
                    <Text className="text-sm text-gray-500">
                      {((item.value / data.numberOfCalls) * 100).toFixed(1)}%
                    </Text>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      index === 0 ? "bg-emerald-500" :
                      index === 1 ? "bg-red-500" :
                      index === 2 ? "bg-amber-500" : "bg-blue-500"
                    }`}
                    style={{ 
                      width: `${(item.value / data.numberOfCalls) * 100}%`,
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};

interface QualityTabProps {
  data: AnalyticsType;
}

const QualityTab: React.FC<QualityTabProps> = ({ data }) => {
  // Calculate quality metrics
  const avgDuration = data.totalCallMinutes / data.numberOfCalls;
  const costEfficiency = data.totalSpent / data.numberOfCalls;
  const successRate = ((data.callDistribution.find(d => d.name === 'Successful')?.value || 0) / data.numberOfCalls * 100);

  const qualityScore = Math.min(
    ((successRate / 100) * 0.4 + 
    (1 - (costEfficiency / 2)) * 0.3 + 
    (Math.min(avgDuration / 10, 1)) * 0.3) * 100,
    100
  );

  return (
    <div className="space-y-6">
      <motion.div 
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <Card 
          className="bg-white border border-gray-200 hover:border-blue-200 shadow-md hover:shadow-lg transition-all duration-300"
          decoration="top"
          decorationColor="blue"
        >
          <div className="flex justify-between items-start mb-6">
            <div>
              <Title>Quality Score</Title>
              <Text className="text-gray-500">Combined performance metric</Text>
            </div>
            <div className="text-right">
              <Metric>{Math.round(qualityScore)}%</Metric>
              <Badge color={qualityScore >= 75 ? "emerald" : qualityScore >= 50 ? "amber" : "red"}>
                {qualityScore >= 75 ? "Excellent" : qualityScore >= 50 ? "Good" : "Needs Improvement"}
              </Badge>
            </div>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
            <div 
              className={`h-full ${
                qualityScore >= 75 ? 'bg-emerald-500' : 
                qualityScore >= 50 ? 'bg-amber-500' : 
                'bg-red-500'
              }`}
              style={{ width: `${qualityScore}%` }}
            />
          </div>
        </Card>
      </motion.div>

      <Grid numItems={1} numItemsSm={3} className="gap-6">
        <motion.div 
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Card 
            className="bg-white border border-gray-200 hover:border-blue-200 shadow-md hover:shadow-xl transition-all duration-300"
            decoration="top"
            decorationColor="blue"
          >
            <div className="flex flex-col items-center">
              <div className="p-4 bg-emerald-100 rounded-full mb-4">
                <CheckCircle className="h-8 w-8 text-emerald-600" />
              </div>
              <Title>Success Rate</Title>
              <Text className="font-medium mt-2">{successRate.toFixed(1)}%</Text>
              <Text className="text-gray-500 text-center mt-2">
                Of all calls completed successfully
              </Text>
            </div>
          </Card>
        </motion.div>

        <motion.div 
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Card 
            className="bg-white border border-gray-200 hover:border-blue-200 shadow-md hover:shadow-xl transition-all duration-300"
            decoration="top"
            decorationColor="blue"
          >
            <div className="flex flex-col items-center">
              <div className="p-4 bg-blue-100 rounded-full mb-4">
                <DollarSign className="h-8 w-8 text-blue-600" />
              </div>
              <Title>Cost Efficiency</Title>
              <Text className="font-medium mt-2">${costEfficiency.toFixed(2)}</Text>
              <Text className="text-gray-500 text-center mt-2">
                Average cost per call
              </Text>
            </div>
          </Card>
        </motion.div>

        <motion.div 
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Card 
            className="bg-white border border-gray-200 hover:border-blue-200 shadow-md hover:shadow-xl transition-all duration-300"
            decoration="top"
            decorationColor="blue"
          >
            <div className="flex flex-col items-center">
              <div className="p-4 bg-amber-100 rounded-full mb-4">
                <Clock className="h-8 w-8 text-amber-600" />
              </div>
              <Title>Avg Duration</Title>
              <Text className="font-medium mt-2">{Math.round(avgDuration)} min</Text>
              <Text className="text-gray-500 text-center mt-2">
                Average call duration
              </Text>
            </div>
          </Card>
        </motion.div>
      </Grid>
    </div>
  );
};

const Analytics = () => {
  const [selectedRange, setSelectedRange] = useState('7d');
  const [data, setData] = useState<AnalyticsType | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('performance');

  const getDateRange = (range: string): { startDate: Date; endDate: Date } => {
    const endDate = new Date();
    const startDate = new Date();
    
    switch (range) {
      case '7d':
        startDate.setDate(endDate.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(endDate.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(endDate.getDate() - 90);
        break;
      default:
        startDate.setDate(endDate.getDate() - 7);
    }
    
    return { startDate, endDate };
  };

  const filterCallsByDateRange = (calls: CallData[], range: string) => {
    const { startDate, endDate } = getDateRange(range);
    return calls.filter(call => {
      const callDate = new Date(call.startedAt);
      return callDate >= startDate && callDate <= endDate;
    });
  };

  const refreshData = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://api.vapi.ai/call', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_VAPI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Failed to fetch analytics data');

      const calls = await response.json();
      const filteredCalls = filterCallsByDateRange(calls, selectedRange);
      
      // Process hourly analysis
      const hourlyAnalysis = Array.from({ length: 24 }, (_, hour) => {
        const hourCalls = filteredCalls.filter(call => new Date(call.startedAt).getHours() === hour);
        const successfulCalls = hourCalls.filter(call => 
          call.status === 'ended' && call.endedReason === 'customer-ended-call'
        );
        
        return {
          hour,
          calls: hourCalls.length,
          successRate: hourCalls.length > 0 ? (successfulCalls.length / hourCalls.length) * 100 : 0
        };
      });

      // Process call history
      const callHistory = filteredCalls.reduce((acc, call) => {
        const date = format(new Date(call.startedAt), 'yyyy-MM-dd');
        const existing = acc.find(item => item.date === date);
        
        if (existing) {
          existing.calls += 1;
          existing.minutes += (call.duration || 0) / 60;
          existing.cost += call.cost || 0;
        } else {
          acc.push({
            date,
            calls: 1,
            minutes: (call.duration || 0) / 60,
            cost: call.cost || 0
          });
        }
        
        return acc;
      }, [] as Array<{ date: string; calls: number; minutes: number; cost: number }>)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      const transformedData: AnalyticsType = {
        numberOfCalls: filteredCalls.length,
        totalCallMinutes: filteredCalls.reduce((acc, call) => acc + ((call.duration || 0) / 60), 0),
        totalSpent: filteredCalls.reduce((acc, call) => acc + (call.cost || 0), 0),
        costPerMinuteTrend: undefined,
        callDistribution: [
          {
            name: 'Successful',
            value: filteredCalls.filter(call => 
              call.status === 'ended' && call.endedReason === 'customer-ended-call'
            ).length
          },
          {
            name: 'Failed - System Error',
            value: filteredCalls.filter(call => 
              call.status === 'failed' || call.endedReason === 'system-error'
            ).length
          },
          {
            name: 'Failed - Customer Dropped',
            value: filteredCalls.filter(call => 
              call.status === 'ended' && call.endedReason === 'customer-dropped'
            ).length
          },
          {
            name: 'Failed - Other',
            value: filteredCalls.filter(call => 
              call.status !== 'ended' || (
                call.endedReason !== 'customer-ended-call' && 
                call.endedReason !== 'system-error' && 
                call.endedReason !== 'customer-dropped'
              )
            ).length
          }
        ],
        callHistory,
        peakHours: hourlyAnalysis,
        qualityMetrics: [
          {
            name: 'Average Call Duration',
            value: `${(filteredCalls.reduce((acc, call) => acc + (call.duration || 0), 0) / (filteredCalls.length * 60)).toFixed(1)} minutes`
          },
          {
            name: 'Success Rate',
            value: `${((filteredCalls.filter(call => 
              call.status === 'ended' && call.endedReason === 'customer-ended-call'
            ).length / filteredCalls.length) * 100).toFixed(1)}%`
          }
        ]
      };

      setData(transformedData);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, [selectedRange]);

  if (loading || !data) {
    return <LoadingSpinner />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="p-6 max-w-7xl mx-auto"
    >
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Analytics Dashboard
            </h1>
            <p className="text-lg text-gray-600 font-medium">
              Comprehensive insights and performance metrics for your voice API
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <Select
              value={selectedRange}
              onValueChange={setSelectedRange}
              className="min-w-[180px]"
            >
              {timeRanges.map((range, index) => (
                <SelectItem key={index} value={range.value} icon={Calendar} className="font-medium">
                  {range.label}
                </SelectItem>
              ))}
            </Select>
            
            <Button
              onClick={refreshData}
              disabled={loading}
              variant="secondary"
              className="bg-white hover:bg-gray-50 border border-gray-200 shadow-sm px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200"
            >
              {loading ? (
                <>
                  <LoadingSpinner size={16} />
                  <span>Refreshing...</span>
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4" />
                  <span>Refresh</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      <OverviewMetrics data={data} />

      <TabGroup>
        <TabList className="mt-8 flex space-x-2 bg-white p-1 rounded-xl shadow-sm border border-gray-200">
          <Tab 
            className="w-full py-3 px-4 text-sm font-medium rounded-lg focus:outline-none transition-all duration-200 ui-selected:bg-blue-500 ui-selected:text-white ui-not-selected:bg-white ui-not-selected:text-gray-600 hover:bg-blue-50 ui-not-selected:hover:text-blue-500 flex items-center justify-center gap-2"
          >
            <TrendingUp className="w-5 h-5" />
            Performance
          </Tab>
          <Tab 
            className="w-full py-3 px-4 text-sm font-medium rounded-lg focus:outline-none transition-all duration-200 ui-selected:bg-blue-500 ui-selected:text-white ui-not-selected:bg-white ui-not-selected:text-gray-600 hover:bg-blue-50 ui-not-selected:hover:text-blue-500 flex items-center justify-center gap-2"
          >
            <PieChartIcon className="w-5 h-5" />
            Distribution
          </Tab>
          <Tab 
            className="w-full py-3 px-4 text-sm font-medium rounded-lg focus:outline-none transition-all duration-200 ui-selected:bg-blue-500 ui-selected:text-white ui-not-selected:bg-white ui-not-selected:text-gray-600 hover:bg-blue-50 ui-not-selected:hover:text-blue-500 flex items-center justify-center gap-2"
          >
            <ActivityIcon className="w-5 h-5" />
            Quality
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <PerformanceTab data={data} />
          </TabPanel>
          <TabPanel>
            <DistributionTab data={data} />
          </TabPanel>
          <TabPanel>
            <QualityTab data={data} />
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </motion.div>
  );
};

export default Analytics;