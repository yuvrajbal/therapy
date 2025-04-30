import { EndOfCallReportPayload } from "../types/vapi.types";
import * as fs from 'fs/promises';
import * as path from 'path';
import prisma from "../../lib/prisma"
import { sendUserData } from "../tools/sendUserData";

export const endOfCallReportHandler = async (
  payload?: EndOfCallReportPayload
): Promise<void> => {
  /**
   * Handle Business logic here.
   * You can store the information like summary, typescript, recordingUrl or even the full messages list in the database.
   */
  if (!payload) {
    console.error("No payload provided to endOfCallReportHandler");
    return;
  }
  try{
    // Create logs directory if it doesn't exist
    const logsDir = path.join(process.cwd(), 'logs');
    await fs.mkdir(logsDir, { recursive: true });

    // Generate filename with timestamp and call ID
    const timestamp = new Date().toISOString().replace(/:/g, '-');
    const filename = `call_${timestamp}.json`;
    const filePath = path.join(logsDir, filename);
    
    // Prepare data with important information from the payload
    const dataToSave = {
      endedReason: payload.endedReason,
      timestamp: new Date().toISOString(),
      transcript: payload.transcript,
      summary: payload.summary,
      recordingUrl: payload.recordingUrl || 'No recording URL available',
      messages: payload.messages,
    };

    // Write data to file
    await fs.writeFile(
      filePath, 
      JSON.stringify(dataToSave, null, 2),
      'utf-8'
    );

    console.log(`End of call report saved to ${filePath}`);

    // Also save transcript to separate text file for easy reading
    const transcriptFilename = `transcript_${timestamp}.txt`;
    const transcriptPath = path.join(logsDir, transcriptFilename);
    
    await fs.writeFile(
      transcriptPath,
      payload.transcript,
      'utf-8'
    );

    console.log(`Transcript saved to ${transcriptPath}`);
    
    // Save data to database
    try {
      const result = await sendUserData(payload);
      if(result) {
        console.log("User data saved to database successfully:");
      } else {
        console.error("Failed to save user data to database");
      }
    } catch (dbError) {
      console.error("Database error while saving user data:", dbError);
    } 
    
    return;
   
  } catch (error) {
    console.error('Failed to save end of call report:', error);
  }
};
