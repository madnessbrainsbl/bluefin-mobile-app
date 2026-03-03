import { Product } from "@/hooks/useProducts";
import { useTranslation } from "react-i18next";
import { Text } from "../ui/text";
import { VStack } from "../ui/vstack";
import { HStack } from "../ui/hstack";
import { Image } from "../ui/image";
import { Box } from "../ui/box";
import { Button } from "../ui/button";
import { useAddToCart } from "@/hooks/useCart";
import React from "react";

export function CartGifts({ products }: { products: Product[] }) {
  const { t } = useTranslation();
  const { isPending: addToCartPending, mutate: addCartItem } = useAddToCart();

  return (
    <>
      <Text className="my-4 text-2xl font-semibold">
        {t("cartScreen.chooseGift")}
      </Text>
      <VStack className="gap-2">
        {products.map((product) => (
          <HStack key={product.id} className="justify-start gap-4 bg-background p-2">
            <Image
              className="h-24 w-24"
              source={product.image}
              alt={product.name.replace(/&quot;/g, '"')}
            />
            <VStack className="grow justify-between">
              <Text>{product.name}</Text>
              <Box className="flex flex-row justify-end">
                <Button
                  className="bg-primary-main"
                  isDisabled={addToCartPending}
                  onPress={() =>
                    addCartItem({
                      product,
                      quantity: 1,
                      additives: [],
                    })
                  }
                >
                  <Text className="text-background">{t("cartScreen.choose")}</Text>
                </Button>
              </Box>
            </VStack>
          </HStack>
        ))}
      </VStack>
    </>
  );
}
