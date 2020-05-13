const { PHASE_DEVELOPMENT_SERVER } = require('next/constants');
const withBundleAnalyzer = require('@next/bundle-analyzer');
const withSourceMaps = require('@zeit/next-source-maps')({
  devtool: 'hidden-source-map',
});

/**
 * next config compose
 * @param {array} plugins
 */
const compose = plugins => ({
  webpack(config, options) {
    return plugins.reduce((config, plugin) => {
      if (plugin instanceof Array) {
        const [_plugin, ...args] = plugin;
        plugin = _plugin(...args);
      }
      if (plugin instanceof Function) {
        plugin = plugin();
      }
      if (plugin && plugin.webpack instanceof Function) {
        return plugin.webpack(config, options);
      }
      return config;
    }, config);
  },

  webpackDevMiddleware(config) {
    return plugins.reduce((config, plugin) => {
      if (plugin instanceof Array) {
        const [_plugin, ...args] = plugin;
        plugin = _plugin(...args);
      }
      if (plugin instanceof Function) {
        plugin = plugin();
      }
      if (plugin && plugin.webpackDevMiddleware instanceof Function) {
        return plugin.webpackDevMiddleware(config);
      }
      return config;
    }, config);
  },
});

module.exports = (phase, { defaultConfig }) =>
  compose([
    [
      withBundleAnalyzer,
      {
        enabled: process.env.ANALYZE === 'true',
      },
    ],
    [withSourceMaps],
    {
      webpack: (config, { isServer }) => {
        console.log(isServer);
        return config;
      },
      env:
        phase === PHASE_DEVELOPMENT_SERVER
          ? {
              API_HOST: 'http://localhost:3000',
            }
          : {
              API_HOST: 'https://api-server.com',
            },
    },
  ]);
