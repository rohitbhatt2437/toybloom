import mongoose, { Schema, Document } from 'mongoose';

export interface IOrder extends Document {
  orderNumber: string;
  customer: {
    userId?: string;
    name: string;
    email: string;
    phone: string;
  };
  items: Array<{
    productId: string;
    title: string;
    price: number;
    quantity: number;
    image: string;
    slug: string;
  }>;
  shippingAddress: {
    fullName: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    pincode: string;
    landmark?: string;
  };
  paymentInfo: {
    method: 'razorpay' | 'cod';
    status: 'pending' | 'paid' | 'failed' | 'refunded';
    razorpayOrderId?: string;
    razorpayPaymentId?: string;
    razorpaySignature?: string;
    paidAt?: Date;
  };
  pricing: {
    subtotal: number;
    discountAmount: number;
    shippingFee: number;
    taxAmount: number;
    total: number;
  };
  couponApplied?: string;
  orderStatus: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'out_for_delivery' | 'delivered' | 'cancelled' | 'returned';
  statusTimeline: Array<{
    status: string;
    timestamp: Date;
    comment?: string;
  }>;
  trackingNumber?: string;
  estimatedDelivery?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema: Schema = new Schema(
  {
    orderNumber: { type: String, required: true, unique: true, index: true },
    customer: {
      userId: { type: Schema.Types.ObjectId, ref: 'User' },
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
    },
    items: [
      {
        productId: { type: String, required: true },
        title: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
        image: { type: String, required: true },
        slug: { type: String, required: true },
      },
    ],
    shippingAddress: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
      landmark: { type: String, default: '' },
    },
    paymentInfo: {
      method: { type: String, enum: ['razorpay', 'cod'], default: 'razorpay' },
      status: { type: String, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' },
      razorpayOrderId: String,
      razorpayPaymentId: String,
      razorpaySignature: String,
      paidAt: Date,
    },
    pricing: {
      subtotal: { type: Number, required: true },
      discountAmount: { type: Number, default: 0 },
      shippingFee: { type: Number, default: 0 },
      taxAmount: { type: Number, default: 0 },
      total: { type: Number, required: true },
    },
    couponApplied: { type: String, default: '' },
    orderStatus: {
      type: String,
      enum: ['pending', 'confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'returned'],
      default: 'confirmed',
      index: true,
    },
    statusTimeline: [
      {
        status: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
        comment: String,
      },
    ],
    trackingNumber: String,
    estimatedDelivery: String,
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);

