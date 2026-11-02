'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/context/AuthContext';
import { Order, OrderStatus } from '@/types';
import {
  Search,
  Truck,
  ChevronRight,
  ShoppingBag,
} from 'lucide-react';

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchOrderNumber, setSearchOrderNumber] = useState('');
  const [searchedOrder, setSearchedOrder] = useState<Order | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch('/api/orders');
        const data = await res.json();
        if (data.success) {
          setOrders(data.orders);
        }
      } catch (err) {
        console.error('Failed to fetch orders:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchOrderNumber.trim()) return;
    setSearchError(null);
    setSearchedOrder(null);

    try {
      const res = await fetch(`/api/orders/${searchOrderNumber.trim()}`);
      const data = await res.json();
      if (data.success && data.order) {
        setSearchedOrder(data.order);
      } else {
        setSearchError('No order found with that Order Number.');
      }
    } catch {
      setSearchError('Error looking up order. Please verify the order number.');
    }
  };

  const statusColorMap: Record<OrderStatus, { bg: string; text: string }> = {
    pending: { bg: 'bg-amber-100', text: 'text-amber-800' },
    confirmed: { bg: 'bg-blue-100', text: 'text-blue-800' },
    processing: { bg: 'bg-purple-100', text: 'text-purple-800' },
    shipped: { bg: 'bg-indigo-100', text: 'text-indigo-800' },
    out_for_delivery: { bg: 'bg-emerald-100', text: 'text-emerald-800' },
    delivered: { bg: 'bg-emerald-500', text: 'text-white' },
    cancelled: { bg: 'bg-rose-100', text: 'text-rose-800' },
    returned: { bg: 'bg-slate-200', text: 'text-slate-700' },
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FCFCFA]">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full space-y-8">
        {/* Header */}
        <div>
          <span className="text-xs font-black uppercase tracking-widest text-toy-coral">
            Order Status & History
          </span>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-1">
            Track Your Toy Delivery
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Enter your order number or check your recent purchases below.
          </p>
        </div>

        {/* Quick Order Lookup Form */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
          <form onSubmit={handleLookup} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Enter Order Number (e.g. TYZ-2026-90412)"
                value={searchOrderNumber}
                onChange={(e) => setSearchOrderNumber(e.target.value.toUpperCase())}
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-toy-coral/30 uppercase"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 rounded-2xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors shadow-sm"
            >
              Track Order
            </button>
          </form>

          {searchError && (
            <p className="text-xs text-rose-500 font-semibold mt-2">{searchError}</p>
          )}

          {/* Searched Single Order Card */}
          {searchedOrder && (
            <div className="mt-6 pt-6 border-t border-slate-100 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">
                    Order Found
                  </span>
                  <h3 className="text-lg font-black text-slate-900">
                    {searchedOrder.orderNumber}
                  </h3>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    statusColorMap[searchedOrder.orderStatus]?.bg || 'bg-slate-100'
                  } ${statusColorMap[searchedOrder.orderStatus]?.text || 'text-slate-700'}`}
                >
                  {searchedOrder.orderStatus.replace(/_/g, ' ')}
                </span>
              </div>

              {/* Progress timeline */}
              <div className="bg-slate-50 rounded-2xl p-4 space-y-3">
                <p className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-toy-coral" />
                  <span>Tracking Timeline (Courier Code: {searchedOrder.trackingNumber || 'Pending'})</span>
                </p>
                <div className="space-y-2">
                  {searchedOrder.statusTimeline.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1 flex-shrink-0" />
                      <div>
                        <span className="font-bold text-slate-800 capitalize">
                          {step.status.replace(/_/g, ' ')}:
                        </span>{' '}
                        <span className="text-slate-600">{step.comment}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User's Orders List */}
        <div>
          <h2 className="text-xl font-black text-slate-900 mb-4">
            Recent Purchases {orders.length > 0 && `(${orders.length})`}
          </h2>

          {loading ? (
            <div className="text-center py-12">
              <div className="w-8 h-8 border-3 border-toy-coral border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <p className="text-xs text-slate-500">Loading orders...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 text-center border border-slate-100 shadow-sm space-y-3">
              <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center text-amber-500 mx-auto mb-2">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-base text-slate-800">No orders placed yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Sign in or browse our catalog of creative toys, robots, and learning kits.
              </p>
              <div className="pt-2 flex justify-center gap-3">
                <Link
                  href="/products"
                  className="px-5 py-2.5 rounded-full bg-toy-coral text-white font-bold text-xs"
                >
                  Explore Catalog
                </Link>
                {!user && (
                  <Link
                    href="/account/login"
                    className="px-5 py-2.5 rounded-full bg-slate-100 text-slate-700 font-bold text-xs"
                  >
                    Sign In
                  </Link>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((ord) => (
                <div
                  key={ord._id}
                  className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow space-y-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400">Order Placed</span>
                      <p className="text-xs font-bold text-slate-800">
                        {new Date(ord.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </p>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-slate-400">Order ID</span>
                      <p className="text-xs font-mono font-bold text-slate-800">{ord.orderNumber}</p>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-slate-400">Total</span>
                      <p className="text-xs font-black text-toy-coral">₹{ord.pricing.total}</p>
                    </div>

                    <div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                          statusColorMap[ord.orderStatus]?.bg || 'bg-slate-100'
                        } ${statusColorMap[ord.orderStatus]?.text || 'text-slate-700'}`}
                      >
                        {ord.orderStatus.replace(/_/g, ' ')}
                      </span>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {ord.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-xl bg-slate-50 overflow-hidden flex-shrink-0 border border-slate-100">
                          <Image src={item.image} alt={item.title} fill className="object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <Link
                            href={`/products/${item.slug}`}
                            className="text-xs font-bold text-slate-800 hover:text-toy-coral truncate block"
                          >
                            {item.title}
                          </Link>
                          <p className="text-[11px] text-slate-400">Qty: {item.quantity} • ₹{item.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Footer status link */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">
                      Estimated Delivery: <strong className="text-slate-800">{ord.estimatedDelivery || 'In 2-4 days'}</strong>
                    </span>
                    <Link
                      href={`/order-success/${ord._id}`}
                      className="font-bold text-toy-coral hover:underline flex items-center gap-1"
                    >
                      <span>View Receipt & Timeline</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
