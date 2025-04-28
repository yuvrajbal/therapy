/* eslint-disable @typescript-eslint/no-explicit-any */
import { FunctionDefinition } from "openai/resources";
export enum VapiWebhookEnum {
  TOOL_CALL = "tool-calls",
  END_OF_CALL_REPORT = "end-of-call-report",
  ASSISTANT_REQUEST = "assistant-request",
  FUNCTION_CALL = "function-call",
  STATUS_UPDATE = "status-update",
  HANG = "hang",
  SPEECH_UPDATE = "speech-update",
  TRANSCRIPT = "transcript",
}

// Add your Vapi tool names here
export type ToolCallName = "fetchUserData";
export interface ConversationMessage {
  role: "user" | "system" | "bot" | "function_call" | "function_result";
  message?: string;
  name?: string;
  args?: string;
  result?: string;
  time: number;
  endTime?: number;
  secondsFromStart: number;
}


interface BaseVapiPayload {
  call: VapiCall;
}

export interface FunctionCallPayload extends BaseVapiPayload {
  type: VapiWebhookEnum.TOOL_CALL;
  toolCalls: any;
  toolWithToolCallList: any;
}
export interface AssistantRequestPayload extends BaseVapiPayload {
  type: VapiWebhookEnum.ASSISTANT_REQUEST;
}

export interface VapiCall {}

export type VapiPayload =
  | AssistantRequestPayload
  | FunctionCallPayload
  | EndOfCallReportPayload

export type ToolCall = {
  id: string;
  type: string;
  function: {
    name: ToolCallName;
    arguments: any;
  };
};


export interface EndOfCallReportPayload extends BaseVapiPayload {
  type: VapiWebhookEnum.END_OF_CALL_REPORT;
  endedReason: string;
  transcript: string;
  messages: ConversationMessage[];
  summary: string;
  recordingUrl?: string;
}

export type ToolCallResponse = {
  results: [
    {
      toolCallId: string;
      result: any;
    }
  ];
};

export interface Model {
  model: string;
  systemPrompt?: string;
  temperature?: number;
  functions?: {
    name: string;
    async?: boolean;
    description?: string;
    parameters?: FunctionDefinition | any;
  }[];
  provider: string;
  url?: string;
}   


const PLAY_HT_EMOTIONS = [
  "female_happy",
  "female_sad",
  "female_angry",
  "female_fearful",
  "female_disgust",
  "female_surprised",
] as const;

type PlayHTEmotion = (typeof PLAY_HT_EMOTIONS)[number];

interface Voice {
  provider: string;
  voiceId: string;
  speed?: number;
  stability?: number;
  similarityBoost?: number;
  style?: number;
  useSpeakerBoost?: boolean;
  temperature?: number;
  emotion?: PlayHTEmotion;
  voiceGuidance?: number;
  styleGuidance?: number;
  textGuidance?: number;
}

export interface Assistant {
  // Properties from AssistantUserEditable
  name?: string;
  transcriber?: {
    provider: "deepgram";
    model?: string;
    keywords?: string[];
  };
  model?: Model;
  voice?: Voice;
  language?: string;
  forwardingPhoneNumber?: string;
  firstMessage?: string;
  voicemailMessage?: string;
  endCallMessage?: string;
  endCallPhrases?: string[];
  interruptionsEnabled?: boolean;
  recordingEnabled?: boolean;
  endCallFunctionEnabled?: boolean;
  dialKeypadFunctionEnabled?: boolean;
  fillersEnabled?: boolean;
  clientMessages?: any[];
  serverMessages?: any[];
  silenceTimeoutSeconds?: number;
  responseDelaySeconds?: number;
  liveTranscriptsEnabled?: boolean;
  keywords?: string[];
  parentId?: string;
  serverUrl?: string;
  serverUrlSecret?: string;

  // Properties from AssistantPrivileged
  id?: string;
  orgId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
export interface AssistantRequestMessageResponse {
  assistant?: Assistant;
  error?: string;
}
export interface AssistantRequestPayload extends BaseVapiPayload {
  type: VapiWebhookEnum.ASSISTANT_REQUEST;
}


export type VapiResponse = ToolCallResponse;
