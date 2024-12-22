import { google } from 'googleapis';
import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';

// Google Calendar credentials
const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY || '';
const GOOGLE_CLIENT_EMAIL = process.env.GOOGLE_CLIENT_EMAIL || '';
const GOOGLE_CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID || '';

export async function POST(request: Request) {
  try {
    const {
      startTime,
      endTime,
      summary,
      description,
      attendeeEmail,
      zoomMeetingUrl,
      zoomMeetingPassword
    } = await request.json();

    // Initialize Google Calendar client
    const auth = new google.auth.JWT({
      email: GOOGLE_CLIENT_EMAIL,
      key: GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/calendar'],
    });

    const calendar = google.calendar({ version: 'v3', auth });

    // Create Google Calendar event
    const event = {
      summary: summary,
      description: `${description}\n\nZoom Meeting Link: ${zoomMeetingUrl}\nPassword: ${zoomMeetingPassword}`,
      start: {
        dateTime: startTime,
        timeZone: 'UTC',
      },
      end: {
        dateTime: endTime,
        timeZone: 'UTC',
      },
      attendees: [
        { email: attendeeEmail },
      ],
      conferenceData: {
        createRequest: {
          requestId: Math.random().toString(36).substring(7),
          conferenceSolutionKey: { type: 'hangoutsMeet' },
        },
      },
    };

    const calendarResponse = await calendar.events.insert({
      auth: auth,
      calendarId: GOOGLE_CALENDAR_ID,
      requestBody: event,
      conferenceDataVersion: 1,
    });

    // Send email notification
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: attendeeEmail,
      subject: `Meeting Scheduled: ${summary}`,
      html: `
        <h2>Meeting Details</h2>
        <p><strong>Topic:</strong> ${summary}</p>
        <p><strong>Time:</strong> ${new Date(startTime).toLocaleString()}</p>
        <p><strong>Duration:</strong> ${Math.floor((new Date(endTime).getTime() - new Date(startTime).getTime()) / (60 * 1000))} minutes</p>
        <p><strong>Zoom Meeting Link:</strong> <a href="${zoomMeetingUrl}">${zoomMeetingUrl}</a></p>
        <p><strong>Password:</strong> ${zoomMeetingPassword}</p>
        <p><strong>Description:</strong> ${description}</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({
      success: true,
      calendarEventId: calendarResponse.data.id,
      zoomMeetingUrl,
      zoomMeetingPassword,
    });
  } catch (error) {
    console.error('Error in calendar API:', error);
    return NextResponse.json(
      { error: 'Failed to create meeting' },
      { status: 500 }
    );
  }
}
