import createNextIntlPlugin from 'next-intl/plugin';
import withPWA from 'next-pwa';
import runtimeCaching from './workbox-config';

const withNextIntl = createNextIntlPlugin('./i18n.ts');

const nextConfig = withNextIntl(
  withPWA({
    dest: 'public',
    register: false,
    skipWaiting: true,
    disable: process.env.NODE_ENV === 'development',
    runtimeCaching,
    buildExcludes: [/middleware-manifest.json$/]
  })({
    /* Your other config options here */
  })
);

export default nextConfig;