import { NextRequest, NextResponse } from 'next/server';
import { getCoupon } from '@/lib/data-store';

export async function POST(req: NextRequest) {
  try {
    const { code, cartTotal } = await req.json();

    if (!code) {
      return NextResponse.json({ success: false, message: 'Please provide a coupon code' }, { status: 400 });
    }

    const coupon = await getCoupon(code);

    if (!coupon) {
      return NextResponse.json({ success: false, message: 'Invalid or expired coupon code' }, { status: 404 });
    }

    if (cartTotal && cartTotal < coupon.minOrderValue) {
      return NextResponse.json(
        {
          success: false,
          message: `This coupon requires a minimum cart value of ₹${coupon.minOrderValue}`,
        },
        { status: 400 }
      );
    }

    let discount = 0;
    if (coupon.discountType === 'percentage') {
      discount = Math.round(((cartTotal || 0) * coupon.discountValue) / 100);
      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    } else {
      discount = coupon.discountValue;
    }

    return NextResponse.json({
      success: true,
      coupon: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        discount,
        description: coupon.description,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

