/**
 * Типы для данных push-уведомлений OneSignal
 * Requirements: 1.3
 */

/**
 * Типы уведомлений
 */
export type NotificationType = 'order_status' | 'promo' | 'news';

/**
 * Данные уведомления, передаваемые в additionalData
 */
export interface NotificationData {
  /** ID заказа для навигации на экран заказа */
  orderId?: string;
  /** Тип уведомления */
  type?: NotificationType;
  /** Deep link для навигации */
  deepLink?: string;
  /** Заголовок уведомления */
  title?: string;
  /** Текст уведомления */
  body?: string;
}

/**
 * Событие клика по уведомлению OneSignal
 */
export interface NotificationClickEvent {
  notification?: {
    additionalData?: NotificationData;
    title?: string;
    body?: string;
  };
}

/**
 * Событие получения уведомления в foreground
 */
export interface NotificationForegroundEvent {
  notification?: {
    additionalData?: NotificationData;
    title?: string;
    body?: string;
  };
}
