import { init, send } from '@emailjs/browser';

// Initialize EmailJS with your public key
init('n--Yx3vL8ch_WR7vO');

interface EmailParams {
  userEmail: string;
  userName: string;
  serviceName: string;
  dateTime: string;
  company?: string;
  message?: string;
  zoomLink?: string;
}

export const sendConfirmationEmail = async (params: EmailParams) => {
  try {
    // Send email to the user
    await send(
      'service_7m2zbxp', // Your EmailJS service ID
      'template_ql4qqxp', // Your EmailJS template ID for user confirmation
      {
        to_email: params.userEmail,
        to_name: params.userName,
        service_name: params.serviceName,
        date_time: params.dateTime,
        company: params.company || 'Not specified',
        message: params.message || 'No additional message',
        zoom_link: params.zoomLink || 'Will be sent shortly',
      }
    );

    // Send notification to admin (you)
    await send(
      'service_7m2zbxp', // Your EmailJS service ID
      'template_ql4qqxp', // Your EmailJS template ID for admin notification
      {
        to_email: 'moksh2031@gmail.com',
        to_name: 'Admin',
        user_email: params.userEmail,
        user_name: params.userName,
        service_name: params.serviceName,
        date_time: params.dateTime,
        company: params.company || 'Not specified',
        message: params.message || 'No additional message',
      }
    );

    return { success: true };
  } catch (error) {
    console.error('Failed to send email:', error);
    return { success: false, error: 'Failed to send confirmation email' };
  }
};
