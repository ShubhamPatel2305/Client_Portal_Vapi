import { useState, useEffect } from 'react';
import {
  Card,
  Title,
  TabGroup,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Select,
  SelectItem,
  Button,
} from '@tremor/react';
import { motion } from 'framer-motion';
import { RefreshCw, Download } from 'lucide-react';
import PerformanceReport from '../components/reports/PerformanceReport';
import CallDetailsReport from '../components/reports/CallDetailsReport';
import CostAnalysisReport from '../components/reports/CostAnalysisReport';
import AdvancedAnalytics from '../components/reports/AdvancedAnalytics';
import { Loading } from '../components/Loading';
import { getCallData } from '../services/vapiService';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { format } from 'date-fns';

interface Message {
  role: string;
  message: string;
  time: number;
}

interface CostBreakdown {
  ttsCharacters: number;
  vapi: number;
  tts: number;
  llm: number;
  stt: number;
  transport: number;
  llmCompletionTokens: number;
  llmPromptTokens: number;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  promptCost: number;
  completionCost: number;
  totalCost: number;
}

interface Analysis {
  averageResponseTime: number;
  successRate: number;
  totalCalls: number;
  averageMessagesPerCall: number;
}

export interface CallData {
  id: string;
  startedAt: string;
  endedAt?: string;
  status: string;
  cost: number;
  messages?: Message[];
  costBreakdown: CostBreakdown;
  analysis: Analysis;
}

const timeRanges = [
  { label: 'Last 7 Days', value: '7d' },
  { label: 'Last 30 Days', value: '30d' },
  { label: 'Last 90 Days', value: '90d' },
  { label: 'All Time', value: 'all' },
];

const Reports: React.FC = () => {
  const [selectedView, setSelectedView] = useState(0);
  const [selectedRange, setSelectedRange] = useState(() => {
    const savedRange = localStorage.getItem('reportsTimeRange');
    return savedRange || '7d';
  });
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<CallData[]>([]);

  useEffect(() => {
    fetchData();
  }, [selectedRange]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getCallData(selectedRange);
      // Transform the response to include required fields
      const transformedData: CallData[] = response.map((call: any) => ({
        ...call,
        costBreakdown: {
          promptTokens: call.promptTokens || 0,
          completionTokens: call.completionTokens || 0,
          totalTokens: (call.promptTokens || 0) + (call.completionTokens || 0),
          promptCost: (call.promptTokens || 0) * 0.00001,
          completionCost: (call.completionTokens || 0) * 0.00002,
          totalCost: call.cost || 0,
        },
        analysis: {
          averageResponseTime: call.averageResponseTime || 0,
          successRate: call.status === 'completed' ? 100 : 0,
          totalCalls: 1,
          averageMessagesPerCall: call.messages?.length || 0,
        },
      }));
      setData(transformedData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchData();
  };

  const handleRangeChange = (value: string) => {
    setSelectedRange(value);
    localStorage.setItem('reportsTimeRange', value);
  };

  const pageTransition = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
  };

  const exportFullReport = async (type: 'pdf' | 'csv') => {
    if (type === 'pdf') {
      const doc = new jsPDF() as jsPDF & { previousAutoTable: { finalY: number } };
      
      // Add header with logo and title
      doc.setFontSize(24);
      doc.setTextColor(59, 130, 246);
      doc.text('Call Analytics Report', 14, 20);
      
      doc.setFontSize(12);
      doc.setTextColor(107, 114, 128);
      doc.text(`Generated on ${format(new Date(), 'PPpp')}`, 14, 30);
      doc.text(`Time Range: ${timeRanges.find(r => r.value === selectedRange)?.label}`, 14, 37);
      
      // Add summary metrics
      const totalCalls = data.length;
      const completedCalls = data.filter(call => call.status === 'completed').length;
      const totalCost = data.reduce((sum, call) => sum + (call.cost || 0), 0);
      const avgDuration = data.reduce((sum, call) => {
        if (call.startedAt && call.endedAt) {
          return sum + (new Date(call.endedAt).getTime() - new Date(call.startedAt).getTime());
        }
        return sum;
      }, 0) / (totalCalls * 1000);

      doc.setFontSize(16);
      doc.setTextColor(31, 41, 55);
      doc.text('Summary', 14, 50);

      (doc as any).autoTable({
        startY: 55,
        head: [['Metric', 'Value']],
        body: [
          ['Total Calls', totalCalls.toString()],
          ['Completed Calls', `${completedCalls} (${((completedCalls/totalCalls)*100).toFixed(1)}%)`],
          ['Total Cost', `$${totalCost.toFixed(4)}`],
          ['Average Duration', `${avgDuration.toFixed(1)} seconds`],
        ],
        theme: 'striped',
        headStyles: { fillColor: [59, 130, 246] },
        styles: { fontSize: 12 },
      });

      // Add performance metrics
      doc.setFontSize(16);
      doc.text('Performance Metrics', 14, (doc as any).previousAutoTable.finalY + 15);

      const successRate = (completedCalls / totalCalls) * 100;
      const avgMessagesPerCall = data.reduce((sum, call) => sum + (call.messages?.length || 0), 0) / totalCalls;

      (doc as any).autoTable({
        startY: (doc as any).previousAutoTable.finalY + 20,
        head: [['Metric', 'Value']],
        body: [
          ['Success Rate', `${successRate.toFixed(1)}%`],
          ['Average Messages per Call', avgMessagesPerCall.toFixed(1)],
          ['Average Cost per Call', `$${(totalCost / totalCalls).toFixed(4)}`],
        ],
        theme: 'striped',
        headStyles: { fillColor: [59, 130, 246] },
        styles: { fontSize: 12 },
      });

      // Add call details
      doc.setFontSize(16);
      doc.text('Call Details', 14, (doc as any).previousAutoTable.finalY + 15);

      (doc as any).autoTable({
        startY: (doc as any).previousAutoTable.finalY + 20,
        head: [['ID', 'Start Time', 'Status', 'Duration (s)', 'Cost', 'Messages']],
        body: data.map(call => [
          call.id,
          format(new Date(call.startedAt), 'yyyy-MM-dd HH:mm:ss'),
          call.status,
          call.endedAt ? 
            ((new Date(call.endedAt).getTime() - new Date(call.startedAt).getTime()) / 1000).toFixed(1) : 
            'In Progress',
          `$${call.cost.toFixed(4)}`,
          call.messages?.length.toString() || '0',
        ]),
        theme: 'striped',
        headStyles: { fillColor: [59, 130, 246] },
        styles: { fontSize: 10 },
      });

      doc.save(`call_analytics_report_${format(new Date(), 'yyyy-MM-dd')}.pdf`);
    } else {
      // Export CSV
      const csvData = [
        // Header row
        ['Call Analytics Report'],
        [`Generated on ${format(new Date(), 'PPpp')}`],
        [`Time Range: ${timeRanges.find(r => r.value === selectedRange)?.label}`],
        [],
        ['Summary Metrics'],
        ['Total Calls', data.length],
        ['Completed Calls', data.filter(call => call.status === 'completed').length],
        ['Total Cost', `$${data.reduce((sum, call) => sum + (call.cost || 0), 0).toFixed(4)}`],
        [],
        ['Call Details'],
        ['ID', 'Start Time', 'End Time', 'Status', 'Duration (s)', 'Cost', 'Messages', 'Conversation'],
        ...data.map(call => [
          call.id,
          format(new Date(call.startedAt), 'yyyy-MM-dd HH:mm:ss'),
          call.endedAt ? format(new Date(call.endedAt), 'yyyy-MM-dd HH:mm:ss') : 'In Progress',
          call.status,
          call.endedAt ? 
            ((new Date(call.endedAt).getTime() - new Date(call.startedAt).getTime()) / 1000).toFixed(1) : 
            'In Progress',
          `$${call.cost.toFixed(4)}`,
          call.messages?.length || 0,
          call.messages?.map((m: Message) => `${m.role}: ${m.message}`).join(' | ') || '',
        ]),
      ];

      const ws = XLSX.utils.aoa_to_sheet(csvData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Call Analytics');
      const csvBuffer = XLSX.write(wb, { bookType: 'csv', type: 'array' });
      const blob = new Blob([csvBuffer], { type: 'text/csv;charset=utf-8' });
      saveAs(blob, `call_analytics_report_${format(new Date(), 'yyyy-MM-dd')}.csv`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loading />
      </div>
    );
  }

  return (
    <motion.div
      initial="initial"
      animate="visible"
      variants={pageTransition}
      className="p-6"
    >
      <div className="flex justify-between items-center mb-6">
        <Title>Reports</Title>
        <div className="flex items-center gap-4">
          <Select
            value={selectedRange}
            onValueChange={handleRangeChange}
            className="w-36"
          >
            {timeRanges.map((range) => (
              <SelectItem key={range.value} value={range.value}>
                {range.label}
              </SelectItem>
            ))}
          </Select>
          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              variant="secondary"
              icon={Download}
              onClick={() => exportFullReport('pdf')}
            >
              Export PDF Report
            </Button>
            <Button
              size="sm"
              variant="secondary"
              icon={Download}
              onClick={() => exportFullReport('csv')}
            >
              Export CSV Report
            </Button>
            <Button
              icon={RefreshCw}
              variant="secondary"
              onClick={handleRefresh}
              disabled={loading}
            >
              Refresh
            </Button>
          </div>
        </div>
      </div>

      <Card>
        <TabGroup
          index={selectedView}
          onIndexChange={(index: number) => setSelectedView(index)}
        >
          <TabList>
            <Tab>Performance</Tab>
            <Tab>Call Details</Tab>
            <Tab>Cost Analysis</Tab>
            <Tab>Advanced Analytics</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <div className="mt-6">
                <PerformanceReport data={data} />
              </div>
            </TabPanel>
            <TabPanel>
              <div className="mt-6">
                <CallDetailsReport data={data} />
              </div>
            </TabPanel>
            <TabPanel>
              <div className="mt-6">
                <CostAnalysisReport data={data} />
              </div>
            </TabPanel>
            <TabPanel>
              <div className="mt-6">
                <AdvancedAnalytics data={data} />
              </div>
            </TabPanel>
          </TabPanels>
        </TabGroup>
      </Card>
    </motion.div>
  );
};

export default Reports;