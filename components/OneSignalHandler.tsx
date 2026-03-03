import { useEffect } from "react";
import { OneSignal } from "react-native-onesignal";
import { useOneSignal } from "@/hooks/useOneSignal";
import type { NotificationClickEvent, NotificationForegroundEvent } from "@/types/notification";

/**
 * Компонент для обработки событий OneSignal
 * Должен быть размещен внутри AuthProvider для доступа к useOneSignal
 * Requirements: 1.3
 */
export const OneSignalHandler = () => {
  const { handleNotificationClick } = useOneSignal();

  useEffect(() => {
    // Обработчик клика по уведомлению
    const handleClick = (event: NotificationClickEvent) => {
      console.log("OneSignal: notification clicked", event);
      const additionalData = event.notification?.additionalData;
      if (additionalData) {
        handleNotificationClick(additionalData);
      }
    };

    // Обработчик получения уведомления в foreground
    const handleForeground = (event: NotificationForegroundEvent) => {
      console.log("OneSignal: notification received in foreground", event);
    };

    OneSignal.Notifications.addEventListener("click", handleClick as any);
    OneSignal.Notifications.addEventListener("foregroundWillDisplay", handleForeground as any);

    return () => {
      OneSignal.Notifications.removeEventListener("click", handleClick as any);
      OneSignal.Notifications.removeEventListener("foregroundWillDisplay", handleForeground as any);
    };
  }, [handleNotificationClick]);

  return null;
};
