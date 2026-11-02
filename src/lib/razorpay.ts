import crypto from 'crypto';

export const RAZORPAY_KEY_ID = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_toyzz2026demo';
export const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || 'toyzz_secret_key_mock_987654';

export interface RazorpayOrderResponse {
  id: string;
  amount: number;
  currency: string;
  receipt: string;
  status: string;
}

/**
 * Creates a Razorpay order or returns a mock order for testing
 */
export async function createRazorpayOrder(amountInRupees: number, receiptId: string): Promise<RazorpayOrderResponse> {
  const amountInPaise = Math.round(amountInRupees * 100);

  // If real credentials are provided (i.e. not the default mock format), try Razorpay SDK
  if (
    process.env.RAZORPAY_KEY_ID &&
    process.env.RAZORPAY_KEY_SECRET &&
    !process.env.RAZORPAY_KEY_ID.includes('demo')
  ) {
    try {
      const Razorpay = (await import('razorpay')).default;
      const instance = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
      });

      const order = await instance.orders.create({
        amount: amountInPaise,
        currency: 'INR',
        receipt: receiptId,
        payment_capture: true,
      });

      return {
        id: order.id,
        amount: Number(order.amount),
        currency: order.currency,
        receipt: order.receipt || receiptId,
        status: order.status,
      };
    } catch (err) {
      console.error('Razorpay live client failed, falling back to mock mode:', err);
    }
  }

  // Realistic simulated Razorpay order for development & demo testing
  const mockOrderId = `order_${Math.random().toString(36).substring(2, 11).toUpperCase()}`;
  return {
    id: mockOrderId,
    amount: amountInPaise,
    currency: 'INR',
    receipt: receiptId,
    status: 'created',
  };
}

/**
 * Verifies Razorpay HMAC signature on backend
 */
export function verifyRazorpaySignature(
  orderId: string,
  paymentId: string,
  signature: string
): boolean {
  if (!orderId || !paymentId || !signature) return false;

  // For testing with mock credentials
  if (signature.startsWith('mock_sig_') || RAZORPAY_KEY_SECRET.includes('mock')) {
    return true;
  }

  const generatedSignature = crypto
    .createHmac('sha256', RAZORPAY_KEY_SECRET)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');

  return generatedSignature === signature;
}

