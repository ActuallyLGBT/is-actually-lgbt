const withTypescript = require('@zeit/next-typescript');
const withCSS = require('@zeit/next-css');

module.exports = withTypescript(
  withCSS({
    cssModules: true,
    cssLoaderOptions: {
      importLoaders: 1,
      localIdentName: '[local]___[hash:base64:5]'
    },
    webpack(config, _) {
      config.module.rules.push({
        test: /\.md$/,
        use: 'raw-loader'
      });

      return config;
    }
  })
);
