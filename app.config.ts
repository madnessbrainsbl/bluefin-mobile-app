import { ExpoConfig, ConfigContext } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => {
  const iosGoogleMapsApiKey =
    process.env.GOOGLE_MAPS_IOS_API_KEY ?? config.ios?.config?.googleMapsApiKey;
  const androidGoogleMapsApiKey =
    process.env.GOOGLE_MAPS_ANDROID_API_KEY ??
    config.android?.config?.googleMaps?.apiKey;

  return {
    ...config,
    name: config.name || "Bluefin Moscow",
    slug: config.slug || "bluefin",
    plugins: [...(config.plugins || []), "expo-font", "expo-web-browser"],
    ios: {
      ...config.ios,
      bundleIdentifier: "ru.sionic.bluefinmoscow",
      config: {
        googleMapsApiKey: iosGoogleMapsApiKey,
      },
    },
    android: {
      ...config.android,
      config: {
        googleMaps: {
          apiKey: androidGoogleMapsApiKey,
        },
      },
      package: "ru.sionic.bluefin",
    },
  };
};
