import { Product } from "@/hooks/useProducts";
import { Box } from "./ui/box";
import { Image } from "./ui/image";
import { Pressable } from "./ui/pressable";
import { Text } from "./ui/text";
import { VStack } from "./ui/vstack";
import { Heading } from "./ui/heading";
import { HStack } from "./ui/hstack";
import { useTranslation } from "react-i18next";
import { Button } from "./ui/button";
import ResponsiveImage from "./ui/ResponsiveImage";
import AutoHeightImage from "./ui/AutoHeightImage";
import { cn } from "@/lib/helpers";
import { Center } from "./ui/center";
import { useAddToCart, useCart } from "@/hooks/useCart";
import { LoadingDots } from "./ui/LoadingDots";

export function ProductCard({
  product,
  className,
  width,
  onPress = () => {},
}: {
  product: Product;
  className?: string;
  width?: number;
  onPress?: () => void;
}) {
  const { t } = useTranslation();
  const { data: cart } = useCart();

  const cartItem = cart?.items.find((item) => item.product.id === product.id);
  const displayPrice = cartItem ? cartItem.price : product.price;

  return (
    <Pressable
      className={className}
      style={{ width: width ? width : 300 }}
      onPress={onPress}
    >
      <VStack className="h-auto overflow-hidden rounded-lg border-[1px] border-outline-main bg-background">
        <Center className="aspect-[14/10] w-full bg-surface-dark">
          <Image
            // className="w-full"
            size="full"
            source={product.image}
            alt={product.name.replace(/&quot;/g, '"')}
          />
          {cartItem && (
            <Box className="absolute bottom-2 right-2 flex h-5 w-5 flex-row items-center justify-center rounded-full bg-primary-main p-0">
              <Text className="text-sm font-bold text-background">{cartItem.quantity}</Text>
            </Box>
          )}
        </Center>

        <VStack className="gap-2 px-3.5 py-2.5">
          <Text
            numberOfLines={2}
            className="h-8 text-sm font-bold leading-[1.3em]"
          >
            {product.name.replace(/&quot;/g, '"')}
          </Text>

          <HStack className="mt-auto items-center justify-between">
            <Text className="text-sm text-typography-light">
              {displayPrice + " ₽"}
            </Text>

            <Text className="ml-2 shrink-0 text-xs font-bold leading-[1.3em] text-typography-dark">
              {product.weight ? product.weight + " " + t("product.gr") : ""}
            </Text>
          </HStack>

          {/* <Button className="bg-primary-main" onPress={onPress}>
            <Text className="text-background">{t("product.order")}</Text>
          </Button> */}

          {cartItem ? (
            <Button
              variant="outline"
              className="bg-background border-primary-main"
              onPress={onPress}
            >
              <Text className="text-primary-main">
                {t("product.inCart")}
              </Text>
              {/* <Box className="flex h-5 w-5 flex-row items-center justify-center rounded-full bg-primary-main p-0">
                <Text className="text-sm font-bold text-background">{cartItem.quantity}</Text>
              </Box> */}
            </Button>
          ) : (
            <Button
              className="bg-primary-main"
              onPress={onPress}
            >
              <Text className="text-background">
                {t("product.order")}
              </Text>
            </Button>
          )}
        </VStack>
      </VStack>
    </Pressable>
  );
}
