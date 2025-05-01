const metroTransformer = require('metro-react-native-babel-transformer');

module.exports.transform = function ({src, filename, options}) {
  // Replace import.meta with a safe alternative
  if (src.includes('import.meta')) {
    src = src.replace(/import\.meta/g, '({})');
  }

  return metroTransformer.transform({src, filename, options});
};
