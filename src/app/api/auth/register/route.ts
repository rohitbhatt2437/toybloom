import { NextRequest, NextResponse } from 'next/server';
import { registerUser, saveOtpRecord } from '@/lib/data-store';
import {
  generateOtp,
  hashOtp,
  getOtpExpiryTime,
  maskIdentifier,
  normalizePhoneNumber,
  sendEmailOtp,
  sendSmsOtp,
} from '@/lib/otp-service';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, password, verificationMethod = 'email' } = body;

    // 1. Validation
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return NextResponse.json(
        { success: false, message: 'Please enter a valid full name (at least 2 characters).' },
        { status: 400 }
      );
    }

    if (!password || typeof password !== 'string' || password.length < 6) {
      return NextResponse.json(
        { success: false, message: 'Password must be at least 6 characters long.' },
        { status: 400 }
      );
    }

    let targetIdentifier = '';
    let normalizedPhone = '';

    if (verificationMethod === 'email') {
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        return NextResponse.json(
          { success: false, message: 'Please provide a valid email address.' },
          { status: 400 }
        );
      }
      targetIdentifier = email.trim().toLowerCase();
    } else if (verificationMethod === 'phone') {
      if (!phone) {
        return NextResponse.json(
          { success: false, message: 'Please provide a valid 10-digit mobile number.' },
          { status: 400 }
        );
      }
      try {
        normalizedPhone = normalizePhoneNumber(phone);
        targetIdentifier = normalizedPhone;
      } catch (err: any) {
        return NextResponse.json({ success: false, message: err.message }, { status: 400 });
      }
    } else {
      return NextResponse.json(
        { success: false, message: 'Invalid verification method. Choose email or mobile.' },
        { status: 400 }
      );
    }

    // 2. Register user in unverified state
    const user = await registerUser({
      name: name.trim(),
      email: email ? email.trim().toLowerCase() : undefined,
      phone: normalizedPhone || phone || undefined,
      password,
      registrationMethod: verificationMethod,
    });

    // 3. Generate secure OTP
    const plainOtp = generateOtp();
    const otpHash = hashOtp(plainOtp);
    const { expiresAt, resendAvailableAt } = getOtpExpiryTime();

    // 4. Save hashed OTP to database
    await saveOtpRecord({
      _id: `otp-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      identifier: targetIdentifier,
      target: verificationMethod,
      otpHash,
      type: 'registration',
      expiresAt,
      attempts: 0,
      resendAvailableAt,
      consumed: false,
      createdAt: new Date().toISOString(),
    });

    // 5. Dispatch OTP via Email or SMS Driver
    let deliveryResult;
    if (verificationMethod === 'email') {
      deliveryResult = await sendEmailOtp(targetIdentifier, plainOtp, user.name);
    } else {
      deliveryResult = await sendSmsOtp(targetIdentifier, plainOtp);
    }

    // 6. Return response (NEVER return plainOtp!)
    const masked = maskIdentifier(targetIdentifier, verificationMethod);

    return NextResponse.json({
      success: true,
      message: `A 6-digit verification code has been sent to ${masked}.`,
      verificationMethod,
      maskedIdentifier: masked,
      identifier: targetIdentifier,
      resendAvailableAt,
      provider: deliveryResult.provider,
      deliveryWarning: !deliveryResult.success ? deliveryResult.error : undefined,
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Registration failed. Please try again.' },
      { status: 400 }
    );
  }
}
