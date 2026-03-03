import { useQuery } from "@tanstack/react-query";
import { apiUrl } from "@/constants/config";
import { useCity } from "./useCatalogStore";

export type Banner = {
  id: number;
  title?: string;
  image: string;
  link?: string;
  position: "top" | "bottom" | "home" | "cart" | "profile";
  order: number;
  active: boolean;
};

export const useBanners = (position?: Banner["position"]) => {
  const { siteId } = useCity();

  return useQuery({
    queryKey: [
      "banners",
      "siteId:" + siteId,
      "position:" + position,
      "ACTIVE:true",
      "editable:true",
    ],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (siteId) params.append("siteId", siteId);
      if (position) params.append("position", position);
      params.append("ACTIVE", "true");
      params.append("editable", "true");

      const url = apiUrl + "/banners/?" + params.toString();
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Site-Id": siteId || "s1",
        },
      });

      if (response.ok) {
        const data = await response.json();
        const banners: Banner[] = data.banners || [];
        return banners;
      }

      // Fallback for legacy/prod API where /banners/ is not available yet.
      // We can derive home banners from /content/slider/.
      if (response.status === 404) {
        if (position && position !== "home") {
          return [];
        }

        const sliderResponse = await fetch(apiUrl + "/content/slider/", {
          method: "GET",
          headers: {
            "Site-Id": siteId || "s1",
          },
        });

        if (!sliderResponse.ok) {
          throw new Error("Failed to fetch banners");
        }

        const slides = (await sliderResponse.json()) as Array<{
          image: string;
          link?: string;
        }>;

        return slides.map((slide, index) => ({
          id: index,
          title: "",
          image: slide.image,
          link: slide.link,
          position: "home",
          order: index,
          active: true,
        }));
      }

      throw new Error("Failed to fetch banners");
    },
    enabled: !!siteId,
  });
};
