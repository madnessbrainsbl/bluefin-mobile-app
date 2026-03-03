import { getAnonToken } from "@/hooks/useAuth";
import { useAuthHydration } from "@/hooks/useAuthHydration";
import { useAuthStore } from "@/stores/authStore";
import { getUserData, User } from "@/hooks/useUser";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getItemAsync } from "expo-secure-store";
import { ReactNode, useEffect } from "react";
import { useOneSignal } from "@/hooks/useOneSignal";
import { useAppsFlyer } from "@/hooks/useAppsFlyer";

export function AuthProvider({ children }: { children: ReactNode }) {
  useAuthHydration();
  
  // Инициализируем OneSignal для отправки player ID на сервер
  useOneSignal();
  
  // Инициализируем AppsFlyer
  const { setUserId } = useAppsFlyer();

  const anonToken = useAuthStore((state) => state.anonToken);
  const setAnonToken = useAuthStore((state) => state.setAnonToken);
  const userToken = useAuthStore((state) => state.userToken);
  const setUserToken = useAuthStore((state) => state.setUserToken);

  const {
    data: { user, anonToken: newAnonToken },
  } = useSuspenseQuery({
    queryKey: ["auth", "anonToken:" + anonToken, "userToken:" + userToken],
    queryFn: async () => {
      let user: User | null = null;
      let newAnonToken: string | null = null;

      if (userToken) {
        user = await getUserData(userToken);
      }

      if (user === null && !anonToken) {
        newAnonToken = await getAnonToken();
      }

      return { user, anonToken: newAnonToken ?? anonToken };
    },
  });

  useEffect(() => {
    if (!user) {
      setUserToken(null);
    }
    if (newAnonToken) {
      setAnonToken(newAnonToken);
    }
  }, [user, newAnonToken, setUserToken, setAnonToken]);

  // Устанавливаем Customer User ID в AppsFlyer при авторизации
  useEffect(() => {
    if (user && user.id) {
      setUserId(user.id);
    } else if (user && user.phone) {
      // Если id отсутствует, используем телефон как идентификатор
      setUserId(user.phone);
    }
  }, [user, setUserId]);

  return children;
}
