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
  
  // Company Header
  doc.setFontSize(24);
  doc.text('TopEdge Technologies', pageWidth / 2, 20, { align: 'center' });
  
  doc.setFontSize(18);
  doc.text('INVOICE', pageWidth / 2, 35, { align: 'center' });
  
  // Invoice Details
  doc.setFontSize(12);
  doc.text(`Invoice Number: ${data.invoiceNumber}`, 20, 50);
  doc.text(`Date: ${format(new Date(data.date), 'MM/dd/yyyy')}`, 20, 60);
  doc.text(`Due Date: ${format(new Date(data.dueDate), 'MM/dd/yyyy')}`, 20, 70);
  doc.text(`Billing Period: ${data.billingPeriod}`, 20, 80);
  
  // Client Information
  doc.text('Bill To:', 20, 100);
  doc.text(data.client.name, 20, 110);
  doc.text(data.client.address, 20, 120);
  doc.text(data.client.city, 20, 130);
  doc.text(data.client.email, 20, 140);
  
  // Services Table
  const servicesHead = [['Service', 'Quantity', 'Rate', 'Amount']];
  const servicesBody = data.services.map(service => [
    service.name,
    service.quantity,
    `$${service.rate.toFixed(2)}`,
    `$${service.amount.toFixed(2)}`
  ]);
  
  doc.autoTable({
    startY: 160,
    head: servicesHead,
    body: servicesBody,
    theme: 'striped',
    headStyles: {
      fillColor: [66, 139, 202],
      textColor: 255
    },
    styles: {
      halign: 'left'
    },
    columnStyles: {
      0: { cellWidth: 80 },
      1: { cellWidth: 30, halign: 'right' },
      2: { cellWidth: 30, halign: 'right' },
      3: { cellWidth: 30, halign: 'right' }
    }
  });
  
  // Totals
  const totalsData = [
    ['Subtotal:', `$${data.subtotal.toFixed(2)}`],
    ['Tax (10%):', `$${data.tax.toFixed(2)}`],
    ['Total:', `$${data.total.toFixed(2)}`]
  ];
  
  doc.autoTable({
    startY: doc.lastAutoTable.finalY + 10,
    body: totalsData,
    theme: 'plain',
    styles: {
      fontSize: 12
    },
    columnStyles: {
      0: { cellWidth: 140 },
      1: { cellWidth: 30, halign: 'right', fontStyle: 'bold' }
    }
  });
  
  return doc;
};
