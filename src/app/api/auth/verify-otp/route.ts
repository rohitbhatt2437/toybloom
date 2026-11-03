import { NextRequest, NextResponse } from 'next/server';
import {
  getLatestActiveOtp,
  incrementOtpAttempts,
  markOtpConsumed,
  activateUserVerification,
} from '@/lib/data-store';
import { verifyOtpHash, MAX_OTP_ATTEMPTS } from '@/lib/otp-service';
import { signToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { identifier, otp, type = 'registration' } = body;

    if (!identifier || !otp) {
      return NextResponse.json(
        { success: false, message: 'Identifier and 6-digit OTP code are required.' },
        { status: 400 }
      );
    }

    const cleanOtp = String(otp).trim();
    if (!/^\d{6}$/.test(cleanOtp)) {
      return NextResponse.json(
        { success: false, message: 'Please enter a valid 6-digit verification code.' },
        { status: 400 }
      );
    }

    // 1. Fetch latest active OTP
    const otpRecord = await getLatestActiveOtp(identifier, type);
    if (!otpRecord) {
      return NextResponse.json(
        {
          success: false,
          message: 'No active verification code found for this contact. Please request a new code.',
        },
        { status: 404 }
      );
    }

    // 2. Check Expiration
    if (Date.now() > otpRecord.expiresAt) {
      await markOtpConsumed(otpRecord._id);
      return NextResponse.json(
        {
          success: false,
          expired: true,
          message: 'This verification code has expired (validity 5 minutes). Please request a new code.',
        },
        { status: 410 }
      );
    }

    // 3. Check Attempt Limits (Max 5 attempts)
    if (otpRecord.attempts >= MAX_OTP_ATTEMPTS) {
      await markOtpConsumed(otpRecord._id);
      return NextResponse.json(
        {
          success: false,
          attemptsExceeded: true,
          message: 'Maximum verification attempts exceeded. Please request a fresh OTP.',
        },
        { status: 429 }
      );
    }

    // Increment attempts count
    const currentAttempts = await incrementOtpAttempts(otpRecord._id);

    // 4. Verify Hash (Timing-safe comparison)
    const isValid = verifyOtpHash(cleanOtp, otpRecord.otpHash);
    if (!isValid) {
      const attemptsLeft = Math.max(0, MAX_OTP_ATTEMPTS - currentAttempts);
      if (attemptsLeft === 0) {
        await markOtpConsumed(otpRecord._id);
        return NextResponse.json(
          {
            success: false,
            attemptsExceeded: true,
            message: 'Too many incorrect attempts. For security, please request a new OTP.',
            attemptsLeft: 0,
          },
          { status: 429 }
        );
      }
      return NextResponse.json(
        {
          success: false,
          message: `Incorrect verification code. ${attemptsLeft} attempt${attemptsLeft === 1 ? '' : 's'} remaining.`,
          attemptsLeft,
        },
        { status: 400 }
      );
    }

    // 5. Success: Consume OTP and Activate User
    await markOtpConsumed(otpRecord._id);
    const verifiedUser = await activateUserVerification(identifier, otpRecord.target);

    // 6. Generate Session Token
    const token = signToken({
      userId: verifiedUser._id,
      email: verifiedUser.email || identifier,
      role: verifiedUser.role,
      name: verifiedUser.name,
    });

    const response = NextResponse.json({
      success: true,
      message: 'Account successfully verified! Welcome to Toyzz.',
      user: verifiedUser,
      token,
    });

    // Set secure HTTP-only session cookie
    response.cookies.set('toyzz_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error: any) {
    console.error('OTP verification error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Verification failed. Please try again.' },
      { status: 500 }
    );
  }
}

