import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { format } from 'date-fns';

interface CompanyInfo {
  name: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  website: string;
}

interface Colors {
  primary: [number, number, number];
  secondary: [number, number, number];
  accent: [number, number, number];
  muted: [number, number, number];
  success: [number, number, number];
  warning: [number, number, number];
  danger: [number, number, number];
}

const companyInfo: CompanyInfo = {
  name: 'TopEdge Technologies',
  address: '123 Tech Park, Silicon Valley',
  city: 'San Francisco, CA 94105',
  phone: '+1 (555) 123-4567',
  email: 'billing@topedge.tech',
  website: 'www.topedge.tech'
};

const colors: Colors = {
  primary: [41, 128, 185],
  secondary: [44, 62, 80],
  accent: [39, 174, 96],
  muted: [127, 140, 141],
  success: [46, 204, 113],
  warning: [241, 196, 15],
  danger: [231, 76, 60]
};

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(amount);
};

interface ChartData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    borderColor?: string;
    backgroundColor?: string;
  }>;
}

const drawSimpleChart = (doc: jsPDF, data: ChartData, x: number, y: number, width: number, height: number): void => {
  const { labels, datasets } = data;
  const maxValue = Math.max(...datasets[0].data);
  const padding = 20;
  const graphWidth = width - (padding * 2);
  const graphHeight = height - (padding * 2);
  const stepX = graphWidth / (labels.length - 1);
  const stepY = graphHeight / maxValue;

  // Draw axes
  doc.setDrawColor(0);
  doc.line(x + padding, y + height - padding, x + width - padding, y + height - padding); // X axis
  doc.line(x + padding, y + padding, x + padding, y + height - padding); // Y axis

  // Draw data points and lines
  datasets.forEach(dataset => {
    const points = dataset.data.map((value, index) => ({
      x: x + padding + (stepX * index),
      y: y + height - padding - (value * stepY)
    }));

    // Draw lines between points
    for (let i = 0; i < points.length - 1; i++) {
      doc.setDrawColor(colors.primary[0], colors.primary[1], colors.primary[2]);
      doc.line(points[i].x, points[i].y, points[i + 1].x, points[i + 1].y);
    }

    // Draw points
    points.forEach(point => {
      doc.setFillColor(colors.primary[0], colors.primary[1], colors.primary[2]);
      doc.circle(point.x, point.y, 1, 'F');
    });
  });

  // Draw labels
  doc.setFontSize(8);
  labels.forEach((label, index) => {
    const xPos = x + padding + (stepX * index);
    doc.text(label, xPos, y + height - padding + 10, { align: 'center' });
  });
};

interface AnalyticsReportData {
  totalCalls: number;
  inboundCalls: number;
  outboundCalls: number;
  avgDuration: number;
  totalCost: number;
  successRate: number;
  dailyStats: Array<{ date: string; totalCalls: number }>;
}

export const generateAnalyticsReport = (data: AnalyticsReportData): jsPDF => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const margin = 20;

  // Header
  doc.setFillColor(colors.primary[0], colors.primary[1], colors.primary[2]);
  doc.rect(0, 0, pageWidth, 40, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.text('Analytics Report', margin, 25);
  doc.setFontSize(12);
  doc.text(format(new Date(), 'MMMM yyyy'), pageWidth - margin, 25, { align: 'right' });

  // Company Info
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  let yPos = 50;
  doc.text(companyInfo.name, margin, yPos);
  doc.text(companyInfo.address, margin, yPos + 5);
  doc.text(companyInfo.city, margin, yPos + 10);
  doc.text(companyInfo.phone, margin, yPos + 15);
  doc.text(companyInfo.email, margin, yPos + 20);
  doc.text(companyInfo.website, margin, yPos + 25);

  // Key Metrics
  yPos = 100;
  doc.setFontSize(16);
  doc.text('Key Metrics', margin, yPos);
  doc.setFontSize(10);

  const metrics = [
    { label: 'Total Calls', value: data.totalCalls },
    { label: 'Inbound Calls', value: data.inboundCalls },
    { label: 'Outbound Calls', value: data.outboundCalls },
    { label: 'Average Duration', value: `${data.avgDuration} mins` },
    { label: 'Total Cost', value: formatCurrency(data.totalCost) },
    { label: 'Success Rate', value: `${data.successRate}%` }
  ];

  metrics.forEach((metric, index) => {
    const xPos = margin + (index % 2) * ((pageWidth - margin * 2) / 2);
    const metricYPos = yPos + 20 + Math.floor(index / 2) * 25;
    doc.text(`${metric.label}:`, xPos, metricYPos);
    doc.text(String(metric.value), xPos + 80, metricYPos);
  });

  // Draw simple chart
  yPos = 200;
  doc.setFontSize(16);
  doc.text('Daily Call Trends', margin, yPos);
  
  const chartData = {
    labels: data.dailyStats.map(stat => format(new Date(stat.date), 'MMM d')),
    datasets: [{
      label: 'Calls',
      data: data.dailyStats.map(stat => stat.totalCalls)
    }]
  };

  drawSimpleChart(doc, chartData, margin, yPos + 10, pageWidth - (margin * 2), 80);

  return doc;
};

interface InvoiceData {
  invoiceNumber: string;
  client: {
    name: string;
    address: string;
    city: string;
    email: string;
  };
  date: string;
  dueDate: string;
  billingPeriod: string;
  services: Array<{
    name: string;
    quantity: number;
    rate: number;
    amount: number;
  }>;
  subtotal: number;
  tax: number;
  total: number;
}

export const generateInvoice = (data: InvoiceData): jsPDF => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const margin = 20;

  // Header
  doc.setFillColor(colors.primary[0], colors.primary[1], colors.primary[2]);
  doc.rect(0, 0, pageWidth, 40, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.text('Invoice', margin, 25);
  doc.setFontSize(12);
  doc.text(`#INV-${data.invoiceNumber}`, pageWidth - margin, 25, { align: 'right' });

  // Company Info
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  let yPos = 50;
  doc.text(companyInfo.name, margin, yPos);
  doc.text(companyInfo.address, margin, yPos + 5);
  doc.text(companyInfo.city, margin, yPos + 10);
  doc.text(companyInfo.phone, margin, yPos + 15);
  doc.text(companyInfo.email, margin, yPos + 20);

  // Client Info
  yPos = 100;
  doc.text('Bill To:', margin, yPos);
  doc.text(data.client.name, margin, yPos + 5);
  doc.text(data.client.address, margin, yPos + 10);
  doc.text(data.client.city, margin, yPos + 15);
  doc.text(data.client.email, margin, yPos + 20);

  // Invoice Details
  yPos = 150;
  doc.setFontSize(12);
  doc.text('Invoice Details', margin, yPos);
  doc.setFontSize(10);

  const details = [
    { label: 'Invoice Date', value: format(new Date(data.date), 'MMM d, yyyy') },
    { label: 'Due Date', value: format(new Date(data.dueDate), 'MMM d, yyyy') },
    { label: 'Billing Period', value: data.billingPeriod }
  ];

  details.forEach((detail, index) => {
    const detailYPos = yPos + 10 + (index * 6);
    doc.text(`${detail.label}:`, margin, detailYPos);
    doc.text(detail.value, margin + 80, detailYPos);
  });

  // Services Table
  yPos = 190;
  (doc as any).autoTable({
    startY: yPos,
    head: [['Service', 'Quantity', 'Rate', 'Amount']],
    body: data.services.map(service => [
      service.name,
      service.quantity,
      formatCurrency(service.rate),
      formatCurrency(service.amount)
    ]),
    theme: 'striped',
    headStyles: { fillColor: [colors.primary[0], colors.primary[1], colors.primary[2]] },
    margin: { top: 20, right: margin, bottom: 20, left: margin }
  });

  // Totals
  const finalY = (doc as any).lastAutoTable.finalY + 10;
  const totalsData = [
    { label: 'Subtotal', value: formatCurrency(data.subtotal) },
    { label: 'Tax', value: formatCurrency(data.tax) },
    { label: 'Total', value: formatCurrency(data.total) }
  ];

  totalsData.forEach((item, index) => {
    const totalsY = finalY + (index * 6);
    doc.text(item.label, pageWidth - margin - 80, totalsY);
    doc.text(item.value, pageWidth - margin, totalsY, { align: 'right' });
  });

  return doc;
};
