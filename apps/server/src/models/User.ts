import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  firebaseUid?: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  gender?: 'male' | 'female' | 'non-binary' | 'prefer-not-to-say';
  dateOfBirth?: {
    month: string;
    day: number;
    year: number;
  };
  preferences: {
    theme: 'dark' | 'light' | 'auto';
    accentColor: string;
    fontSize: 'small' | 'medium' | 'large';
    language: 'en' | 'hi';
    dailyReminders: boolean;
    hapticFeedback: boolean;
  };
  subscription: {
    isPro: boolean;
    tier: 'free' | 'monthly' | 'yearly';
    validUntil?: Date;
    razorpayCustomerId?: string;
    razorpaySubscriptionId?: string;
  };
  streak: number;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    firebaseUid: { type: String, unique: true, sparse: true },
    email: { type: String, required: true, unique: true, index: true },
    fullName: { type: String, required: true },
    avatarUrl: { type: String },
    gender: {
      type: String,
      enum: ['male', 'female', 'non-binary', 'prefer-not-to-say'],
      default: 'prefer-not-to-say',
    },
    dateOfBirth: {
      month: { type: String },
      day: { type: Number },
      year: { type: Number },
    },
    preferences: {
      theme: { type: String, enum: ['dark', 'light', 'auto'], default: 'dark' },
      accentColor: { type: String, default: '#6366F1' },
      fontSize: { type: String, enum: ['small', 'medium', 'large'], default: 'medium' },
      language: { type: String, enum: ['en', 'hi'], default: 'en' },
      dailyReminders: { type: Boolean, default: true },
      hapticFeedback: { type: Boolean, default: true },
    },
    subscription: {
      isPro: { type: Boolean, default: false },
      tier: { type: String, enum: ['free', 'monthly', 'yearly'], default: 'free' },
      validUntil: { type: Date },
      razorpayCustomerId: { type: String },
      razorpaySubscriptionId: { type: String },
    },
    streak: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const User = model<IUser>('User', UserSchema);