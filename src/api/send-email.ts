import { Resend } from 'resend';

const resend = new Resend('re_GmTbySC6_5e4ARoHVPtz64rE8GfEkCNAW');

export async function POST(req: Request) {
  try {
    const { to, subject, data } = await req.json();

    const { name, email, message, priority, type } = data;

    const emailContent = `
      New Support Request

      From: ${name} (${email})
      Priority: ${priority}
      Type: ${type}
      Subject: ${subject}

      Message:
      ${message}
    `;

    const { data: emailResponse, error } = await resend.emails.send({
      from: 'AI Call Hub Support <onboarding@resend.dev>',
      to: [to],
      subject: subject,
      text: emailContent,
    });

    if (error) {
      return new Response(JSON.stringify({ error }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    return new Response(JSON.stringify({ data: emailResponse }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
