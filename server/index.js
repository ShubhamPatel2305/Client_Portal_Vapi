import express from 'express';
import cors from 'cors';
import { Resend } from 'resend';
import cron from 'node-cron';
import multer from 'multer';

const app = express();
const port = 5000;

// Initialize Resend with your API key
const resend = new Resend('re_GmTbySC6_5e4ARoHVPtz64rE8GfEkCNAW');

// Configure multer for file uploads
const upload = multer({ storage: multer.memoryStorage() });

// Store scheduled tasks and alert settings
const scheduledTasks = new Map();
const alertSettings = new Map();

// CORS configuration
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
}));

// Body parser middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Schedule report endpoint
app.post('/api/schedule-report', upload.fields([
  { name: 'pdfReport', maxCount: 1 },
  { name: 'excelReport', maxCount: 1 }
]), async (req, res) => {
  try {
    console.log('Received schedule report request');
    const settings = JSON.parse(req.body.settings);
    const { frequency, time, email } = settings;
    
    console.log('Parsed settings:', settings);
    
    // Create cron schedule based on frequency
    let cronSchedule;
    switch (frequency) {
      case 'daily':
        cronSchedule = `${time.split(':')[1]} ${time.split(':')[0]} * * *`;
        break;
      case 'weekly':
        cronSchedule = `${time.split(':')[1]} ${time.split(':')[0]} * * 1`;
        break;
      case 'monthly':
        cronSchedule = `${time.split(':')[1]} ${time.split(':')[0]} 1 * *`;
        break;
      default:
        throw new Error('Invalid frequency');
    }

    console.log('Created cron schedule:', cronSchedule);

    // Schedule the email task
    const task = cron.schedule(cronSchedule, async () => {
      try {
        const pdfBuffer = req.files['pdfReport'][0].buffer;
        const excelBuffer = req.files['excelReport'][0].buffer;

        await resend.emails.send({
          from: 'onboarding@resend.dev',
          to: email,
          subject: `Scheduled ${frequency} Report`,
          html: `
            <h2>Your Scheduled Report</h2>
            <p>Here is your ${frequency} analytics report.</p>
            <p>Please find the PDF and Excel reports attached.</p>
          `,
          attachments: [
            {
              filename: 'report.pdf',
              content: pdfBuffer
            },
            {
              filename: 'report.xlsx',
              content: excelBuffer
            }
          ]
        });
        
        console.log('Scheduled email sent successfully');
      } catch (error) {
        console.error('Error sending scheduled report:', error);
      }
    });

    // Store the task
    const taskId = Date.now().toString();
    scheduledTasks.set(taskId, task);

    console.log('Task scheduled successfully:', taskId);
    res.json({ success: true, taskId });
  } catch (error) {
    console.error('Error scheduling report:', error);
    res.status(500).json({ error: 'Failed to schedule report', details: error.message });
  }
});

// Save alert settings endpoint
app.post('/api/alert-settings', async (req, res) => {
  try {
    console.log('Received alert settings:', req.body);
    const settings = req.body;
    const userId = settings.email; // Use email as user identifier
    
    alertSettings.set(userId, settings);
    console.log('Alert settings saved successfully');
    res.json({ success: true });
  } catch (error) {
    console.error('Error saving alert settings:', error);
    res.status(500).json({ error: 'Failed to save alert settings', details: error.message });
  }
});

// Send alert endpoint
app.post('/api/send-alert', async (req, res) => {
  try {
    console.log('Received alert request:', req.body);
    const { type, value, settings } = req.body;
    const { email } = settings;

    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: `Alert: ${type.charAt(0).toUpperCase() + type.slice(1)} Threshold Exceeded`,
      html: `
        <h2>Alert Notification</h2>
        <p>Your ${type} threshold has been exceeded.</p>
        <p>Current value: ${value}</p>
        <p>Threshold: ${type === 'cost' ? settings.costThreshold : settings.minutesThreshold}</p>
      `
    });

    console.log('Alert sent successfully');
    res.json({ success: true });
  } catch (error) {
    console.error('Error sending alert:', error);
    res.status(500).json({ error: 'Failed to send alert', details: error.message });
  }
});

// Test email connection endpoint
app.post('/api/test-email', async (req, res) => {
  try {
    console.log('Testing email connection:', req.body);
    const { email } = req.body;
    
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: 'Test Email Connection',
      html: '<p>This is a test email to verify your email connection.</p>'
    });

    console.log('Test email sent successfully');
    res.json({ success: true });
  } catch (error) {
    console.error('Error testing email:', error);
    res.status(500).json({ error: 'Failed to test email', details: error.message });
  }
});

// Email endpoint
app.post('/api/send-email', async (req, res) => {
  try {
    const { to, subject, data } = req.body;
    
    if (!to || !subject || !data) {
      return res.status(400).json({ 
        error: 'Missing required fields' 
      });
    }

    const { name, email, message, priority, type } = data;

    console.log('Attempting to send email:', {
      to,
      subject,
      name,
      email,
      priority,
      type
    });

    try {
      const emailResponse = await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: to,
        subject: subject,
        html: `
          <h2>New Support Request</h2>
          <p><strong>From:</strong> ${name} (${email})</p>
          <p><strong>Priority:</strong> ${priority}</p>
          <p><strong>Type:</strong> ${type}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <h3>Message:</h3>
          <p>${message}</p>
        `
      });

      console.log('Email sent successfully:', emailResponse);
      res.json({ success: true, data: emailResponse });
    } catch (emailError) {
      console.error('Resend API Error:', emailError);
      res.status(400).json({ 
        error: 'Failed to send email',
        details: emailError.message
      });
    }
  } catch (error) {
    console.error('Server Error:', error);
    res.status(500).json({ 
      error: 'Internal Server Error',
      details: error.message
    });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
