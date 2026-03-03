import { createContext } from "react";
import { StoreApi } from "zustand";

// --- Типы состояния стора ---
export type CatalogStateProps = {
  siteId: string | null;
  departmentId: number | null;
  profile: any | null;
  viewCategoryId: number | null;
  promocodes: string[];
};

export type CatalogStateActions = {
  setSiteId: (id: string | null) => void;
  setDepartmentId: (id: number | null) => void;
  setProfile: (profile: any | null) => void;
  setViewCategoryId: (id: number | null) => void;
  setPromocodes: (codes: string[]) => void;
};

// Полное состояние стора
export type CatalogState = CatalogStateProps & CatalogStateActions;

// --- Контексты ---
export const CatalogStoreContext = createContext<StoreApi<CatalogState> | null>(
  null
);

export const SiteContext = createContext<{ siteId: string } | null>(null);