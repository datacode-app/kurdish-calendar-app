/* eslint-disable @typescript-eslint/no-explicit-any */
import createNextIntlPlugin from "next-intl/plugin";
import withPWA from "next-pwa";

const withNextIntl = createNextIntlPlugin("./i18n.ts");

// Combine the PWA plugin with the next-intl plugin
const nextConfig = withPWA({
  dest: "public",
  register: false, // We're handling registration in our PWA component
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
})(withNextIntl({
  /* Your other config options here */
}) as any) as any;

export default nextConfig;
