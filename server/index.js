import express from 'express';
import cors from 'cors';
import { Resend } from 'resend';

const app = express();
const port = 5000;

// Initialize Resend with your API key
const resend = new Resend('re_GmTbySC6_5e4ARoHVPtz64rE8GfEkCNAW');

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['POST'],
  credentials: true
}));
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
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
