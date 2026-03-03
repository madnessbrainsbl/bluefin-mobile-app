import "../global.css";
// import "../node_modules/.cache/nativewind/global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { Suspense, useEffect } from "react";
import "react-native-reanimated";
import { useColorScheme } from "@/hooks/useColorScheme";
import LoadingScreen from "@/components/LoadingScreen";
import {
  QueryClient,
  QueryClientProvider,
  QueryErrorResetBoundary,
  useQueryErrorResetBoundary,
} from "@tanstack/react-query";
import { Navigation } from "@/components/navigation/Navigation";
import { SafeAreaView } from "react-native-safe-area-context";
import "@/lib/i18n";
import { ErrorBoundary } from "react-error-boundary";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AuthProvider } from "@/components/AuthProvider";
import { ErrorScreen } from "@/components/Loading/ErrorScreen";
import { CatalogStoreProvider } from "@/components/CatalogStoreProvider";
import AppMetrica from "@appmetrica/react-native-analytics";
import {
  getAdvertisingId,
  useTrackingPermissions,
} from "expo-tracking-transparency";
import { ConnectionProvider } from "@/components/ConnectionProvider";
import { OneSignal, LogLevel } from "react-native-onesignal";
import { useAppsFlyer } from "@/hooks/useAppsFlyer";
import { OneSignalHandler } from "@/components/OneSignalHandler";

SplashScreen.preventAutoHideAsync();

// Инициализация OneSignal до рендера компонентов
if (process.env.EXPO_PUBLIC_ONESIGNAL_APP_ID) {
  try {
    OneSignal.initialize(process.env.EXPO_PUBLIC_ONESIGNAL_APP_ID);
    console.log("OneSignal: Initialized successfully");
  } catch (error) {
    console.error("OneSignal: Initialization failed", error);
  }
}

export default function RootLayout() {
  const [assetsLoaded] = useFonts({
    Inter: require("@/assets/fonts/Inter-VariableFont_slnt,wght.ttf"),
  });

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        experimental_prefetchInRender: true,
      },
    },
  });

  const [hookStatus, requestPermission] = useTrackingPermissions();

  // Инициализация AppsFlyer
  useAppsFlyer();

  // AppMetrica временно отключен - требуется новая сборка для исправления
  // useEffect(() => {
  //   (async () => {
  //     const { status } = await requestPermission();

  //     if (status === "granted") {
  //       const deviceId = getAdvertisingId();

  //       const appMetricaKey = process.env.EXPO_PUBLIC_APPMETRICA_TOKEN;
  //       if (appMetricaKey && appMetricaKey.length > 0) {
  //         AppMetrica.activate({
  //           apiKey: appMetricaKey,
  //           sessionTimeout: 120,
  //           logs: true,
  //         });
  //         console.log("AppMetrica: Initialized successfully");
  //       } else {
  //         console.warn("AppMetrica: API key not configured, skipping initialization");
  //       }
  //     }
  //   })();
  // }, [hookStatus?.granted]);

  useEffect(() => {
    // Запрос разрешений и получение player ID после инициализации
    OneSignal.Notifications.requestPermission(false);

    OneSignal.User.getOnesignalId().then((playerId: string | null) => {
      if (playerId) {
        console.log("OneSignal Player ID:", playerId);
        // Player ID будет отправлен на сервер при авторизации пользователя через useOneSignal хук
      }
    });
  }, []);

  useEffect(() => {
    if (assetsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [assetsLoaded]);

  const { reset } = useQueryErrorResetBoundary();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <GluestackUIProvider mode="light">
        <QueryClientProvider client={queryClient}>
          <QueryErrorResetBoundary>
            <SafeAreaView style={{ flex: 1 }}>
              <ErrorBoundary
                onReset={reset}
                fallbackRender={(props) => <ErrorScreen {...props} />}
              >
                <Suspense fallback={<LoadingScreen />}>
                  <ConnectionProvider>
                    <AuthProvider>
                      <OneSignalHandler />
                      <CatalogStoreProvider>
                        <Navigation />
                      </CatalogStoreProvider>
                    </AuthProvider>
                  </ConnectionProvider>
                </Suspense>
              </ErrorBoundary>
            </SafeAreaView>
          </QueryErrorResetBoundary>
        </QueryClientProvider>
      </GluestackUIProvider>
    </GestureHandlerRootView>
  );
}
