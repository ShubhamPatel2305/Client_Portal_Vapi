import { schedulerApi } from '../lib/api/scheduler';
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';

export interface ScheduleSettings {
  frequency: 'daily' | 'weekly' | 'monthly';
  time: string;
  startDate: string;
  email: string;
}

export interface AlertSettings {
  emailAlerts: boolean;
  pushNotifications: boolean;
  costThreshold: number;
  minutesThreshold: number;
  email: string;
  phone: string;
}

export interface ReportData {
  monthlyCallData: any[];
  totalCalls: number;
  totalCost: number;
  avgCallDuration: number;
  dateRange: string;
}

const generatePDFReport = (data: ReportData): Blob => {
  const doc = new jsPDF();
  
  // Add header
  doc.setFontSize(20);
  doc.text('Call Analytics Report', 20, 20);
  doc.setFontSize(12);
  doc.text(`Date Range: ${data.dateRange}`, 20, 30);
  
  // Add summary
  doc.text('Summary:', 20, 45);
  doc.text(`Total Calls: ${data.totalCalls}`, 30, 55);
  doc.text(`Total Cost: $${data.totalCost.toFixed(2)}`, 30, 65);
  doc.text(`Average Call Duration: ${data.avgCallDuration.toFixed(2)} minutes`, 30, 75);
  
  // Add monthly data
  doc.text('Monthly Breakdown:', 20, 95);
  let y = 105;
  data.monthlyCallData.forEach(month => {
    doc.text(`${month.date}: ${month.totalCalls} calls, $${month.totalCost.toFixed(2)}`, 30, y);
    y += 10;
  });
  
  return doc.output('blob');
};

const generateExcelReport = (data: ReportData): Blob => {
  const wb = XLSX.utils.book_new();

  // Create summary sheet
  const summaryData = [
    ['Total Calls', data.totalCalls || 0],
    ['Total Cost', `$${(data.totalCost || 0).toFixed(2)}`],
    ['Average Call Duration', `${(data.avgCallDuration || 0).toFixed(2)} minutes`],
    ['Date Range', data.dateRange || 'N/A']
  ];
  const summaryWs = XLSX.utils.aoa_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(wb, summaryWs, 'Summary');

  // Create monthly data sheet
  const monthlyData = [
    ['Date', 'Total Calls', 'Total Cost', 'Average Duration']
  ];
  
  if (Array.isArray(data.monthlyCallData)) {
    data.monthlyCallData.forEach(month => {
      if (month) {
        monthlyData.push([
          month.date || 'N/A',
          month.totalCalls || 0,
          `$${(month.totalCost || 0).toFixed(2)}`,
          `${(month.avgDuration || 0).toFixed(2)} minutes`
        ]);
      }
    });
  }
  
  const monthlyWs = XLSX.utils.aoa_to_sheet(monthlyData);
  XLSX.utils.book_append_sheet(wb, monthlyWs, 'Monthly Data');
  
  return new Blob([XLSX.write(wb, { bookType: 'xlsx', type: 'array' })]);
};

export const emailService = {
  scheduleReport: async (settings: ScheduleSettings, reportData: ReportData): Promise<void> => {
    try {
      if (!reportData || !reportData.monthlyCallData) {
        throw new Error('Report data is missing or invalid');
      }

      // Generate reports
      const pdfBlob = generatePDFReport(reportData);
      const excelBlob = generateExcelReport(reportData);

      // Create form data
      const formData = new FormData();
      formData.append('settings', JSON.stringify(settings));
      formData.append('pdfReport', pdfBlob, 'report.pdf');
      formData.append('excelReport', excelBlob, 'report.xlsx');
      formData.append('reportData', JSON.stringify(reportData));

      // Schedule the report
      await schedulerApi.scheduleReport(settings, formData);
    } catch (error) {
      console.error('Error scheduling report:', error);
      throw new Error('Failed to schedule report. Please check your data and try again.');
    }
  },

  saveAlertSettings: async (settings: AlertSettings): Promise<void> => {
    try {
      await schedulerApi.saveAlertSettings(settings);
      // Save settings to local storage for client-side monitoring
      localStorage.setItem('alertSettings', JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving alert settings:', error);
      throw error;
    }
  },

  sendAlert: async (type: 'cost' | 'duration', value: number, settings: AlertSettings): Promise<void> => {
    try {
      await schedulerApi.sendAlert(type, value, settings);
    } catch (error) {
      console.error('Error sending alert:', error);
      throw error;
    }
  },

  testEmailConnection: async (email: string): Promise<boolean> => {
    try {
      const result = await schedulerApi.testEmailConnection(email);
      return result.success;
    } catch (error) {
      console.error('Error testing email connection:', error);
      throw error;
    }
  }
};
