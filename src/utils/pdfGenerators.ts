import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { format } from 'date-fns';

// Extend jsPDF type to include autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => void;
    lastAutoTable: {
      finalY: number;
    };
  }
}

interface AnalyticsReportData {
  totalCalls: number;
  inboundCalls: number;
  outboundCalls: number;
  avgDuration: number;
  totalCost: number;
  successRate: number;
  dailyStats: Array<{ date: string; totalCalls: number }>;
  callDetails: Array<{
    id: string;
    date: string;
    type: string;
    duration: number;
    cost: number;
    status: string;
  }>;
}

interface InvoiceData {
  invoiceNumber: string;
  client: {
    name: string;
    address: string;
    city: string;
    email: string;
    phone?: string;
    companyName?: string;
    taxId?: string;
  };
  date: string;
  dueDate: string;
  billingPeriod: string;
  services: Array<{
    name: string;
    description?: string;
    quantity: number;
    rate: number;
    amount: number;
  }>;
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod?: string;
  notes?: string;
}

export const generateAnalyticsReport = (data: AnalyticsReportData): jsPDF => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  
  // Company Header
  doc.setFontSize(24);
  doc.text('TopEdge Technologies', pageWidth / 2, 20, { align: 'center' });
  
  doc.setFontSize(16);
  doc.text(`Call Analytics Report - ${format(new Date(), 'MMMM yyyy')}`, pageWidth / 2, 30, { align: 'center' });
  
  doc.setFontSize(12);
  doc.text(`Generated on: ${format(new Date(), 'MMMM dd, yyyy')}`, pageWidth / 2, 40, { align: 'center' });
  
  // Call Summary Section
  doc.setFontSize(14);
  doc.text('Call Summary:', 20, 60);
  
  doc.setFontSize(12);
  const summaryData = [
    ['Total Calls:', data.totalCalls.toString()],
    ['Inbound Calls:', data.inboundCalls.toString()],
    ['Outbound Calls:', data.outboundCalls.toString()],
    ['Average Duration:', `${data.avgDuration}m ${data.avgDuration % 1 * 60}s`]
  ];
  
  doc.autoTable({
    startY: 65,
    head: [],
    body: summaryData,
    theme: 'plain',
    styles: {
      cellPadding: 2,
      fontSize: 12
    },
    columnStyles: {
      0: { cellWidth: 40 },
      1: { cellWidth: 40 }
    }
  });
  
  // Performance Metrics Section
  doc.setFontSize(14);
  doc.text('Performance Metrics:', 20, doc.lastAutoTable.finalY + 20);
  
  const metricsData = [
    ['Success Rate:', `${data.successRate}%`],
    ['Peak Hour:', '6AM'],
    ['Busiest Day:', format(new Date(data.dailyStats[0].date), 'MMMM dd')]
  ];
  
  doc.autoTable({
    startY: doc.lastAutoTable.finalY + 25,
    head: [],
    body: metricsData,
    theme: 'plain',
    styles: {
      cellPadding: 2,
      fontSize: 12
    },
    columnStyles: {
      0: { cellWidth: 40 },
      1: { cellWidth: 40 }
    }
  });

  // Call Details Table
  doc.setFontSize(14);
  doc.text('Call Details:', 20, doc.lastAutoTable.finalY + 20);

  const callDetailsHead = [
    ['Call ID', 'Date', 'Type', 'Duration', 'Cost', 'Status']
  ];

  const callDetailsBody = data.callDetails.map(call => [
    call.id,
    format(new Date(call.date), 'MM/dd/yyyy'),
    call.type,
    `${Math.floor(call.duration / 60)}m ${call.duration % 60}s`,
    `$${call.cost}`,
    call.status
  ]);
  
  doc.autoTable({
    startY: doc.lastAutoTable.finalY + 25,
    head: callDetailsHead,
    body: callDetailsBody,
    theme: 'striped',
    headStyles: {
      fillColor: [66, 139, 202],
      textColor: 255,
      fontSize: 10,
      halign: 'left'
    },
    styles: {
      cellPadding: 2,
      fontSize: 9,
      overflow: 'linebreak',
      halign: 'left'
    },
    columnStyles: {
      0: { cellWidth: 25 },
      1: { cellWidth: 25 },
      2: { cellWidth: 25 },
      3: { cellWidth: 25 },
      4: { cellWidth: 25 },
      5: { cellWidth: 25 }
    }
  });
  
  return doc;
};

export const generateInvoice = (data: InvoiceData): jsPDF => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  
  // Company Header with Logo Space
  doc.setFillColor(245, 245, 245);
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  doc.setFontSize(24);
  doc.setTextColor(44, 62, 80);
  doc.text('TopEdge Technologies', 20, 25);
  
  // Invoice Title
  doc.setFontSize(32);
  doc.setTextColor(52, 152, 219);
  doc.text('INVOICE', pageWidth - 20, 25, { align: 'right' });
  
  // Company Info
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text('123 Tech Street', 20, 45);
  doc.text('Silicon Valley, CA 94025', 20, 50);
  doc.text('support@topedge.tech', 20, 55);
  doc.text('+1 (555) 123-4567', 20, 60);
  
  // Invoice Details Box
  doc.setDrawColor(220, 220, 220);
  doc.setFillColor(250, 250, 250);
  doc.roundedRect(pageWidth - 90, 40, 70, 50, 3, 3, 'FD');
  
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text('Invoice Number:', pageWidth - 85, 50);
  doc.text('Date:', pageWidth - 85, 60);
  doc.text('Due Date:', pageWidth - 85, 70);
  doc.text('Period:', pageWidth - 85, 80);
  
  doc.setTextColor(44, 62, 80);
  doc.text(data.invoiceNumber, pageWidth - 20, 50, { align: 'right' });
  doc.text(format(new Date(data.date), 'MM/dd/yyyy'), pageWidth - 20, 60, { align: 'right' });
  doc.text(format(new Date(data.dueDate), 'MM/dd/yyyy'), pageWidth - 20, 70, { align: 'right' });
  doc.text(data.billingPeriod, pageWidth - 20, 80, { align: 'right' });
  
  // Bill To Section
  doc.setFontSize(12);
  doc.setTextColor(52, 152, 219);
  doc.text('BILL TO', 20, 80);
  
  doc.setFontSize(11);
  doc.setTextColor(44, 62, 80);
  doc.text(data.client.name, 20, 90);
  if (data.client.companyName) {
    doc.text(data.client.companyName, 20, 95);
  }
  doc.text(data.client.address, 20, data.client.companyName ? 100 : 95);
  doc.text(data.client.city, 20, data.client.companyName ? 105 : 100);
  doc.text(data.client.email, 20, data.client.companyName ? 110 : 105);
  if (data.client.phone) {
    doc.text(data.client.phone, 20, data.client.companyName ? 115 : 110);
  }
  if (data.client.taxId) {
    doc.text(`Tax ID: ${data.client.taxId}`, 20, data.client.companyName ? 120 : 115);
  }
  
  // Services Table
  const startY = data.client.companyName ? 130 : 125;
  const servicesHead = [['Item & Description', 'Quantity', 'Rate', 'Amount']];
  const servicesBody = data.services.map(service => [
    service.description 
      ? `${service.name}\n${service.description}`
      : service.name,
    service.quantity,
    `$${service.rate.toFixed(2)}`,
    `$${service.amount.toFixed(2)}`
  ]);
  
  doc.autoTable({
    startY,
    head: servicesHead,
    body: servicesBody,
    theme: 'striped',
    headStyles: {
      fillColor: [52, 152, 219],
      textColor: 255,
      fontSize: 11,
      fontStyle: 'bold',
      halign: 'left'
    },
    styles: {
      cellPadding: 5,
      fontSize: 10,
      overflow: 'linebreak',
      halign: 'left'
    },
    columnStyles: {
      0: { cellWidth: 90 },
      1: { cellWidth: 30, halign: 'center' },
      2: { cellWidth: 30, halign: 'right' },
      3: { cellWidth: 30, halign: 'right' }
    }
  });
  
  // Totals Section
  const finalY = doc.lastAutoTable.finalY;
  doc.setFontSize(10);
  
  doc.setTextColor(100, 100, 100);
  doc.text('Subtotal:', pageWidth - 80, finalY + 15);
  doc.text('Tax:', pageWidth - 80, finalY + 25);
  doc.setFontSize(12);
  doc.setTextColor(44, 62, 80);
  doc.text('Total Due:', pageWidth - 80, finalY + 40);
  
  doc.setFontSize(10);
  doc.setTextColor(44, 62, 80);
  doc.text(`$${data.subtotal.toFixed(2)}`, pageWidth - 20, finalY + 15, { align: 'right' });
  doc.text(`$${data.tax.toFixed(2)}`, pageWidth - 20, finalY + 25, { align: 'right' });
  doc.setFontSize(12);
  doc.setTextColor(52, 152, 219);
  doc.text(`$${data.total.toFixed(2)}`, pageWidth - 20, finalY + 40, { align: 'right' });
  
  // Payment Method
  if (data.paymentMethod) {
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Payment Method: ${data.paymentMethod}`, 20, finalY + 25);
  }
  
  // Notes Section
  if (data.notes) {
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text('Notes:', 20, finalY + 45);
    doc.setTextColor(44, 62, 80);
    doc.text(data.notes, 20, finalY + 55);
  }
  
  // Footer
  doc.setFontSize(9);
  doc.setTextColor(150, 150, 150);
  doc.text('Thank you for your business!', pageWidth / 2, pageHeight - 20, { align: 'center' });
  
  return doc;
};
