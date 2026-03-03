import { useMutation } from "@tanstack/react-query";
import { apiUrl } from "@/constants/config";
import { useTranslation } from "react-i18next";
import { Product } from "./useProducts";
import { useDepartment } from "./useCatalogStore";

export function useSearch() {
  const { i18n } = useTranslation();
  const department = useDepartment();

  return useMutation<Product[], Error, { q: string }>({
    mutationKey: ["search"],
    mutationFn: async ({ q }) => {
      if (q.length < 3) return [];
      const response = await fetch(
        `${apiUrl}/catalog/search/?catalogId=${department.catalogId}&q=${q}`,
        {
          headers: { lng: i18n.language },
        },
      );

      if (response.ok) {
        const resp = await response.json();
        return resp as Product[];
      } else {
        throw new Error("Failed to fetch products data");
      }
    },
  });
}