const { getDefaultConfig } = require('expo/metro-config');

module.exports = (() => {
  const config = getDefaultConfig(__dirname);

  const { transformer, resolver } = config;

  config.transformer = {
    ...transformer,
    babelTransformerPath: require.resolve('react-native-svg-transformer/expo'),
  };
  config.resolver = {
    ...resolver,
    assetExts: [...resolver.assetExts.filter((ext) => ext !== 'svg'), 'db'], // Add 'db' to assetExts
    sourceExts: [...resolver.sourceExts, 'svg'],
  };

  return config;
})();
