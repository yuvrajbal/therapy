import { fetchUserData } from "../tools/fetchUserData";
import { ToolCall } from "../types/vapi.types";


export const fetchUserDataHandler = async(payload: any) => {
  const {toolCalls} = payload
  
  const fetchUserDataTool = async() => {
    const toolCall: ToolCall = toolCalls[0];
    const {
      function: { name, arguments: toolCallparameters },
    } = toolCall;

    switch (name) {
      case "fetchUserData":
        return await fetchUserData({
          toolCallparameters,
        });
      default:
        throw new Error(`Function ${name} not found`);
    }
  };
  
  const result = await fetchUserDataTool()
  return {
    results: [  
      {
        toolCallId : toolCalls[0].id,
        result:result.summaries
      }
    ]
  }
}