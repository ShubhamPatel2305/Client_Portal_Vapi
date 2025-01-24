import axios from 'axios';

const BACKEND_BASE_URL = 'https://client-portal-vapi-backend.vercel.app/api/v1/admin';

interface CredentialsResponse {
  success: boolean;
  data: {
    email: string;
    apiKey: string;
    assistantId: string[];
  };
}

export const fetchUserCredentials = async (email: string): Promise<void> => {
  try {
    const response = await axios.get<CredentialsResponse>(`${BACKEND_BASE_URL}/get/${email}`);
    
    if (response.status === 200 && response.data.success) {
      const { apiKey, assistantId } = response.data.data;
      localStorage.setItem('vapi_api_key', apiKey);
      localStorage.setItem('vapi_assistant_id', assistantId[0]); // Taking first assistant ID
    }
  } catch (error) {
    console.log('Using default credentials as user data not found');
    // If error occurs, we'll fallback to default credentials
    localStorage.removeItem('vapi_api_key');
    localStorage.removeItem('vapi_assistant_id');
  }
};

export const getApiKey = (): string => {
  return localStorage.getItem('vapi_api_key') || "bc4bd62c-4c8c-4175-a935-99381197d206" || '';
};

export const getAssistantId = (): string => {
  return localStorage.getItem('vapi_assistant_id') || "56c7f0f1-a068-4f7f-ae52-33bb86c3896d";
};
