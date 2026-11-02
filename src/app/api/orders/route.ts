import { NextRequest, NextResponse } from 'next/server';
import { getAllOrders, createOrder } from '@/lib/data-store';
import { verifyToken } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('toyzz_token')?.value || req.headers.get('authorization')?.replace('Bearer ', '');
    const decoded = token ? verifyToken(token) : null;

    if (!decoded) {
      return NextResponse.json({ success: false, message: 'Authentication required' }, { status: 401 });
    }

    // Admins see all orders, customers see only their own
    const orders = decoded.role === 'admin'
      ? await getAllOrders()
      : await getAllOrders(decoded.userId);

    return NextResponse.json({ success: true, count: orders.length, orders });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { customer, items, shippingAddress, paymentInfo, pricing, couponApplied } = body;

    if (!customer || !items || !items.length || !shippingAddress || !paymentInfo || !pricing) {
      return NextResponse.json(
        { success: false, message: 'Missing required order fields.' },
        { status: 400 }
      );
    }

    // Check optional user session token
    const token = req.cookies.get('toyzz_token')?.value || req.headers.get('authorization')?.replace('Bearer ', '');
    const decoded = token ? verifyToken(token) : null;
    if (decoded && !customer.userId) {
      customer.userId = decoded.userId;
    }

    const order = await createOrder({
      customer,
      items,
      shippingAddress,
      paymentInfo,
      pricing,
      couponApplied,
    });

    return NextResponse.json({ success: true, order }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

