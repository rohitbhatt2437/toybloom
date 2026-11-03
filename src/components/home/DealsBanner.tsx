'use client';

import React from 'react';
import Link from 'next/link';
import { Tag, Sparkles, Clock, CheckCircle } from 'lucide-react';

export default function DealsBanner() {
  return (
    <section className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-8 sm:p-12 shadow-xl border border-indigo-900/40">
        {/* Glow orb */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-rose-400" />
              <span>Limited Time Offer</span>
            </div>

            <h3 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Safety Certified & Curated Toys for Growing Minds
            </h3>

            <p className="text-sm text-slate-300 max-w-xl">
              From screen-free Montessori speech cards to robotic engineering sets, our collection is curated for developmental fun and certified non-toxic durability.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-4 py-2.5">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span className="text-xs text-slate-300 font-medium">100% Verified Physical Store Stock</span>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-300">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>Same-Day Packing & Direct Dispatch</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col items-center lg:items-end justify-center">
            <Link
              href="/products?sortBy=featured"
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-400 to-rose-500 text-slate-950 font-black text-sm shadow-xl hover:from-amber-300 hover:to-rose-400 hover:scale-105 transition-all text-center w-full sm:w-auto"
            >
              Claim Special Deals Now
            </Link>
            <p className="text-[11px] text-slate-400 mt-2 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Valid while stocks last</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

