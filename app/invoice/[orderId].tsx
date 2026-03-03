import { Text } from "@/components/ui/text";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import React from "react";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable } from "react-native";
import WebView from "react-native-webview";

export default function Page() {
  const { orderId } = useLocalSearchParams();
  const { t } = useTranslation();

  const [key, setKey] = useState(0);

  useFocusEffect(
    useCallback(() => {
      setKey((k) => k + 1);
    }, [orderId]),
  );

  return (
    <>
      <Pressable className="text-typography-control" onPress={() => router.back()}>
        <Text>{t("ordersScreen.back")}</Text>
      </Pressable>
      <WebView
        key={key}
        source={{
          uri: `${process.env.EXPO_PUBLIC_INVOICE_URL}/?id=${orderId}`,
        }}
      />
    </>
  );
}
