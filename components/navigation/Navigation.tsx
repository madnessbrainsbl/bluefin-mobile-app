import { Drawer } from "expo-router/drawer";
import Header from "./Header";
import DrawerContent from "./DrawerContent";
import { useAuthStore } from "@/stores/authStore";
import { LoginSheet } from "../LoginSheet/LoginSheet";
import { DialogModal, useDialogModal } from "../ModalDialog";
import { KeyboardAvoidingView, Platform } from "react-native";
import { useSheetStore } from "@/hooks/useSheetStore";
import { CitySheet } from "../CitySheet/CitySheet";
import { AddressSheet } from "../AddressSheet/AddressSheet";
import { ProductSheet } from "../ProductSheet/ProductSheet";
import { UserProfileSheet } from "../UserProfileSheet/UserProfileSheet";
import { useCatalogStore, useCity } from "@/hooks/useCatalogStore";
import React, { useEffect } from "react";
import { useUser } from "@/hooks/useUser";

export function Navigation() {
  const sheet = useSheetStore((state) => state.sheet);
  const params = useSheetStore((state) => state.params);
  const userToken = useAuthStore((state) => state.userToken);

  return (
    <>
      <Drawer
        backBehavior="history"
        screenOptions={{
          // sceneStyle: { backgroundColor: "#fff" },
          drawerStyle: { width: 280 },
          drawerType: "front",
          drawerPosition: "right",
          header: (props) => <Header {...props} />,
        }}
        drawerContent={({ navigation, state }) => (
          <DrawerContent closeDrawer={navigation.closeDrawer} />
        )}
      >
        <Drawer.Screen name="index" />
        <Drawer.Screen name="profile" />
        <Drawer.Screen name="cart" />
        <Drawer.Screen name="content/[page]" />
        <Drawer.Screen name="settings/index" />
        <Drawer.Screen name="+not-found" />
      </Drawer>

      <LoginSheet isOpen={!userToken && sheet === "phone"} />
      <CitySheet isOpen={sheet === "city"} />
      <AddressSheet isOpen={sheet === "address"} />
      <ProductSheet isOpen={sheet === "product"} product={params} />
      <UserProfileSheet isOpen={sheet === "profile"} profile={params} />
      <DialogModal />
    </>
  );
}
