const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { google } = require('googleapis');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Google Calendar setup
const CREDENTIALS_PATH = path.join(__dirname, 'booking-meeting-445311-5a86de3aa9b7.json');
console.log('Loading credentials from:', CREDENTIALS_PATH);

// Load credentials directly
const credentials = require('./booking-meeting-445311-5a86de3aa9b7.json');

// Create JWT client
const jwtClient = new google.auth.JWT(
  credentials.client_email,
  null,
  credentials.private_key,
  ['https://www.googleapis.com/auth/calendar'],
  null
);

const calendar = google.calendar({ version: 'v3', auth: jwtClient });

// Get Zoom access token
async function getZoomAccessToken() {
  try {
    console.log('Getting Zoom access token...');
    
    // OAuth app credentials flow
    const tokenUrl = 'https://zoom.us/oauth/token';
    const credentials = Buffer.from(
      `${process.env.ZOOM_CLIENT_ID}:${process.env.ZOOM_CLIENT_SECRET}`
    ).toString('base64');

    const response = await axios({
      method: 'POST',
      url: tokenUrl,
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: new URLSearchParams({
        grant_type: 'client_credentials'
      }).toString()
    });

    console.log('Zoom token obtained successfully');
    return response.data.access_token;
  } catch (error) {
    console.error('Zoom token error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      url: error.config?.url
    });
    throw new Error(`Zoom authentication failed: ${error.response?.data?.message || error.message}`);
  }
}

// Create Zoom meeting
async function createZoomMeeting(accessToken, meetingDetails) {
  try {
    console.log('Creating Zoom meeting with details:', meetingDetails);

    const response = await axios({
      method: 'POST',
      url: 'https://api.zoom.us/v2/users/me/meetings',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      data: {
        topic: meetingDetails.summary,
        type: 2,
        start_time: meetingDetails.startTime,
        duration: 60,
        timezone: 'Asia/Kolkata',
        settings: {
          host_video: true,
          participant_video: true,
          join_before_host: true,
          waiting_room: false,
          mute_upon_entry: false,
          auto_recording: 'none'
        }
      }
    });

    console.log('Zoom meeting created successfully:', {
      id: response.data.id,
      join_url: response.data.join_url
    });
    
    return response.data;
  } catch (error) {
    console.error('Zoom meeting creation error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    throw new Error(`Failed to create Zoom meeting: ${error.response?.data?.message || error.message}`);
  }
}

// Create meeting endpoint
app.post('/api/create-meeting', async (req, res) => {
  try {
    console.log('Received create meeting request:', req.body);
    const { startTime, endTime, summary, description, attendeeEmail } = req.body;

    // Validate required fields
    if (!startTime || !endTime || !summary || !attendeeEmail) {
      throw new Error('Missing required fields');
    }

    // Get Zoom access token and create meeting
    const accessToken = await getZoomAccessToken();
    const zoomMeeting = await createZoomMeeting(accessToken, {
      summary,
      startTime,
      endTime
    });

    // Create Google Calendar event
    console.log('Creating Google Calendar event...');
    const calendarResponse = await calendar.events.insert({
      calendarId: process.env.GOOGLE_CALENDAR_ID,
      requestBody: {
        summary,
        description: `${description || ''}\n\nZoom Meeting Link: ${zoomMeeting.join_url}`,
        start: { dateTime: startTime },
        end: { dateTime: endTime },
        attendees: [{ email: attendeeEmail }],
        conferenceData: {
          createRequest: { requestId: `${Date.now()}` },
        },
      },
    });

    console.log('Calendar event created successfully');

    res.json({
      success: true,
      calendarEventId: calendarResponse.data.id,
      zoomMeetingUrl: zoomMeeting.join_url,
      zoomMeetingPassword: zoomMeeting.password,
    });
  } catch (error) {
    console.error('Meeting creation error:', {
      message: error.message,
      zoomError: error.response?.data,
      status: error.response?.status
    });
    
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to create meeting'
    });
  }
});

// Get booked slots endpoint
app.get('/api/booked-slots', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    console.log('Fetching booked slots:', { startDate, endDate });

    const response = await calendar.events.list({
      calendarId: process.env.GOOGLE_CALENDAR_ID,
      timeMin: startDate,
      timeMax: endDate,
      singleEvents: true,
      orderBy: 'startTime',
    });

    const bookedSlots = response.data.items.map(event => ({
      date: event.start.dateTime.split('T')[0],
      timeSlot: new Date(event.start.dateTime).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      }),
    }));

    console.log('Successfully fetched booked slots:', bookedSlots);
    res.json(bookedSlots);
  } catch (error) {
    console.error('Error fetching booked slots:', error);
    res.status(500).json({ 
      error: 'Failed to fetch booked slots',
      details: error.message 
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const PORT = 3002;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Server initialized with Google Calendar and ready to accept requests');
});