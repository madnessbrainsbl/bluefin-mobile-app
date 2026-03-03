import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/authStore";

// ОСМИ API Configuration
const OSMI_API_URL = process.env.EXPO_PUBLIC_OSMI_API_URL || "https://osmi6.marketingcrm.online/api/v3";
const OSMI_API_KEY = process.env.EXPO_PUBLIC_OSMI_API_KEY || "";
const OSMI_OAUTH_KEY = process.env.EXPO_PUBLIC_OSMI_OAUTH_KEY || "";

/**
 * Хук для синхронизации данных пользователя с ОСМИ
 * Передает имя и фамилию пользователя в ОСМИ
 * Если имя не указано, передает "NONAME" для обоих полей (обязательные поля в ОСМИ)
 * 
 * OSMI API credentials are read from environment variables.
 */
export const useOsmiSync = () => {
  const userToken = useAuthStore((state: { userToken: string | null }) => state.userToken);

  return useMutation<
    void,
    Error,
    { name?: string; phone: string; email?: string }
  >({
    mutationFn: async ({ name, phone, email }) => {
      if (!userToken) throw new Error("No user token");
      if (!OSMI_API_KEY) {
        console.warn("OSMI: API key not configured");
        return;
      }

      // Разделяем имя на имя и фамилию
      // Если имя не указано или пустое, используем "NONAME" для обоих полей
      const trimmedName = name?.trim();
      let firstName = "NONAME";
      let lastName = "NONAME";

      if (trimmedName) {
        const nameParts = trimmedName.split(/\s+/);
        firstName = nameParts[0] || "NONAME";
        lastName = nameParts.slice(1).join(" ") || "NONAME";
      }

      const response = await fetch(`${OSMI_API_URL}/customers/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Api-Key": OSMI_API_KEY,
          "X-Oauth-Key": OSMI_OAUTH_KEY,
        },
        body: JSON.stringify({
          phone: phone,
          first_name: firstName,
          last_name: lastName,
          email: email || undefined,
        }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || "Failed to sync with OSMI");
      }
      
      console.log("OSMI: Successfully synced user data", { 
        first_name: firstName, 
        last_name: lastName, 
        phone 
      });
    },
  });
};
