import { Resend } from 'resend';
import { format } from 'date-fns';

const resend = new Resend('re_YOUR_API_KEY'); // Replace with your Resend API key

export const sendBookingConfirmation = async ({
  name,
  email,
  date,
  time,
  company,
}: {
  name: string;
  email: string;
  date: Date;
  time: string;
  company: string;
}) => {
  try {
    const formattedDate = format(date, 'MMMM d, yyyy');
    
    await resend.emails.send({
      from: 'MyTopEdge <meetings@mytopedge.com>',
      to: email,
      subject: 'Meeting Confirmation - MyTopEdge AI Consultation',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #3B82F6;">Meeting Confirmation</h1>
          <p>Dear ${name},</p>
          <p>Thank you for scheduling a consultation with MyTopEdge. Your meeting has been confirmed for:</p>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Date:</strong> ${formattedDate}</p>
            <p><strong>Time:</strong> ${time}</p>
            <p><strong>Company:</strong> ${company}</p>
          </div>

          <p>We look forward to discussing how our AI solutions can benefit your business.</p>
          
          <p>Best regards,<br>The MyTopEdge Team</p>
        </div>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error('Failed to send email:', error);
    return { success: false, error };
  }
};