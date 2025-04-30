module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: ['@babel/plugin-syntax-import-meta', 'transform-import-meta'],
  env: {
    production: {
      plugins: ['react-native-paper/babel'],
    },
  },
};
