import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { vapiService } from '../lib/api/vapiService';

import { CallAnalytics } from '../components/billing/CallAnalytics';
import InvoiceList from '../components/billing/InvoiceList';
import jsPDF from 'jspdf';
import {
  format,
  startOfWeek,
  endOfWeek,
  addDays,
} from 'date-fns';
import {
  Card,
  Text,
  Metric,
  TabGroup,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Grid,
  Title,
  BarChart,
  DonutChart,
  AreaChart,
  Button,
  Select,
  SelectItem,
} from '@tremor/react';
import {
  Download,
  RefreshCw,
  DollarSign,
  Clock,
  Phone,
  Calculator,
  FileText,
  TrendingUp,
  BarChart2,
  Loader2,
} from 'lucide-react';
import type { CallData } from '../lib/api/vapiService';

const containerVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.4,
      ease: "easeOut",
      staggerChildren: 0.1 
    } 
  },
  exit: { 
    opacity: 0,
    y: -20,
    transition: { duration: 0.3 } 
  },
};

const cardVariants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.3 } 
  },
  hover: { 
    scale: 1.02,
    boxShadow: "0 10px 30px -10px rgba(0,0,0,0.1)",
    transition: { duration: 0.2 } 
  }
};

interface InvoiceItem {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

interface Invoice {
  id: string;
  date: string;
  dueDate: string;
  amount: number;
  status: string;
  items: InvoiceItem[];
  companyDetails: {
    name: string;
    address: string;
    phone: string;
    email: string;
    website: string;
    logo?: string;
  };
  clientDetails: {
    name: string;
    address: string;
    phone: string;
    email: string;
  };
  paymentDetails: {
    bankName: string;
    accountNumber: string;
    ifscCode: string;
    swiftCode: string;
  };
  notes: string;
  terms: string;
}

interface BillingData {
  calls: {
    details: CallData[];
    total: number;
    totalCost: number;
    avgDuration: number;
    avgCost: number;
  };
  costTrend: {
    date: string;
    cost: number;
  }[];
  costDistribution: {
    category: string;
    value: number;
  }[];
  hourlyDistribution: {
    hour: string;
    calls: number;
    cost: number;
  }[];
  weeklyTrend: {
    week: string;
    calls: number;
    cost: number;
  }[];
}

interface CostBreakdownData {
  date: string;
  calls: number;
  cost: number;
}

// Sample invoice data


const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  } else if (minutes > 0) {
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  } else {
    return `${Math.floor(seconds)}.${Math.floor((seconds % 1) * 10)}s`;
  }
};

export default function Billing() {
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [billingData, setBillingData] = useState<BillingData>({
    calls: {
      details: [],
      total: 0,
      totalCost: 0,
      avgDuration: 0,
      avgCost: 0,
    },
    costTrend: [],
    costDistribution: [],
    hourlyDistribution: [],
    weeklyTrend: [],
  });
  const [, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [costBreakdownPeriod, setCostBreakdownPeriod] = useState<'daily' | 'weekly'>('weekly');
  const [costBreakdownData, setCostBreakdownData] = useState<CostBreakdownData[]>([]);

  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];



  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 2 }, (_, i) => currentYear - i);
  };

  const fetchBillingData = async () => {
    try {
      setLoading(true);
      setRefreshing(true);

      // Get calls for the selected month
      const startDate = new Date(selectedYear, selectedMonth, 1);
      const endDate = new Date(selectedYear, selectedMonth + 1, 0); // Last day of selected month

      const calls = await vapiService.getCalls(startDate, endDate);

      // Calculate total cost and average duration
      const totalCost = calls.reduce((sum, call) => sum + (call.cost || 0), 0);
      const totalDuration = calls.reduce((sum, call) => sum + (call.duration || 0), 0);
      const avgDuration = totalDuration / calls.length;
      const avgCost = totalCost / calls.length;

      // Calculate cost trend for the current month
      const costTrend = Array.from({ length: endDate.getDate() }, (_, i) => {
        const date = new Date(selectedYear, selectedMonth, i + 1);
        const dailyCalls = calls.filter((call) => {
          const callDate = new Date(call.startedAt);
          return (
            callDate.getDate() === date.getDate() &&
            callDate.getMonth() === date.getMonth() &&
            callDate.getFullYear() === date.getFullYear()
          );
        });
        return {
          date: date.toISOString().split('T')[0],
          cost: dailyCalls.reduce((sum, call) => sum + (call.cost || 0), 0),
        };
      });

      // Calculate hourly distribution
      const hourlyDistribution = Array.from({ length: 24 }, (_, hour) => {
        const hourCalls = calls.filter((call) => {
          const callDate = new Date(call.startedAt);
          return callDate.getHours() === hour;
        });
        return {
          hour: `${hour.toString().padStart(2, '0')}:00`,
          calls: hourCalls.length,
          cost: hourCalls.reduce((sum, call) => sum + (call.cost || 0), 0),
        };
      });

      // Calculate weekly trend
      const weeks: { [key: string]: { calls: number; cost: number } } = {};
      calls.forEach((call) => {
        const date = new Date(call.startedAt);
        const week = `Week ${Math.ceil(date.getDate() / 7)}`;
        if (!weeks[week]) {
          weeks[week] = { calls: 0, cost: 0 };
        }
        weeks[week].calls++;
        weeks[week].cost += call.cost || 0;
      });

      const weeklyTrend = Object.entries(weeks).map(([week, data]) => ({
        week,
        ...data,
      }));

      // Calculate cost distribution
      const costDistribution = [
        {
          category: 'Transport',
          value: calls.reduce((sum, call) => sum + (call.costBreakdown?.transport || 0), 0),
        },
        {
          category: 'STT',
          value: calls.reduce((sum, call) => sum + (call.costBreakdown?.stt || 0), 0),
        },
        {
          category: 'LLM',
          value: calls.reduce((sum, call) => sum + (call.costBreakdown?.llm || 0), 0),
        },
        {
          category: 'TTS',
          value: calls.reduce((sum, call) => sum + (call.costBreakdown?.tts || 0), 0),
        },
        {
          category: 'Vapi',
          value: calls.reduce((sum, call) => sum + (call.costBreakdown?.vapi || 0), 0),
        },
      ];

      setBillingData({
        calls: {
          details: calls,
          total: calls.length,
          totalCost,
          avgDuration,
          avgCost,
        },
        costTrend,
        costDistribution,
        hourlyDistribution,
        weeklyTrend,
      });
    } catch (error) {
      console.error('Error fetching billing data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const generateCostBreakdownData = (period: 'daily' | 'weekly') => {
    let data: CostBreakdownData[] = [];

    if (period === 'daily') {
      const daysInMonth = new Date(Number(selectedYear), Number(selectedMonth) + 1, 0).getDate();

      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(Number(selectedYear), Number(selectedMonth), day);
        const dateStr = format(date, 'MMM dd');

        const callsInDay = billingData.calls.details.filter((call) => {
          const callDate = new Date(call.startedAt || call.createdAt);
          return (
            callDate.getDate() === day &&
            callDate.getMonth() === Number(selectedMonth) &&
            callDate.getFullYear() === Number(selectedYear)
          );
        });

        const totalCost = callsInDay.reduce((sum, call) => sum + call.cost, 0);

        data.push({
          date: dateStr,
          calls: callsInDay.length,
          cost: totalCost,
        });
      }
    } else {
      // Weekly view
      const monthStart = new Date(Number(selectedYear), Number(selectedMonth), 1);
      const monthEnd = new Date(Number(selectedYear), Number(selectedMonth) + 1, 0);
      let currentWeekStart = startOfWeek(monthStart);

      while (currentWeekStart <= monthEnd) {
        const weekEnd = endOfWeek(currentWeekStart);
        const weekEndAdjusted = weekEnd > monthEnd ? monthEnd : weekEnd;

        const callsInWeek = billingData.calls.details.filter((call) => {
          const callDate = new Date(call.startedAt || call.createdAt);
          return callDate >= currentWeekStart && callDate <= weekEndAdjusted;
        });

        const totalCost = callsInWeek.reduce((sum, call) => sum + call.cost, 0);

        data.push({
          date: `${format(currentWeekStart, 'MMM dd')} - ${format(weekEndAdjusted, 'MMM dd')}`,
          calls: callsInWeek.length,
          cost: totalCost,
        });

        currentWeekStart = addDays(currentWeekStart, 7);
      }
    }

    setCostBreakdownData(data);
  };

  const handleRefresh = () => {
    fetchBillingData();
  };

  const handleExport = () => {
    try {
      // Prepare the data for export
      const exportData = {
        billingPeriod: `${months[selectedMonth]} ${selectedYear}`,
        summary: {
          totalCost: billingData.calls.totalCost.toFixed(2),
          totalCalls: billingData.calls.total,
          averageDuration: formatDuration(billingData.calls.avgDuration),
          averageCost: billingData.calls.avgCost.toFixed(3),
        },
        costDistribution: billingData.costDistribution,
        callDetails: billingData.calls.details.map(call => ({
          id: call.id,
          startTime: format(new Date(call.startedAt || call.createdAt), 'yyyy-MM-dd HH:mm:ss'),
          duration: formatDuration(call.duration),
          cost: call.cost.toFixed(3),
          status: call.status,
          costBreakdown: {
            transport: call.costBreakdown?.transport?.toFixed(3) || '0',
            stt: call.costBreakdown?.stt?.toFixed(3) || '0',
            llm: call.costBreakdown?.llm?.toFixed(3) || '0',
            tts: call.costBreakdown?.tts?.toFixed(3) || '0',
            vapi: call.costBreakdown?.vapi?.toFixed(3) || '0',
          }
        }))
      };

      // Convert to CSV string
      const csvRows = [];
      
      // Add header row
      csvRows.push(['Billing Report - ' + exportData.billingPeriod]);
      csvRows.push([]);
      
      // Add summary section
      csvRows.push(['Summary']);
      csvRows.push(['Total Cost', `$${exportData.summary.totalCost}`]);
      csvRows.push(['Total Calls', exportData.summary.totalCalls]);
      csvRows.push(['Average Duration', exportData.summary.averageDuration]);
      csvRows.push(['Average Cost', `$${exportData.summary.averageCost}`]);
      csvRows.push([]);
      
      // Add cost distribution section
      csvRows.push(['Cost Distribution']);
      csvRows.push(['Category', 'Amount']);
      exportData.costDistribution.forEach(item => {
        csvRows.push([item.category, `$${item.value.toFixed(2)}`]);
      });
      csvRows.push([]);
      
      // Add call details section
      csvRows.push(['Call Details']);
      csvRows.push(['ID', 'Start Time', 'Duration', 'Cost', 'Status', 'Transport', 'STT', 'LLM', 'TTS', 'Vapi']);
      exportData.callDetails.forEach(call => {
        csvRows.push([
          call.id,
          call.startTime,
          call.duration,
          `$${call.cost}`,
          call.status,
          `$${call.costBreakdown.transport}`,
          `$${call.costBreakdown.stt}`,
          `$${call.costBreakdown.llm}`,
          `$${call.costBreakdown.tts}`,
          `$${call.costBreakdown.vapi}`
        ]);
      });

      // Convert array to CSV string
      const csvString = csvRows.map(row => row.join(',')).join('\n');

      // Create a Blob and download link
      const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `billing_report_${exportData.billingPeriod.replace(' ', '_')}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error exporting data:', error);
    }
  };

  const handleInvoiceDownload = async (invoice: Invoice) => {
    try {
      const doc = new jsPDF();
      
      // Add background pattern
      doc.setFillColor(248, 250, 252);
      doc.rect(0, 0, doc.internal.pageSize.width, doc.internal.pageSize.height, 'F');
      
      // Add top edge design
      doc.setFillColor(59, 130, 246);
      doc.rect(0, 0, doc.internal.pageSize.width, 40, 'F');
      
      // Add decorative corner elements
      doc.setDrawColor(59, 130, 246);
      doc.setLineWidth(0.5);
      doc.line(5, 5, 25, 5);
      doc.line(5, 5, 5, 25);
      doc.line(doc.internal.pageSize.width - 5, 5, doc.internal.pageSize.width - 25, 5);
      doc.line(doc.internal.pageSize.width - 5, 5, doc.internal.pageSize.width - 5, 25);
      
      // Company Name in top edge
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(28);
      doc.setFont('helvetica', 'bold');
      doc.text('TOPEDGE', doc.internal.pageSize.width / 2, 25, { align: 'center' });
      
      // Invoice Title
      doc.setFontSize(24);
      doc.text('INVOICE', doc.internal.pageSize.width / 2, 60, { align: 'center' });

      // Invoice Details
      doc.setTextColor(100, 116, 139);
      doc.setFontSize(10);
      doc.text(`Invoice #: ${invoice.id}`, 20, 80);
      doc.text(`Date: ${format(new Date(invoice.date), 'MMMM dd, yyyy')}`, 20, 85);
      doc.text(`Due Date: ${format(new Date(invoice.dueDate), 'MMMM dd, yyyy')}`, 20, 90);

      // Company Details with modern styling
      doc.setFillColor(241, 245, 249);
      doc.roundedRect(20, 100, 80, 50, 3, 3, 'F');
      doc.setTextColor(71, 85, 105);
      doc.setFont('helvetica', 'bold');
      doc.text('From:', 25, 110);
      doc.setTextColor(15, 23, 42);
      doc.setFont('helvetica', 'bold');
      doc.text('TOPEDGE TECHNOLOGIES', 25, 117);
      doc.setFont('helvetica', 'normal');
      doc.text(invoice.companyDetails?.address || '', 25, 125);
      doc.text(`Phone: ${invoice.companyDetails?.phone || ''}`, 25, 140);
      doc.text(`Email: ${invoice.companyDetails?.email || ''}`, 25, 145);

      // Client Details with modern styling
      doc.setFillColor(241, 245, 249);
      doc.roundedRect(110, 100, 80, 50, 3, 3, 'F');
      doc.setTextColor(71, 85, 105);
      doc.setFont('helvetica', 'bold');
      doc.text('Bill To:', 115, 110);
      doc.setTextColor(15, 23, 42);
      doc.setFont('helvetica', 'bold');
      doc.text(invoice.clientDetails?.name || '', 115, 117);
      doc.setFont('helvetica', 'normal');
      doc.text(invoice.clientDetails?.address || '', 115, 125);
      doc.text(`Phone: ${invoice.clientDetails?.phone || ''}`, 115, 140);
      doc.text(`Email: ${invoice.clientDetails?.email || ''}`, 115, 145);

      // Items Table Header with gradient effect
      doc.setFillColor(241, 245, 249);
      doc.rect(20, 160, 170, 10, 'F');
      doc.setTextColor(51, 65, 85);
      doc.setFont('helvetica', 'bold');
      doc.text('DESCRIPTION', 25, 167);
      doc.text('QTY', 95, 167);
      doc.text('RATE', 125, 167);
      doc.text('AMOUNT', 165, 167);

      // Items with zebra striping
      let y = 180;
      invoice.items?.forEach((item, index) => {
        if (index % 2 === 0) {
          doc.setFillColor(248, 250, 252);
          doc.rect(20, y - 4, 170, 10, 'F');
        }

        doc.setFont('helvetica', 'normal');
        doc.setTextColor(15, 23, 42);
        doc.text(item.description, 25, y);
        doc.text(item.quantity.toString(), 95, y);
        doc.text(`$${item.rate.toFixed(2)}`, 125, y);
        doc.text(`$${item.amount.toFixed(2)}`, 165, y);
        y += 10;
      });

      // Payment Details with modern styling
      y += 20;
      doc.setFillColor(241, 245, 249);
      doc.roundedRect(20, y, 110, 50, 3, 3, 'F');
      doc.setTextColor(71, 85, 105);
      doc.setFont('helvetica', 'bold');
      doc.text('Payment Details', 25, y + 10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(15, 23, 42);
      doc.text(`Bank Name: ${invoice.paymentDetails?.bankName || ''}`, 25, y + 20);
      doc.text(`Account No: ${invoice.paymentDetails?.accountNumber || ''}`, 25, y + 28);
      doc.text(`IFSC Code: ${invoice.paymentDetails?.ifscCode || ''}`, 25, y + 36);
      doc.text(`SWIFT Code: ${invoice.paymentDetails?.swiftCode || ''}`, 25, y + 44);

      // Total Amount Box with improved styling
      const totalBoxWidth = 90;
      const totalBoxHeight = 60;
      const totalBoxX = doc.internal.pageSize.width - totalBoxWidth - 20;
      const totalBoxY = y;

      // Add total box with subtle gradient
      doc.setFillColor(248, 250, 252);
      doc.roundedRect(totalBoxX, totalBoxY, totalBoxWidth, totalBoxHeight, 3, 3, 'F');
      doc.setDrawColor(59, 130, 246);
      doc.setLineWidth(0.5);
      doc.roundedRect(totalBoxX, totalBoxY, totalBoxWidth, totalBoxHeight, 3, 3, 'S');

      // Add total text with improved styling
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(71, 85, 105);
      doc.setFontSize(12);
      doc.text('TOTAL AMOUNT', totalBoxX + 5, totalBoxY + 15);
      doc.setFontSize(16);
      doc.setTextColor(59, 130, 246);
      doc.text(`$${invoice.amount.toFixed(2)}`, totalBoxX + totalBoxWidth - 5, totalBoxY + 15, { align: 'right' });

      // Add signature and stamp within the total box
      const signatureX = totalBoxX + 5;
      const signatureY = totalBoxY + 35;

      // Add signature
      doc.setFontSize(10);
      doc.setFont('helvetica', 'italic');
      doc.setTextColor(59, 130, 246);
      doc.text('TopEdge Director', signatureX, signatureY);
      
      // Add signature line
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.5);
      doc.line(signatureX, signatureY + 5, signatureX + 45, signatureY + 5);
      
      // Add "Authorized Signature" text
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(71, 85, 105);
      doc.setFontSize(8);
      doc.text('Authorized Signature', signatureX, signatureY + 12);

      // Add stamp
      const stampX = totalBoxX + totalBoxWidth - 25;
      const stampY = totalBoxY + 40;
      const stampRadius = 18;

      // Draw outer circle
      doc.setDrawColor(59, 130, 246);
      doc.setLineWidth(0.5);
      doc.circle(stampX, stampY, stampRadius, 'S');

      // Draw inner circle
      doc.setLineWidth(0.3);
      doc.circle(stampX, stampY, stampRadius - 2, 'S');

      // Add stamp text
      doc.setTextColor(59, 130, 246);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.text('TOPEDGE', stampX, stampY - 5, { align: 'center' });
      doc.setFont('helvetica', 'normal');
      doc.text('VERIFIED', stampX, stampY + 2, { align: 'center' });
      doc.setFontSize(6);
      doc.text(format(new Date(), 'dd/MM/yyyy'), stampX, stampY + 8, { align: 'center' });

      // Terms and Notes
      y += 70;
      doc.setFillColor(241, 245, 249);
      doc.roundedRect(20, y, 170, 40, 3, 3, 'F');
      doc.setTextColor(71, 85, 105);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text('Terms & Conditions', 25, y + 10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(15, 23, 42);
      doc.text(invoice.terms || 'Standard terms and conditions apply', 25, y + 17);
      
      doc.setTextColor(71, 85, 105);
      doc.setFont('helvetica', 'bold');
      doc.text('Notes', 25, y + 27);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(15, 23, 42);
      doc.text(invoice.notes || 'Thank you for your business!', 25, y + 34);

      // Footer
      const pageHeight = doc.internal.pageSize.height;
      doc.setFillColor(241, 245, 249);
      doc.rect(0, pageHeight - 20, doc.internal.pageSize.width, 20, 'F');
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text('This is a computer-generated document by TopEdge Technologies.', doc.internal.pageSize.width / 2, pageHeight - 10, { align: 'center' });

      doc.save(`invoice-${invoice.id}.pdf`);
    } catch (error) {
      console.error('Error generating invoice:', error);
    }
  };

  useEffect(() => {
    fetchBillingData();
  }, [selectedMonth, selectedYear]);

  useEffect(() => {
    if (billingData.calls.details.length > 0) {
      generateCostBreakdownData(costBreakdownPeriod);
    }
  }, [selectedMonth, selectedYear, costBreakdownPeriod, billingData]);

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="p-6 space-y-6 bg-gradient-to-b from-gray-50 to-white min-h-screen"
    >
      <div className="flex justify-between items-center mb-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Title className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            Billing & Usage
          </Title>
        </motion.div>
        <div className="flex items-center gap-3">
          <Select
            value={selectedMonth.toString()}
            onValueChange={(value) => setSelectedMonth(parseInt(value))}
            className="w-[130px] shadow-sm"
            enableClear={false}
          >
            {months.map((month, index) => (
              <SelectItem key={month} value={index.toString()}>
                {month}
              </SelectItem>
            ))}
          </Select>

          <Select
            value={selectedYear.toString()}
            onValueChange={(value) => setSelectedYear(parseInt(value))}
            className="w-[110px] shadow-sm"
            enableClear={false}
          >
            {generateYearOptions().map((year) => (
              <SelectItem key={year} value={year.toString()}>
                {year}
              </SelectItem>
            ))}
          </Select>

          <Button
            icon={RefreshCw}
            onClick={handleRefresh}
            disabled={refreshing}
            variant="secondary"
            className="flex items-center gap-2 shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            {refreshing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              'Refresh'
            )}
          </Button>

          <Button
            icon={Download}
            onClick={handleExport}
            variant="secondary"
            className="flex items-center gap-2 shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            Export
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        <motion.div 
          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4"
          variants={containerVariants}
        >
          {/* Total Cost Card */}
          <motion.div
            variants={cardVariants}
            whileHover="hover"
            className="transform transition-all duration-300"
          >
            <Card
              decoration="top"
              decorationColor="blue"
              className="bg-white/50 backdrop-blur-sm border border-gray-100"
            >
              <div className="flex items-center justify-between">
                <div>
                  <Text className="text-sm font-medium text-gray-600">Total Cost</Text>
                  <Metric className="mt-2 text-blue-600">${billingData.calls.totalCost.toFixed(2)}</Metric>
                  <Text className="mt-2 text-xs text-green-600">+2.5% from last month</Text>
                </div>
                <div className="rounded-full bg-blue-50 p-3 ring-4 ring-blue-50/50">
                  <DollarSign className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Total Calls Card */}
          <motion.div
            variants={cardVariants}
            whileHover="hover"
            className="transform transition-all duration-300"
          >
            <Card
              decoration="top"
              decorationColor="green"
              className="bg-white/50 backdrop-blur-sm border border-gray-100"
            >
              <div className="flex items-center justify-between">
                <div>
                  <Text className="text-sm font-medium text-gray-600">Total Calls</Text>
                  <Metric className="mt-2 text-green-600">{billingData.calls.total}</Metric>
                  <Text className="mt-2 text-xs text-green-600">+5% from last month</Text>
                </div>
                <div className="rounded-full bg-green-50 p-3 ring-4 ring-green-50/50">
                  <Phone className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Average Duration Card */}
          <motion.div
            variants={cardVariants}
            whileHover="hover"
            className="transform transition-all duration-300"
          >
            <Card
              decoration="top"
              decorationColor="amber"
              className="bg-white/50 backdrop-blur-sm border border-gray-100"
            >
              <div className="flex items-center justify-between">
                <div>
                  <Text className="text-sm font-medium text-gray-600">Average Duration</Text>
                  <Metric className="mt-2 text-amber-600">{formatDuration(billingData.calls.avgDuration)}</Metric>
                  <Text className="mt-2 text-xs text-amber-600">-1.2% from last month</Text>
                </div>
                <div className="rounded-full bg-amber-50 p-3 ring-4 ring-amber-50/50">
                  <Clock className="h-6 w-6 text-amber-600" />
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Average Cost Card */}
          <motion.div
            variants={cardVariants}
            whileHover="hover"
            className="transform transition-all duration-300"
          >
            <Card
              decoration="top"
              decorationColor="purple"
              className="bg-white/50 backdrop-blur-sm border border-gray-100"
            >
              <div className="flex items-center justify-between">
                <div>
                  <Text className="text-sm font-medium text-gray-600">Average Cost</Text>
                  <Metric className="mt-2 text-purple-600">${billingData.calls.avgCost.toFixed(3)}</Metric>
                  <Text className="mt-2 text-xs text-purple-600">-0.8% from last month</Text>
                </div>
                <div className="rounded-full bg-purple-50 p-3 ring-4 ring-purple-50/50">
                  <Calculator className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </Card>
          </motion.div>
        </motion.div>

        <TabGroup>
          <TabList className="mt-8 bg-white shadow-sm rounded-lg p-1">
            <Tab icon={BarChart2} className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600">Overview</Tab>
            <Tab icon={FileText} className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600">Usage Details</Tab>
            <Tab icon={TrendingUp} className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600">Cost Analysis</Tab>
            <Tab icon={FileText} className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600">Invoices</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <Grid numItemsSm={1} numItemsLg={2} className="gap-6 mt-6">
                {/* Cost Distribution */}
                <Card className="transform transition-all duration-300 hover:shadow-lg">
                  <div className="flex items-center justify-between">
                    <Title>Cost Distribution</Title>
                    <Text className="text-sm text-gray-500">Last 30 days</Text>
                  </div>
                  <DonutChart
                    className="mt-6 h-80"
                    data={billingData.costDistribution}
                    category="value"
                    index="category"
                    valueFormatter={(value: number, category: string, formattedValue: string) =>
                      category === "cost" ? `$${value.toFixed(2)}` : value.toString()
                    }
                    colors={["indigo", "violet", "blue", "cyan"]}
                    showAnimation={true}
                    showTooltip={true}
                    showLabel={true}
                  />
                  <div className="mt-4">
                    <Text className="text-sm text-gray-500">Total Cost: ${billingData.calls.totalCost.toFixed(2)}</Text>
                  </div>
                </Card>

                {/* Call Volume Trend */}
                <Card className="transform transition-all duration-300 hover:shadow-lg">
                  <div className="flex items-center justify-between">
                    <Title>Call Volume Trend</Title>
                    <Text className="text-sm text-gray-500">Weekly data</Text>
                  </div>
                  <AreaChart
                    className="mt-6 h-80"
                    data={billingData.weeklyTrend}
                    index="week"
                    categories={["calls"]}
                    colors={["blue"]}
                    valueFormatter={(value: number, category: string, formattedValue: string) =>
                      category === "cost" ? `$${value.toFixed(2)}` : value.toString()
                    }
                    showAnimation={true}
                    showTooltip={true}
                    showLegend={true}
                    showGridLines={true}
                  />
                </Card>

                {/* Hourly Distribution */}
                <Card className="transform transition-all duration-300 hover:shadow-lg">
                  <div className="flex items-center justify-between">
                    <Title>Hourly Distribution</Title>
                    <Text className="text-sm text-gray-500">24-hour view</Text>
                  </div>
                  <BarChart
                    className="mt-6 h-80"
                    data={billingData.hourlyDistribution}
                    index="hour"
                    categories={["calls", "cost"]}
                    colors={["blue", "green"]}
                    valueFormatter={(value: number, category: string, formattedValue: string) =>
                      category === "cost" ? `$${value.toFixed(2)}` : value.toString()
                    }
                    showAnimation={true}
                    showTooltip={true}
                    showLegend={true}
                    showGridLines={true}
                  />
                  <div className="mt-4 flex justify-between text-sm text-gray-500">
                    <Text>
                      Peak Hour:{" "}
                      {billingData.hourlyDistribution.reduce((max, curr) =>
                        curr.calls > max.calls ? curr : max,
                        { hour: "", calls: 0 }
                      ).hour}
                    </Text>
                    <Text>
                      Lowest Activity:{" "}
                      {billingData.hourlyDistribution.reduce((min, curr) =>
                        curr.calls < min.calls ? curr : min,
                        { hour: "", calls: Infinity }
                      ).hour}
                    </Text>
                  </div>
                </Card>

                {/* Cost Analysis */}
                <Card className="transform transition-all duration-300 hover:shadow-lg">
                  <div className="flex items-center justify-between">
                    <Title>Cost Analysis</Title>
                    <Text className="text-sm text-gray-500">Daily breakdown</Text>
                  </div>
                  <BarChart
                    className="mt-6 h-80"
                    data={billingData.costTrend}
                    index="date"
                    categories={["cost"]}
                    colors={["indigo"]}
                    valueFormatter={(value: number, category: string, formattedValue: string) =>
                      category === "cost" ? `$${value.toFixed(2)}` : value.toString()
                    }
                    showAnimation={true}
                    showTooltip={true}
                    showLegend={true}
                    showGridLines={true}
                  />
                  <div className="mt-4 flex justify-between text-sm text-gray-500">
                    <Text>Highest Cost: ${Math.max(...billingData.costTrend.map((d) => d.cost)).toFixed(2)}</Text>
                    <Text>
                      Average Cost:{" "}
                      {(
                        billingData.costTrend.reduce((sum, curr) => sum + curr.cost, 0) /
                        billingData.costTrend.length
                      ).toFixed(2)}
                    </Text>
                  </div>
                </Card>
              </Grid>
            </TabPanel>

            <TabPanel>
              <div className="mt-6">
                <CallAnalytics
                  data={billingData}
                  selectedMonth={selectedMonth}
                  onMonthChange={setSelectedMonth}
                />
              </div>
            </TabPanel>

            <TabPanel>
              <div className="mt-6 space-y-6">
                <Grid numItemsSm={1} numItemsLg={2} className="gap-6">
                  <Card className="transform transition-all duration-300 hover:shadow-lg">
                    <div className="flex items-center justify-between">
                      <Title>Cost Breakdown</Title>
                      <Select
                        value={costBreakdownPeriod}
                        onValueChange={(value) => setCostBreakdownPeriod(value as 'daily' | 'weekly')}
                        className="w-32"
                      >
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                      </Select>
                    </div>
                    <BarChart
                      className="mt-6 h-80"
                      data={costBreakdownData}
                      index="date"
                      categories={["calls", "cost"]}
                      colors={["blue", "emerald"]}
                      valueFormatter={(value: number, category: string, formattedValue: string) =>
                        category === "cost" ? `$${value.toFixed(2)}` : value.toString()
                      }
                      showAnimation={true}
                      showTooltip={true}
                      showLegend={true}
                      showGridLines={true}
                    />
                  </Card>

                  <Card className="transform transition-all duration-300 hover:shadow-lg">
                    <div className="flex items-center justify-between">
                      <Title>Cost Metrics</Title>
                      <Text className="text-sm text-gray-500">Current Period</Text>
                    </div>
                    <div className="mt-6 grid grid-cols-2 gap-4">
                      <Card className="p-4 bg-gray-50">
                        <Text className="text-sm text-gray-600">Average Cost/Call</Text>
                        <Metric className="mt-2">${billingData.calls.avgCost.toFixed(3)}</Metric>
                        <Text className="mt-1 text-xs text-green-600">↓ 2.3% vs last period</Text>
                      </Card>
                      <Card className="p-4 bg-gray-50">
                        <Text className="text-sm text-gray-600">Total Cost</Text>
                        <Metric className="mt-2">${billingData.calls.totalCost.toFixed(2)}</Metric>
                        <Text className="mt-1 text-xs text-red-600">↑ 5.1% vs last period</Text>
                      </Card>
                      <Card className="p-4 bg-gray-50">
                        <Text className="text-sm text-gray-600">Cost/Minute</Text>
                        <Metric className="mt-2">
                          ${(billingData.calls.totalCost / (billingData.calls.details.reduce((sum, call) => sum + call.duration, 0) / 60)).toFixed(
                            3
                          )}
                        </Metric>
                        <Text className="mt-1 text-xs text-gray-600">No change</Text>
                      </Card>
                      <Card className="p-4 bg-gray-50">
                        <Text className="text-sm text-gray-600">Projected Cost</Text>
                        <Metric className="mt-2">${(billingData.calls.totalCost * 1.1).toFixed(2)}</Metric>
                        <Text className="mt-1 text-xs text-yellow-600">Based on current usage</Text>
                      </Card>
                    </div>
                  </Card>
                </Grid>
              </div>
            </TabPanel>

            <TabPanel>
              <InvoiceList
                invoices={billingData.calls.details.reduce((acc, call) => {
                  const date = new Date(call.startedAt || call.createdAt);
                  const monthKey = format(date, 'yyyy-MM');

                  const existingInvoice = acc.find((inv) => format(new Date(inv.date), 'yyyy-MM') === monthKey);
                  if (existingInvoice) {
                    existingInvoice.amount += call.cost;
                    if (existingInvoice.items) {
                      existingInvoice.items[0].quantity++;
                      existingInvoice.items[0].amount += call.cost;
                    }
                  } else {
                    acc.push({
                      id: `INV-${monthKey}`,
                      date: new Date(date.getFullYear(), date.getMonth(), 1),
                      dueDate: new Date(date.getFullYear(), date.getMonth() + 1, 0),
                      amount: call.cost,
                      status: 'paid',
                      items: [
                        {
                          description: "API Calls",
                          quantity: 1,
                          rate: call.cost,
                          amount: call.cost,
                        },
                      ],
                      companyDetails: {
                        name: "Company Name",
                        address: "123 Main St, Anytown, USA",
                        phone: "555-555-5555",
                        email: "info@example.com",
                        website: "example.com",
                      },
                      clientDetails: {
                        name: "Client Name",
                        address: "456 Elm St, Anytown, USA",
                        phone: "555-555-5555",
                        email: "client@example.com",
                      },
                      paymentDetails: {
                        bankName: "Bank of America",
                        accountNumber: "1234567890",
                        ifscCode: "BOFAUS3N",
                        swiftCode: "BOFAUS3NXXX",
                      },
                      notes: "",
                      terms: "",
                    });
                  }
                  return acc;
                }, [] as Invoice[])}
                onDownload={handleInvoiceDownload}
              />
            </TabPanel>
          </TabPanels>
        </TabGroup>
      </div>
    </motion.div>
  );
}
