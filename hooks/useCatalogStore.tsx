import { useStore } from "zustand";
import { useContext } from "react";
import { useAppSettings } from "./useAppSettings";
import {
  CatalogState,
  CatalogStoreContext,
  SiteContext,
} from "@/stores/catalogStore.context";

export function useCatalogStore<T>(selector: (state: CatalogState) => T): T {
  const store = useContext(CatalogStoreContext);
  if (!store) throw new Error("out of CatalogStoreContext");
  return useStore(store, selector);
}

export function useCity() {
  const context = useContext(SiteContext);
  if (!context) throw new Error("out of SiteContext");

  const siteId = context.siteId;
  const {
    data: { cities },
  } = useAppSettings();

  if (!cities[siteId]) {
    throw new Error("city not found: " + siteId);
  }

  return cities[siteId];
}

export function useDepartment() {
  const { departmentId } = useCatalogStore((state) => state);
  const siteContext = useContext(SiteContext);
  const {
    data: { departments, cities, defaultDepartmentId },
  } = useAppSettings();

  const selectedDepartment = departments[String(departmentId)];
  if (selectedDepartment) return selectedDepartment;

  const siteId = siteContext?.siteId;
  const cityDefaultDepartmentId = siteId
    ? cities?.[siteId]?.defaultDepartmentId
    : undefined;
  const cityDefaultDepartment =
    cityDefaultDepartmentId !== undefined
      ? departments[String(cityDefaultDepartmentId)]
      : undefined;
  if (cityDefaultDepartment) return cityDefaultDepartment;

  const globalDefaultDepartment =
    defaultDepartmentId !== undefined
      ? departments[String(defaultDepartmentId)]
      : undefined;
  if (globalDefaultDepartment) return globalDefaultDepartment;

  return departments["26"];
}
