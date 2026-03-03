import { apiUrl } from "@/constants/config";
import { useCity } from "@/hooks/useCatalogStore";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import WebView from "react-native-webview";

export default function Page() {
  const { page } = useLocalSearchParams();
  const { siteId } = useCity();
  const { i18n } = useTranslation();
  const [key, setKey] = useState(0);
  const pageSlug = Array.isArray(page) ? page[0] : page;
  const rawContentUrl = process.env.EXPO_PUBLIC_CONTENT_URL;
  const apiOrigin = (() => {
    try {
      return new URL(apiUrl).origin;
    } catch {
      return apiUrl;
    }
  })();
  const contentBaseUrl = rawContentUrl?.startsWith("http")
    ? rawContentUrl.replace(/\/$/, "")
    : `${apiOrigin}/content`;
  const normalizedLocale = (() => {
    const language = i18n.language ?? "ru-RU";
    const lower = language.toLowerCase();
    if (lower.startsWith("ru")) return "ru-RU";
    if (lower.startsWith("en")) return "en-US";
    return language;
  })();

  useFocusEffect(
    useCallback(() => {
      setKey((k) => k + 1);
    }, [page]),
  );

  return (
    <WebView
      key={key}
      source={{
        uri: `${contentBaseUrl}/${siteId}/${normalizedLocale}/${pageSlug ?? ""}/`,
      }}
    />
  );
}
