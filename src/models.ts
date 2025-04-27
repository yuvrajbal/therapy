import mongoose, { Schema, Document, Types } from 'mongoose';


interface IMessage {
  speaker: 'user' | 'assistant';
  text: string;
  timestamp: Date;
}

interface ISession{
  session_id: string;
  date: Date;
  summary:string;
  duration:number;
  key_topics: string[];
}

interface ITherapyContext {
  recurring_issues: string[];
  progress_notes: string;
  sentiment_analysis: {
    overall_trend: string;
    recent_change: string;
  };
  suggested_approaches: string[];
}

export interface IUser extends Document{
  phone: string;
  name?:string;
  created_at: Date;
  last_session: Date;
  sessions: ISession[];
  therapy_context: ITherapyContext;
}

export interface IConversation extends Document {
  user_id: Types.ObjectId;
  session_id: string; // matches conversation_uuid from VAPI
  date: Date;
  full_transcript: string;
  messages: IMessage[];
  analyzed: boolean;
}

const UserSchema: Schema= new Schema({
  phone: { type: String, required: true, unique: true, index: true },
  name: { type: String },
  created_at: { type: Date, default: Date.now },
  last_session: { type: Date, default: Date.now },
  sessions: [{
    session_id: { type: String, required: true },
    date: { type: Date, default: Date.now },
    summary: { type: String },
    duration: { type: Number },
    key_topics: [{ type: String }]
  }],
  therapy_context: {
    recurring_issues: [{ type: String }],
    progress_notes: { type: String, default: '' },
    sentiment_analysis: {
      overall_trend: { type: String, default: 'neutral' },
      recent_change: { type: String, default: 'none' }
    },
    suggested_approaches: [{ type: String }]
  }
})  
const ConversationSchema: Schema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  session_id: { type: String, required: true, index: true },
  date: { type: Date, default: Date.now },
  full_transcript: { type: String, default: '' },
  messages: [{
    speaker: { type: String, enum: ['user', 'assistant'], required: true },
    text: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
  }],
  analyzed: { type: Boolean, default: false }
});

export  const User = mongoose.model<IUser>('User', UserSchema);
export const Conversation = mongoose.model<IConversation>('Conversation', ConversationSchema);
