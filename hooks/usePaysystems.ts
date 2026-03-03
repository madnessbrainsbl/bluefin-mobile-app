import { useQuery } from "@tanstack/react-query";
import { apiUrl } from "@/constants/config";
import { useAuthStore } from "@/stores/authStore";
import { useCatalogStore, useCity } from "./useCatalogStore";

export type Paysystem = {
    id: string;
    xml_id: string;
    code: "CARD" | "CASH" | "ONLINE" | "BILL" | string;
    name: string;
    description: string;
  }

export const usePaysystems = () => {
  const { siteId } = useCity();
  const anonToken = useAuthStore((state) => state.anonToken);
  const userToken = useAuthStore((state) => state.userToken);
  const profile = useCatalogStore((state) => state.profile);
  const promocodes = useCatalogStore((state) => state.promocodes);

  const coords = profile?.coords?.join(",") ?? "";
  const promocodesJson = JSON.stringify(promocodes);

  return useQuery({
    queryKey: [
      "paysystems",
      {
        siteId,
        anonToken,
        userToken,
        coords,
        promocodes: promocodesJson,
      },
    ],
    queryFn: async () => {
      const directResponse = await fetch(apiUrl + "/orders/paysystems/", {
        method: "GET",
        headers: siteId ? { "Site-Id": siteId } : undefined,
      });

      if (directResponse.ok) {
        const resp = (await directResponse.json()) as Paysystem[];
        return resp;
      }

      // Fallback for legacy/prod API where /orders/paysystems/ is not available yet.
      // We can take the list from /cart/.
      if (directResponse.status === 404) {
        const headers: Record<string, string> = {
          "Site-Id": siteId ?? "s1",
        };

        if (userToken) {
          headers["Authorization"] = "Bearer " + userToken;
        } else {
          headers["Anonymous-Token"] = anonToken ?? "";
        }

        const params = new URLSearchParams({
          coords,
          promocodes: promocodesJson,
        });

        const cartResponse = await fetch(apiUrl + "/cart/?" + params.toString(), {
          method: "GET",
          headers,
        });

        if (!cartResponse.ok) {
          throw new Error("Failed to fetch paysystems");
        }

        const cart = (await cartResponse.json()) as { paysystems?: Paysystem[] };
        return cart.paysystems ?? [];
      }

      throw new Error("Failed to fetch paysystems");
    },
  });
};
