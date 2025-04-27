// controllers/webhookController.ts
import { Request, Response } from 'express';
import { User, Conversation } from '../models';
import mongoose from 'mongoose';

// Handle transcript webhook
export const handleTranscript = async (req: Request, res: Response) => {
  try {
    const { conversationId } = req.params;
    const { transcript, userPhone } = req.body;
    
    // Find or create user based on phone number
    let user = await User.findOne({ phone: userPhone });
    
    if (!user) {
      user = new User({
        phone: userPhone,
        created_at: new Date(),
        last_session: new Date(),
        sessions: [],
        therapy_context: {
          recurring_issues: [],
          progress_notes: '',
          sentiment_analysis: {
            overall_trend: 'neutral',
            recent_change: 'none'
          },
          suggested_approaches: []
        }
      });
      await user.save();
    }
    
    // Find or create conversation for this session
    let conversation = await Conversation.findOne({ session_id: conversationId });
    
    if (!conversation) {
      conversation = new Conversation({
        user_id: user._id,
        session_id: conversationId,
        date: new Date(),
        full_transcript: '',
        messages: [],
        analyzed: false
      });
    }
    
    // Add new message to conversation
    conversation.messages.push({
      speaker: transcript.speaker === 'user' ? 'user' : 'assistant',
      text: transcript.text,
      timestamp: new Date()
    });
    
    // Update full transcript
    conversation.full_transcript += `${transcript.speaker}: ${transcript.text}\n`;
    
    await conversation.save();
    
    // Update user's last session date
    user.last_session = new Date();
    await user.save();
    
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error handling transcript:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

// Handle end-of-call webhook
export const handleEndOfCall = async (req: Request, res: Response) => {
  try {
    const { conversationId } = req.params;
    const { callDetails, summary } = req.body;
    
    // Find the conversation
    const conversation = await Conversation.findOne({ session_id: conversationId });
    
    if (!conversation) {
      return res.status(404).json({ success: false, error: 'Conversation not found' });
    }
    
    // Mark conversation as analyzed
    conversation.analyzed = true;
    await conversation.save();
    
    // Update user session info
    const user = await User.findById(conversation.user_id);
    
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    
    // Add session to user's sessions array
    user.sessions.push({
      session_id: conversationId,
      date: conversation.date,
      summary: summary || 'No summary available',
      duration: callDetails.duration || 0,
      key_topics: extractKeyTopics(conversation.full_transcript)
    });
    
    // Update therapy context (simple implementation - would be more sophisticated in production)
    updateTherapyContext(user, conversation);
    
    await user.save();
    
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error handling end of call:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

// Handle function call webhook
export const handleFunctionCall = async (req: Request, res: Response) => {
  try {
    const { conversationId } = req.params;
    const { function_name, arguments: args } = req.body;
    
    // Handle different function calls
    switch (function_name) {
      case 'getUserContext':
        // Retrieve user context based on conversation ID
        const conversation = await Conversation.findOne({ session_id: conversationId });
        if (!conversation) {
          return res.status(404).json({ 
            success: false, 
            error: 'Conversation not found' 
          });
        }
        
        const user = await User.findById(conversation.user_id);
        if (!user) {
          return res.status(404).json({ 
            success: false, 
            error: 'User not found' 
          });
        }
        
        // Return user therapy context
        return res.status(200).json({
          success: true,
          result: {
            user_name: user.name || 'User',
            therapy_context: user.therapy_context,
            session_count: user.sessions.length,
            last_session_date: user.sessions.length > 0 ? 
              user.sessions[user.sessions.length - 1].date : null
          }
        });
        
      // Add other function cases as needed
      
      default:
        return res.status(400).json({ 
          success: false, 
          error: `Unknown function: ${function_name}` 
        });
    }
  } catch (error) {
    console.error('Error handling function call:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

// Handle assistant request webhook
export const handleAssistantRequest = async (req: Request, res: Response) => {
  try {
    const { conversationId } = req.params;
    const { phone_number } = req.body;
    
    // Find user by phone number to personalize assistant
    let user = await User.findOne({ phone: phone_number });
    
    // Create default assistant configuration
    const assistantConfig = {
      name: "Therapy Assistant",
      model: "claude-3-opus-20240229",
      voice_id: "shimmer", // Choose appropriate voice
      system_prompt: generateSystemPrompt(user)
    };
    
    res.status(200).json({ assistant: assistantConfig });
  } catch (error) {
    console.error('Error handling assistant request:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

// Handle status update webhook
export const handleStatusUpdate = async (req: Request, res: Response) => {
  try {
    const { conversationId } = req.params;
    const { status, call_details } = req.body;
    
    // Log status update (could store in database if needed)
    console.log(`Call ${conversationId} status updated to: ${status}`);
    
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error handling status update:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

// Helper functions

// Extract key topics from transcript (simple implementation)
function extractKeyTopics(transcript: string): string[] {
  // In a real implementation, you might use NLP or other techniques
  // This is a simple placeholder
  const topics = [];
  
  if (transcript.toLowerCase().includes('anxiety')) topics.push('anxiety');
  if (transcript.toLowerCase().includes('depression')) topics.push('depression');
  if (transcript.toLowerCase().includes('stress')) topics.push('stress management');
  
  return topics;
}

// Update therapy context based on conversation (simple implementation)
function updateTherapyContext(user: any, conversation: any): void {
  // In a real implementation, you might use sentiment analysis, NLP, etc.
  // This is a simple placeholder logic
  
  const transcript = conversation.full_transcript.toLowerCase();
  
  // Check for common issues
  if (transcript.includes('anxiety') && !user.therapy_context.recurring_issues.includes('anxiety')) {
    user.therapy_context.recurring_issues.push('anxiety');
  }
  
  if (transcript.includes('depression') && !user.therapy_context.recurring_issues.includes('depression')) {
    user.therapy_context.recurring_issues.push('depression');
  }
  
  // Update progress notes
  user.therapy_context.progress_notes += `\n[${new Date().toISOString()}] New session completed.`;
}

// Generate system prompt based on user context
function generateSystemPrompt(user: any | null): string {
  if (!user) {
    // Default prompt for new users
    return `You are a supportive voice therapy assistant. Your goal is to listen carefully, 
    provide thoughtful responses, and help the user explore their feelings and thoughts.
    Respond with empathy and ask open-ended questions to encourage reflection.`;
  }
  
  // Personalized prompt for returning users
  return `You are a supportive voice therapy assistant speaking with ${user.name || 'a returning user'}.
  Based on previous sessions, focus areas include: ${user.therapy_context.recurring_issues.join(', ') || 'general well-being'}.
  Progress notes: ${user.therapy_context.progress_notes || 'This is a new user.'}
  
  Your goal is to listen carefully, provide thoughtful responses, and help the user 
  explore their feelings and thoughts. Respond with empathy and ask open-ended questions to encourage reflection.
  
  Remember the user's history but don't explicitly mention that you're using saved data unless relevant.`;
}