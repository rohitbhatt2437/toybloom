'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  LayoutDashboard,
  ShoppingBag,
  LogOut,
  ArrowLeft,
  ShieldAlert,
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, isAdmin, logout } = useAuth();
  const router = useRouter();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white text-xs">
        Verifying administrator credentials...
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4 text-center">
        <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mb-4">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h1 className="text-xl font-bold text-slate-800 mb-2">Admin Access Required</h1>
        <p className="text-xs text-slate-500 max-w-sm mb-6">
          You need an administrator account to view the Toyzz backend console.
        </p>
        <Link
          href="/account/login"
          className="px-6 py-2.5 rounded-full bg-slate-900 text-white font-bold text-xs hover:bg-slate-800"
        >
          Sign In as Admin
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full lg:w-64 bg-slate-900 text-slate-300 p-6 flex flex-col justify-between border-r border-slate-800 flex-shrink-0">
        <div className="space-y-8">
          {/* Brand header */}
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-400 to-rose-500 flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4 fill-white" />
              </div>
              <span className="text-xl font-black text-white tracking-tight">
                Toy<span className="text-toy-coral">zz</span>{' '}
                <span className="text-[10px] bg-amber-500/20 text-amber-400 font-bold px-1.5 py-0.5 rounded-md ml-1">
                  ADMIN
                </span>
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5 text-xs font-semibold">
            <Link
              href="/admin"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl bg-white/10 text-white shadow-sm"
            >
              <LayoutDashboard className="w-4 h-4 text-amber-400" />
              <span>Dashboard & Inventory</span>
            </Link>

            <Link
              href="/products"
              target="_blank"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <ShoppingBag className="w-4 h-4 text-sky-400" />
              <span>Live Storefront ↗</span>
            </Link>
          </nav>
        </div>

        {/* User info & Signout */}
        <div className="pt-6 border-t border-slate-800 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-amber-500/20 text-amber-400 font-bold text-xs flex items-center justify-center border border-amber-500/30">
              AD
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-white truncate">{user?.name}</p>
              <p className="text-[10px] text-slate-500 truncate">{user?.email}</p>
            </div>
          </div>

          <div className="flex gap-2">
            <Link
              href="/"
              className="flex-1 py-2 rounded-xl bg-slate-800 text-center text-[11px] font-bold text-slate-300 hover:text-white transition-colors flex items-center justify-center gap-1.5"
            >
              <ArrowLeft className="w-3 h-3" />
              <span>Store</span>
            </Link>
            <button
              onClick={async () => {
                await logout();
                router.push('/');
              }}
              className="px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-[11px] font-bold transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Viewport */}
      <main className="flex-1 p-6 sm:p-10 overflow-y-auto">{children}</main>
    </div>
  );
}
