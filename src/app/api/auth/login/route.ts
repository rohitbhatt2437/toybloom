import { NextRequest, NextResponse } from 'next/server';
import { findUserByIdentifier, saveOtpRecord } from '@/lib/data-store';
import { comparePassword, signToken } from '@/lib/auth';
import {
  generateOtp,
  hashOtp,
  getOtpExpiryTime,
  sendEmailOtp,
  sendSmsOtp,
} from '@/lib/otp-service';

export async function POST(req: NextRequest) {
  try {
    const { email, identifier: rawId, password } = await req.json();
    const loginIdentifier = (rawId || email || '').trim();

    if (!loginIdentifier || !password) {
      return NextResponse.json(
        { success: false, message: 'Please provide your email or mobile number and password.' },
        { status: 400 }
      );
    }

    const user = await findUserByIdentifier(loginIdentifier);
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials. Please check your login details.' },
        { status: 401 }
      );
    }

    const isValid = await comparePassword(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials. Please check your login details.' },
        { status: 401 }
      );
    }

    // Check account verification status (Admins bypass)
    if (user.role !== 'admin') {
      const isVerified =
        user.registrationMethod === 'phone' ? user.isPhoneVerified : user.isEmailVerified;

      if (!isVerified) {
        // Dispatch a fresh verification code
        const targetMethod = user.registrationMethod || (loginIdentifier.includes('@') ? 'email' : 'phone');
        const targetContact = targetMethod === 'phone' ? user.phone || loginIdentifier : user.email || loginIdentifier;

        const plainOtp = generateOtp();
        const otpHash = hashOtp(plainOtp);
        const { expiresAt, resendAvailableAt } = getOtpExpiryTime();

        await saveOtpRecord({
          _id: `otp-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          identifier: targetContact,
          target: targetMethod,
          otpHash,
          type: 'registration',
          expiresAt,
          attempts: 0,
          resendAvailableAt,
          consumed: false,
          createdAt: new Date().toISOString(),
        });

        if (targetMethod === 'email') {
          await sendEmailOtp(targetContact, plainOtp, user.name);
        } else {
          await sendSmsOtp(targetContact, plainOtp);
        }

        return NextResponse.json(
          {
            success: false,
            unverified: true,
            verificationMethod: targetMethod,
            identifier: targetContact,
            message: 'Your account is not verified yet. We have sent a new verification code to complete activation.',
          },
          { status: 403 }
        );
      }
    }

    const token = signToken({
      userId: user._id,
      email: user.email || loginIdentifier,
      role: user.role,
      name: user.name,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        isEmailVerified: user.isEmailVerified,
        isPhoneVerified: user.isPhoneVerified,
        registrationMethod: user.registrationMethod,
        addresses: user.addresses,
      },
      token,
    });

    // Set secure HTTP-only cookie
    response.cookies.set('toyzz_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json({ success: false, message: error.message || 'Login failed.' }, { status: 500 });
  }
}
