/** @type {import('next').NextConfig} */
const withNextIntl = require('next-intl/plugin')();

const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["geist"],
};

module.exports = withNextIntl(nextConfig); 