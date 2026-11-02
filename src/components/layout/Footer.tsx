'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, ShieldCheck, Heart, Truck, RefreshCw, PhoneCall, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      {/* Values Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 border-b border-slate-800/80">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center sm:text-left">
          <div className="flex items-center gap-4 justify-center sm:justify-start">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 flex-shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Free Express Shipping</h4>
              <p className="text-xs text-slate-400">On all prepaid orders over ₹499</p>
            </div>
          </div>

          <div className="flex items-center gap-4 justify-center sm:justify-start">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 flex-shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">100% Certified Safe</h4>
              <p className="text-xs text-slate-400">ISI certified & BPA-free toys</p>
            </div>
          </div>

          <div className="flex items-center gap-4 justify-center sm:justify-start">
            <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 flex-shrink-0">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Hassle-Free Returns</h4>
              <p className="text-xs text-slate-400">7-day replacement guarantee</p>
            </div>
          </div>

          <div className="flex items-center gap-4 justify-center sm:justify-start">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0">
              <Heart className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">50,000+ Happy Kids</h4>
              <p className="text-xs text-slate-400">Loved by parents across India</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-rose-500 flex items-center justify-center text-white">
                <Sparkles className="w-5 h-5 fill-white" />
              </div>
              <span className="text-2xl font-black text-white tracking-tight">
                Toy<span className="text-rose-500">zz</span>
              </span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Toyzz is India&apos;s premier children&apos;s toy destination designed to spark imagination, STEM learning, and playful exploration. Inspired by modern exploratory play spaces with non-toxic, certified craftsmanship.
            </p>
            <div className="flex items-center gap-3 text-xs text-slate-400 pt-2">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-amber-400" /> Bengaluru, Karnataka
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <PhoneCall className="w-4 h-4 text-emerald-400" /> 1800-TOYZZ-01
              </span>
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h5 className="text-white font-bold text-sm mb-4">Play Zones</h5>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/products?category=build" className="hover:text-amber-400 transition-colors">
                  🏗️ Build (Blocks & Tiles)
                </Link>
              </li>
              <li>
                <Link href="/products?category=play" className="hover:text-rose-400 transition-colors">
                  🎮 Play (Robots & Tracks)
                </Link>
              </li>
              <li>
                <Link href="/products?category=discover" className="hover:text-sky-400 transition-colors">
                  🔬 Discover (Lamps & Space)
                </Link>
              </li>
              <li>
                <Link href="/products?category=create" className="hover:text-purple-400 transition-colors">
                  🎨 Create (3D Pens & Art)
                </Link>
              </li>
              <li>
                <Link href="/products?category=learn" className="hover:text-emerald-400 transition-colors">
                  📚 Learn (Montessori & Sound)
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h5 className="text-white font-bold text-sm mb-4">Customer Care</h5>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/orders" className="hover:text-white transition-colors">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link href="/checkout" className="hover:text-white transition-colors">
                  Checkout & Payment
                </Link>
              </li>
              <li>
                <Link href="/account/login" className="hover:text-white transition-colors">
                  Account Sign In
                </Link>
              </li>
              <li>
                <span className="text-slate-500">Shipping & Delivery Info</span>
              </li>
              <li>
                <span className="text-slate-500">Replacement Guarantee</span>
              </li>
            </ul>
          </div>

          {/* Newsletter & Payments */}
          <div>
            <h5 className="text-white font-bold text-sm mb-3">Join the Toyzz Club</h5>
            <p className="text-xs text-slate-400 mb-3">
              Subscribe for weekly new arrivals, STEM guides, and exclusive secret coupon codes.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-2">
              <input
                type="email"
                placeholder="Enter parent's email"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs transition-colors"
              >
                Get 15% OFF Coupon
              </button>
            </form>

            <div className="pt-4">
              <p className="text-[11px] text-slate-400 mb-1.5 font-semibold">100% Secure Payments Powered By:</p>
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-300">
                <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-sky-400">UPI</span>
                <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-blue-400">Razorpay</span>
                <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-amber-400">Cards</span>
                <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-emerald-400">COD</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-10 mt-10 border-t border-slate-800 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Toyzz India Retail Pvt Ltd. All rights reserved.</p>
          <div className="flex items-center gap-6 text-[11px]">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Child Safety Standards</span>
            <Link href="/admin" className="text-slate-400 hover:text-white">Admin Portal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
