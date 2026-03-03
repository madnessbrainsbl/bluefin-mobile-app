import { Button } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useCart } from "@/hooks/useCart";
import { cn } from "@gluestack-ui/nativewind-utils/cn";
import { Slot, router, usePathname } from "expo-router";
import { createContext, RefObject, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Keyboard, KeyboardAvoidingView, Platform } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

export const CartLayoutContext = createContext<RefObject<ScrollView> | null>(null);

export default function CartLayout() {
  const { t } = useTranslation();
  const pathname = usePathname();
  const { data: cart } = useCart();

  const scrollRef = useRef<ScrollView>(null);

  const [keyboardSpace, setKeyboardSpace] = useState(0);

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', (frames) => setKeyboardSpace(frames.endCoordinates.height));
    const hideSubscription = Keyboard.addListener('keyboardDidHide', (frames) => setKeyboardSpace(frames.endCoordinates.height));

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);
  return (

    <VStack style={{ flex: 1 }}>
      <HStack className="mt-4 justify-center px-4 z-[1000]">
        <Button
          onPress={() => router.push("/cart")}
          className={cn("grow shrink basis-0 rounded-none border-[1px] border-primary-main", {
            "bg-primary-main": pathname === "/cart",
            "bg-background": pathname === "/cart/checkout",
          })}
        >
          <Text
            className={cn({
              "text-background": pathname === "/cart",
              "text-typography-accent": pathname === "/cart/checkout",
            })}
          >
            {t("cartScreen.cart")}
          </Text>
        </Button>
        <Button
          isDisabled={!cart || cart?.minPrice > cart?.originalSum}
          onPress={() => router.push("/cart/checkout")}
          className={cn("grow shrink basis-0 rounded-none border-[1px] border-primary-main", {
            "bg-primary-main": pathname === "/cart/checkout",
            "bg-background": pathname === "/cart",
          })}
        >
          <Text
            className={cn({
              "text-background": pathname === "/cart/checkout",
              "text-typography-accent": pathname === "/cart",
            })}
          >
            {t("cartScreen.delivery")}
          </Text>
        </Button>
      </HStack>
      <KeyboardAvoidingView
        style={{ flex: 1, alignContent: "stretch" }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={120}
      >
        <ScrollView className="p-4  grow" ref={scrollRef}>
          <CartLayoutContext.Provider value={scrollRef}>
            <Slot />
          </CartLayoutContext.Provider>
        </ScrollView>
      </KeyboardAvoidingView>
    </VStack>
  );
}
