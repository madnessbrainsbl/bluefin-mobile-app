import { apiUrl } from "@/constants/config";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Href } from "expo-router";
import { useTranslation } from "react-i18next";
import { useCity } from "./useCatalogStore";

export type MenuItem = {
  name: string;
  type: "internal" | "external";
  link: Href;
  image: string;
  sub: MenuItem[];
};

export type MenuStore = {
  main: MenuItem[];
};

export function useMenues() {
  const { i18n } = useTranslation();
  const { siteId } = useCity();
  const normalizedLocale = (() => {
    const language = i18n.language ?? "ru-RU";
    const lower = language.toLowerCase();
    if (lower.startsWith("ru")) return "ru-RU";
    if (lower.startsWith("en")) return "en-US";
    return language;
  })();

  const menuesLocale = (() => {
    if (normalizedLocale === "en-US") return "ru-RU";
    return normalizedLocale;
  })();

  return useSuspenseQuery({
    queryKey: ["menues", "locale:" + menuesLocale, "siteId:" + siteId],

    queryFn: async () => {
      const url = apiUrl + "/content/menues/";
      const response = await fetch(url, {
        headers: { Locale: menuesLocale, "Site-Id": siteId },
      });

      if (response.ok) {
        const resp = await response.json();
        return resp as MenuStore;
      }

      if (menuesLocale !== "ru-RU") {
        const fallbackResponse = await fetch(url, {
          headers: { Locale: "ru-RU", "Site-Id": siteId },
        });
        if (fallbackResponse.ok) {
          const resp = await fallbackResponse.json();
          return resp as MenuStore;
        }
      }

      throw new Error("Failed to fetch menu data");
    },
  });
}
