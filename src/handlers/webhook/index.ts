import { Request, Response } from "express";
import {  VapiPayload, VapiWebhookEnum } from "../types/vapi.types";
import { endOfCallReportHandler } from "./endCallReport";
export const webhookHandler = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const payload = req.body.message as VapiPayload;
    switch (payload.type) {
      case VapiWebhookEnum.END_OF_CALL_REPORT:
        return res.status(201).json(await endOfCallReportHandler(payload));
      default:
        throw new Error(`Unhandled message type`);
    }
  } catch (error) {
    // console.log('lmao', error);
    return res.status(500).send(error instanceof Error ? error.message : 'An unknown error occurred');
  }
};
