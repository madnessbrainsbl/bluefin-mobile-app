import { apiUrl } from "@/constants/config";
import { useQuery } from "@tanstack/react-query";
import { Suggestion } from "./useSuggestions";
import { useTranslation } from "react-i18next";

export function useSuggestionsByCoords(coords: [number, number] | undefined) {
    const { i18n } = useTranslation();

    return useQuery({
        queryKey: ["coords", "locale:" + i18n.language, "coords:" + coords],
        queryFn: async () => {
            if (!coords) {
                return [];
            }

            const response = await fetch(apiUrl + "/profiles/geolocate/?lat=" + coords[0] + "&lng=" + coords[1], {
                headers: { "Locale": i18n.language },
            });
            if (response.ok) {
                const resp = await response.json();
                return resp as Suggestion[];
            } else {
                throw new Error("Failed to fetch geo data");
            }
        },
    });
}