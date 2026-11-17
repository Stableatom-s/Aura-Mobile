import mongoose, { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  firebaseUid?: string;
  googleId?: string;
  appleId?: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  gender?: 'male' | 'female' | 'non-binary' | 'prefer-not-to-say' | string;
  onboardingCompleted: boolean;
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
    plan?: string;
    validUntil?: Date;
    razorpayCustomerId?: string;
    razorpaySubscriptionId?: string;
  };
  streak: number;
  status?: string;
  risk?: string;
  country?: string;
  device?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    firebaseUid: { type: String, unique: true, sparse: true },
    googleId: { type: String, unique: true, sparse: true },
    appleId: { type: String, unique: true, sparse: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    fullName: { type: String, default: '' },
    avatarUrl: { type: String },
    gender: {
      type: String,
      default: 'prefer-not-to-say',
    },
    onboardingCompleted: { type: Boolean, default: false },
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
      plan: { type: String, default: 'Free' },
      validUntil: { type: Date },
      razorpayCustomerId: { type: String },
      razorpaySubscriptionId: { type: String },
    },
    streak: { type: Number, default: 0 },
    status: { type: String, default: 'Active' },
    risk: { type: String, default: 'Normal' },
    country: { type: String, default: 'IN' },
    device: { type: String, default: 'Mobile' },
  },
  { timestamps: true }
);

export const User = mongoose.models.User || model<IUser>('User', UserSchema);