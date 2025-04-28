import { Request, Response } from "express";
import {  VapiPayload, VapiWebhookEnum } from "../types/vapi.types";
import { endOfCallReportHandler } from "./endCallReport";
import { assistantRequestHandler } from "./assistantRequest";
import { fetchUserDataHandler } from "./toolCall";
export const webhookHandler = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const payload = req.body.message as VapiPayload;
    switch (payload.type) {
      case VapiWebhookEnum.END_OF_CALL_REPORT:
        await endOfCallReportHandler(payload);
        return res.status(201).json({success:true});
      case VapiWebhookEnum.TOOL_CALL:
        return res.status(201).json(await fetchUserDataHandler(payload));
      default:
        throw new Error(`Unhandled message type`);
    }
  } catch (error) {
    // console.log('lmao', error);
    return res.status(500).send(error instanceof Error ? error.message : 'An unknown error occurred');
  }
};
