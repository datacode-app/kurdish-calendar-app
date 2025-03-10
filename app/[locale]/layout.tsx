import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import "../globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import PWA from "../pwa";
import { Analytics } from '@vercel/analytics/next';
import { getFontClass } from "@/lib/utils";
import { SpeedInsights } from "@vercel/speed-insights/next"
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata({ 
  params: { locale } 
}: { 
  params: { locale: string } 
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'app' });
  
  const title = t('title');
  const description = t('description');
  const baseUrl = 'https://calander.krd';
  
  return {
    title: {
      default: title,
      template: `%s | ${title} - calendar.krd`
    },
    description,
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: '/',
      languages: {
        'ku': '/ku',
        'en': '/en',
        'ar': '/ar',
        'fa': '/fa',
      },
    },
    openGraph: {
      type: 'website',
      locale,
      url: baseUrl,
      title,
      description,
      siteName: 'Kurdish Calendar - calendar.krd',
      images: [
        {
          url: `${baseUrl}/images/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: 'Kurdish Calendar'
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${baseUrl}/images/twitter-image.jpg`],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    icons: {
      icon: [
        { url: '/favicon/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
        { url: '/favicon/favicon.svg', type: 'image/svg+xml' },
        { url: '/favicon/favicon.ico' }
      ],
      apple: [
        { url: '/favicon/apple-touch-icon.png', sizes: '180x180' }
      ],
      shortcut: [{ url: '/favicon/favicon.ico' }]
    },
    manifest: '/site.webmanifest',
    appleWebApp: {
      title: 'Kurdish Calendar - calendar.krd',
      statusBarStyle: 'default'
    },
    verification: {
      google: 'google-site-verification-code', // Replace with your actual verification code
    },
    keywords: ['Kurdish calendar', 'Kurdish events', 'Kurdish holidays', 'Kurdistan', 'Kurdish culture', 'kurd.dev','calendar.krd']
  };
}

// Add viewport export to fix the warnings
export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' }
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages({ locale });

  return (
    <html lang={locale} dir={locale === 'ar' || locale === 'ku' || locale === 'fa' ? 'rtl' : 'ltr'}>
      <head>
        <meta name="apple-mobile-web-app-title" content="Kurdish Calendar - calendar.krd" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <link rel="icon" type="image/png" href="/favicon/favicon-96x96.png" sizes="96x96" />
        <link rel="icon" type="image/svg+xml" href="/favicon/favicon.svg" />
        <link rel="shortcut icon" href="/favicon/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png" />
        <link rel="canonical" href={`https://calendar.krd/${locale}`} />
        {/* Structured data for rich results */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "Kurdish Calendar",
              "url": "https://calendar.krd",
              "description": "A comprehensive calendar of Kurdish events and holidays",
              "applicationCategory": "Calendar",
              "operatingSystem": "All",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "inLanguage": ["ku","en", "ar", "fa"]
            })
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} ${getFontClass(locale)} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <PWA />
          <NextIntlClientProvider locale={locale} messages={messages}>
            {children}
            <SpeedInsights />

            <Analytics />
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
} 