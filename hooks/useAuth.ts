import { apiUrl } from "@/constants/config";
import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/authStore";
import { useCatalogStore } from "./useCatalogStore";
import { useOneSignal } from "./useOneSignal";

export const getAnonToken = async () => {
  const response = await fetch(apiUrl + "/auth/anontoken/");
  if (response.ok) {
    const token = (await response.json()).token as string;
    return token;
  } else {
    throw new Error("Failed to fetch anon token");
  }
};

export const useAuth = () => {
  const userToken = useAuthStore((state) => state.userToken);
  const setUserToken = useAuthStore((state) => state.setUserToken);
  const setProfile = useCatalogStore((state) => state.setProfile);
  const { unlinkPlayerId } = useOneSignal();

  const sendCodeRequestMutation = useMutation<
    void,
    Error | { status: number; message: string },
    string
  >({
    mutationFn: async (phone: string) => {
      const formData = new FormData();
      formData.append("phone", phone);

      const response = await fetch(apiUrl + "/auth/sendsms/", {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      });

      if (!response.ok) {
        if (response.status === 502) {
          const json = await response.json();
          throw {
            status: response.status,
            message: json.error,
          };
        } else {
          throw new Error("Failed to send phone");
        }
      }
    },
  });

  const sendCodeMutation = useMutation<
    string,
    Error | { status: number; message: string },
    { siteId: string; phone: string; code: string; token: string }
  >({
    mutationFn: async ({ siteId, phone, code, token }) => {
      const formData = new FormData();
      formData.append("phone", phone);
      formData.append("code", code);
     
      const response = await fetch(apiUrl + "/auth/checkcode/", {
        method: "POST",
        headers: {
          "Anonymous-Token": token,
          "Site-Id": siteId,
        },
        body: formData,
      });
      
 
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          return result.token;
        } else {
          console.error({
            status: response.status,
            message: result.error,
          })
          throw {
            status: 400,
            message: result.error,
          };
        }
      } else {
        if (response.status === 400) {
          const json = await response.json();
          console.error({
            status: response.status,
            message: json.error,
          })
          throw {
            status: response.status,
            message: json.error,
          };
        } else {
          const json = await response.json();

          console.error({
            status: response.status,
            message: json.error,
          })
          throw new Error("Failed to send phone");
        }
      }
    },
  });

  const logoutMutation = useMutation<
    void,
    Error | { status: number; message: string }
  >({
    mutationFn: async () => {
      if (!userToken) return;

      // Отвязываем Player_ID от профиля пользователя перед logout
      // Requirements: 1.5
      await unlinkPlayerId();

      const response = await fetch(apiUrl + "/auth/logout/", {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: "Bearer " + userToken,
        },
      });

      if (!response.ok) {
        if (response.status === 502) {
          const json = await response.json();
          throw {
            status: response.status,
            message: json.error,
          };
        } else {
          throw new Error("Failed to log out");
        }
      }
    },
    onSuccess: () => {
      setUserToken(null);
      setProfile(null);
    },
  });

  return {
    sendCodeRequestMutation,
    sendCodeMutation,
    logoutMutation,
  };
};
