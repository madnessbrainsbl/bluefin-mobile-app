import { useTranslation } from "react-i18next";
import { useCatalogStore, useDepartment } from "./useCatalogStore";
import { useQuery } from "@tanstack/react-query";
import { apiUrl } from "@/constants/config";
import { useAppSettings } from "./useAppSettings";

export type Additive = {
  id: string;
  name: string;
  price: number;
};

export type Product = {
  id: number;
  externalId: string;
  // "variation_id": 12259,
  // "key": 12259,
  name: string;
  // "slug": "kaliforniya_blyufin_s_kamchatskim_krabom_ntq0zwrkndgtm2qxos00zdzklwe4ytqtmmrinjewndcxngnm",
  price: number;
  weight: number;
  image: string;
  fullImage: string;
  short_desc: string;
  kkal: number;
  proteins: number;
  fats: number;
  carbohydrates: number;
  additives?: Additive[];
  // "type": "simple",
  // "additional_images": [],
  // options: {
  //   hot: boolean,
  //   discount: number,
  // //   "undefined": "",
  //   ing_sauces: boolean,
  //   new_product: boolean,
  //   long_cooking: boolean,
  // //   disabled_days: [],
  // //   "active_datetime": null,
  //   exclusive_product: boolean,
  // //   "prod_max_quantity": ""
  // },
  // "groupsingsProps": [],
  // "meta": {
  //   "product_title": "",
  //   "product_description": "",
  //   "product_keywords": "",
  //   "img_alt": "",
  //   "img_title": ""
  // }
};

export function useProducts() {
  const { i18n } = useTranslation();
  const department = useDepartment();
  const viewCategoryId = useCatalogStore((state) => state.viewCategoryId);
  const siteId = useCatalogStore((state) => state.siteId);

  return useQuery({
    queryKey: [
      "products",
      "locale:" + i18n.language,
      "catalogId:" + department.catalogId,
      "viewCategoryId:" + viewCategoryId,
      "siteId:" + (siteId ?? "s1"),
      "ACTIVE:true",
      "editable:true",
    ],
    queryFn: async () => {
      if (!viewCategoryId) return [];

      const params = new URLSearchParams({
        catalogId: String(department.catalogId),
        categoryId: String(viewCategoryId),
        ACTIVE: "true",
        editable: "true",
      });

      const response = await fetch(
        `${apiUrl}/catalog/products/?${params.toString()}`,
        {
          headers: { Locale: i18n.language, "Site-Id": siteId ?? "s1" },
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
