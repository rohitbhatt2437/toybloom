import { NextRequest, NextResponse } from 'next/server';
import { getAdminStats } from '@/lib/data-store';
import { verifyToken } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('toyzz_token')?.value || req.headers.get('authorization')?.replace('Bearer ', '');
    const decoded = token ? verifyToken(token) : null;

    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized. Admin access required.' },
        { status: 403 }
      );
    }

    const stats = await getAdminStats();
    return NextResponse.json({ success: true, stats });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

