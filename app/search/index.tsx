import SearchIcon from "@/components/icons/SearchIcon";
import XIcon2 from "@/components/icons/XIcon2";
import { Input } from "@/components/Input";
import { ProductCard } from "@/components/ProductCard";
import { ProductList } from "@/components/ProductList";
import { Box } from "@/components/ui/box";
import { Button } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { LoadingDots } from "@/components/ui/LoadingDots";
import { Text } from "@/components/ui/text";
import { useAuthStore } from "@/stores/authStore";
import { useCatalogStore } from "@/hooks/useCatalogStore";
import useDebounce from "@/hooks/useDebounce";
import { Product } from "@/hooks/useProducts";
import { useSearch } from "@/hooks/useSearch";
import { useSheetStore } from "@/hooks/useSheetStore";
import { UserProfile, useUserProfiles } from "@/hooks/useUserProfiles";
import { useFocusEffect } from "expo-router";
import React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, Dimensions, Pressable, TextInputProps } from "react-native";
import { TextInput } from "react-native-gesture-handler";

export default function SearchScreen() {
  const { t, i18n } = useTranslation();
  const openSheet = useSheetStore((state) => state.openSheet);
  const closeSheet = useSheetStore((state) => state.closeSheet);

  const userToken = useAuthStore((state) => state.userToken);

  // const { data: cart } = useCart();
  const departmentId = useCatalogStore((state) => state.departmentId);
  const setDepartmentId = useCatalogStore((state) => state.setDepartmentId);
  const setProfile = useCatalogStore((state) => state.setProfile);

  const {
    useUserProfileCreateMutation: { mutateAsync: createUserProfile },
  } = useUserProfiles();

  // const { data: products } = useProducts();
  const [searchValue, setSearchValue] = useState<string>("");
  const q = useDebounce(searchValue, 300);

  useEffect(() => {
    searchProducts({ q });
  }, [q]);

  const { isPending, data: products, mutate: searchProducts } = useSearch();

  const screenWidth = Dimensions.get("window").width;
  const numColumns = 2;
  const gap = 8;
  const px = 8;

  const availableSpace = screenWidth - (numColumns - 1) * gap - px * 2;
  const itemSize = availableSpace / numColumns;

  return (
    <>
      <Box className="relative p-4 bg-background">
        <Input
          className="grow"
          label={t("searchScreen.search")}
          placeholder={t("searchScreen.startTyping")}
          autofocus
          value={searchValue}
          onChange={(value) => setSearchValue(value)}
        />
      </Box>
      {isPending && (
        <Box className="flex grow items-center justify-center">
          <LoadingDots />
        </Box>
      )}
      {!!products?.length && (
        <FlatList
          numColumns={numColumns}
          initialNumToRender={8}
          style={{ backgroundColor: "white", padding: px }}
          columnWrapperStyle={{ gap }}
          contentContainerStyle={{ alignItems: "stretch", rowGap: gap }}
          renderItem={({ item: product }) => {
            // const cartItem = cart?.items.find((ci) => ci.productId === product.id);

            return (
              <ProductCard
                key={product.id}
                product={product}
                // cartItem={cartItem}
                width={itemSize}
                onPress={() => {
                  if (departmentId) {
                    openSheet({
                      sheet: "product",
                      params: product,
                      onClose: () => {},
                    });
                  } else {
                    openSheet({
                      sheet: "address",
                      params: {},
                      onClose: async ({
                        departmentId,
                        profile,
                      }: {
                        departmentId: number;
                        profile: UserProfile | null;
                      }) => {
                        setDepartmentId(departmentId);

                        const newProfile =
                          profile && !profile.id && userToken
                            ? await createUserProfile(profile)
                            : profile;
                        setProfile(newProfile);
                        closeSheet();
                      },
                    });
                  }
                }}
              />
            );
          }}
          keyExtractor={(item, index) => item.id.toString()}
          data={products}
        />
      )}
    </>
  );
}
