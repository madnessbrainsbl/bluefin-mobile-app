import { ReactNode, useEffect, useState } from "react";
import NetInfo from "@react-native-community/netinfo";
import { onlineManager } from "@tanstack/react-query";
import { use } from "i18next";
import { Text } from "./ui/text";
import { Box } from "./ui/box";
import { useTranslation } from "react-i18next";
import Logo from "./ui/Logo";
import { AppState, Platform } from "react-native";
import type { AppStateStatus } from "react-native";
import { focusManager } from "@tanstack/react-query";

export const ConnectionProvider = ({ children }: { children: ReactNode }) => {
  useEffect(
    () =>
      onlineManager.setEventListener((setOnline) => {
        return NetInfo.addEventListener((state) => {
          setOnline(!!state.isConnected);
          setShowOffline(!state.isConnected);
        });
      }),
    [],
  );

  function onAppStateChange(status: AppStateStatus) {
    if (Platform.OS !== "web") {
      focusManager.setFocused(status === "active");
    }
  }

  useEffect(() => {
    const subscription = AppState.addEventListener("change", onAppStateChange);

    return () => subscription.remove();
  }, []);

  const { t } = useTranslation();

  const [showOffline, setShowOffline] = useState(false);
  if (showOffline) {
    return (
      <Box className="flex h-full items-center justify-center gap-4 bg-background">
        <Box className="px-20">
          <Logo variant="gold" />
        </Box>
        <Text className="text-2xl">{t("errors.noConnection")}</Text>
        <Text className="text">{t("errors.checkConnection")}</Text>
      </Box>
    );
  } else {
    return children;
  }
};
