'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/context/AuthContext';
import { Sparkles, Lock, Mail, User, Phone, ArrowRight, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, register } = useAuth();

  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      if (isRegister) {
        const res = await register(
          formData.name,
          formData.email,
          formData.password,
          formData.phone
        );
        if (res.success) {
          router.push('/products');
        } else {
          setErrorMsg(res.message || 'Failed to create account.');
        }
      } else {
        const res = await login(formData.email, formData.password);
        if (res.success) {
          if (formData.email.includes('admin')) {
            router.push('/admin');
          } else {
            router.push('/orders');
          }
        } else {
          setErrorMsg(res.message || 'Invalid email or password.');
        }
      }
    } catch {
      setErrorMsg('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAccount = (role: 'admin' | 'customer') => {
    setIsRegister(false);
    if (role === 'admin') {
      setFormData({
        name: 'Toyzz Admin',
        email: 'admin@toyzz.com',
        password: 'admin123',
        phone: '+91 98765 43210',
      });
    } else {
      setFormData({
        name: 'Priya Sharma',
        email: 'parent@toyzz.com',
        password: 'parent123',
        phone: '+91 91234 56789',
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FCFCFA]">
      <Navbar />

      <main className="max-w-md mx-auto px-4 py-16 flex-1 w-full flex flex-col justify-center">
        {/* Card */}
        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xl space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-rose-500 text-white flex items-center justify-center mx-auto shadow-md">
              <Sparkles className="w-6 h-6 fill-white" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              {isRegister ? 'Join the Toyzz Family' : 'Welcome Back!'}
            </h1>
            <p className="text-xs text-slate-500">
              {isRegister
                ? 'Create an account to track orders & save addresses'
                : 'Sign in to access your orders and toy box'}
            </p>
          </div>

          {/* Tab Selector */}
          <div className="flex bg-slate-100 p-1 rounded-2xl text-xs font-bold">
            <button
              onClick={() => {
                setIsRegister(false);
                setErrorMsg(null);
              }}
              className={`flex-1 py-2 rounded-xl transition-all ${
                !isRegister ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setIsRegister(true);
                setErrorMsg(null);
              }}
              className={`flex-1 py-2 rounded-xl transition-all ${
                isRegister ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
              }`}
            >
              Create Account
            </button>
          </div>

          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Parent / Customer Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Priya Sharma"
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-toy-coral/30"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="parent@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-toy-coral/30"
                />
              </div>
            </div>

            {isRegister && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Mobile Number (Optional)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-toy-coral/30"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-toy-coral/30"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-toy-coral text-white font-black text-xs shadow-lg shadow-rose-500/25 hover:bg-rose-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>{loading ? 'Authenticating...' : isRegister ? 'Create Account' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Credentials helper */}
          <div className="pt-4 border-t border-slate-100 text-center space-y-2">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Quick Test Credentials:
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => fillDemoAccount('customer')}
                className="flex-1 py-1.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-[11px] font-bold text-slate-700 transition-colors"
              >
                Customer Login
              </button>
              <button
                type="button"
                onClick={() => fillDemoAccount('admin')}
                className="flex-1 py-1.5 px-3 rounded-xl bg-amber-100 hover:bg-amber-200 text-[11px] font-bold text-amber-900 transition-colors"
              >
                Admin Login
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
