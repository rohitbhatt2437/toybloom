import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import {
  getAuth,
  Auth,
  GoogleAuthProvider,
  signInWithPopup,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
};

export function isFirebaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
  );
}

// Initialize Firebase safely on client side
let app: FirebaseApp | null = null;
let auth: Auth | null = null;

export function getFirebaseAuth(): Auth | null {
  if (typeof window === 'undefined') return null;

  if (!isFirebaseConfigured()) {
    console.warn('[Firebase] Firebase environment keys are not configured yet in .env.local');
    return null;
  }

  if (!app) {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  }

  if (!auth && app) {
    auth = getAuth(app);
    auth.useDeviceLanguage();
  }

  return auth;
}

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

/**
 * 1-Click Google Sign-In / Registration
 */
export async function signInWithGoogle() {
  const authInstance = getFirebaseAuth();
  if (!authInstance) {
    throw new Error(
      'Firebase is not configured. Please add your Firebase keys in .env.local'
    );
  }

  try {
    const result = await signInWithPopup(authInstance, googleProvider);
    const idToken = await result.user.getIdToken();
    return {
      success: true,
      user: {
        uid: result.user.uid,
        name: result.user.displayName || 'Google User',
        email: result.user.email || '',
        photoURL: result.user.photoURL || '',
      },
      idToken,
    };
  } catch (error: any) {
    console.error('Google Sign-In Error:', error);
    throw new Error(error.message || 'Google Sign-In failed');
  }
}

/**
 * Initialize reCAPTCHA verifier for Phone Auth
 */
export function setupRecaptchaVerifier(
  containerId: string,
  onSolved?: () => void
): RecaptchaVerifier | null {
  const authInstance = getFirebaseAuth();
  if (!authInstance) return null;

  try {
    const verifier = new RecaptchaVerifier(authInstance, containerId, {
      size: 'invisible',
      callback: () => {
        if (onSolved) onSolved();
      },
      'expired-callback': () => {
        console.warn('reCAPTCHA expired. Please retry.');
      },
    });
    return verifier;
  } catch (err) {
    console.error('reCAPTCHA initialization error:', err);
    return null;
  }
}

/**
 * Send real 6-digit SMS OTP to Indian Mobile (+91) via Firebase Phone Auth
 */
export async function sendPhoneOtpFirebase(
  phoneNumber: string,
  verifier: RecaptchaVerifier
): Promise<ConfirmationResult> {
  const authInstance = getFirebaseAuth();
  if (!authInstance) {
    throw new Error(
      'Firebase is not configured. Please add your Firebase keys in .env.local'
    );
  }

  // Ensure +91 prefix
  let formatted = phoneNumber.trim().replace(/[\s\-]/g, '');
  if (!formatted.startsWith('+')) {
    if (formatted.startsWith('0')) formatted = formatted.slice(1);
    formatted = `+91${formatted}`;
  }

  return signInWithPhoneNumber(authInstance, formatted, verifier);
}

