import { Schema, model, Document, Types } from 'mongoose';

export interface IJournalEntry extends Document {
  userId: Types.ObjectId;
  emotion: string; // e.g. 'Happy', 'Sad', 'Calm'
  reflectionText: string;
  sentimentScore?: number;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const JournalEntrySchema = new Schema<IJournalEntry>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    emotion: { type: String, required: true },
    reflectionText: { type: String, required: true },
    sentimentScore: { type: Number },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

export const JournalEntry = model<IJournalEntry>('JournalEntry', JournalEntrySchema);