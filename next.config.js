const { i18n } = require('./next-i18next.config')

module.exports = {
  reactStrictMode: true,
  i18n,
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],  
  webpack: (config, { isServer }) => {
    config.resolve.modules.push(__dirname + '/src');
    
    return config;
  },
};

