import { FlatList, Dimensions } from "react-native";
import { ProductCard } from "./ProductCard";
import { useProducts } from "@/hooks/useProducts";
import { useSheetStore } from "@/hooks/useSheetStore";
import { useCatalogStore } from "@/hooks/useCatalogStore";
import { UserProfile, useUserProfiles } from "@/hooks/useUserProfiles";
import { useAuthStore } from "@/stores/authStore";
import { LoadingDots } from "./ui/LoadingDots";
import { Box } from "./ui/box";
import { Text } from "./ui/text";
import AppMetrica, {
  ECommerce,
  ECommerceProduct,
} from "@appmetrica/react-native-analytics";
import { useCategories } from "@/hooks/useCategories";
import { makeECommerceProduct } from "@/lib/helpers";
import { useTrackingPermissions } from "expo-tracking-transparency";
import { useTranslation } from "react-i18next";

export function ProductList() {
  const { t } = useTranslation();
  const [trackingPermissionStatus] = useTrackingPermissions();

  const openSheet = useSheetStore((state) => state.openSheet);
  const closeSheet = useSheetStore((state) => state.closeSheet);

  const userToken = useAuthStore((state) => state.userToken);

  // const { data: cart } = useCart();
  const { data: categories } = useCategories();
  const viewCategoryId = useCatalogStore((state) => state.viewCategoryId);

  const departmentId = useCatalogStore((state) => state.departmentId);
  const setDepartmentId = useCatalogStore((state) => state.setDepartmentId);
  const setProfile = useCatalogStore((state) => state.setProfile);

  const {
    useUserProfileCreateMutation: { mutateAsync: createUserProfile },
  } = useUserProfiles();

  // const setViewCategoryId = useCatalogStore((state) => state.setViewCategoryId);
  const { isPending, data: products } = useProducts();

  const screenWidth = Dimensions.get("window").width;
  const numColumns = 2;
  const gap = 8;
  const px = 8;

  const availableSpace = screenWidth - (numColumns - 1) * gap - px * 2;
  const itemSize = availableSpace / numColumns;

  if (isPending) {
    return (
      <Box className="flex grow items-center justify-center">
        <LoadingDots />
      </Box>
    );
  }

  return (
    <FlatList
      numColumns={numColumns}
      initialNumToRender={8}
      style={{ backgroundColor: "white", flex: 1 }}
      columnWrapperStyle={{ gap }}
      contentContainerStyle={{
        alignItems: "stretch",
        rowGap: gap,
        padding: px,
        flexGrow: 1,
      }}
      ListEmptyComponent={() => (
        <Box className="flex grow items-center justify-center p-8">
          <Text className="text-center text-lg font-semibold text-typography-accent">
            {t("catalogScreen.emptyCategory")}
          </Text>
        </Box>
      )}
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

                // Sending an e-commerce event.
                if (trackingPermissionStatus?.granted) {
                  AppMetrica.reportECommerce(
                    ECommerce.showProductCardEvent(
                      makeECommerceProduct(
                        product,
                        categories,
                        viewCategoryId ?? categories[0].id,
                      ),
                      {
                        name: "ProductCard",
                      },
                    ),
                  );
                }
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
  );
}
