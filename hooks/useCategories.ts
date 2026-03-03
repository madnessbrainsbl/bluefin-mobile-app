// import { create } from 'zustand'

import { apiUrl } from "@/constants/config";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useCatalogStore, useDepartment } from "./useCatalogStore";
import { useAppSettings } from "./useAppSettings";

export type Category = {
  id: number;
  sort: number;
  slug: string;
  path: string;
  name: string;
  image: string;
  text: string;
  meta: {
    title: string | null;
    description: string | null;
    keywords: string | null;
  };
  sub: Category[];
};

export function useCategories() {
  const { i18n } = useTranslation();
  const department = useDepartment();
  const catalogId = department?.catalogId ?? 8;
  const siteId = useCatalogStore((state) => state.siteId);

  return useSuspenseQuery({
    queryKey: [
      "categories",
      "locale:" + i18n.language,
      "catalogId:" + catalogId,
      "siteId:" + (siteId ?? "s1"),
    ],
    queryFn: async () => {
      const response = await fetch(
        apiUrl + "/catalog/categories/?catalogId=" + catalogId,
        {
          headers: { Locale: i18n.language, "Site-Id": siteId ?? "s1" },
        },
      );
      if (response.ok) {
        const resp = await response.json();

        return resp as Category[];
      } else {
        throw new Error("Failed to fetch categories data");
      }
    },
  });
}
