import { NextRequest, NextResponse } from 'next/server';
import {
  findUserByIdentifier,
  getLatestActiveOtp,
  saveOtpRecord,
} from '@/lib/data-store';
import {
  generateOtp,
  hashOtp,
  getOtpExpiryTime,
  maskIdentifier,
  sendEmailOtp,
  sendSmsOtp,
} from '@/lib/otp-service';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { identifier, type = 'registration' } = body;

    if (!identifier) {
      return NextResponse.json(
        { success: false, message: 'Identifier (email or phone) is required.' },
        { status: 400 }
      );
    }

    const isEmail = identifier.includes('@');
    const method: 'email' | 'phone' = isEmail ? 'email' : 'phone';

    // 1. Verify user exists
    const user = await findUserByIdentifier(identifier);
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'No registered account found with these details.' },
        { status: 404 }
      );
    }

    // 2. Check if already verified
    if (method === 'email' && user.isEmailVerified) {
      return NextResponse.json(
        { success: false, alreadyVerified: true, message: 'Your email is already verified. You can log in.' },
        { status: 400 }
      );
    }
    if (method === 'phone' && user.isPhoneVerified) {
      return NextResponse.json(
        { success: false, alreadyVerified: true, message: 'Your phone number is already verified. You can log in.' },
        { status: 400 }
      );
    }

    // 3. Check Cooldown on Latest OTP (60 seconds)
    const existingOtp = await getLatestActiveOtp(identifier, type);
    if (existingOtp && Date.now() < existingOtp.resendAvailableAt) {
      const secondsLeft = Math.ceil((existingOtp.resendAvailableAt - Date.now()) / 1000);
      return NextResponse.json(
        {
          success: false,
          cooldown: true,
          message: `Please wait ${secondsLeft} second${secondsLeft === 1 ? '' : 's'} before requesting a new code.`,
          secondsRemaining: secondsLeft,
        },
        { status: 429 }
      );
    }

    // 4. Generate New Secure OTP
    const plainOtp = generateOtp();
    const otpHash = hashOtp(plainOtp);
    const { expiresAt, resendAvailableAt } = getOtpExpiryTime();

    // 5. Store in Database
    await saveOtpRecord({
      _id: `otp-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      identifier,
      target: method,
      otpHash,
      type,
      expiresAt,
      attempts: 0,
      resendAvailableAt,
      consumed: false,
      createdAt: new Date().toISOString(),
    });

    // 6. Send OTP
    if (method === 'email') {
      await sendEmailOtp(identifier, plainOtp, user.name);
    } else {
      await sendSmsOtp(identifier, plainOtp);
    }

    const masked = maskIdentifier(identifier, method);

    return NextResponse.json({
      success: true,
      message: `A fresh verification code has been dispatched to ${masked}.`,
      resendAvailableAt,
    });
  } catch (error: any) {
    console.error('Resend OTP error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to resend verification code.' },
      { status: 500 }
    );
  }
}

