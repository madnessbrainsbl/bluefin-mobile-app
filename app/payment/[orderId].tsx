import { useQueryClient } from "@tanstack/react-query";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import WebView, { WebViewMessageEvent } from "react-native-webview";

export default function PaymentScreen() {
  const { orderId } = useLocalSearchParams();
  const QueryClient = useQueryClient();

  const INITIAL_URL = `${process.env.EXPO_PUBLIC_PAYMENT_URL}/?orderId=${orderId}`;

  const [key, setKey] = useState(0);

  useFocusEffect(
    React.useCallback(() => {
      setKey((k) => k + 1);
    }, [orderId]),
  );

  const onPaymasterMessage = useCallback((event: WebViewMessageEvent) => {
    if (
      event.nativeEvent.data === "paymentSuccess" ||
      event.nativeEvent.data === "paymentFailed"
    ) {
      setKey(key + 1);
      QueryClient.invalidateQueries({ queryKey: ["orders"] });
      router.push("/");
    }
  }, []);

  return (
    <WebView
      key={key}
      source={{
        uri: INITIAL_URL,
      }}
      onMessage={onPaymasterMessage}
    />
  );
}