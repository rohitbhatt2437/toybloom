import mongoose, { Schema, Document } from 'mongoose';

export interface IOtp extends Document {
  identifier: string;
  target: 'email' | 'phone';
  otpHash: string;
  type: 'registration' | 'login' | 'reset_password';
  expiresAt: Date;
  attempts: number;
  resendAvailableAt: Date;
  consumed: boolean;
  createdAt: Date;
}

const OtpSchema: Schema = new Schema(
  {
    identifier: { type: String, required: true, index: true },
    target: { type: String, enum: ['email', 'phone'], required: true },
    otpHash: { type: String, required: true },
    type: { type: String, enum: ['registration', 'login', 'reset_password'], default: 'registration' },
    expiresAt: { type: Date, required: true, index: { expires: '0s' } }, // MongoDB TTL auto-cleanup
    attempts: { type: Number, default: 0 },
    resendAvailableAt: { type: Date, required: true },
    consumed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.Otp || mongoose.model<IOtp>('Otp', OtpSchema);

