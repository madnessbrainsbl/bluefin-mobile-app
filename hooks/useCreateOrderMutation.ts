import { useMutation } from "@tanstack/react-query"
import { useAuthStore } from "@/stores/authStore";
import { useUser } from "./useUser";
import { useCatalogStore, useCity } from "./useCatalogStore";
import { apiUrl } from "@/constants/config";
import { Paysystem } from "./usePaysystems";
import { useAppsFlyer } from "./useAppsFlyer";
import { useCart } from "./useCart";

export type CreateOrderParams = {
    username: string;
    email: string;
    otherPerson?: {
        name: string;
        phone: string;
    };
    deliveryDateTime?: string;
    personNumber?: string;
    paysystem: Paysystem;
    comment: string;
    cashChange?: string;
    promocodes: string[];
    requestedBonusPayment: string;
}

export type CreateOrderResult = {
    id: number;
    isOnlinePayment: boolean;
};

export const useCreateOrderMutation = () => {
    const userToken = useAuthStore((state) => state.userToken);
    const { data: user } = useUser();
    const { siteId } = useCity();
    const profile = useCatalogStore((state) => state.profile);
    const { logPurchase } = useAppsFlyer();
    const { data: cart } = useCart();

    return useMutation<
        CreateOrderResult,
        Error | {
            status: number;
            message: string;
        },
        CreateOrderParams
    >({
        mutationKey: ["createOrder"],
        mutationFn: async ({
            username,
            email,
            otherPerson,
            deliveryDateTime,
            personNumber,
            paysystem,
            comment,
            cashChange,
            promocodes,
            requestedBonusPayment
        }) => {
            if (!userToken) throw new Error("No user token");
            if (!user) throw new Error("No user");
            if (!siteId) throw new Error("No city id");
            if (!profile) throw new Error("No profile");
            if (!profile.id) throw new Error("No profile id");

            const formData = new FormData();

            formData.append("name", username);
            formData.append("email", email);
            formData.append("phone", user.phone);

            formData.append("profileId", profile.id);
            formData.append("addressCoords", profile.coords.join(","));
            formData.append("address", profile.address);
            formData.append("flat", profile.flat ?? "");
            formData.append("entrance", profile.entrance ?? "");
            formData.append("floor", profile.floor ?? "");
            formData.append("intercomCode", profile.intercomCode ?? "");

            if (typeof otherPerson !== "undefined") {
                formData.append("receivedAnotherPerson", "Y");
                formData.append("receivedPersonName", otherPerson.name);
                // formData.append("receivedPersonPhone", unMask(otherPersonNumber));
                formData.append("receivedPersonPhone", otherPerson.phone);
            } else {
                formData.append("receivedAnotherPerson", "N");
            }

            if (typeof deliveryDateTime !== "undefined") {
                formData.append("deliverOnTime", deliveryDateTime);
            }
            
            formData.append("numberOfPersons", personNumber ?? "1");
            
            formData.append("requestedBonusPayment", requestedBonusPayment ?? "0")

            //TODO add change field
            //formData.append("changeAmount", "0");
            formData.append(
                "comment",
                paysystem.code === "CASH" && cashChange
                    ? comment + ". Сдача с " + cashChange + ". "
                    : comment,
            );

            //TODO remove hardcoded value
            formData.append("paysystemId", paysystem.id ?? "2");

            if (promocodes.length > 0) {
                promocodes.forEach((promocode) => {
                    formData.append("promocodes[]", promocode);
                });
            }

            const response = await fetch(apiUrl + "/orders/create/", {
                method: "POST",
                headers: {
                    "Authorization": "Bearer " + userToken,
                    "Site-Id": siteId,
                    "Content-Type": "multipart/form-data",
                },
                body: formData,
            });

            if (response.ok) {
                const json = (await response.json()) as CreateOrderResult;
                return json;
            } else {
                if (response.status === 400) {
                    const json = await response.json();
                    throw {
                        status: response.status,
                        message: json.error,
                    };
                } else {
                    throw new Error("Failed to create order");
                }
            }
        },
        onSuccess: (data) => {
            // Отправляем событие af_purchase в AppsFlyer
            const orderAmount = cart?.sum ?? 0;
            logPurchase(String(data.id), orderAmount, "RUB");
        }
    });
}