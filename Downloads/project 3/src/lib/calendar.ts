import axios from 'axios';

// Environment variables
const GOOGLE_CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID || '';

// Zoom OAuth credentials
const ZOOM_CLIENT_ID = 'sVt3JDveSayNtP3mjFJCQ';
const ZOOM_CLIENT_SECRET = 'c33uRBJsjcjQ2Tp4Cn8Cs2qtw15vJH3K';
const ZOOM_ACCOUNT_ID = '9xySfcQMQUyDVuydF5dxMQ';

interface BookedSlot {
  date: string;
  timeSlot: string;
}

// Function to handle API errors
const handleApiError = (error: any) => {
  console.error('API Error:', error);
  if (error.response) {
    throw new Error(error.response.data.error || 'API request failed');
  }
  throw new Error('Network error occurred');
};

const API_BASE_URL = 'http://localhost:3002/api';

// Function to get booked slots from Google Calendar
export async function getBookedSlots(startDate: Date, endDate: Date): Promise<BookedSlot[]> {
  try {
    const response = await axios.get(`${API_BASE_URL}/booked-slots`, {
      params: {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch booked slots:', error);
    return [];
  }
}

export async function createMeeting(
  startTime: string,
  endTime: string,
  summary: string,
  description: string,
  attendeeEmail: string
): Promise<{
  success: boolean;
  calendarEventId?: string;
  zoomMeetingUrl?: string;
  zoomMeetingPassword?: string;
  error?: string;
}> {
  try {
    const response = await axios.post(`${API_BASE_URL}/create-meeting`, {
      startTime,
      endTime,
      summary,
      description,
      attendeeEmail,
    });

    return response.data;
  } catch (error) {
    console.error('Meeting creation error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create meeting',
    };
  }
}
