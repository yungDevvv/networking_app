// const { i18n } = require('./next-i18next.config')
// const path = require('path');
// module.exports = {
//   reactStrictMode: true,
//   i18n,
//   pageExtensions: ['js', 'jsx', 'ts', 'tsx'],  
//   webpack: (config, { isServer }) => {
//     config.resolve.modules.push(path.resolve(__dirname, 'src'));
//     return config;
//   },
// };



const path = require('path');
const { i18n } = require('./next-i18next.config');

module.exports = {
  reactStrictMode: true,
  i18n,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // config.node = {
      //   fs: 'empty',
      // };
    }
    return config;
  },
};