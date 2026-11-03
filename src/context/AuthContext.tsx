'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@/types';

interface RegisterParams {
  name: string;
  email?: string;
  phone?: string;
  password: string;
  verificationMethod: 'email' | 'phone';
}

interface AuthModalOptions {
  title?: string;
  subtitle?: string;
  onSuccess?: () => void;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  isAuthModalOpen: boolean;
  authModalTitle: string;
  authModalSubtitle: string;
  openAuthModal: (options?: AuthModalOptions) => void;
  closeAuthModal: () => void;
  triggerModalSuccess: () => void;
  login: (
    identifier: string,
    password: string
  ) => Promise<{
    success: boolean;
    unverified?: boolean;
    verificationMethod?: 'email' | 'phone';
    identifier?: string;
    message?: string;
  }>;
  register: (
    params: RegisterParams
  ) => Promise<{
    success: boolean;
    maskedIdentifier?: string;
    identifier?: string;
    verificationMethod?: 'email' | 'phone';
    resendAvailableAt?: number;
    deliveryWarning?: string;
    message?: string;
  }>;
  verifyOtp: (
    identifier: string,
    otp: string,
    type?: string
  ) => Promise<{
    success: boolean;
    message?: string;
    attemptsLeft?: number;
    expired?: boolean;
    attemptsExceeded?: boolean;
  }>;
  resendOtp: (
    identifier: string,
    type?: string
  ) => Promise<{
    success: boolean;
    message?: string;
    resendAvailableAt?: number;
    cooldown?: boolean;
    secondsRemaining?: number;
  }>;
  loginWithGoogle: () => Promise<{ success: boolean; message?: string }>;
  syncFirebaseUser: (params: {
    method: 'google' | 'phone';
    email?: string;
    phone?: string;
    name?: string;
  }) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Global Auth Modal State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTitle, setAuthModalTitle] = useState('Sign In to Toyzz');
  const [authModalSubtitle, setAuthModalSubtitle] = useState(
    'Continue with your Google account to explore full toy details, save favorites, and place orders.'
  );
  const [modalSuccessCallback, setModalSuccessCallback] = useState<(() => void) | null>(null);

  const openAuthModal = (options?: AuthModalOptions) => {
    setAuthModalTitle(options?.title || 'Sign In to Toyzz');
    setAuthModalSubtitle(
      options?.subtitle ||
        'Continue with your Google account to explore full toy details, save favorites, and place orders.'
    );
    setModalSuccessCallback(() => options?.onSuccess || null);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    setModalSuccessCallback(null);
  };

  const triggerModalSuccess = () => {
    if (modalSuccessCallback) {
      modalSuccessCallback();
    }
    closeAuthModal();
  };

  const refreshUser = async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (identifier: string, password: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password }),
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        return { success: true };
      }
      return {
        success: false,
        unverified: data.unverified,
        verificationMethod: data.verificationMethod,
        identifier: data.identifier,
        message: data.message || 'Login failed',
      };
    } catch {
      return { success: false, message: 'Network error. Please try again.' };
    }
  };

  const register = async (params: RegisterParams) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      const data = await res.json();
      if (data.success) {
        return {
          success: true,
          maskedIdentifier: data.maskedIdentifier,
          identifier: data.identifier,
          verificationMethod: data.verificationMethod,
          resendAvailableAt: data.resendAvailableAt,
          deliveryWarning: data.deliveryWarning,
          message: data.message,
        };
      }
      return { success: false, message: data.message || 'Registration failed' };
    } catch {
      return { success: false, message: 'Network error. Please try again.' };
    }
  };

  const verifyOtp = async (identifier: string, otp: string, type: string = 'registration') => {
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, otp, type }),
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        return { success: true, message: data.message };
      }
      return {
        success: false,
        message: data.message || 'Verification failed',
        attemptsLeft: data.attemptsLeft,
        expired: data.expired,
        attemptsExceeded: data.attemptsExceeded,
      };
    } catch {
      return { success: false, message: 'Network connection failed during verification.' };
    }
  };

  const resendOtp = async (identifier: string, type: string = 'registration') => {
    try {
      const res = await fetch('/api/auth/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, type }),
      });
      const data = await res.json();
      return {
        success: data.success,
        message: data.message,
        resendAvailableAt: data.resendAvailableAt,
        cooldown: data.cooldown,
        secondsRemaining: data.secondsRemaining,
      };
    } catch {
      return { success: false, message: 'Network error while resending code.' };
    }
  };

  const syncFirebaseUser = async (params: {
    method: 'google' | 'phone';
    email?: string;
    phone?: string;
    name?: string;
  }) => {
    try {
      const res = await fetch('/api/auth/firebase-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        return { success: true };
      }
      return { success: false, message: data.message || 'Authentication failed' };
    } catch {
      return { success: false, message: 'Network error. Please try again.' };
    }
  };

  const loginWithGoogle = async () => {
    try {
      const { signInWithGoogle } = await import('@/lib/firebase');
      const googleRes = await signInWithGoogle();
      if (googleRes.success && googleRes.user) {
        const res = await syncFirebaseUser({
          method: 'google',
          email: googleRes.user.email,
          name: googleRes.user.name,
        });
        if (res.success && isAuthModalOpen) {
          triggerModalSuccess();
        }
        return res;
      }
      return { success: false, message: 'Google sign-in was not completed.' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Google sign-in failed' };
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {
      // Ignore
    }
    setUser(null);
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAdmin,
        isAuthModalOpen,
        authModalTitle,
        authModalSubtitle,
        openAuthModal,
        closeAuthModal,
        triggerModalSuccess,
        login,
        register,
        verifyOtp,
        resendOtp,
        loginWithGoogle,
        syncFirebaseUser,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
