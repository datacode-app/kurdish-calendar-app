"use client";

import dynamic from "next/dynamic";

// Dynamic imports for client-side only components.
const PWA = dynamic(() => import("../pwa"), { ssr: false });
const Analytics = dynamic(
  () => import("@vercel/analytics/next").then((mod) => mod.Analytics),
  { ssr: false }
);
const SpeedInsights = dynamic(
  () => import("@vercel/speed-insights/next").then((mod) => mod.SpeedInsights),
  { ssr: false }
);

export default function ClientProviders() {
  return (
    <>
      <PWA />
      {process.env.NODE_ENV === "production" && (
        <>
          <SpeedInsights />
          <Analytics />
        </>
      )}
    </>
  );
}
