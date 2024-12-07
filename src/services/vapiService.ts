import axios from 'axios';

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
