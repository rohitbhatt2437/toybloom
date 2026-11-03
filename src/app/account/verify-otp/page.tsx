'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function VerifyOtpRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/account/login');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FCFCFA] text-slate-500 text-xs">
      Redirecting to Google Sign-In...
    </div>
  );
}
