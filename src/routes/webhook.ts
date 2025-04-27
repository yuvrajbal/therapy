// // routes/webhook.ts
// import express from 'express';
// import { 
//   handleTranscript, 
//   handleEndOfCall, 
//   handleFunctionCall,
//   handleAssistantRequest,
//   handleStatusUpdate
// } from '../controllers/webhookController';

// const router = express.Router();

// // Route for handling transcripts from VAPI
// router.post('/:conversationId/transcript', handleTranscript);

// // Route for handling end-of-call reports
// router.post('/:conversationId/end-of-call-report', handleEndOfCall);

// // Route for handling function calls from the assistant
// router.post('/:conversationId/function-call', handleFunctionCall);

// // Route for handling assistant requests
// router.post('/:conversationId/assistant-request', handleAssistantRequest);

// // Route for handling status updates
// router.post('/:conversationId/status-update', handleStatusUpdate);

// export { router as webhookRouter };