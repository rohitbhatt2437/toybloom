'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import {
  ShoppingBag,
  Search,
  User as UserIcon,
  Sparkles,
  Menu,
  X,
  Package,
  ShieldCheck,
  Truck,
  ChevronDown,
  LogOut,
  SlidersHorizontal,
} from 'lucide-react';

export default function Navbar() {
  const router = useRouter();
  const { totalItems, openCart } = useCart();
  const { user, isAdmin, logout } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  const categories = [
    { name: 'Build', slug: 'build', color: 'text-amber-600 hover:bg-amber-50' },
    { name: 'Play', slug: 'play', color: 'text-rose-600 hover:bg-rose-50' },
    { name: 'Discover', slug: 'discover', color: 'text-sky-600 hover:bg-sky-50' },
    { name: 'Create', slug: 'create', color: 'text-purple-600 hover:bg-purple-50' },
    { name: 'Learn', slug: 'learn', color: 'text-emerald-600 hover:bg-emerald-50' },
  ];

  const ageGroups = ['0-2 Years', '3-5 Years', '6-8 Years', '9+ Years'];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm">
      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-amber-500 via-rose-500 to-sky-500 text-white text-xs py-1.5 px-4 font-semibold text-center tracking-wide flex items-center justify-center gap-4">
        <span className="flex items-center gap-1.5">
          <Truck className="w-3.5 h-3.5" /> FREE Shipping above ₹499
        </span>
        <span className="hidden sm:inline">•</span>
        <span className="hidden sm:flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5" /> 100% Non-Toxic & ISI Certified Toys
        </span>
        <span className="hidden md:inline">•</span>
        <span className="hidden md:inline">Use code <strong className="underline underline-offset-2">TOYZZ10</strong> for 10% OFF</span>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Logo & Mobile Menu Toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400 via-rose-500 to-sky-500 flex items-center justify-center text-white shadow-md shadow-rose-500/20 group-hover:scale-105 transition-transform">
                <Sparkles className="w-6 h-6 fill-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black tracking-tight text-slate-900 group-hover:text-toy-coral transition-colors flex items-center">
                  Toy<span className="text-toy-coral">zz</span>
                  <span className="text-xs bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded-full ml-1.5 uppercase">
                    Kids
                  </span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 -mt-1">
                  Play • Learn • Grow
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Search Bar */}
          <div className="hidden lg:flex flex-1 max-w-lg mx-6">
            <form onSubmit={handleSearch} className="relative w-full">
              <input
                type="text"
                placeholder="Search toys by name, STEM kits, age, or brand..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-24 py-2.5 rounded-full bg-slate-50 border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-toy-coral/20 focus:border-toy-coral transition-all"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 px-4 py-1.5 rounded-full bg-slate-900 text-white text-xs font-semibold hover:bg-toy-coral transition-colors"
              >
                Search
              </button>
            </form>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-3">
            <Link
              href="/orders"
              className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-toy-coral px-3 py-2 rounded-xl hover:bg-slate-50 transition-colors"
            >
              <Package className="w-4 h-4 text-slate-500" />
              <span>Track Orders</span>
            </Link>

            {/* User Dropdown */}
            <div className="relative">
              {user ? (
                <div>
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 p-1.5 pr-3 rounded-full bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-full bg-toy-coral text-white font-bold text-xs flex items-center justify-center">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-xs font-semibold text-slate-700 max-w-[80px] truncate hidden md:inline">
                      {user.name.split(' ')[0]}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {userDropdownOpen && (
                    <div
                      className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 text-xs font-semibold animate-in fade-in"
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="font-bold text-slate-800">{user.name}</p>
                        <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                      </div>

                      {isAdmin && (
                        <Link
                          href="/admin"
                          className="flex items-center gap-2 px-4 py-2.5 text-amber-600 hover:bg-amber-50"
                        >
                          <SlidersHorizontal className="w-4 h-4" />
                          <span>Admin Dashboard</span>
                        </Link>
                      )}

                      <Link
                        href="/orders"
                        className="flex items-center gap-2 px-4 py-2.5 text-slate-700 hover:bg-slate-50"
                      >
                        <Package className="w-4 h-4" />
                        <span>My Order History</span>
                      </Link>

                      <button
                        onClick={logout}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-rose-600 hover:bg-rose-50 text-left border-t border-slate-100"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/account/login"
                  className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-toy-coral px-3 py-2 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  <UserIcon className="w-4 h-4" />
                  <span className="hidden sm:inline">Sign In</span>
                </Link>
              )}
            </div>

            {/* Cart Button */}
            <button
              onClick={openCart}
              className="relative flex items-center gap-2 px-4 py-2.5 rounded-full bg-amber-400/90 hover:bg-amber-400 text-slate-900 font-bold text-xs shadow-sm hover:shadow transition-all"
              aria-label="View Shopping Cart"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Cart</span>
              {totalItems > 0 && (
                <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[11px] font-black flex items-center justify-center animate-pulse">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Category & Age Quick Filter Bar (Desktop) */}
        <div className="hidden lg:flex items-center justify-between py-2.5 border-t border-slate-100/80 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px] mr-1">
              Play Zones:
            </span>
            {categories.map((c) => (
              <Link
                key={c.slug}
                href={`/products?category=${c.slug}`}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all ${c.color}`}
              >
                {c.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px] mr-1">
              Shop By Age:
            </span>
            {ageGroups.map((age) => (
              <Link
                key={age}
                href={`/products?ageGroup=${encodeURIComponent(age)}`}
                className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 font-semibold transition-colors"
              >
                {age}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-200 px-4 py-5 space-y-4 animate-in slide-in-from-top">
          {/* Mobile Search */}
          <form onSubmit={handleSearch} className="relative w-full">
            <input
              type="text"
              placeholder="Search toys..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-20 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold"
            >
              Search
            </button>
          </form>

          {/* Categories */}
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Explore Play Zones
            </p>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((c) => (
                <Link
                  key={c.slug}
                  href={`/products?category=${c.slug}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold border border-slate-100 ${c.color}`}
                >
                  {c.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Ages */}
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Shop By Age Group
            </p>
            <div className="flex flex-wrap gap-2">
              {ageGroups.map((age) => (
                <Link
                  key={age}
                  href={`/products?ageGroup=${encodeURIComponent(age)}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold"
                >
                  {age}
                </Link>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2 text-xs font-semibold">
            <Link
              href="/orders"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 py-2 text-slate-700"
            >
              <Package className="w-4 h-4 text-slate-500" />
              Track Your Order
            </Link>
            {isAdmin && (
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 py-2 text-amber-600 font-bold"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Admin Dashboard
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
