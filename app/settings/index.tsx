import {
  Checkbox,
  CheckboxGroup,
  CheckboxIcon,
  CheckboxIndicator,
  CheckboxLabel,
} from "@/components/ui/checkbox";
import { VStack } from "@/components/ui/vstack";
import React from "react";
import {
  requestTrackingPermissionsAsync,
  useTrackingPermissions,
  getAdvertisingId,
} from "expo-tracking-transparency";
import AppMetrica from "@appmetrica/react-native-analytics";
import { CheckIcon } from "@/components/ui/icon";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useDialogModal } from "@/components/ModalDialog";
import { useCatalogStore } from "@/hooks/useCatalogStore";
import { useAuthStore } from "@/stores/authStore";
import { Linking, Platform } from "react-native";

export default function SettingsScreen() {
  const { t } = useTranslation();
  const [trackingPermissionStatus] = useTrackingPermissions();
  const showDialogModal = useDialogModal((state) => state.showDialogModal);

  const setSiteId = useCatalogStore((state) => state.setSiteId);
  const setDepartmentId = useCatalogStore((state) => state.setDepartmentId);
  const setProfile = useCatalogStore((state) => state.setProfile);

  const setAnonToken = useAuthStore((state) => state.setAnonToken);
  const setUserToken = useAuthStore((state) => state.setUserToken);

  function resetState() {
    setSiteId(null);
    setDepartmentId(null);
    setProfile(null);
    setUserToken(null);
    setAnonToken(null);
  }

  const handleOpenSettings = () => {
    if (Platform.OS === "ios") {
      Linking.openURL("app-settings:");
    } else {
      Linking.openSettings();
    }
  };
  const [status, requestPermission] = useTrackingPermissions();
  
  return (
    <VStack className="mt-4 gap-4 px-4">
      <Button
        className="bg-primary-main px-4 active:bg-typography-control"
        onPress={() => {
          let granted = status?.granted;
  
          if (!granted && status?.canAskAgain) {
            showDialogModal({
              message: t("settingsScreen.trackingPermissionDescription"),
              onClose: async () => {
                const permission = await requestPermission();
              },
            });
          } else if (!granted) {
            showDialogModal({
              message: t("settingsScreen.trackingPermissionDescriptionCannotAsk"),
              onClose: async () => {
                handleOpenSettings();
              },
            });
          } else {
            showDialogModal({
              message: t("settingsScreen.trackingPermissionDisable"),
              onClose: async () => {
                handleOpenSettings();
              },
            });
          }
        }}
      >
        <Text className="text-background">
          {t("settingsScreen.trackingPermission")}
        </Text>
      </Button>
      <Button
        className="bg-primary-main active:bg-typography-control"
        onPress={() => {
          showDialogModal({
            message: t("settingsScreen.resetStateConfirmation"),
            onConfirm: () => resetState(),
          });
        }}
      >
        <Text className="text-background">{t("settingsScreen.resetState")}</Text>
      </Button>
    </VStack>
  );
}
