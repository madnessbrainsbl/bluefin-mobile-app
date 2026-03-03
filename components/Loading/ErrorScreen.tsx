import { FallbackProps } from "react-error-boundary";
import { Box } from "../ui/box";
import { Pressable } from "../ui/pressable";
import { Text } from "../ui/text";
import { useTranslation } from "react-i18next";
import { Button } from "../ui/button";
import AppMetrica from "@appmetrica/react-native-analytics";
import { ScrollView } from "react-native-gesture-handler";
import { useTrackingPermissions } from "expo-tracking-transparency";

export const ErrorScreen = ({ error, resetErrorBoundary }: FallbackProps) => {
  const { t } = useTranslation();
  const [trackingPermissionStatus] = useTrackingPermissions();

  if (trackingPermissionStatus?.granted) {
    AppMetrica.reportError(
      "Unknown error",
      JSON.stringify({ message: error.message, raw: error }),
    );
  }

  return (
    <Box className="flex h-full items-center justify-center gap-4 bg-background">
      <Text className="text-2xl">{t("errors.somethingWentWrong")}</Text>
      <Button
        className="bg-primary-main active:bg-typography-control"
        onPress={() => resetErrorBoundary()}
      >
        <Text className="text-background">{t("errors.reload")}</Text>
      </Button>
      {/* <ScrollView>
        <Text>{error.message}</Text>
        <Text>{error.stack}</Text>
      </ScrollView> */}
    </Box>
  );
};
