import { NextRequest, NextResponse } from 'next/server';
import { verifyRazorpaySignature } from '@/lib/razorpay';
import { updateOrderPayment } from '@/lib/data-store';

export async function POST(req: NextRequest) {
  try {
    const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = await req.json();

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return NextResponse.json(
        { success: false, message: 'Missing payment signature verification data' },
        { status: 400 }
      );
    }

    const isValid = verifyRazorpaySignature(razorpayOrderId, razorpayPaymentId, razorpaySignature);

    if (!isValid) {
      if (orderId) {
        await updateOrderPayment(orderId, { status: 'failed' });
      }
      return NextResponse.json(
        { success: false, message: 'Invalid payment signature. Verification failed.' },
        { status: 400 }
      );
    }

    // Mark order as paid
    if (orderId) {
      await updateOrderPayment(orderId, {
        status: 'paid',
        razorpayPaymentId,
        razorpaySignature,
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Payment verified and order updated successfully.',
      paymentId: razorpayPaymentId,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

