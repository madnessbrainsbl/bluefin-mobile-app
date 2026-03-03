# Bluefin Mobile App

Bluefin mobile app built with Expo and React Native: catalog, cart, checkout, profile, and push notifications. Integrates with API, OneSignal, AppsFlyer, OSMI, and AikoCard.

## Stack

- Expo + React Native
- Expo Router
- TypeScript
- React Query
- NativeWind + Gluestack UI

## Quick Start

1. Install dependencies:

```bash
npm install
```

2. Create local environment file:

```bash
cp .env.example .env
```

3. Fill `.env` with real keys.

4. Run app:

```bash
npx expo start
```

## Android / iOS

```bash
npm run android
npm run ios
```

## Build (EAS)

Sensitive values must be configured in EAS secrets, not committed to repository.

```bash
eas build --platform android --profile preview
eas build --platform ios --profile production
```

## Security Notes

- Real credentials are not stored in this repository.
- `.env` is ignored by git.
- `.env.example` contains placeholders only.
