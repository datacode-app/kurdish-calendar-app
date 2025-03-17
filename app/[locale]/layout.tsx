import type { Metadata, Viewport } from "next";
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { Noto_Kufi_Arabic, Noto_Sans_Arabic } from 'next/font/google';
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import "../globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { getFontClass } from "@/lib/utils";
import ClientProviders from "../components/ClientProviders";
import Footer from "../components/Footer";
import { cn } from "@/lib/utils";

// Configure Noto Kufi Arabic font
const notoKufi = Noto_Kufi_Arabic({
  subsets: ['arabic'],
  variable: '--font-noto-kufi',
  display: 'swap',
  adjustFontFallback: false,
  weight: ['400', '500', '700']
});

// Configure Noto Sans Arabic font
const notoSans = Noto_Sans_Arabic({
  subsets: ['arabic'],
  variable: '--font-noto-sans',
  display: 'swap',
  adjustFontFallback: false,
  weight: ['400', '500', '700']
});

// Static configuration values
const BASE_URL = "https://calendar.krd";
const STRUCTURED_DATA = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Kurdish Calendar",
  url: BASE_URL,
  description: "A comprehensive calendar of Kurdish events and holidays",
  applicationCategory: "Calendar",
  operatingSystem: "All",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  inLanguage: ["ku", "en", "ar", "fa"],
  
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "app" });
  const title = t("title");
  const description = t("description");

  return {
    metadataBase: new URL(BASE_URL),
    title: {
      default: title,
      template: `%s | ${title} - calendar.krd`,
    },
    description,
    // defaultLocale: 'ku',
    alternates: {
      canonical: "/",
      languages: {
        ku: "/ku",
        en: "/en",
        ar: "/ar",
        fa: "/fa",
      },
    },
    openGraph: {
      type: "website",
      locale,
      url: BASE_URL,
      title,
      description,
      siteName: "Kurdish Calendar - calendar.krd",
      images: [
        {
          url: `${BASE_URL}/images/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: "Kurdish Calendar",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${BASE_URL}/images/twitter-image.jpg`],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    icons: {
      icon: [
        {
          url: "/favicon/favicon-96x96.png",
          sizes: "96x96",
          type: "image/png",
        },
        { url: "/favicon/favicon.svg", type: "image/svg+xml" },
        { url: "/favicon/favicon.ico" },
      ],
      apple: [{ url: "/favicon/apple-touch-icon.png", sizes: "180x180" }],
      shortcut: [{ url: "/favicon/favicon.ico" }],
    },
    manifest: "/site.webmanifest",
    appleWebApp: {
      title: "Kurdish Calendar - calendar.krd",
      statusBarStyle: "default",
    },
    verification: {
      google: "google-site-verification-code",
    },
    keywords: [
      "Kurdish calendar",
      "Kurdish events",
      "Kurdish holidays",
      "Kurdistan",
      "Kurdish culture",
      "kurd.dev",
      "calendar.krd",
    ],
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale = 'ku' } = await params;
  const messages = await getMessages({ locale });

  return (
    <html
      lang={locale}
      dir={["ar", "ku", "fa"].includes(locale) ? "rtl" : "ltr"}
      suppressHydrationWarning
      className={cn(
        'dark',
        GeistSans.variable,
        GeistMono.variable,
        notoKufi.variable,
        notoSans.variable,
        locale === 'ku' || locale === 'ar' || locale === 'fa' ? notoKufi.className : notoSans.className
      )}
    >
      <head>
        <meta
          name="apple-mobile-web-app-title"
          content="Kurdish Calendar - calendar.krd"
        />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <link rel="canonical" href={`${BASE_URL}/${locale}`} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: STRUCTURED_DATA }}
        />
      </head>
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          locale === 'ku' || locale === 'ar' || locale === 'fa' ? 'font-notoKufi' : 'font-notoSans'
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          storageKey="theme"
        >
          <ClientProviders />
          <NextIntlClientProvider locale={locale} messages={messages}>
            <div className="relative flex min-h-screen flex-col">
              <div className="flex-1">{children}</div>
              <Footer />
            </div>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
