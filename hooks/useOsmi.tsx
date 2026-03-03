import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/authStore";
import { useCity } from "./useCatalogStore";
import { apiUrl } from "@/constants/config";
import { useCart } from "./useCart";

export type OSMIProfile = {
  cardNumber: string;
  bonusBalance: number;
  loyaltyLevel: number | null;
};

export const useOsmiProfile = () => {
  const userToken = useAuthStore((state) => state.userToken);

  return useQuery({
    queryKey: ["osmi_profile", "userToken:" + userToken],
    queryFn: async () => {
      if (!userToken) return null;
      const response = await fetch(apiUrl + "/osmi/profile/", {
        method: "GET",
        headers: {
          Authorization: "Bearer " + userToken,
        },
      });

      if (response.ok) {
        const resp = (await response.json()) as OSMIProfile;
        return resp;
      } else {
        throw new Error("Failed to fetch osmi profile");
      }
    },
  });
};

export function useOsmiEstimation() {
  const userToken = useAuthStore((state) => state.userToken);
  const { siteId } = useCity();

  return useMutation<
    number,
    Error,
    { requestedBonusPayment: number; paysystemId: string; promocodes: string[] }
  >({
    mutationKey: ["osmi_estimation", "userToken:" + userToken],
    mutationFn: async ({ requestedBonusPayment, paysystemId, promocodes }) => {
      const formData = new FormData();

      formData.append("requestedBonusPayment", String(requestedBonusPayment));
      formData.append("paysystemId", String(paysystemId));
      formData.append("promocodes", JSON.stringify(promocodes));
      
      const response = await fetch(apiUrl + "/osmi/estimate/", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: "Bearer " + userToken,
          "Site-Id": siteId,
        },
      });

      if (response.ok) {
        const resp = await response.json();
        return Number(resp.bonusSum);
      } else {
        console.error("Failed to fetch osmi estimation");
        throw new Error("Failed to fetch osmi estimation");
      }
    },
  });
}
