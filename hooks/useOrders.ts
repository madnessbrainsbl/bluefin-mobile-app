import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/authStore";
import { apiUrl } from "@/constants/config";
import { CartItem } from "./useCart";
import { useCatalogStore, useCity } from "./useCatalogStore";
import { UserProfile } from "./useUserProfiles";

export type Order = {
  id: string;
  number: string;
  dateCreated: {
    date: string;
    timezoneType: number;
    timezone: string;
  };
  dateUpdated: {
    date: string;
    timezoneType: number;
    timezone: string;
  };
  isPaid: boolean;
  isOnlinePayment: boolean;
  name: string;
  email: string;
  phone: string;
  comment: string;
  receivedAnotherPerson: boolean; //"N",
  receivedPersonName: string | null;
  receivedPersonPhone: string | null;
  deliverOnTime: string | null;
  numberOfPersons: string;
  paySystemId: string;
  bonusSpent: number;
  bonusSum: number;
  cart: {
    items: CartItem[];
    deliveryPrice: number;
    sum: number;
    originalSum: number;
    promocodes: string[];
  };
  profile: UserProfile;
};

export const useOrders = () => {
  const userToken = useAuthStore((state) => state.userToken);
    const { siteId } = useCity();

  return useQuery({
    queryKey: ["orders", "userToken:" + userToken, "siteId:" + siteId],
    queryFn: async () => {
      if (!userToken) return [];
      const response = await fetch(apiUrl + "/orders/", {
        method: "GET",
        headers: {
          "Authorization": "Bearer " + userToken,
          "Site-Id": siteId,
        },
      });
      if (response.ok) {
        const resp = (await response.json()) as Order[];
        return resp;
      } else {
        throw new Error("Failed to fetch orders data");
      }
    },
  });
};
