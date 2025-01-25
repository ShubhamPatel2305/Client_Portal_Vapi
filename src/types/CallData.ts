export interface Message {
  role: string;
  content?: string;
  timestamp?: number;
  message: string;
  time: number;
}

export interface CostBreakdown {
  promptTokens?: number;
  completionTokens?: number;
  promptCost?: number;
  completionCost?: number;
  llm?: number;
  stt?: number;
  tts?: number;
  transport?: number;
  vapi?: number;
  totalTokens?: number;
  ttsCharacters?: number;
}

export interface Analysis {
  averageResponseTime: number;
}

export interface CallData {
  duration: number;
  id: string;
  startedAt: string;
  endedAt?: string;
  status: string;
  endedReason?: string;
  cost: number;
  costBreakdown?: CostBreakdown;
  messages?: Message[];
  analysis?: Analysis;
}
