'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Sparkles, ArrowRight, ShieldCheck, Star, Award } from 'lucide-react';

export default function HeroBanner() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-amber-100/60 via-rose-50/40 to-white py-12 md:py-20 border-b border-amber-100/60">
      {/* Decorative whimsical shapes in background */}
      <div className="absolute top-10 left-8 w-64 h-64 bg-amber-300/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-rose-300/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-sky-200/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headlines & CTA */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border border-amber-200 shadow-sm text-xs font-bold text-amber-900">
              <span className="flex h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>India&apos;s Most Loved Kid-Friendly Wonder Store</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
              Where Fun Sparks{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-rose-500 to-sky-500">
                Genius Minds!
              </span>
            </h1>

            {/* Subtext */}
            <p className="text-base sm:text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Explore 360° dancing robots, astronaut starry night projectors, 3D pens, and Montessori speech toys. Handpicked for creativity, safety, and screen-free discovery.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                href="/products"
                className="px-7 py-4 rounded-2xl bg-toy-coral text-white font-black text-sm flex items-center gap-2 shadow-xl shadow-rose-500/25 hover:bg-rose-600 hover:shadow-rose-500/40 hover:-translate-y-0.5 transition-all"
              >
                <span>Shop All Toys</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/products?category=discover"
                className="px-7 py-4 rounded-2xl bg-white border border-slate-200 text-slate-800 font-bold text-sm shadow-sm hover:bg-slate-50 hover:border-slate-300 hover:-translate-y-0.5 transition-all"
              >
                Explore STEM & Galaxy
              </Link>
            </div>

            {/* Social Trust Marks */}
            <div className="pt-6 border-t border-slate-200/60 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-600">
              <div className="flex items-center gap-1.5 font-bold">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>
                <span className="text-slate-800">4.9/5 Rating</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1.5 font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>BIS & ISI Certified</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1.5 font-semibold">
                <Award className="w-4 h-4 text-sky-600" />
                <span>Non-Toxic Food Grade</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Main Visual Card */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-[4/3] bg-gradient-to-tr from-amber-200 via-rose-200 to-sky-200">
                <Image
                  src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1000&q=80"
                  alt="Toy Imagine Starry Night Projector"
                  fill
                  priority
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent flex flex-col justify-end p-6 text-white">
                  <span className="px-2.5 py-0.5 rounded-full bg-rose-500 text-white font-bold text-[10px] uppercase tracking-wider self-start mb-1">
                    Featured Wonder
                  </span>
                  <h3 className="font-extrabold text-lg text-white">
                    360° Astronaut Starry Projector
                  </h3>
                  <p className="text-xs text-slate-200">Transforms bedrooms into dream galaxies</p>
                </div>
              </div>

              {/* Floating Badge 1: Top Right */}
              <div className="absolute -top-4 -right-4 bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-lg border border-slate-100 flex items-center gap-3 animate-pulse">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-black text-sm">
                  30%
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Mega Deal</p>
                  <p className="text-xs font-black text-slate-800">Coupon: TOYZZ10</p>
                </div>
              </div>

              {/* Floating Badge 2: Bottom Left */}
              <div className="absolute -bottom-5 -left-4 bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-lg border border-slate-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-black text-slate-800">50,000+ Orders</p>
                  <p className="text-[10px] text-slate-500">Delivered Across India</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
