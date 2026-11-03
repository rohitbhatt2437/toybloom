import { NextRequest, NextResponse } from 'next/server';
import { findOrCreateFirebaseUser } from '@/lib/data-store';
import { signToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { method, email, phone, name } = body;

    if (!method || (method !== 'google' && method !== 'phone')) {
      return NextResponse.json(
        { success: false, message: 'Invalid authentication method specified.' },
        { status: 400 }
      );
    }

    if (method === 'google' && !email) {
      return NextResponse.json(
        { success: false, message: 'Google authentication requires a valid email address.' },
        { status: 400 }
      );
    }

    if (method === 'phone' && !phone) {
      return NextResponse.json(
        { success: false, message: 'Phone authentication requires a valid mobile number.' },
        { status: 400 }
      );
    }

    // Find or register verified user
    const user = await findOrCreateFirebaseUser({
      method,
      email,
      phone,
      name,
    });

    // Create session JWT
    const token = signToken({
      userId: user._id,
      email: user.email || user.phone || 'customer@toyzz.com',
      role: user.role,
      name: user.name,
    });

    const response = NextResponse.json({
      success: true,
      message: method === 'google' ? 'Signed in with Google successfully!' : 'Phone verified successfully!',
      user,
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
    console.error('Firebase Auth API Error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Authentication failed.' },
      { status: 500 }
    );
  }
}

