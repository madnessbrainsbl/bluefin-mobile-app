const nativewind = require("react-native-css-interop/babel");

module.exports = function (api) {
  api.cache(true);
  const nativewindConfig = nativewind();
  const nativewindPlugins = (nativewindConfig.plugins || []).filter(
    (plugin) => {
      if (typeof plugin === "string") {
        return plugin !== "react-native-worklets/plugin";
      }
      if (Array.isArray(plugin)) {
        return plugin[0] !== "react-native-worklets/plugin";
      }
      return true;
    },
  );
  return {
    presets: [
      [
        "babel-preset-expo",
        {
          jsxImportSource: "nativewind",
          unstable_transformImportMeta: true,
        },
      ],
    ],

    plugins: [
      [
        "module-resolver",
        {
          root: ["./"],
          alias: {
            "@": "./",
          },
        },
      ],
      ...nativewindPlugins,
      "react-native-reanimated/plugin",
    ],
  };
};
