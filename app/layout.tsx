import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { register } from './serviceWorkerRegistration';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://calendar.krd'),
  title: {
    default: 'Kurdish Calendar - Events and Holidays',
    template: '%s | Kurdish Calendar'
  },
  description: 'A comprehensive calendar of Kurdish events, holidays, and cultural celebrations. Stay updated with important dates in Kurdish culture.',
  keywords: [
    // English keywords
    'Kurdish calendar', 'Kurdish holidays', 'Kurdish events', 'Kurdish culture', 'Kurdish festivals',
    // Kurdish keywords
    'ڕۆژژمێری کوردی', 'جەژنەکانی کوردی', 'ڕووداوەکانی کوردی', 'کەلتووری کوردی', 'جەژنەکانی کورد',
    'ڕۆژژمێری جەژنەکان', 'ڕۆژژمێری ڕووداوەکان', 'جەژنی نەورۆز', 'جەژنی ڕێزگاری', 'جەژنی قوربان',
    'ڕۆژژمێری کوردی ٢٠٢٤', 'جەژنەکانی کوردی ٢٠٢٤', 'ڕووداوەکانی کوردی ٢٠٢٤',
    // Regional variations
    'ڕۆژژمێری کوردستانی باشوور', 'ڕۆژژمێری کوردستانی رۆژھەڵات',
    'ڕۆژژمێری کوردستانی باکوور', 'ڕۆژژمێری کوردستانی رۆژاوا',
    // Cultural terms
    'کەلتووری کوردی', 'مێژووی کوردی', 'نەریتەکانی کوردی', 'ڕێزگاری کوردی',
    // Event types
    'جەژنە نەریتییەکان', 'جەژنە ئاینییەکان', 'جەژنە نیشتمانییەکان',
    // Time-related
    'ڕۆژژمێری شمسی', 'ڕۆژژمێری جەلالی', 'ڕۆژژمێری کوردی بە شمسی',
    // Additional relevant terms
    'کوردستان', 'کورد', 'کەلتوور', 'جەژن', 'ڕووداو', 'ڕۆژژمێر',
    // Persian keywords (since some users might search in Persian)
    'تقویم کردی', 'جشن‌های کردی', 'رویدادهای کردی', 'فرهنگ کردی',
    // Arabic keywords
    'التقويم الكردي', 'أعياد كردية', 'أحداث كردية', 'ثقافة كردية'
  ],
  authors: [{ name: 'DataCode' }],
  creator: 'DataCode',
  publisher: 'DataCode',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://calendar.krd',
    siteName: 'Kurdish Calendar',
    title: 'Kurdish Calendar - Events and Holidays',
    description: 'A comprehensive calendar of Kurdish events, holidays, and cultural celebrations.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Kurdish Calendar',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kurdish Calendar - Events and Holidays',
    description: 'A comprehensive calendar of Kurdish events, holidays, and cultural celebrations.',
    images: ['/og-image.jpg'],
    creator: '@datacode',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-site-verification',
  },
  alternates: {
    canonical: 'https://calendar.krd',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Register service worker
  if (typeof window !== 'undefined') {
    register();
  }

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
