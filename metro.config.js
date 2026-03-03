const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require('nativewind/metro');
const path = require("path");

const config = getDefaultConfig(__dirname, {
  isCSSEnabled: true,
})

config.resolver.nodeModulesPaths = [path.resolve(__dirname, "node_modules")];

// Заглушки для native-only модулей на web платформе
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (platform === 'web') {
    // react-native-maps не поддерживает web
    if (
      moduleName === 'react-native-maps' || 
      moduleName.startsWith('react-native-maps/') ||
      // Блокируем native-only модули React Native
      moduleName.includes('codegenNativeCommands') ||
      moduleName.includes('codegenNativeComponent')
    ) {
      return {
        type: 'empty',
      };
    }
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = withNativeWind(config, { input: './global.css' })