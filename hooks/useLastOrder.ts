import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/authStore";
import { apiUrl } from "@/constants/config";
import { Order } from "./useOrders";

export function useLastOrder() {

    return useMutation<Order | null, Error, { siteId: string; userToken: string | null }>({
        mutationKey: ["lastOrder"],
        mutationFn: async ({ siteId, userToken }) => {
            if (!userToken) return null;

            const response = await fetch(`${apiUrl}/orders/last/`, {
                method: "GET",
                headers: {
                    "User-Token": userToken,
                    "Site-Id": siteId,
                },
            });

            if (!response.ok) {
                return null;
            }

            const data = await response.json() as Order | null;
            return data;
        },
    })
}