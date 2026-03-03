import { useTranslation } from "react-i18next";
import { Button } from "./ui/button";
import { HStack } from "./ui/hstack";
import { Text } from "./ui/text";
import { Product } from "@/hooks/useProducts";
import MinusIcon from "./icons/MinusIcon";
import PlusIcon from "./icons/PlusIcon";
import { cn } from "@/lib/helpers";
import { LoadingDots } from "./ui/LoadingDots";
import { CartItem } from "@/hooks/useCart";
import React from "react";

export function ProductBasketControls({
  className,
  product,
  cartItem,
  additionalPrice = 0,
  quantity,
  setQuantity,
  addToCartPending,
}: {
  className?: string;
  product: Product;
  cartItem?: CartItem;
  additionalPrice: number;
  quantity: number;
  setQuantity: (quantity: number) => void;
  addToCartPending: boolean;
}) {
  const { t } = useTranslation();

  const unitPrice = cartItem ? cartItem.price : product.price + additionalPrice;
  const totalPrice = unitPrice * Math.max(quantity, 1);

  return (
    <>
      <HStack className={cn("items-center justify-between gap-4", className)}>
        {addToCartPending ? (
          <LoadingDots />
        ) : (
          <Text className="text-xl font-bold text-primary-main">
            {totalPrice} ₽
          </Text>
        )}
        {!cartItem ? (
          <Button
            className={cn("h-12 bg-primary-main")}
            variant="solid"
            isDisabled={addToCartPending}
            onPress={() => setQuantity(quantity + 1)}
          >
            <Text className="font-bold text-background">{t("product.order")}</Text>
          </Button>
        ) : (
          <HStack className="items-center gap-4">
            <Button
              className="h-12 w-12 bg-surface-control p-4"
              onPress={() => setQuantity(Math.max(quantity - 1, 0))}
            >
              <MinusIcon />
            </Button>

            <Text className="w-4 text-center">{quantity}</Text>
            <Button
              className="h-12 w-12 bg-surface-control p-4"
              onPress={() => setQuantity(quantity + 1)}
            >
              <PlusIcon />
            </Button>
          </HStack>
        )}
      </HStack>
    </>
  );
}
