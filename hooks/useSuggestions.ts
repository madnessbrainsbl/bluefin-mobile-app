import { apiUrl } from "@/constants/config";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/authStore";
import { useTranslation } from "react-i18next";
import { useCatalogStore, useCity } from "./useCatalogStore";

export type Suggestion = {
    value: string,
    profile: {
        city: string,
        street: string,
        street_fias_id: string,
        house: string,
        house_fias_id: string
        house_only: string,
        flat: string,
        block: string,
        metro: string,
        coords: [number, number]
    }
}

export function useSuggestions(address: string) {
    const { i18n } = useTranslation();

    const { siteId } = useCity();

    return useQuery({
        queryKey: ["address", "locale:" + i18n.language, "siteId:" + siteId, "address:" + address],
        queryFn: async () => {
            const response = await fetch(apiUrl + "/profiles/suggestaddress/?query=" + address, {
                headers: { "Locale": i18n.language, "Site-Id": siteId },
            });
            if (response.ok) {
                const resp = await response.json();
                return resp as Suggestion[];
            } else {
                throw new Error("Failed to fetch address suggestions");
            }
        },
    });
}