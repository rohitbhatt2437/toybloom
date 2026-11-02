import { NextRequest, NextResponse } from 'next/server';
import { createRazorpayOrder, RAZORPAY_KEY_ID } from '@/lib/razorpay';

export async function POST(req: NextRequest) {
  try {
    const { amount, receipt } = await req.json();

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { success: false, message: 'Invalid payment amount' },
        { status: 400 }
      );
    }

    const orderReceipt = receipt || `rcpt_${Date.now()}`;
    const razorpayOrder = await createRazorpayOrder(amount, orderReceipt);

    return NextResponse.json({
      success: true,
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId: RAZORPAY_KEY_ID,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

