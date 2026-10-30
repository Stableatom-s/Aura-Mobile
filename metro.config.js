const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Redirect the missing CJS reanimated sub-path to the ESM equivalent in react-native-web
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (
    platform === 'web' &&
    moduleName.includes('react-native-web/dist/cjs/exports/StyleSheet/compiler/createReactDOMStyle.js')
  ) {
    return {
      filePath: require.resolve('react-native-web/dist/exports/StyleSheet/compiler/createReactDOMStyle.js'),
      type: 'sourceFile',
    };
  }

  if (
    platform === 'web' &&
    moduleName.includes('react-native-web/dist/cjs/exports/StyleSheet/preprocess.js')
  ) {
    return {
      filePath: require.resolve('react-native-web/dist/exports/StyleSheet/preprocess.js'),
      type: 'sourceFile',
    };
  }

  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;