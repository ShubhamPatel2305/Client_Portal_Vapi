import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Select,
  SelectItem,
  DateRangePicker,
  DateRangePickerValue,
  Grid,
  Button,
} from '@tremor/react';
import {
  FileText,
  Download,
  RefreshCw,
} from 'lucide-react';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

import { fetchAnalyticsData } from '../lib/api';
import { Analytics } from '../lib/api/vapiService';
import ChartCard from '../components/ChartCard';
import { showToast } from '../components/Toast';

const reportTypes = [
  { value: 'performance', label: 'Performance Report' },
  { value: 'calls', label: 'Call Analytics Report' },
  { value: 'user', label: 'User Engagement Report' },
  { value: 'regional', label: 'Regional Analysis Report' },
  { value: 'comprehensive', label: 'Comprehensive Report' },
] as const;

type ReportType = typeof reportTypes[number]['value'];

export default function Reports() {
  const [selectedReport, setSelectedReport] = useState<ReportType>('comprehensive');
  const [dateRange, setDateRange] = useState<DateRangePickerValue>({
    from: startOfDay(subDays(new Date(), 30)),
    to: endOfDay(new Date()),
  });
  const [data, setData] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    if (!dateRange.from || !dateRange.to) return;

    try {
      setLoading(true);
      const result = await fetchAnalyticsData(dateRange.from, dateRange.to);
      setData(result);
      showToast('Report data updated');
    } catch (error) {
      console.error('Error fetching report data:', error);
      showToast('Failed to fetch report data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [dateRange]);

  const exportPDF = () => {
    if (!data) return;

    const doc = new jsPDF();
    const title = `${selectedReport.charAt(0).toUpperCase() + selectedReport.slice(1)} Report`;
    
    doc.setFontSize(20);
    doc.text(title, 20, 20);
    
    doc.setFontSize(12);
    doc.text(`Period: ${format(dateRange.from!, 'PP')} - ${format(dateRange.to!, 'PP')}`, 20, 30);

    // Add metrics based on report type
    let yPos = 40;
    const metrics = [
      ['Total Call Minutes', data.totalCallMinutes.toString()],
      ['Number of Calls', data.numberOfCalls.toString()],
      ['Total Spent', `$${data.totalSpent.toFixed(2)}`],
      ['Average Cost per Call', `$${data.avgCostPerCall.toFixed(2)}`],
    ];

    autoTable(doc, {
      startY: yPos,
      head: [['Metric', 'Value']],
      body: metrics,
    });

    doc.save(`${selectedReport}-report.pdf`);
    showToast('Report exported as PDF');
  };

  const exportExcel = () => {
    if (!data) return;

    const ws = XLSX.utils.json_to_sheet([
      {
        'Total Call Minutes': data.totalCallMinutes,
        'Number of Calls': data.numberOfCalls,
        'Total Spent': data.totalSpent,
        'Average Cost per Call': data.avgCostPerCall,
      }
    ]);

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Report');
    XLSX.writeFile(wb, `${selectedReport}-report.xlsx`);
    showToast('Report exported as Excel');
  };

  return (
    <motion.div
      className="p-4 md:p-8 min-h-screen bg-gray-50"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-500">Generate and export detailed analytics reports</p>
        </div>
        
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            size="sm"
            variant="secondary"
            icon={RefreshCw}
            onClick={fetchData}
            loading={loading}
          >
            Refresh
          </Button>
          <Button
            size="sm"
            variant="secondary"
            icon={FileText}
            onClick={exportPDF}
            disabled={!data}
          >
            Export PDF
          </Button>
          <Button
            size="sm"
            variant="secondary"
            icon={Download}
            onClick={exportExcel}
            disabled={!data}
          >
            Export Excel
          </Button>
        </div>
      </div>

      <Grid numItems={1} numItemsSm={2} className="gap-4 mb-6">
        <Select
          value={selectedReport}
          onValueChange={(value) => setSelectedReport(value as ReportType)}
        >
          {reportTypes.map((type) => (
            <SelectItem key={type.value} value={type.value}>
              {type.label}
            </SelectItem>
          ))}
        </Select>
        <DateRangePicker
          value={dateRange}
          onValueChange={setDateRange}
          selectPlaceholder="Select dates"
          className="max-w-md mx-auto"
        />
      </Grid>

      <Grid numItems={1} numItemsSm={2} numItemsLg={3} className="gap-6 mt-6">
        <ChartCard
          title="Call Distribution"
          chartData={data?.callDistribution || []}
          chartType="donut"
          categories={['value']}
          loading={loading}
        />

        <ChartCard
          title="Monthly Call Trend"
          chartData={data?.monthlyTrend || []}
          chartType="area"
          categories={['calls', 'cost']}
          loading={loading}
        />

        <ChartCard
          title="Cost Analysis"
          chartData={data?.costAnalysis || []}
          chartType="bar"
          categories={['amount']}
          loading={loading}
        />
      </Grid>
    </motion.div>
  );
}