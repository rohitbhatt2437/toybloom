import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import Providers from '@/components/Providers';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-sans',
  weight: '100 900',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://toyzz.in'),
  title: {
    default: 'Toyzz – India’s Ultimate Kids Toy Store | STEM, Creative & Montessori Toys',
    template: '%s | Toyzz Kids Store',
  },
  description:
    'Discover educational toys, 360° dancing robots, Montessori speech flashcards, starry night projectors, and building blocks. Safe, ISI-certified, and fast delivery across India.',
  keywords: [
    'toys for kids',
    'educational toys',
    'montessori toys india',
    '3d printing pen',
    'dancing robot toy',
    'night projector lamp',
    'baby toys online',
    'stem toys',
    'toy store india',
  ],
  authors: [{ name: 'Toyzz Retail' }],
  creator: 'Toyzz',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://toyzz.in',
    title: 'Toyzz – Explore, Play, Discover & Create',
    description:
      'India’s favorite kids wonderland for educational toys, dancing robots, and Montessori speech learning.',
    siteName: 'Toyzz',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Toyzz – India’s Favorite Kids Toy Store',
    description: 'Shop educational, safe, and fun toys with fast delivery across India.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={geistSans.variable}>
      <body className="font-sans antialiased text-slate-800 bg-[#FCFCFA] min-h-screen">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
