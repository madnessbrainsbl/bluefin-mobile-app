import { ReactNode, Suspense, useRef, useState, useEffect } from "react";
import { create, useStore } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  CatalogStoreContext,
  SiteContext,
  CatalogState,
} from "@/stores/catalogStore.context";
import { InitSite } from "./InitSite";
import LoadingScreen from "./LoadingScreen";

// Создание zustand store
function createCatalogStore() {
  return create<CatalogState>()(
    persist(
      (set) => ({
        siteId: null,
        departmentId: null,
        profile: null,
        viewCategoryId: null,
        promocodes: [],
        setSiteId: (siteId) =>
          set({ siteId, profile: null, viewCategoryId: null }),
        setDepartmentId: (departmentId) => set({ departmentId }),
        setProfile: (profile) => set({ profile }),
        setViewCategoryId: (viewCategoryId) => set({ viewCategoryId }),
        setPromocodes: (promocodes) => set({ promocodes }),
      }),
      {
        name: "catalog",
        storage: createJSONStorage(() => AsyncStorage),
      },
    ),
  );
}

export function CatalogStoreProvider({ children }: { children: ReactNode }) {
  const storeRef = useRef<ReturnType<typeof createCatalogStore>>(undefined);

  if (!storeRef.current) {
    storeRef.current = createCatalogStore();
  }

  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (storeRef.current) {
      const unsub = storeRef.current.persist.onFinishHydration(() =>
        setHydrated(true),
      );
      setHydrated(storeRef.current.persist.hasHydrated());
      return () => unsub();
    }
  }, []);

  const siteId = useStore(storeRef.current!, (s) => s.siteId);

  if (!hydrated) {
    return <LoadingScreen />;
  }

  return (
    <CatalogStoreContext.Provider value={storeRef.current!}>
      {siteId === null ? (
        <Suspense fallback={<LoadingScreen />}>
          <InitSite />
        </Suspense>
      ) : (
        <SiteContext.Provider value={{ siteId }}>
          {children}
        </SiteContext.Provider>
      )}
    </CatalogStoreContext.Provider>
  );
}
