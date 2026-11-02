import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Sparkles, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FCFCFA]">
      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center py-20 px-4 text-center">
        <div className="w-24 h-24 rounded-3xl bg-amber-100/80 border border-amber-200 flex items-center justify-center text-amber-500 mb-6 shadow-sm">
          <Sparkles className="w-12 h-12" />
        </div>

        <span className="text-xs font-black uppercase tracking-widest text-toy-coral">
          404 - Lost in the Toy Box
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-1 mb-3">
          This toy seems to have rolled away!
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mb-8">
          The page or product you were looking for doesn&apos;t exist or might have been moved. Let&apos;s find you something wonderful instead!
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="px-6 py-3 rounded-2xl bg-toy-coral text-white font-bold text-xs flex items-center gap-2 shadow-md hover:bg-rose-600 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Homepage</span>
          </Link>
          <Link
            href="/products"
            className="px-6 py-3 rounded-2xl bg-white border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-all"
          >
            Browse All Toys
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
