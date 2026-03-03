import { apiUrl } from "@/constants/config";
import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useAuthStore } from "@/stores/authStore";
import { useCatalogStore, useCity } from "./useCatalogStore";
import { Additive, Product } from "./useProducts";
import { Paysystem } from "./usePaysystems";
import { useCategories } from "./useCategories";
import AppMetrica, {
  ECommerce,
  ECommerceCartItem,
  ECommerceProduct,
} from "@appmetrica/react-native-analytics";
import { getCartQuantityChange, makeECommerceProduct } from "@/lib/helpers";
import { useTrackingPermissions } from "expo-tracking-transparency";
import { useAppsFlyer } from "./useAppsFlyer";

export type CartItem = {
  id: string;
  name: string;
  // productId: number;
  product: Product;
  quantity: number;
  price: number;
  originalPrice: number;
  discountPrice: number;
  discountPercent: number;
  additivesIds: string[];
};

export type Cart = {
  sum: number;
  originalSum: number;
  items: CartItem[];
  // appliedCoupons: string[];
  paysystems: Paysystem[];
  minPrice: number;
  minPriceDisplay: string;
  maxBonus: number;
  deliveryPrice: number;
  giftProducts: Product[];
  appliedPromocodes: string[];
  notAppliedPromocodes: string[];
};

export const useCart = (paysystemId?: string) => {
  const anonToken = useAuthStore((state) => state.anonToken);
  const userToken = useAuthStore((state) => state.userToken);

  const { siteId } = useCity();
  const profile = useCatalogStore((state) => state.profile);
  const promocodes = useCatalogStore((state) => state.promocodes);

  const coords = profile?.coords?.join(",") ?? "";
  const promocodesJson = JSON.stringify(promocodes);
  
  return useQuery<Cart | null>({
    queryKey: [
      "cart",
      {
        anonToken,
        userToken,
        siteId,
        profileId: profile?.id,
        coords,
        promocodes: promocodesJson,
        paysystemId,
      },
    ],
    queryFn: async () => {
      const headers: Record<string, string> = {
        "Site-Id": siteId,
      };

      if (userToken) {
        headers["Authorization"] = "Bearer " + userToken;
      } else {
        headers["Anonymous-Token"] = anonToken ?? "";
      }

      const params: Record<string, string> = {
        coords,
        promocodes: promocodesJson,
      };

      if (paysystemId)
        params.paysystemId = paysystemId;

      const response = await fetch(
        apiUrl + "/cart/?" + new URLSearchParams(params).toString(),
        {
          method: "GET",
          headers,
        },
      );

      if (response.ok) {
        const resp = (await response.json()) as Cart;

        return resp;
      } else {
        if (response.status === 401 || response.status === 403) {
          return null;
        } else {
          throw new Error("Failed to fetch user cart");
        }
      }
    },
  });
};

export const useAddToCart = () => {
  const [trackingPermissionStatus] = useTrackingPermissions();

  const queryClient = useQueryClient();
  const { siteId } = useCity();
  const anonToken = useAuthStore((state) => state.anonToken);
  const userToken = useAuthStore((state) => state.userToken);
  const setUserToken = useAuthStore((state) => state.setUserToken);

  const { data: categories } = useCategories();
  const viewCategoryId = useCatalogStore((state) => state.viewCategoryId);

  const { data: cart } = useCart();
  
  const { logAddToCart } = useAppsFlyer();

  return useMutation({
    mutationKey: [
      "addToCart",
      "siteId:" + siteId,
      "userToken:" + userToken,
      "anonToken:" + anonToken,
    ],
    mutationFn: async ({
      product,
      quantity = 1,
      additives = [],
    }: {
      product: Product;
      quantity: number;
      additives: string[];
    }) => {
      const headers: Record<string, string> = {
        "Site-Id": siteId,
      };

      if (userToken) {
        headers["Authorization"] = "Bearer " + userToken;
      } else {
        headers["Anonymous-Token"] = anonToken ?? "";
      }

      const formData = new FormData();
      formData.append("productId", product.id.toString());
      formData.append("quantity", quantity.toString());

      additives &&
        additives.forEach((additive) => {
          formData.append("additives[]", additive);
        });

      const response = await fetch(apiUrl + "/cart/add/", {
        method: "POST",
        headers,
        body: formData,
      });

      if (response.ok) {
        await queryClient.invalidateQueries({
          queryKey: ["cart"],
        });

        const changedQuantity = getCartQuantityChange(
          cart?.items ?? [],
          product.id,
          quantity,
        );

        if (changedQuantity > 0) {
          // Отправляем событие af_add_to_cart в AppsFlyer
          logAddToCart(String(product.id), product.price, changedQuantity);
          
          const addCartItem = ECommerce.addCartItemEvent({
            product: makeECommerceProduct(
              product,
              categories,
              viewCategoryId ?? categories[0].id,
            ),
            quantity: changedQuantity,
            price: {
              amount: { amount: product.price, unit: "RUB" },
            },
          });
          if (trackingPermissionStatus?.granted) {
            AppMetrica.reportECommerce(addCartItem);
          }
        } else {
          const removeCartItem = ECommerce.removeCartItemEvent({
            product: makeECommerceProduct(
              product,
              categories,
              viewCategoryId ?? categories[0].id,
            ),
            quantity: changedQuantity * -1,
            price: {
              amount: { amount: product.price, unit: "RUB" },
            },
          });
          if (trackingPermissionStatus?.granted) {
            AppMetrica.reportECommerce(removeCartItem);
          }
        }

        return true;
      } else {
        
        if (response.status === 401 || response.status === 403) {
          console.warn("Failed to add to cart, forbidden");
          setUserToken(null);
          return null;
        } else {
          console.error("Failed to add to cart")
          throw new Error("Failed to add to cart");
        }
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["cart"],
      });
    },
  });
};

export const useRemoveCartItem = () => {
  const [trackingPermissionStatus] = useTrackingPermissions();

  const queryClient = useQueryClient();
  const { siteId } = useCity();
  const anonToken = useAuthStore((state) => state.anonToken);
  const userToken = useAuthStore((state) => state.userToken);
  const setUserToken = useAuthStore((state) => state.setUserToken);

  const { data: categories } = useCategories();
  const viewCategoryId = useCatalogStore((state) => state.viewCategoryId);

  const { data: cart } = useCart();

  return useMutation({
    mutationKey: [
      "removeCartItem",
      "siteId:" + siteId,
      "userToken:" + userToken,
      "anonToken:" + anonToken,
    ],
    mutationFn: async ({ product }: { product: Product }) => {
      const headers: Record<string, string> = {
        "Site-Id": siteId,
      };

      if (userToken) {
        headers["Authorization"] = "Bearer " + userToken;
      } else {
        headers["Anonymous-Token"] = anonToken ?? "";
      }

      const formData = new FormData();
      formData.append("productId", product.id.toString());

      const response = await fetch(apiUrl + "/cart/remove/", {
        method: "POST",
        headers,
        body: formData,
      });

      if (response.ok) {
        await queryClient.invalidateQueries({
          queryKey: [
            "cart",
            "anonToken:" + anonToken,
            "userToken:" + userToken,
            "siteId:" + siteId,
          ],
        });

        const changedQuantity =
          cart?.items.find((item) => item.product.id === product.id)
            ?.quantity ?? 0;

        const removeCartItem = ECommerce.removeCartItemEvent({
          product: makeECommerceProduct(
            product,
            categories,
            viewCategoryId ?? categories[0].id,
          ),
          quantity: changedQuantity,
          price: {
            amount: { amount: product.price, unit: "RUB" },
          },
        });

        if (trackingPermissionStatus?.granted) {
          AppMetrica.reportECommerce(removeCartItem);
        }
        return true;
      } else {
        if (response.status === 401 || response.status === 403) {
          setUserToken(null);
          return null;
        } else {
          throw new Error("Failed to remove cart");
        }
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["cart"],
      });
    },
  });
};

export const useClearCart = () => {
  const [trackingPermissionStatus] = useTrackingPermissions();

  const queryClient = useQueryClient();
  const { siteId } = useCity();
  const anonToken = useAuthStore((state) => state.anonToken);
  const userToken = useAuthStore((state) => state.userToken);
  const setUserToken = useAuthStore((state) => state.setUserToken);

  const { data: categories } = useCategories();
  const viewCategoryId = useCatalogStore((state) => state.viewCategoryId);

  const { data: cart } = useCart();

  return useMutation({
    mutationKey: [
      "clearCart",
      "siteId:" + siteId,
      "userToken:" + userToken,
      "anonToken:" + anonToken,
    ],
    mutationFn: async () => {
      const headers: Record<string, string> = {
        "Site-Id": siteId,
      };

      if (userToken) {
        headers["Authorization"] = "Bearer " + userToken;
      } else {
        headers["Anonymous-Token"] = anonToken ?? "";
      }

      const response = await fetch(apiUrl + "/cart/clear/", {
        method: "POST",
        headers,
      });

      if (response.ok) {
        cart?.items.forEach((item) => {
          const product = item.product;

          const changedQuantity =
            cart?.items.find((item) => item.product.id === product.id)
              ?.quantity ?? 0;

          const removeCartItem = ECommerce.removeCartItemEvent({
            product: makeECommerceProduct(
              product,
              categories,
              viewCategoryId ?? categories[0].id,
            ),
            quantity: changedQuantity,
            price: {
              amount: { amount: product.price, unit: "RUB" },
            },
          });

          if (trackingPermissionStatus?.granted) {
            AppMetrica.reportECommerce(removeCartItem);
          }
        });

        // await queryClient.invalidateQueries({
        //   queryKey: ["cart"],
        // });

        return true;
      } else {
        if (response.status === 401 || response.status === 403) {
          setUserToken(null);
          return null;
        } else {
          throw new Error("Failed to clear cart");
        }
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["cart"],
      });
    },
  });
};
