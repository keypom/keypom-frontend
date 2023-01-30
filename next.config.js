/* eslint-disable @typescript-eslint/no-var-requires */
const withBundleAnalyzer = require('@next/bundle-analyzer');
const withPlugins = require('next-compose-plugins');

const bundleAnalyzer = withBundleAnalyzer({ enabled: process.env.ANALYZE === 'true' });

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    appDir: true,
    // fallbackNodePolyfills: false,
  },
};

module.exports = withPlugins([bundleAnalyzer], nextConfig);
