import {
  CartItem,
  useAddToCart,
  useCart,
  useRemoveCartItem,
} from "@/hooks/useCart";
import { Box } from "../ui/box";
import { Text } from "../ui/text";
import { HStack } from "../ui/hstack";
import { AddIcon, Icon, RemoveIcon } from "../ui/icon";
import { useTranslation } from "react-i18next";
import { Button } from "../ui/button";
import MinusIcon from "../icons/MinusIcon";
import PlusIcon from "../icons/PlusIcon";
import { Center } from "../ui/center";
import ResponsiveImage from "../ui/ResponsiveImage";
import { Pressable } from "../ui/pressable";
import TrashIcon from "../icons/TrashIcon";
import { cn } from "@gluestack-ui/nativewind-utils/cn";
import { LoadingDots } from "../ui/LoadingDots";
import { ProductAdditives } from "../ProductAdditives";
import { Image } from "../ui/image";
import React from "react";

export function CartProduct({ item }: { item: CartItem }) {
  const { t } = useTranslation();

  //TODO make optimistic update
  //TODO add debouncer
  const { isPending: cartPending, isFetching } = useCart();
  const { isPending: addToCartPending, mutate: addCartItem } = useAddToCart();
  const { isPending: removeCartItemPending, mutate: removeCartItem } =
    useRemoveCartItem();

  const isPending =
    cartPending || isFetching || addToCartPending || removeCartItemPending;

  return (
    <Box
      className={cn("mt-4 bg-background p-4", { "opacity-70": addToCartPending })}
    >
      <HStack className="items-stretch justify-between gap-4">
        <Text className="shrink grow basis-0 font-medium" numberOfLines={2}>
          {item.name}
        </Text>
        <Pressable
          className="active:bg-typography-control"
          disabled={addToCartPending || removeCartItemPending}
          onPress={() => removeCartItem({ product: item.product })}
        >
          <Icon
            as={TrashIcon}
            className="h-8 w-8 fill-none text-typography-dark"
          />
        </Pressable>
      </HStack>
      <Text className="mt-2 text-xs leading-snug tracking-tight text-typography-muted">
        {t("product.weight")}: {item.product.weight} {t("product.gr")}
      </Text>
      <Text className="mt-2 text-xs leading-snug tracking-tight text-typography-muted">
        {item.product.short_desc}
      </Text>
      <Center className="my-4 aspect-[11/8] w-full bg-surface-dark">
        <Image
          size="full"
          source={item.product.fullImage}
          alt={item.name.replace(/&quot;/g, '"')}
        />
      </Center>

      {Array.isArray(item.product.additives) &&
        item.product.additives?.length > 0 && (
          <ProductAdditives
            className="my-4"
            disabled={isPending}
            additives={item.product.additives}
            values={item.additivesIds ?? []}
            onChange={(additives) =>
              addCartItem({
                product: item.product,
                quantity: item.quantity,
                additives: additives,
              })
            }
          />
        )}

      <HStack className="flex-wrap items-center justify-between gap-y-4">
        <HStack className="items-center gap-2">
          <Button
            className="h-10 w-10 bg-surface-control p-4"
            isDisabled={item.quantity === 1 || isPending}
            onPress={() => {
              addCartItem({
                product: item.product,
                quantity: Math.max(item.quantity - 1, 1),
                additives: item.additivesIds,
              });
            }}
          >
            {/* <ButtonIcon className="stroke-typography-control fill-typography-control  p-0" as={MinusIcon} />  */}
            <RemoveIcon className="h-6 w-6 stroke-typography-control" />
          </Button>

          <Text className="w-6 text-center">{item.quantity}</Text>
          <Button
            className="h-10 w-10 bg-surface-control p-4"
            isDisabled={isPending}
            onPress={() =>
              addCartItem({
                product: item.product,
                quantity: item.quantity + 1,
                additives: item.additivesIds,
              })
            }
          >
            <AddIcon className="h-6 w-6 stroke-typography-control" />
          </Button>
        </HStack>
        <HStack className="items-center gap-2">
          {isPending && <LoadingDots />}
          {!isPending && (
            <>
              {item.discountPercent > 0 && (
                <>
                  <Text className="font-semibold leading-snug tracking-tight line-through">
                    {Number(item.originalPrice) * item.quantity} ₽
                  </Text>
                  <Text className="rounded bg-primary-light p-1 font-semibold leading-snug tracking-tight text-background">
                    -{Number(item.discountPercent)} %
                  </Text>
                </>
              )}
              <Text className="text-2xl font-semibold leading-snug tracking-tight text-primary-light">
                {Number(item.price) * item.quantity} ₽
              </Text>
            </>
          )}
        </HStack>
      </HStack>
    </Box>
  );
}
