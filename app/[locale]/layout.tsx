import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import "../globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import PWA from "../pwa";

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
  
  return {
    title: t('title'),
    description: t('description'),
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
      title: 'Kurdish calendar',
      statusBarStyle: 'default'
    },
    themeColor: [
      { media: '(prefers-color-scheme: light)', color: 'white' },
      { media: '(prefers-color-scheme: dark)', color: '#0f172a' }
    ],
    viewport: {
      width: 'device-width',
      initialScale: 1,
      maximumScale: 1,
      userScalable: false
    }
  };
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  let messages;
  try {
    messages = (await import(`../../public/locales/${locale}/common.json`)).default;
  } catch {
    // Fallback to English if the locale doesn't exist
    messages = (await import(`../../public/locales/en/common.json`)).default;
  }

  // Set the direction based on the locale
  const isRtl = locale === 'ar' || locale === 'ku' || locale === 'fa';
  const dir = isRtl ? 'rtl' : 'ltr';

  return (
    <html lang={locale} dir={dir} suppressHydrationWarning>
      <head>
        <meta name="apple-mobile-web-app-title" content="Kurdish calendar" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <link rel="icon" type="image/png" href="/favicon/favicon-96x96.png" sizes="96x96" />
        <link rel="icon" type="image/svg+xml" href="/favicon/favicon.svg" />
        <link rel="shortcut icon" href="/favicon/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <PWA />
          <NextIntlClientProvider locale={locale} messages={messages}>
            {children}
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
} 