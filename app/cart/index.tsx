import { CartProduct } from "@/components/Cart/CartProduct";
import { Box } from "@/components/ui/box";
import { Button } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
// import { Input, InputField } from "@/components/ui/input";
import { Input } from "@/components/Input";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useAddToCart, useCart, useRemoveCartItem } from "@/hooks/useCart";
import { useTranslation } from "react-i18next";
import { useCatalogStore, useDepartment } from "@/hooks/useCatalogStore";
import { Pressable } from "react-native";
import XIcon2 from "@/components/icons/XIcon2";
import { Icon } from "@/components/ui/icon";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { CartGifts } from "@/components/Cart/CartGifts";
import { useAppSettings } from "@/hooks/useAppSettings";
import React from "react";
import { cn } from "@gluestack-ui/nativewind-utils/cn";
import { router } from "expo-router";

export default function CartScreen() {
  const { t } = useTranslation();
  // const { data: department } = useDepartment();
  // const departmentId = useCatalogStore((state) => state.departmentId);
  // const { data: { departments }} = useAppSettings();
  // const department = departmentId ? departments[String(departmentId)] : null;
  // if (!department) {
  //   throw new Error("Missing department");
  // }

  const department = useDepartment();

  // const { isPending: cartPending, data: cart } = useCart();
  const { isPending: cartPending, isFetching, data: cart } = useCart();
  const { isPending: addToCartPending } = useAddToCart();
  const { isPending: removeCartItemPending } = useRemoveCartItem();

  const isPending =
    cartPending || isFetching || addToCartPending || removeCartItemPending;

  const promocodes = useCatalogStore((state) => state.promocodes);
  const setPromocodes = useCatalogStore((state) => state.setPromocodes);

  const [promocode, setPromocode] = useState("");

  const queryClient = useQueryClient();
  function addPromocode() {
    if (promocode.trim() === "") return;
    if (promocodes.includes(promocode)) {
      //TODO message promocode already set
      return;
    }
    setPromocode("");
    setPromocodes([...promocodes, promocode]);
  }

  function removePromocode(promocode: string) {
    setPromocodes(promocodes.filter((item) => item !== promocode));
  }

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["cart"] });
  }, [promocodes]);
  
  return (
    <Box className="py-4">
      <Text className="text-3xl font-extrabold text-typography-accent">
        {t("cartScreen.checkout")}
      </Text>
      {cart && cart?.minPrice > cart?.originalSum && (
        <Box className="mt-4 flex items-center bg-surface-error p-4">
          <Text className="font-bold text-typography-error">
            {t("cartScreen.orderPriceTooLow", { minPrice: cart?.minPrice })}
          </Text>
        </Box>
      )}
      {department.workHours?.length && (
        <VStack className="my-4 bg-surface-message p-4">
          {department.workHours.map((item, index) => (
            <HStack key={index} className="gap-2">
              <Text className="basis-14 tracking-tight text-typography-accent">
                {item.days}
              </Text>
              <Text className="font-bold tracking-tight text-typography-accent">
                {item.time}
              </Text>
            </HStack>
          ))}
          <Text className="mt-2 text-sm">
            {t("cartScreen.overhoursOrders")}
          </Text>
        </VStack>
      )}
      <HStack className="items-stretch">
        <Input
          className="grow"
          label={t("cartScreen.promocode")}
          placeholder={t("cartScreen.promocode")}
          value={promocode}
          onChange={setPromocode}
        />
        <Button
          className="h-auto rounded-none border-[1px] border-primary-main"
          variant="outline"
          onPress={() => {
            addPromocode();
            // setPromocodes([...promocodes, promocode]);
          }}
        >
          <Text className="text-primary-main">{t("cartScreen.apply")}</Text>
        </Button>
      </HStack>

      {!!promocodes.length && (
        <VStack className="mt-4">
          <Text>Промо-коды:</Text>
          {promocodes.map((promocode) => (
            <HStack key={promocode} className="items-center gap-2 p-2">
            
              <Text
                className={cn("leading-5", {
                  "text-primary-main":
                    cart?.appliedPromocodes.includes(promocode),
                  "text-typography-error":
                    cart?.notAppliedPromocodes.includes(promocode),
                })}
              >
                {promocode}{" "}
                {cart?.notAppliedPromocodes.includes(promocode) &&
                  t("cartScreen.notApplied")}
              </Text>
            
              <Pressable
                onPress={() => removePromocode(promocode)}
                className="rounded-full border border-typography-light p-0.5 active:bg-typography-light"
              >
                <Icon as={XIcon2} className="h-3 w-3 text-typography-light" />
              </Pressable>
            </HStack>
          ))}
        </VStack>
      )}

      {!!cart?.giftProducts?.length && (
        <CartGifts products={cart?.giftProducts} />
      )}
      {cart?.items.length === 0 ? (
        <Text className="mt-8 text-center text-2xl font-bold text-typography-accent">
          {t("cartScreen.emptyCart")}
        </Text>
      ) : (
        <>
          <HStack className="mt-6 justify-between">
            <Text className="text-xl font-bold text-typography-accent">
              {t("cartScreen.deliveryPrice")}:
            </Text>
            <Text className="text-xl font-bold text-primary-main">
              {cart?.deliveryPrice
                ? cart?.deliveryPrice + " ₽"
                : t("cartScreen.free")}
            </Text>
          </HStack>
          <HStack className="mt-2 justify-between">
            <Text className="text-xl font-bold text-typography-accent">
              {t("cartScreen.totalPrice")}:
            </Text>
            <Text className="text-xl font-bold text-primary-main">
              {cart?.sum} ₽
            </Text>
          </HStack>
        </>
      )}

      <VStack>
        {cart?.items.map((item) => <CartProduct key={item.id} item={item} />)}
      </VStack>

      <Button
        className="my-4 rounded-none bg-primary-main"
        onPress={() => router.push("/cart/checkout")}
        isDisabled={isPending || !cart || cart?.minPrice > cart?.originalSum}
      >
        <Text className="font-bold text-background">
          {t("cartScreen.makeOrder")}
        </Text>
      </Button>
    </Box>
  );
}
