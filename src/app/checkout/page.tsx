'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import {
  ShieldCheck,
  CreditCard,
  Truck,
  ArrowRight,
  Lock,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, discount, appliedCoupon, shippingFee, finalTotal, clearCart } = useCart();
  const { user } = useAuth();

  // Shipping Form State
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    street: user?.addresses?.[0]?.street || '',
    city: user?.addresses?.[0]?.city || '',
    state: user?.addresses?.[0]?.state || 'Karnataka',
    pincode: user?.addresses?.[0]?.pincode || '',
    landmark: user?.addresses?.[0]?.landmark || '',
  });

  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'cod'>('razorpay');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if ((window as any).Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (items.length === 0) {
      setErrorMessage('Your cart is empty. Add some toys before checking out!');
      return;
    }

    if (!formData.fullName || !formData.email || !formData.phone || !formData.street || !formData.city || !formData.pincode) {
      setErrorMessage('Please fill in all required shipping address fields.');
      return;
    }

    setIsProcessing(true);

    try {
      // 1. Create order in backend
      const orderPayload = {
        customer: {
          userId: user?._id,
          name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
        },
        items: items.map((i) => ({
          productId: i.product._id,
          title: i.product.title,
          price: i.product.price,
          quantity: i.quantity,
          image: i.product.featuredImage,
          slug: i.product.slug,
        })),
        shippingAddress: {
          fullName: formData.fullName,
          phone: formData.phone,
          street: formData.street,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          landmark: formData.landmark,
        },
        paymentInfo: {
          method: paymentMethod,
          status: paymentMethod === 'cod' ? 'pending' : 'pending',
        },
        pricing: {
          subtotal,
          discountAmount: discount,
          shippingFee,
          taxAmount: 0,
          total: finalTotal,
        },
        couponApplied: appliedCoupon || undefined,
      };

      const orderRes = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      const orderData = await orderRes.json();
      if (!orderData.success) {
        throw new Error(orderData.message || 'Failed to create order.');
      }

      const createdOrder = orderData.order;

      // 2. Handle Payment
      if (paymentMethod === 'cod') {
        clearCart();
        router.push(`/order-success/${createdOrder._id}`);
        return;
      }

      // 3. Razorpay Online Payment Flow
      const rzpRes = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: finalTotal,
          receipt: createdOrder.orderNumber,
        }),
      });

      const rzpData = await rzpRes.json();
      if (!rzpData.success) {
        throw new Error(rzpData.message || 'Failed to initialize payment gateway.');
      }

      const scriptLoaded = await loadRazorpayScript();

      if (scriptLoaded && (window as any).Razorpay && !rzpData.keyId.includes('demo')) {
        // Live / Real Razorpay Popup
        const options = {
          key: rzpData.keyId,
          amount: rzpData.amount,
          currency: rzpData.currency,
          name: 'Toyzz Store India',
          description: `Order ${createdOrder.orderNumber}`,
          order_id: rzpData.orderId,
          prefill: {
            name: formData.fullName,
            email: formData.email,
            contact: formData.phone,
          },
          theme: {
            color: '#F43F5E',
          },
          handler: async (response: any) => {
            // Verify backend HMAC signature
            const verifyRes = await fetch('/api/payments/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                orderId: createdOrder._id,
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              }),
            });
            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              clearCart();
              router.push(`/order-success/${createdOrder._id}`);
            } else {
              setErrorMessage('Payment verification failed. Please contact support.');
            }
          },
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.open();
        setIsProcessing(false);
      } else {
        // Instant Sandbox / Test Simulator Mode
        // Simulates seamless payment verification and completes the order
        const mockPaymentId = `pay_mock_${Date.now()}`;
        const mockSignature = `mock_sig_${Date.now()}`;

        const verifyRes = await fetch('/api/payments/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId: createdOrder._id,
            razorpayOrderId: rzpData.orderId,
            razorpayPaymentId: mockPaymentId,
            razorpaySignature: mockSignature,
          }),
        });

        const verifyData = await verifyRes.json();
        if (verifyData.success) {
          clearCart();
          router.push(`/order-success/${createdOrder._id}`);
        } else {
          throw new Error('Payment simulation verification failed.');
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Something went wrong while processing your order.');
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FCFCFA]">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center py-20 px-4 text-center">
          <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center text-amber-500 mb-4">
            <Truck className="w-10 h-10" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Your Cart is Empty</h1>
          <p className="text-xs text-slate-500 max-w-sm mb-6">
            You don&apos;t have any toys in your cart to checkout.
          </p>
          <Link
            href="/products"
            className="px-6 py-3 rounded-2xl bg-toy-coral text-white font-bold text-xs shadow-md hover:bg-rose-600 transition-all"
          >
            Explore Toys
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FCFCFA]">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full">
        {/* Header */}
        <div className="mb-8">
          <span className="text-xs font-black uppercase tracking-widest text-toy-coral">
            Secure Checkout
          </span>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-1">
            Complete Your Toy Order
          </h1>
          <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span>256-bit SSL encrypted checkout & Razorpay security</span>
          </p>
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Form: Delivery & Payment Details */}
          <div className="lg:col-span-7 space-y-8">
            {/* 1. Contact & Shipping Address */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-4">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
                <Truck className="w-5 h-5 text-toy-coral" />
                <span>1. Shipping & Delivery Address</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Parent / Recipient Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="e.g. Priya Sharma"
                    className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-toy-coral/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="name@example.com"
                    className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-toy-coral/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Phone Number (for SMS Tracking) *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+91 98765 43210"
                    className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-toy-coral/30"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Street Address / House No / Apartment *
                  </label>
                  <input
                    type="text"
                    name="street"
                    required
                    value={formData.street}
                    onChange={handleInputChange}
                    placeholder="e.g. Flat 402, Sunshine Meadows, 100ft Road"
                    className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-toy-coral/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="e.g. Bengaluru"
                    className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-toy-coral/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    PIN Code *
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    required
                    value={formData.pincode}
                    onChange={handleInputChange}
                    placeholder="e.g. 560038"
                    className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-toy-coral/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    State *
                  </label>
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-toy-coral/30 bg-white"
                  >
                    <option value="Karnataka">Karnataka</option>
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="Delhi">Delhi NCR</option>
                    <option value="Tamil Nadu">Tamil Nadu</option>
                    <option value="Telangana">Telangana</option>
                    <option value="Gujarat">Gujarat</option>
                    <option value="Uttar Pradesh">Uttar Pradesh</option>
                    <option value="West Bengal">West Bengal</option>
                    <option value="Other">Other State</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Landmark (Optional)
                  </label>
                  <input
                    type="text"
                    name="landmark"
                    value={formData.landmark}
                    onChange={handleInputChange}
                    placeholder="Nearby park, school, metro"
                    className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-toy-coral/30"
                  />
                </div>
              </div>
            </div>

            {/* 2. Payment Method */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-4">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
                <CreditCard className="w-5 h-5 text-toy-coral" />
                <span>2. Payment Option</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Razorpay Online */}
                <label
                  className={`p-5 rounded-3xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                    paymentMethod === 'razorpay'
                      ? 'border-toy-coral bg-rose-50/30 shadow-md shadow-rose-500/10'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="razorpay"
                          checked={paymentMethod === 'razorpay'}
                          onChange={() => setPaymentMethod('razorpay')}
                          className="accent-rose-500 w-4 h-4"
                        />
                        <span className="font-extrabold text-sm text-slate-900">
                          Razorpay Online
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1 pl-6">
                        UPI (GPay, PhonePe, Paytm), Debit/Credit Cards & NetBanking
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 pl-6 flex items-center gap-2 text-[10px] text-emerald-600 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Instant Confirmation</span>
                  </div>
                </label>

                {/* Cash on Delivery */}
                <label
                  className={`p-5 rounded-3xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                    paymentMethod === 'cod'
                      ? 'border-toy-coral bg-rose-50/30 shadow-md shadow-rose-500/10'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="cod"
                          checked={paymentMethod === 'cod'}
                          onChange={() => setPaymentMethod('cod')}
                          className="accent-rose-500 w-4 h-4"
                        />
                        <span className="font-extrabold text-sm text-slate-900">
                          Cash on Delivery (COD)
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1 pl-6">
                        Pay cash or UPI upon package doorstep delivery
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 pl-6 text-[10px] text-slate-400 font-medium">
                    Verified OTP delivery
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-6 sticky top-28">
              <h3 className="font-black text-slate-900 text-lg border-b border-slate-100 pb-4">
                Order Summary ({items.length} toys)
              </h3>

              {/* Items Preview */}
              <div className="max-h-60 overflow-y-auto space-y-3 divide-y divide-slate-100 pr-1">
                {items.map((item) => (
                  <div key={item.product._id} className="pt-3 first:pt-0 flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-xl bg-slate-50 overflow-hidden flex-shrink-0 border border-slate-100">
                      <Image
                        src={item.product.featuredImage}
                        alt={item.product.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-800 truncate">
                        {item.product.title}
                      </p>
                      <p className="text-[11px] text-slate-400">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-xs font-extrabold text-slate-800">
                      ₹{item.product.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div>

              {/* Calculation Summary */}
              <div className="space-y-2 pt-4 border-t border-slate-100 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Items Subtotal</span>
                  <span className="font-bold text-slate-800">₹{subtotal}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Coupon Discount ({appliedCoupon})</span>
                    <span>-₹{discount}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Delivery Charges</span>
                  <span className={shippingFee === 0 ? 'text-emerald-600 font-bold' : 'text-slate-800'}>
                    {shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}
                  </span>
                </div>

                <div className="flex justify-between text-lg font-black text-slate-900 pt-3 border-t border-slate-200">
                  <span>Total Amount</span>
                  <span className="text-toy-rose">₹{finalTotal}</span>
                </div>
              </div>

              {/* Place Order Button */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-4 px-6 rounded-2xl bg-toy-coral text-white font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-rose-500/25 hover:bg-rose-600 hover:shadow-2xl transition-all disabled:opacity-50"
              >
                {isProcessing ? (
                  <span>Securing Order...</span>
                ) : (
                  <>
                    <span>Place Order (₹{finalTotal})</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="text-center text-[10px] text-slate-400 space-y-1">
                <p>By placing this order you agree to Toyzz Terms of Service.</p>
                <p className="flex items-center justify-center gap-1 font-semibold text-slate-500">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>30-Day Money Back / Exchange Guarantee</span>
                </p>
              </div>
            </div>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}
