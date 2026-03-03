import { create } from "zustand";
import { deleteItemAsync, getItemAsync, setItemAsync } from "expo-secure-store";
import { createJSONStorage, persist } from "zustand/middleware";

type AuthStoreProps = {
  userToken: string | null;
  anonToken: string | null;
};

type AuthStoreActions = {
  // setConfig: (nextConfig: SettingsStoreState) => void
  setAnonToken: (
    nextAnonToken:
      | AuthStoreProps["anonToken"]
      | ((
          anonToken: AuthStoreProps["anonToken"],
        ) => AuthStoreProps["anonToken"]),
  ) => void;
  setUserToken: (
    nextUserToken:
      | AuthStoreProps["userToken"]
      | ((
          userToken: AuthStoreProps["userToken"],
        ) => AuthStoreProps["userToken"]),
  ) => void;
};

const expoSecureStorage = {
  setItem: async (key: string, value: string) => setItemAsync(key, value),
  getItem: async (key: string) => getItemAsync(key),
  removeItem: async (key: string) => deleteItemAsync(key),
};

export const useAuthStore = create<AuthStoreProps & AuthStoreActions>()(
  persist(
    (set) => ({
      anonToken: null,
      userToken: null,

      setAnonToken: (nextAnonToken) =>
        set((state) => ({
          anonToken:
            typeof nextAnonToken === "function"
              ? nextAnonToken(state.anonToken)
              : nextAnonToken,
        })),
      setUserToken: (nextUserToken) =>
        set((state) => ({
          userToken:
            typeof nextUserToken === "function"
              ? nextUserToken(state.userToken)
              : nextUserToken,
        })),
    }),
    {
      name: "auth",
      storage: createJSONStorage(() => expoSecureStorage),
    },
  ),
);