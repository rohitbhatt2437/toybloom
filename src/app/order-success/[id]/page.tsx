'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Order } from '@/types';
import confetti from 'canvas-confetti';
import {
  CheckCircle,
  Truck,
  MapPin,
  ArrowRight,
} from 'lucide-react';

export default function OrderSuccessPage() {
  const params = useParams();
  const orderId = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Shoot festive colorful confetti
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#F59E0B', '#F43F5E', '#0EA5E9', '#10B981', '#8B5CF6'],
      });
    } catch {
      // Ignore if confetti fails
    }

    async function fetchOrder() {
      try {
        const res = await fetch(`/api/orders/${orderId}`);
        const data = await res.json();
        if (data.success) {
          setOrder(data.order);
        }
      } catch (err) {
        console.error('Error fetching order', err);
      } finally {
        setLoading(false);
      }
    }

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FCFCFA]">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full">
        {loading ? (
          <div className="text-center py-20 space-y-3">
            <div className="w-12 h-12 border-4 border-toy-coral border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm font-bold text-slate-700">Retrieving your order confirmation...</p>
          </div>
        ) : !order ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm space-y-4">
            <h2 className="text-2xl font-bold text-slate-800">Order Placed Successfully!</h2>
            <p className="text-sm text-slate-500">
              Your order ID is <strong>{orderId}</strong>. A confirmation has been registered.
            </p>
            <Link
              href="/orders"
              className="inline-block px-6 py-2.5 rounded-full bg-toy-coral text-white font-bold text-xs"
            >
              Go to Order History
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Success Hero Header */}
            <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-100 shadow-sm text-center relative overflow-hidden">
              <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 shadow-sm">
                <CheckCircle className="w-10 h-10" />
              </div>

              <span className="text-xs font-black uppercase tracking-widest text-emerald-600">
                Payment & Order Verified
              </span>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-1">
                Thank You for Ordering! 🎉
              </h1>
              <p className="text-sm text-slate-600 mt-2 max-w-lg mx-auto">
                We&apos;re preparing your toys with extra care and excitement. An SMS confirmation will be sent shortly to{' '}
                <strong className="text-slate-900">{order.customer.phone}</strong>.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-6 text-xs font-bold">
                <div className="px-4 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-slate-700">
                  Order Number: <strong className="text-slate-900">{order.orderNumber}</strong>
                </div>
                <div className="px-4 py-2 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900">
                  Estimated Delivery: <strong>{order.estimatedDelivery || 'In 2-4 Days'}</strong>
                </div>
                <div className="px-4 py-2 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800">
                  Payment: <strong className="uppercase">{order.paymentInfo.method} ({order.paymentInfo.status})</strong>
                </div>
              </div>
            </div>

            {/* Tracking Timeline */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-4">
              <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Truck className="w-5 h-5 text-toy-coral" />
                <span>Live Order Progress</span>
              </h2>

              <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {order.statusTimeline.map((step, idx) => (
                  <div key={idx} className="relative flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center absolute -left-6 ring-4 ring-white">
                      <CheckCircle className="w-3.5 h-3.5" />
                    </span>
                    <div>
                      <p className="text-xs font-black uppercase tracking-wider text-slate-900">
                        {step.status.replace(/_/g, ' ')}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">{step.comment}</p>
                      <span className="text-[10px] text-slate-400">
                        {new Date(step.timestamp).toLocaleString('en-IN', {
                          dateStyle: 'medium',
                          timeStyle: 'short',
                        })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Ordered Toys List & Shipping Info */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Items Card */}
              <div className="md:col-span-7 bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
                <h3 className="font-black text-slate-900 text-sm">Toys in this Order</h3>
                <div className="space-y-3 divide-y divide-slate-100">
                  {order.items.map((item, i) => (
                    <div key={i} className="pt-3 first:pt-0 flex items-center gap-4">
                      <div className="relative w-16 h-16 rounded-2xl bg-slate-50 overflow-hidden flex-shrink-0 border border-slate-100">
                        <Image src={item.image} alt={item.title} fill className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-900 line-clamp-1">{item.title}</p>
                        <p className="text-[11px] text-slate-400">Qty: {item.quantity}</p>
                      </div>
                      <span className="text-xs font-black text-slate-900">
                        ₹{item.price * item.quantity}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold text-slate-800">₹{order.pricing.subtotal}</span>
                  </div>
                  {order.pricing.discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-semibold">
                      <span>Discount</span>
                      <span>-₹{order.pricing.discountAmount}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>{order.pricing.shippingFee === 0 ? 'FREE' : `₹${order.pricing.shippingFee}`}</span>
                  </div>
                  <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-100">
                    <span>Total Paid</span>
                    <span className="text-toy-rose">₹{order.pricing.total}</span>
                  </div>
                </div>
              </div>

              {/* Delivery Address Card */}
              <div className="md:col-span-5 bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
                <h3 className="font-black text-slate-900 text-sm flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-toy-coral" />
                  <span>Delivery Address</span>
                </h3>
                <div className="text-xs text-slate-600 space-y-1">
                  <p className="font-bold text-slate-900">{order.shippingAddress.fullName}</p>
                  <p>{order.shippingAddress.street}</p>
                  <p>
                    {order.shippingAddress.city}, {order.shippingAddress.state} -{' '}
                    {order.shippingAddress.pincode}
                  </p>
                  {order.shippingAddress.landmark && (
                    <p className="text-slate-400">Landmark: {order.shippingAddress.landmark}</p>
                  )}
                  <p className="pt-2 font-semibold text-slate-800">
                    Phone: {order.shippingAddress.phone}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <Link
                    href="/products"
                    className="w-full py-3 px-4 rounded-2xl bg-toy-coral text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md hover:bg-rose-600 transition-colors"
                  >
                    <span>Continue Exploring Toys</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
