import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n.ts');

const nextConfig = withNextIntl({
  /* config options here */
});

export default nextConfig;
