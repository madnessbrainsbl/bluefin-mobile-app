import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
} from "../ui/actionsheet";
import { VStack } from "../ui/vstack";
import { HStack } from "../ui/hstack";
import { Text } from "../ui/text";
import { Product } from "@/hooks/useProducts";
import ResponsiveImage from "../ui/ResponsiveImage";
import { useTranslation } from "react-i18next";
import { ProductNutrition } from "../ProductNutrition";
import { ProductBasketControls } from "../ProductBasketControls";
import { ProductAdditives } from "../ProductAdditives";
import { useSheetStore } from "@/hooks/useSheetStore";
import { useAddToCart, useCart } from "@/hooks/useCart";
import { useEffect, useMemo, useState } from "react";
import { use } from "i18next";
import { ScrollView } from "react-native-gesture-handler";
import React from "react";
import { Center } from "../ui/center";
import { Image } from "../ui/image";

export function ProductSheet({
  isOpen,
  product,
}: {
  isOpen: boolean;
  product: Product | null;
}) {
  const { t } = useTranslation();
  const { data: cart } = useCart();

  const quantity =
    cart?.items.find((item) => item.product.id === product?.id)?.quantity ?? 0;

  // const selectedAdditives = cart?.items.find(
  //   (item) => item.product.id === product?.id,
  // )?.additivesIds ?? [];

  const closeSheet = useSheetStore((state) => state.closeSheet);
  const { isPending: addToCartPending, mutate: addToCart } = useAddToCart();

  const [selectedAdditives, setSelectedAdditives] = useState<string[]>([]);
  // const [quantity, setQuantity] = useState(initialQuantity);

  useEffect(() => {
    const cartItem = cart?.items.find(
      (item) => item.product.id === product?.id,
    );
    setSelectedAdditives(cartItem?.additivesIds ?? []);
    // setQuantity(cartItem?.quantity ?? 1);
  }, [product, cart]);

  useEffect(() => {
    if (product && quantity > 0) {
      addToCart({
        product,
        quantity,
        additives: selectedAdditives,
      });
    }
  }, [selectedAdditives]);

  if (!product) return <></>;

  return (
    <Actionsheet isOpen={isOpen} onClose={() => closeSheet()}>
      <ActionsheetBackdrop />
      <ActionsheetContent
        className="rounded-tl-lg rounded-tr-lg pr-4"
        style={{ maxHeight: "80%" }}
      >
        <ActionsheetDragIndicatorWrapper>
          <ActionsheetDragIndicator />
        </ActionsheetDragIndicatorWrapper>
        <ScrollView>
          <VStack className="w-full pr-2 pt-2">
            <Center className="aspect-[14/10] w-full overflow-hidden rounded-lg bg-surface-dark">
              <Image
                size="full"
                source={product?.fullImage}
                alt={product.name}
                className=""
              />
            </Center>

            <HStack className="mt-4 justify-between gap-4">
              <Text
                className="font-bold leading-snug tracking-tight flex-1"
              >
                {product.name?.replace(/&quot;/g, '"').trim()}
              </Text>
              <Text className="font-bold leading-snug tracking-tight text-typography-dark">
                {product.weight
                  ? `${product.weight} ${t("product.gr")}`
                  : "..."}
              </Text>
            </HStack>

            <Text className="mt-4 text-sm leading-snug tracking-tight">
              {product.short_desc?.replace(/&quot;/g, '"').trim()}
            </Text>

            <ProductNutrition className="mt-4" product={product} />

            {Array.isArray(product.additives) &&
              product.additives?.length > 0 && (
                <ProductAdditives
                  className="mt-4"
                  additives={product.additives}
                  values={selectedAdditives}
                  onChange={setSelectedAdditives}
                  // onChange={(a) => addToCart({ productId: product.id, quantity, additives: a })}
                />
              )}
            <ProductBasketControls
              className="mt-4"
              product={product}
              cartItem={cart?.items.find(
                (item) => item.product.id === product.id,
              )}
              additionalPrice={selectedAdditives.reduce(
                (acc, id) =>
                  acc +
                  (product.additives?.find((a) => a.id === id)?.price ?? 0),
                0,
              )}
              // addToCart={() => addToCart({ productId: product.id, quantity, additives: selectedAdditives })}
              addToCartPending={addToCartPending}
              quantity={quantity ?? 1}
              setQuantity={(q) =>
                addToCart({
                  product,
                  quantity: q,
                  additives: selectedAdditives,
                })
              }
              // setQuantity={setQuantity}
            />
          </VStack>
        </ScrollView>
      </ActionsheetContent>
    </Actionsheet>
  );
}
