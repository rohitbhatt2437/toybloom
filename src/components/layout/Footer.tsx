'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, ShieldCheck, Truck, RefreshCw, PhoneCall, MapPin, Store } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      {/* Values Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 border-b border-slate-800/80">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center sm:text-left">
          <div className="flex items-center gap-4 justify-center sm:justify-start">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 flex-shrink-0">
              <Store className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Real Store Inventory</h4>
              <p className="text-xs text-slate-400">Direct from our operating toy shop</p>
            </div>
          </div>

          <div className="flex items-center gap-4 justify-center sm:justify-start">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 flex-shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Quality Inspected</h4>
              <p className="text-xs text-slate-400">Child-safe & non-toxic toys</p>
            </div>
          </div>

          <div className="flex items-center gap-4 justify-center sm:justify-start">
            <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 flex-shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Prompt Dispatch</h4>
              <p className="text-xs text-slate-400">Packed securely for shipping</p>
            </div>
          </div>

          <div className="flex items-center gap-4 justify-center sm:justify-start">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Store Support</h4>
              <p className="text-xs text-slate-400">Assistance for parents & gifts</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
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
              Official online storefront for our toy store. Browse actual in-stock educational toys, electronic robots, Montessori aids, and creative drawing tools.
            </p>
            <div className="flex flex-col gap-1.5 text-xs text-slate-400 pt-2">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>Store Address: [Pending Owner Address Input]</span>
              </span>
              <span className="flex items-center gap-1.5">
                <PhoneCall className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Phone / WhatsApp: [Pending Owner Phone Input]</span>
              </span>
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h5 className="text-white font-bold text-sm mb-4">Store Sections</h5>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/products?category=play" className="hover:text-rose-400 transition-colors">
                  🎮 Play (Robots & Tracks)
                </Link>
              </li>
              <li>
                <Link href="/products?category=discover" className="hover:text-sky-400 transition-colors">
                  🔬 Discover (Lamps & Starry Lights)
                </Link>
              </li>
              <li>
                <Link href="/products?category=create" className="hover:text-purple-400 transition-colors">
                  🎨 Create (3D Pens & Drawing Boards)
                </Link>
              </li>
              <li>
                <Link href="/products?category=learn" className="hover:text-emerald-400 transition-colors">
                  📚 Learn (Montessori & Flashcards)
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service & Admin */}
          <div>
            <h5 className="text-white font-bold text-sm mb-4">Customer Care & Store Management</h5>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/orders" className="hover:text-white transition-colors">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link href="/account/login" className="hover:text-white transition-colors">
                  Customer Sign In
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-amber-400 hover:text-amber-300 font-bold transition-colors">
                  Admin Inventory & Price Approval
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-10 mt-10 border-t border-slate-800 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Toy Store. All rights reserved.</p>
          <div className="flex items-center gap-6 text-[11px]">
            <Link href="/admin" className="text-slate-400 hover:text-white">Admin Portal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
