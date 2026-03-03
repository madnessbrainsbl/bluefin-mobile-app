import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/authStore";
import { apiUrl } from "@/constants/config";
import { useCity } from "./useCatalogStore";

// Aiko API Configuration
const AIKO_API_KEY = process.env.EXPO_PUBLIC_AIKO_API_KEY || "";

export type AikoCardProfile = {
  cardNumber: string;
  balance: number;
  points: number;
  level?: string;
  status?: string;
};

export type AikoCardTransaction = {
  id: string;
  date: string;
  type: "accrual" | "writeoff";
  amount: number;
  description: string;
};

/**
 * Хук для получения профиля карты лояльности АйкоКард
 * Использует API Aiko (iikoCard) для получения данных карты лояльности
 */
export const useAikoCardProfile = () => {
  const userToken = useAuthStore((state) => state.userToken);
  const { siteId } = useCity();

  return useQuery({
    queryKey: ["aiko_card_profile", "userToken:" + userToken, "siteId:" + siteId],
    queryFn: async () => {
      if (!userToken) return null;

      const response = await fetch(apiUrl + "/aiko/card/profile/", {
        method: "GET",
        headers: {
          Authorization: "Bearer " + userToken,
          "Site-Id": siteId || "",
          "X-Aiko-Api-Key": AIKO_API_KEY,
        },
      });

      if (response.ok) {
        const resp = await response.json();
        return resp as AikoCardProfile;
      } else {
        throw new Error("Failed to fetch AikoCard profile");
      }
    },
    enabled: !!userToken && !!siteId,
  });
};

/**
 * Хук для получения истории транзакций АйкоКард
 */
export const useAikoCardTransactions = () => {
  const userToken = useAuthStore((state) => state.userToken);
  const { siteId } = useCity();

  return useQuery({
    queryKey: ["aiko_card_transactions", "userToken:" + userToken, "siteId:" + siteId],
    queryFn: async () => {
      if (!userToken) return null;

      const response = await fetch(apiUrl + "/aiko/card/transactions/", {
        method: "GET",
        headers: {
          Authorization: "Bearer " + userToken,
          "Site-Id": siteId || "",
          "X-Aiko-Api-Key": AIKO_API_KEY,
        },
      });

      if (response.ok) {
        const resp = await response.json();
        return (resp.transactions || resp) as AikoCardTransaction[];
      } else {
        throw new Error("Failed to fetch AikoCard transactions");
      }
    },
    enabled: !!userToken && !!siteId,
  });
};

/**
 * Хук для привязки карты АйкоКард
 */
export const useAikoCardLink = () => {
  const userToken = useAuthStore((state) => state.userToken);
  const { siteId } = useCity();

  return useMutation<
    AikoCardProfile,
    Error,
    { cardNumber: string; phone?: string }
  >({
    mutationFn: async ({ cardNumber, phone }) => {
      if (!userToken) throw new Error("No user token");

      const formData = new FormData();
      formData.append("cardNumber", cardNumber);
      if (phone) formData.append("phone", phone);

      const response = await fetch(apiUrl + "/aiko/card/link/", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + userToken,
          "Site-Id": siteId || "",
          "X-Aiko-Api-Key": AIKO_API_KEY,
        },
        body: formData,
      });

      if (response.ok) {
        const resp = await response.json();
        return resp as AikoCardProfile;
      } else {
        const error = await response.json();
        throw new Error(error.message || "Failed to link AikoCard");
      }
    },
  });
};
