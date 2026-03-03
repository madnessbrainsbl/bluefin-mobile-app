import { useEffect, useCallback } from "react";
import { OneSignal } from "react-native-onesignal";
import { useAuthStore } from "@/stores/authStore";
import { apiUrl } from "@/constants/config";
import { router } from "expo-router";
import type { NotificationData } from "@/types/notification";

/**
 * Интерфейс возвращаемых значений хука useOneSignal
 */
export interface UseOneSignalReturn {
  /** Отправить Player_ID на сервер для привязки к пользователю */
  sendPlayerIdToServer: () => Promise<void>;
  /** Отвязать Player_ID от профиля пользователя при logout */
  unlinkPlayerId: () => Promise<void>;
  /** Обработать клик по уведомлению и выполнить навигацию */
  handleNotificationClick: (data: NotificationData) => void;
  /** Отправить уведомление через сервер */
  sendNotification: (playerIds: string[], title: string, message: string, data?: Record<string, any>) => Promise<boolean>;
}

/**
 * Хук для работы с OneSignal
 * Отправляет player ID на сервер при авторизации пользователя
 * Requirements: 1.1, 1.3, 1.5
 */
export const useOneSignal = (): UseOneSignalReturn => {
  const userToken = useAuthStore((state) => state.userToken);

  /**
   * Отправляет Player_ID на сервер для привязки к профилю пользователя
   * Requirements: 1.1
   */
  const sendPlayerIdToServer = useCallback(async () => {
    if (!userToken) return;

    try {
      const playerId = await OneSignal.User.getOnesignalId();
      
      if (playerId) {
        console.log("OneSignal: Sending player ID to server:", playerId);
        
        const response = await fetch(apiUrl + "/user/onesignal/", {
          method: "POST",
          headers: {
            Authorization: "Bearer " + userToken,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            player_id: playerId,
          }),
        });

        if (response.ok) {
          console.log("OneSignal: Player ID successfully sent to server");
        } else {
          console.error("OneSignal: Failed to send player ID to server");
        }
      }
    } catch (error) {
      console.error("OneSignal: Error sending player ID:", error);
    }
  }, [userToken]);

  /**
   * Отвязывает Player_ID от профиля пользователя при logout
   * Requirements: 1.5
   */
  const unlinkPlayerId = useCallback(async () => {
    if (!userToken) return;

    try {
      const playerId = await OneSignal.User.getOnesignalId();
      
      if (playerId) {
        console.log("OneSignal: Unlinking player ID from server:", playerId);
        
        const response = await fetch(apiUrl + "/user/onesignal/unlink/", {
          method: "POST",
          headers: {
            Authorization: "Bearer " + userToken,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            player_id: playerId,
          }),
        });

        if (response.ok) {
          console.log("OneSignal: Player ID successfully unlinked from server");
        } else {
          console.error("OneSignal: Failed to unlink player ID from server");
        }
      }
    } catch (error) {
      console.error("OneSignal: Error unlinking player ID:", error);
    }
  }, [userToken]);

  /**
   * Обрабатывает клик по уведомлению и выполняет навигацию
   * Requirements: 1.3
   */
  const handleNotificationClick = useCallback((data: NotificationData) => {
    if (data.orderId) {
      console.log("OneSignal: Navigating to order:", data.orderId);
      router.push(`/profile/orders/${data.orderId}`);
    } else if (data.deepLink) {
      console.log("OneSignal: Navigating to deep link:", data.deepLink);
      router.push(data.deepLink as any);
    }
  }, []);

  // Автоматическая отправка Player_ID при авторизации
  useEffect(() => {
    if (userToken) {
      sendPlayerIdToServer();
    }
  }, [userToken, sendPlayerIdToServer]);

  /**
   * Отправляет уведомление через сервер
   */
  const sendNotification = useCallback(async (
    playerIds: string[], 
    title: string, 
    message: string, 
    data?: Record<string, any>
  ): Promise<boolean> => {
    if (!userToken) return false;

    try {
      const response = await fetch(apiUrl + "/notifications/send/", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + userToken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          player_ids: playerIds,
          title,
          message,
          data,
        }),
      });

      return response.ok;
    } catch (error) {
      console.error("OneSignal: Error sending notification:", error);
      return false;
    }
  }, [userToken]);

  return {
    sendPlayerIdToServer,
    unlinkPlayerId,
    handleNotificationClick,
    sendNotification,
  };
};

