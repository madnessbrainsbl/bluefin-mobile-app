import { Box } from "@/components/ui/box";
import { Button } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { useAuthStore } from "@/stores/authStore";
import { cn } from "@gluestack-ui/nativewind-utils/cn";
// import { cn } from "@/lib/helpers";
// import { cn } from "@/lib/helpers";
import { Slot, router, useNavigation, usePathname } from "expo-router";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

export default function ProfileLayout() {
  const { t } = useTranslation();
  const pathname = usePathname();
  const userToken = useAuthStore((state) => state.userToken);

  useEffect(() => {
    if (!userToken) router.push("/");
  }, [userToken]);

  return (
    <>
      <HStack className="my-4 justify-center px-4">
        <Button
          onPress={() => router.push("/profile")}
          className={cn("grow rounded-none border-[1px] border-primary-main", {
            "bg-primary-main": pathname === "/profile",
            "bg-background": pathname.startsWith("/profile/orders"),
          })}
        >
          <Text
            className={cn({
              "text-background": pathname === "/profile",
              "text-accent": pathname.startsWith("/profile/orders"),
            })}
          >
            {t("personalScreen.personalData")}
          </Text>
        </Button>
        <Button
          onPress={() => router.push("/profile/orders")}
          className={cn("grow rounded-none border-[1px] border-primary-main", {
            "bg-primary-main": pathname.startsWith("/profile/orders"),
            "bg-background": pathname === "/profile",
          })}
        >
          <Text
           className={cn({
            "text-background": pathname.startsWith("/profile/orders"),
            "text-accent": pathname === "/profile",
          })}
          >{t("personalScreen.ordersHistory")}</Text>
        </Button>
      </HStack>
      <Slot />
    </>
  );
}
