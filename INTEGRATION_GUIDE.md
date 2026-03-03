# Руководство по интеграции новых функций

## 1. OneSignal - Push-уведомления

### Что было сделано:
- Добавлены обработчики уведомлений (click, foregroundWillDisplay)
- Создан хук `useOneSignal` для отправки player ID на сервер
- Player ID автоматически отправляется на сервер при авторизации пользователя

### Настройка на сервере:
Необходимо создать эндпоинт `/user/onesignal/` для приема player ID:
```json
POST /user/onesignal/
Headers: Authorization: Bearer {token}
Body: { "player_id": "string" }
```

Для отправки уведомлений через ваш API:
```json
POST /notifications/send/
Headers: Authorization: Bearer {token}
Body: {
  "player_ids": ["string"],
  "title": "string",
  "message": "string",
  "data": {}
}
```

### Переменные окружения:
- `EXPO_PUBLIC_ONESIGNAL_APP_ID` - App ID из OneSignal

## 2. Баннеры

### Что было сделано:
- Создан хук `useBanners` для получения баннеров с сервера
- Создан компонент `Banner` для отображения одного баннера
- Создан компонент `BannerList` для отображения списка баннеров
- Баннеры добавлены на главную страницу

### Настройка на сервере:
Необходимо создать эндпоинт `/banners/`:
```json
GET /banners/?siteId={siteId}&position={position}
Response: {
  "banners": [
    {
      "id": number,
      "title": "string",
      "image": "string (URL)",
      "link": "string (optional)",
      "position": "top" | "bottom" | "home" | "cart" | "profile",
      "order": number,
      "active": boolean
    }
  ]
}
```

### Использование:
```tsx
import { BannerList } from "@/components/Banner/BannerList";

<BannerList position="home" horizontal width={300} height={150} />
```

## 3. АйкоКард - Программа лояльности

### Что было сделано:
- Создан хук `useAikoCardProfile` для получения профиля карты
- Создан хук `useAikoCardTransactions` для получения истории транзакций
- Создан хук `useAikoCardLink` для привязки карты

### Настройка на сервере:
Необходимо создать эндпоинты:
- `GET /aiko/card/profile/` - получение профиля карты
- `GET /aiko/card/transactions/` - получение истории транзакций
- `POST /aiko/card/link/` - привязка карты

### Использование:
```tsx
import { useAikoCardProfile } from "@/hooks/useAikoCard";

const { data: cardProfile } = useAikoCardProfile();
```

## 4. AppsFlyer

### Что было сделано:
- Добавлен пакет `react-native-appsflyer`
- Создан хук `useAppsFlyer` для инициализации и отслеживания событий
- AppsFlyer автоматически инициализируется при запуске приложения

### Настройка:
Добавьте переменные окружения в `.env`:
- `EXPO_PUBLIC_APPSFLYER_DEV_KEY` - Dev Key из AppsFlyer
- `EXPO_PUBLIC_APPSFLYER_IOS_APP_ID` - iOS App ID
- `EXPO_PUBLIC_APPSFLYER_ANDROID_APP_ID` - Android App ID

### Использование:
```tsx
import { useAppsFlyer } from "@/hooks/useAppsFlyer";

const { logEvent, setUserId } = useAppsFlyer();

// Отслеживание события
logEvent("purchase", { amount: 100, currency: "RUB" });

// Установка пользовательского ID
setUserId("user123");
```

### Настройка в app.json:
AppsFlyer требует нативной конфигурации. После установки пакета выполните:
```bash
npx expo prebuild
```

## 5. Передача имени в ОСМИ

### Что было сделано:
- Создан хук `useOsmiSync` для синхронизации данных с ОСМИ
- При регистрации/авторизации имя пользователя передается в ОСМИ
- Если имя не указано, сервер должен использовать "Гость" по умолчанию

### Настройка на сервере:
Необходимо создать эндпоинт `/osmi/sync/`:
```json
POST /osmi/sync/
Headers: Authorization: Bearer {token}, Site-Id: {siteId}
Body: {
  "name": "string (optional, если не указано - использовать 'Гость')",
  "phone": "string",
  "email": "string (optional)"
}
```

### Важно:
Синхронизация должна выполняться на сервере при регистрации/авторизации пользователя. 
Хук `useOsmiSync` предоставлен для ручной синхронизации при необходимости.

## Установка зависимостей

После добавления новых пакетов выполните:
```bash
npm install
# или
yarn install
```

Для AppsFlyer может потребоваться пересборка нативного кода:
```bash
npx expo prebuild
npx expo run:android
# или
npx expo run:ios
```

## Примечания

1. Все новые функции требуют соответствующих эндпоинтов на бэкенде
2. Переменные окружения должны быть добавлены в `.env` файл
3. Для AppsFlyer и OneSignal требуется нативная конфигурация
4. Баннеры отображаются только если они активны и отсортированы по полю `order`

