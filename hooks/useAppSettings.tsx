import { apiUrl } from "@/constants/config";
import { useSuspenseQuery } from "@tanstack/react-query";
// import { City } from "./useCitites";
// import { Department } from "./useDepartment";

// export type DeliveryZone = {
//   color: string;
//   price: string;
//   coords: [number, number][];
//   editable: boolean;
//   delivery_time: string;
//   departmentId: number;
// };

export type City = {
  id: number;
  siteId: string;
  name: string;
  mapCenter: [number, number];
  mapZoom: number;
  kladr: string;
  defaultDepartmentId: number;
  zones: DeliveryZone[];
};

export type DepartmentCity = {
  id: number;
  siteId: string | null;
  name: string | null;
  mapCenter: [number, number];
  mapZoom: number | null;
  kladr: string | null;
};

export type DeliveryZone = {
  color: string;
  price: string;
  delivery_price: string;
  coords: [number, number][];
  // editable: boolean;
  // delivery_time: string;
  departmentId: number;
};

export type WorkHours = {
  days: string;
  time: string;
};

export type Department = {
  id: number;
  name: string | null;
  siteId: number | null;
  catalogId: number | null;
  city: DepartmentCity | null;
  zones: DeliveryZone[] | null;
  phone: string | null;
  email: string | null;
  workHours: WorkHours[] | null;
  address: string | null;
  description: string | null;
  vkLink: string | null;
  tgLink: string | null;
};

export type AppSettings = {
  minApiVersion: number;
  defaultSiteId: string;
  defaultDepartmentId: number;
  cities: Record<string, City>;
  departments: Record<string, Department>;
};

export function useAppSettings() {
  return useSuspenseQuery({
    queryKey: ["settings"],
    queryFn: async () => {
      const response = await fetch(apiUrl + "/settings/");
      if (response.ok) {
        return (await response.json()) as AppSettings;
      } else {
        throw new Error("Failed to fetch api config data");
      }
    },
  });
}
