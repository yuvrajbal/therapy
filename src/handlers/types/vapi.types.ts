/* eslint-disable @typescript-eslint/no-explicit-any */

export enum VapiWebhookEnum {
  TOOL_CALL = "tool-calls",
  END_OF_CALL_REPORT = "end-of-call-report"
}

// Add your Vapi tool names here
export type ToolCallName = "checkOrderStatus";
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

export interface VapiCall {}
export type VapiPayload = FunctionCallPayload | EndOfCallReportPayload;

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

export type VapiResponse = ToolCallResponse;
