import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/authStore";
import { apiUrl } from "@/constants/config";
import { UserProfile, useUserProfiles } from "./useUserProfiles";
import { useCatalogStore, useCity } from "./useCatalogStore";
import { useOsmiSync } from "./useOsmiSync";

export type User = {
  id: string;
  name: string;
  last_name: string;
  second_name: string;
  phone: string;
  email: string;
  birthday: string;
  gender: string;
  email_notify: boolean;
  phone_notify: boolean;
  lastOrderProfile: UserProfile | null;
};

export const getUserData = async (userToken: string, siteId?: string) => {
  // if (!userToken) return null;
  const headers: HeadersInit = {
    Authorization: "Bearer " + userToken,
  };

  if (siteId) {
    headers["Site-Id"] = siteId;
  }

  const response = await fetch(apiUrl + "/user/me/", {
    headers,
  });
  
  if (response.ok) {
    const resp = await response.json();
  
    return resp as User;
  } else {
    if (response.status === 401 || response.status === 403) {
      console.warn("Unauthorized");
      return null;
    } else {
      throw new Error("Failed to fetch user data");
    }
  }
};

export const useUser = () => {
  const { siteId } = useCity();
  const userToken = useAuthStore((state) => state.userToken);
  const setUserToken = useAuthStore((state) => state.setUserToken);
  const profile = useCatalogStore((state) => state.profile);
  const setProfile = useCatalogStore((state) => state.setProfile);
  const {
    useUserProfileCreateMutation: { mutateAsync: createUserProfile },
  } = useUserProfiles();
  const { mutateAsync: syncWithOsmi } = useOsmiSync();

  return useQuery({
    queryKey: ["user", "userToken:" + userToken, "siteId:" + siteId],
    queryFn: async () => {
      if (!userToken) return null;

      //TODO handle thrown error
      const user = await getUserData(userToken, siteId);

      if (!profile && user?.lastOrderProfile) {
        setProfile(user.lastOrderProfile);
      } else if (profile && !profile.id) {
        const newProfile = await createUserProfile({
          ...profile,
          token: userToken,
        });

        setProfile(newProfile);
      }
      if (!user) {
        console.warn("Unauthorized. Revoking user token.");
        setUserToken(null);
        return null;
      }

      // Синхронизация с ОСМИ при получении данных пользователя
      // Передаем имя напрямую - useOsmiSync сам обработает пустые значения как "NONAME"
      // Requirements: 5.1, 5.4
      if (user && siteId) {
        try {
          await syncWithOsmi({
            name: user.name || undefined,
            phone: user.phone,
            email: user.email || undefined,
          });
        } catch (error) {
          console.error("Failed to sync with OSMI:", error);
          // Ошибка синхронизации не блокирует работу приложения
          // Повторная попытка будет при следующем запуске
        }
      }

      return user;
    },
  });
};

export const useUserMutation = () => {
  const { refetch: refetchUser, data: userData } = useUser();
  const userToken = useAuthStore((state) => state.userToken);
  const { siteId } = useCity();
  const { mutateAsync: syncWithOsmi } = useOsmiSync();

  const setUserToken = useAuthStore((state) => state.setUserToken);
  const setAnonToken = useAuthStore((state) => state.setAnonToken);
  const setSiteId = useCatalogStore((state) => state.setSiteId);
  const setDepartmentId = useCatalogStore((state) => state.setDepartmentId);
  const setProfile = useCatalogStore((state) => state.setProfile);

  const updateUserMutation = useMutation<
    void,
    Error | { status: number; message: string | Record<string, string> },
    Partial<User>
  >({
    mutationFn: async (user: Partial<User>) => {
      if (!userToken) throw new Error("No user token");

      const formData = new FormData();
      if (user.name) formData.append("first_name", user.name);
      if (user.email) formData.append("email", user.email);
      if (user.birthday) formData.append("birthday", user.birthday);

      const response = await fetch(apiUrl + "/user/edit/", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + userToken,
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      });

      if (!response.ok) {
        if (response.status === 422) {
          const json = await response.json();

          throw {
            status: response.status,
            message: Object.entries(json.error)
              .map(([key, value]) => `${value}`)
              .join(", "), // json.error,
          };
        } else {
          throw new Error("Failed to update user");
        }
      }
    },
    onSuccess: async (_, variables) => {
      // Синхронизация с ОСМИ при обновлении имени
      // Передаем имя напрямую - useOsmiSync сам обработает пустые значения как "NONAME"
      // Requirements: 5.2
      if (variables.name && siteId && userData) {
        try {
          await syncWithOsmi({
            name: variables.name || undefined,
            phone: userData.phone,
            email: userData.email || undefined,
          });
        } catch (error) {
          console.error("Failed to sync name with OSMI:", error);
          // Ошибка синхронизации не блокирует работу приложения
        }
      }
      refetchUser();
    },
  });

  const deleteUserMutation = useMutation<
    void,
    Error | { status: number; message: string | Record<string, string> }
  >({
    mutationFn: async () => {
      if (!userToken) throw new Error("No user token");

      const response = await fetch(apiUrl + "/user/delete/", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + userToken,
          "Content-Type": "multipart/form-data",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }
    },
    onSuccess: () => {
      setSiteId(null);
      setDepartmentId(null);
      setProfile(null);
      setUserToken(null);
      setAnonToken(null);
    },
  });

  //TODO make optimistic update of notification checkboxes
  const updateNotificationFlagsMutation = useMutation<
    void,
    Error | { status: number; message: string | Record<string, string> },
    string[]
  >({
    mutationFn: async (notificationFlags: string[]) => {
      if (!userToken) throw new Error("No user token");

      const formData = new FormData();
      formData.append(
        "email_notify",
        notificationFlags.includes("email") ? "true" : "",
      );
      formData.append(
        "phone_notify",
        notificationFlags.includes("phone") ? "true" : "",
      );

      const response = await fetch(apiUrl + "/user/edit/", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + userToken,
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      });
      if (!response.ok) {
        if (response.status === 502) {
          const json = await response.json();
          throw {
            status: response.status,
            message: json.message,
          };
        } else {
          throw new Error("Failed to update user");
        }
      }
    },
    onSuccess: () => {
      refetchUser();
    },
  });
  return {
    updateUserMutation,
    deleteUserMutation,
    updateNotificationFlagsMutation,
  };
};
