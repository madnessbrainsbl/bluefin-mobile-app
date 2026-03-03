import { DrawerHeaderProps } from "@react-navigation/drawer";
import Logo from "@/components/ui/Logo";
import { Box } from "../ui/box";
import { StatusBar } from "expo-status-bar";
import { HStack } from "../ui/hstack";
import { Pressable } from "../ui/pressable";
import React from "react";
import { Keyboard } from "react-native";
import { useColorScheme } from "@/hooks/useColorScheme";
import BasketIcon from "../icons/BasketIcon";
import MenuIcon from "../icons/MenuIcon";
import SearchIcon from "../icons/SearchIcon";
import UserIcon from "../icons/UserIcon";
import { useSheetStore } from "@/hooks/useSheetStore";
import { useAuthStore } from "@/stores/authStore";
import { router } from "expo-router";
import { useCart } from "@/hooks/useCart";
import { Text } from "../ui/text";

let Header = ({ navigation, route }: DrawerHeaderProps) => {
  const colorScheme = useColorScheme();

  const userToken = useAuthStore((state) => state.userToken);
  const openSheet = useSheetStore((state) => state.openSheet);

  const { data: cart } = useCart();

  return (
    <Box>
      <StatusBar
        style="auto"
        backgroundColor={colorScheme === "light" ? "white" : "#8A8A8A"}
      />

      <Pressable onPress={Keyboard.dismiss}>
        <HStack className="h-16 items-center justify-between bg-background px-3 pt-1 md:px-6">
          <Pressable
            className="h-[39px] w-[72px] active:bg-primary-pale"
            onPress={() => router.push("/")}
          >
            <Logo variant="gold" className="h-full w-full" />
          </Pressable>

          <HStack className="items-center justify-end">
            {/* <HeaderSearch /> */}
            <Pressable
              className="m-2 h-10 w-10 p-2 active:bg-primary-pale"
              onPress={() => router.push("/search")}
            >
              <Box>
                <SearchIcon
                  className="color-primary-light"
                  aria-hidden="true"
                />
              </Box>
            </Pressable>

            <Pressable
              className="m-2 h-10 w-10 p-2 active:bg-primary-pale"
              onPress={() => router.push("/cart")}
            >
              <Box>
                <BasketIcon
                  className="color-primary-light"
                  aria-hidden="true"
                />
              </Box>

              {!!cart?.items.length && (
                <Box className="absolute right-1 top-1 h-4 w-4 rounded-full bg-primary-light">
                  <Text className="text-center text-xs font-bold leading-snug tracking-tight text-background">
                    {cart?.items.reduce((acc, item) => acc + item.quantity, 0)}
                  </Text>
                </Box>
              )}
            </Pressable>
            <Pressable
              className="m-2 h-10 w-10 p-2 active:bg-primary-pale"
              onPress={() => {
                userToken
                  ? router.push("/profile")
                  : openSheet({
                      sheet: "phone",
                      params: {},
                      onClose: () => {},
                    });
              }}
            >
              <Box>
                <UserIcon
                  className="color-primary-light"
                  aria-hidden="true"
                />
              </Box>
            </Pressable>

            <Box>
              <Pressable
                className="h-10 w-10 p-2 active:bg-primary-pale"
                onPress={navigation.openDrawer}
              >
                <MenuIcon
                  className="color-primary-light"
                  aria-hidden="true"
                />
              </Pressable>
            </Box>
          </HStack>
        </HStack>
      </Pressable>
    </Box>
  );
};

export default Header;
