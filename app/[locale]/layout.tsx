import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import "../globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { getFontClass } from "@/lib/utils";
import ClientProviders from "../components/ClientProviders";

// Configure fonts
const geistSans = Geist({
  weight: "variable",
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
  preload: true,
});
const geistMono = Geist_Mono({
  weight: "variable",
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
  preload: true,
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
  params:Promise <{ locale: string }>;
}) {
  const { locale='ku' } = await params;
  const messages = await getMessages({ locale });

  return (
    <html
      lang={locale}
      dir={["ar", "ku", "fa"].includes(locale) ? "rtl" : "ltr"}
      suppressHydrationWarning
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
        className={`${geistSans.variable} ${geistMono.variable} ${getFontClass(
          locale
        )} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ClientProviders />
          <NextIntlClientProvider locale={locale} messages={messages}>
            {children}
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
