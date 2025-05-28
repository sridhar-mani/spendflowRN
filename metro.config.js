const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');
const path = require('path');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
  transformer: {
    babelTransformerPath: path.resolve(__dirname, 'transformer.js'),
  },
  resolver: {
    assetExts: ['tflite', 'bin', 'txt', 'jpg', 'png', 'json'],
    extraNodeModules: {
      events: path.resolve(__dirname, 'node_modules/events'),
    },
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
