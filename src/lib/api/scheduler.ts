import axios from 'axios';
import { ScheduleSettings, AlertSettings } from '../../services/emailService';

// Use a constant for the base URL instead of environment variable
const BASE_URL = 'http://localhost:5000/api';

export const schedulerApi = {
  scheduleReport: async (settings: ScheduleSettings, reportData: any) => {
    try {
      const formData = new FormData();
      formData.append('settings', JSON.stringify(settings));
      formData.append('reportData', JSON.stringify(reportData));
      
      const response = await axios.post(`${BASE_URL}/schedule-report`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } catch (error) {
      console.error('Error scheduling report:', error);
      throw new Error('Failed to schedule report. Please try again.');
    }
  },

  saveAlertSettings: async (settings: AlertSettings) => {
    try {
      const response = await axios.post(`${BASE_URL}/alert-settings`, settings);
      return response.data;
    } catch (error) {
      console.error('Error saving alert settings:', error);
      throw new Error('Failed to save alert settings. Please try again.');
    }
  },

  sendAlert: async (type: string, value: number, settings: AlertSettings) => {
    try {
      const response = await axios.post(`${BASE_URL}/send-alert`, {
        type,
        value,
        settings,
      });
      return response.data;
    } catch (error) {
      console.error('Error sending alert:', error);
      throw new Error('Failed to send alert. Please try again.');
    }
  },

  testEmailConnection: async (email: string) => {
    try {
      const response = await axios.post(`${BASE_URL}/test-email`, { email });
      return response.data;
    } catch (error) {
      console.error('Error testing email connection:', error);
      throw new Error('Failed to test email connection. Please try again.');
    }
  }
};
