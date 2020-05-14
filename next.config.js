const { PHASE_DEVELOPMENT_SERVER } = require('next/constants');
const withBundleAnalyzer = require('@next/bundle-analyzer');
const withSourceMaps = require('@zeit/next-source-maps')({
  devtool: 'hidden-source-map',
});
const compose = require('next-compose-plugins');

const nextConfig = {
  webpack: (config, { isServer }) => {
    console.log(isServer);
    return config;
  },
  publicRuntimeConfig: {
    API_HOST: PHASE_DEVELOPMENT_SERVER ? 'http://localhost:3888' : 'https://api-server.com',
  },
};

module.exports = compose([
  [
    withBundleAnalyzer,
    {
      enabled: process.env.ANALYZE === 'true',
    },
  ],
  [withSourceMaps, {}, ['!', PHASE_DEVELOPMENT_SERVER]],
  nextConfig,
]);
