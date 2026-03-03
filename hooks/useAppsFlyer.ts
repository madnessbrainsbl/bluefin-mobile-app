import { useEffect } from "react";
import { Platform } from "react-native";
// @ts-ignore - react-native-appsflyer может не иметь типов
import appsFlyer from "react-native-appsflyer";
import { useAuthStore } from "@/stores/authStore";

/**
 * Стандартные события AppsFlyer
 */
export const AF_EVENTS = {
  PURCHASE: "af_purchase",
  ADD_TO_CART: "af_add_to_cart",
  LOGIN: "af_login",
  COMPLETE_REGISTRATION: "af_complete_registration",
} as const;

/**
 * Хук для работы с AppsFlyer
 * Инициализирует AppsFlyer и отслеживает события
 */
export const useAppsFlyer = () => {
  const userToken = useAuthStore((state) => state.userToken);

  useEffect(() => {
    // Инициализация AppsFlyer
    const initAppsFlyer = async () => {
      try {
        const appsFlyerDevKey = process.env.EXPO_PUBLIC_APPSFLYER_DEV_KEY;
        const appsFlyerAppId =
          Platform.OS === "ios"
            ? process.env.EXPO_PUBLIC_APPSFLYER_IOS_APP_ID
            : process.env.EXPO_PUBLIC_APPSFLYER_ANDROID_APP_ID;

        if (!appsFlyerDevKey || !appsFlyerAppId) {
          console.warn("AppsFlyer: Missing configuration");
          return;
        }

        const options = {
          devKey: appsFlyerDevKey,
          isDebug: __DEV__,
          appId: appsFlyerAppId,
          onInstallConversionDataListener: true,
          onDeepLinkListener: true,
        };

        // @ts-ignore
        await appsFlyer.initSdk(options);
        console.log("AppsFlyer: Initialized successfully");
      } catch (error) {
        console.error("AppsFlyer: Initialization error", error);
      }
    };

    initAppsFlyer();
  }, []);

  // Отслеживание входа пользователя
  useEffect(() => {
    if (userToken) {
      // Здесь можно получить user ID из токена или из профиля пользователя
      // appsFlyer.setCustomerUserId(userId);
    }
  }, [userToken]);

  return {
    // Отслеживание события
    logEvent: (eventName: string, eventValues?: Record<string, any>) => {
      try {
        // @ts-ignore
        appsFlyer.logEvent(eventName, eventValues);
        console.log("AppsFlyer: Event logged", eventName, eventValues);
      } catch (error) {
        console.error("AppsFlyer: Error logging event", error);
      }
    },
    // Установка пользовательского ID
    setUserId: (userId: string) => {
      try {
        // @ts-ignore
        appsFlyer.setCustomerUserId(userId);
        console.log("AppsFlyer: User ID set", userId);
      } catch (error) {
        console.error("AppsFlyer: Error setting user ID", error);
      }
    },
    /**
     * Отслеживание события покупки (af_purchase)
     * @param orderId - ID заказа
     * @param amount - сумма заказа
     * @param currency - валюта (по умолчанию RUB)
     */
    logPurchase: (orderId: string, amount: number, currency: string = "RUB") => {
      try {
        const eventValues = {
          af_order_id: orderId,
          af_revenue: amount,
          af_currency: currency,
        };
        // @ts-ignore
        appsFlyer.logEvent(AF_EVENTS.PURCHASE, eventValues);
        console.log("AppsFlyer: Purchase logged", eventValues);
      } catch (error) {
        console.error("AppsFlyer: Error logging purchase", error);
      }
    },
    /**
     * Отслеживание события добавления в корзину (af_add_to_cart)
     * @param productId - ID товара
     * @param price - цена товара
     * @param quantity - количество
     */
    logAddToCart: (productId: string, price: number, quantity: number) => {
      try {
        const eventValues = {
          af_content_id: productId,
          af_price: price,
          af_quantity: quantity,
        };
        // @ts-ignore
        appsFlyer.logEvent(AF_EVENTS.ADD_TO_CART, eventValues);
        console.log("AppsFlyer: Add to cart logged", eventValues);
      } catch (error) {
        console.error("AppsFlyer: Error logging add to cart", error);
      }
    },
  };
};

