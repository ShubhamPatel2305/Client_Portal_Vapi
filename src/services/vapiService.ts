import axios from 'axios';
import { VapiClient } from '@vapi-ai/server-sdk';

const VAPI_BASE_URL = 'https://api.vapi.ai';
const VAPI_API_KEY = import.meta.env.VITE_VAPI_API_KEY;

interface Cost {
  type: string;
  analysisType: string;
  completionTokens: number;
  cost: number;
  model: Record<string, string>;
  promptTokens: number;
}

interface Message {
  role: string;
  message: string;
  time: number;
  endTime: number;
  secondsFromStart: number;
}

interface Destination {
  type: string;
  sipUri: string;
  description: string;
  message: string;
  sipHeaders: Record<string, string>;
  transferPlan: {
    mode: string;
  };
}

interface CostBreakdown {
  transport: number;
  stt: number;
  llm: number;
  tts: number;
  vapi: number;
  total: number;
  llmPromptTokens: number;
  llmCompletionTokens: number;
  ttsCharacters: number;
}

interface ArtifactPlan {
  recordingEnabled: boolean;
  videoRecordingEnabled: boolean;
  transcriptPlan: {
    enabled: boolean;
  };
  recordingPath: string;
}

interface Analysis {
  summary: string;
  structuredData: Record<string, any>;
  successEvaluation: string;
}

interface Monitor {
  listenUrl: string;
  controlUrl: string;
}

interface Artifact {
  messages: Message[];
  messagesOpenAIFormatted: Array<{ role: string }>;
  recordingUrl: string;
  stereoRecordingUrl: string;
  videoRecordingUrl: string;
  videoRecordingStartDelaySeconds: number;
  transcript: string;
}

interface Transport {
  provider: string;
  assistantVideoEnabled: boolean;
}

interface Assistant {
  transcriber: {
    provider: string;
  };
  model: {
    provider: string;
    model: string;
  };
  voice: {
    provider: string;
    voiceId: string;
  };
  firstMessage: string;
  firstMessageMode: string;
  hipaaEnabled: boolean;
  clientMessages: string[];
  serverMessages: string[];
  silenceTimeoutSeconds: number;
  maxDurationSeconds: number;
  backgroundSound: string;
  backgroundDenoisingEnabled: boolean;
  modelOutputInMessagesEnabled: boolean;
  transportConfigurations: Array<{
    provider: string;
    timeout: number;
    record: boolean;
  }>;
  name: string;
  voicemailDetection: {
    provider: string;
  };
  voicemailMessage: string;
  endCallMessage: string;
  endCallPhrases: string[];
  metadata: Record<string, string>;
  artifactPlan: {
    recordingEnabled: boolean;
    videoRecordingEnabled: boolean;
  };
  startSpeakingPlan: {
    waitSeconds: number;
    smartEndpointingEnabled: boolean;
  };
  stopSpeakingPlan: {
    numWords: number;
    voiceSeconds: number;
    backoffSeconds: number;
  };
  monitorPlan: {
    listenEnabled: boolean;
    controlEnabled: boolean;
  };
  credentialIds: string[];
  server: {
    url: string;
    timeoutSeconds: number;
  };
}

interface PhoneNumber {
  twilioAccountSid: string;
  twilioAuthToken: string;
  twilioPhoneNumber: string;
  fallbackDestination: {
    type: string;
    sipUri: string;
  };
  name: string;
  assistantId: string;
  squadId: string;
  serverUrl: string;
  serverUrlSecret: string;
}

interface Customer {
  numberE164CheckEnabled: boolean;
  extension: string;
  number: string;
  sipUri: string;
  name: string;
}

export interface VapiCall {
  id: string;
  orgId: string;
  createdAt: string;
  updatedAt: string;
  type: string;
  costs: Cost[];
  messages: Message[];
  phoneCallProvider: string;
  phoneCallTransport: string;
  status: string;
  endedReason: string;
  destination: Destination;
  startedAt: string;
  endedAt: string;
  cost: number;
  costBreakdown: CostBreakdown;
  artifactPlan: ArtifactPlan;
  analysis: Analysis;
  monitor: Monitor;
  artifact: Artifact;
  transport: Transport;
  phoneCallProviderId: string;
  assistantId: string;
  assistant: Assistant;
  squadId: string;
  phoneNumberId: string;
  phoneNumber: PhoneNumber;
  customerId: string;
  customer: Customer;
  name: string;
}

interface ListCallsParams {
  id?: string;
  assistantId?: string;
  phoneNumberId?: string;
  limit?: number;
  createdAtGt?: string;
  createdAtLt?: string;
  createdAtGe?: string;
  createdAtLe?: string;
  updatedAtGt?: string;
  updatedAtLt?: string;
  updatedAtGe?: string;
  updatedAtLe?: string;
}

const vapiClient = axios.create({
  baseURL: VAPI_BASE_URL,
  headers: {
    'Authorization': `Bearer ${VAPI_API_KEY}`,
    'Content-Type': 'application/json',
  },
});

export const fetchVapiCalls = async (params?: ListCallsParams): Promise<VapiCall[]> => {
  try {
    const response = await vapiClient.get('/call', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching Vapi calls:', error);
    throw error;
  }
};

export const fetchAnalytics = async (timeRange: string) => {
  try {
    const response = await fetch('https://api.vapi.ai/analytics', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${VAPI_API_KEY}`,
      },
      body: JSON.stringify({ timeRange }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch analytics data');
    }

    const data = await response.json();
    
    // Process and transform the data
    return {
      totalCalls: data.totalCalls || 0,
      totalDuration: data.totalDuration || 0,
      averageCallDuration: data.averageCallDuration || 0,
      totalCost: data.totalCost || 0,
      successRate: data.successRate || 0,
      callsByDay: data.callsByDay || [],
      callOutcomes: data.callOutcomes || [],
      customerSentiment: data.customerSentiment || [],
      commonTopics: data.commonTopics || [],
      peakCallTimes: data.peakCallTimes || [],
    };
  } catch (error) {
    console.error('Error fetching analytics:', error);
    throw error;
  }
};

const vapiAxios = axios.create({
  baseURL: VAPI_BASE_URL,
  headers: {
    'Authorization': `Bearer ${VAPI_API_KEY}`,
    'Content-Type': 'application/json',
  },
});

const client = new VapiClient({ token: VAPI_API_KEY });

const mockAnalyticsData = {
  total_calls: 150,
  total_duration: 12000, // in seconds
  average_duration: 80, // in seconds
  total_cost: 300, // in currency
  calls_by_status: {
    completed: 120,
    failed: 20,
    unknown: 10,
  },
  calls_by_date: {
    '2024-12-05': 20,
    '2024-12-06': 30,
    '2024-12-07': 25,
    '2024-12-08': 15,
    '2024-12-09': 10,
    '2024-12-10': 20,
    '2024-12-11': 30,
  },
  average_latency: 200, // in milliseconds
  calls: Array(150).fill({
    duration: 80,
    cost: 2,
    status: 'completed',
    created_at: '2024-12-05T10:00:00Z',
    latency: 200,
  }),
};

export const vapiService = {
  // Get list of calls with pagination and filters
  getCalls: async (params: {
    limit?: number;
    offset?: number;
    start_date?: string;
    end_date?: string;
    status?: string;
  }) => {
    try {
      const response = await vapiAxios.get('/v1/calls', {
        params: {
          ...params,
          limit: params.limit || 100,
          offset: params.offset || 0
        }
      });
      return {
        calls: response.data.data || [],
        total: response.data.total || 0
      };
    } catch (error: any) {
      console.error('Error fetching calls:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch calls');
    }
  },

  // Get specific call details
  getCall: async (callId: string) => {
    const response = await vapiAxios.get(`/calls/${callId}`);
    return response.data;
  },

  // Get assistant details
  getAssistant: async (assistantId: string) => {
    try {
      const response = await client.assistants.get(assistantId);
      console.log(response);
      return response;
    } catch (error) {
      console.error('Error fetching assistant details:', error);
      throw error;
    }
  },

  // Update assistant configuration
  updateAssistant: async (assistantId: string, data: any) => {
    const response = await vapiAxios.patch(`/assistant/${assistantId}`, data);
    return response.data;
  },

  // Get analytics data
  getAnalytics: async (params: {
    start_date?: string;
    end_date?: string;
    assistant_id?: string;
  }) => {
    try {
      // Return mock data instead of making an API call
      return mockAnalyticsData;
    } catch (error: any) {
      console.error('Error fetching analytics:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch analytics');
    }
  },

  // Send message to assistant
  sendMessage: async (assistantId: string, message: string) => {
    const response = await vapiAxios.post(`/assistants/${assistantId}/messages`, {
      message,
    });
    return response.data;
  },

  // Get real-time metrics
  getRealTimeMetrics: async (assistantId: string) => {
    const response = await vapiAxios.get(`/assistants/${assistantId}/metrics`);
    return response.data;
  },
};

export default vapiService;