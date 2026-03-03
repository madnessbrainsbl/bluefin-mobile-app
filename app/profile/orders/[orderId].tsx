import { Box } from "@/components/ui/box";
import { Divider } from "@/components/ui/divider";
import { HStack } from "@/components/ui/hstack";
import { Image } from "@/components/ui/image";
import { LoadingDots } from "@/components/ui/LoadingDots";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useCart } from "@/hooks/useCart";
import { useOrders } from "@/hooks/useOrders";
import { Link, useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import { Pressable } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

export default function OrderScreen() {
  const { orderId } = useLocalSearchParams();
  const { isPending: ordersIsPending, data: orders } = useOrders();
  const { isPending: cartIsPending, data: cart } = useCart();

  const order = orders?.find((order) => order.id === orderId);
  const paysystem = cart?.paysystems.find((p) => p.id == order?.paySystemId);
  const { t, i18n } = useTranslation();

  if (!order || ordersIsPending || cartIsPending) {
    return (
      <Box className="grow items-center justify-center">
        <LoadingDots />
      </Box>
    );
  }

  return (
    <ScrollView>
      <Box className="items-stretch gap-4 px-4">
        <Box className="items-start">
          <Link href="/profile/orders" className="text-typography-control">
            {"< " + t("ordersScreen.back")}
          </Link>
        </Box>
        <Text className="text-accent text-3xl font-extrabold">{`${t("ordersScreen.orderNumber")} ${order.id}`}</Text>

        <Text className="text-accent text-lg font-bold">
          {t("ordersScreen.orderDetails")}
        </Text>
        <HStack className="justify-between gap-4">
          <VStack className="grow gap-2">
            <VStack>
              <Text className="text-sm">
                {t("ordersScreen.orderNumberText")}
              </Text>
              <Text className="text-accent">{order.id}</Text>
            </VStack>
            <VStack>
              <Text className="text-sm">{t("ordersScreen.orderStatus")}</Text>
              <Text className="text-accent">Принят</Text>
            </VStack>
          </VStack>
          <VStack className="grow gap-2">
            <VStack>
              <Text className="text-sm">{t("ordersScreen.date")}</Text>
              <Text className="text-accent">
                {new Date(order.dateCreated.date).toLocaleDateString(
                  i18n.language,
                )}
              </Text>
            </VStack>
            <VStack>
              <Text className="text-sm">{t("ordersScreen.paysystem")}</Text>
              <Text className="text-accent">{paysystem?.name}</Text>
            </VStack>
          </VStack>
        </HStack>
        <VStack>
          <Text className="text-sm">{t("ordersScreen.comment")}</Text>
          <Text className="text-accent">
            {order.comment ? order.comment : "-"}
          </Text>
        </VStack>

        <Text className="text-accent text-lg font-bold">
          {t("ordersScreen.deliveryAddress")}
        </Text>
        <VStack>
          <Text className="text-sm">{t("profile.addressLine")}</Text>
          <Text className="text-accent">{order.profile.address}</Text>
        </VStack>
        <HStack className="justify-between gap-4">
          <VStack className="grow gap-2">
            <VStack>
              <Text className="text-sm">{t("profile.entrance")}</Text>
              <Text className="text-accent">
                {order.profile.entrance ? order.profile.entrance : "-"}
              </Text>
            </VStack>
            <VStack>
              <Text className="text-sm">{t("profile.floor")}</Text>
              <Text className="text-accent">
                {order.profile.floor ? order.profile.floor : "-"}
              </Text>
            </VStack>
          </VStack>
          <VStack className="grow gap-2">
            <VStack>
              <Text className="text-sm">{t("profile.flat")}</Text>
              <Text className="text-accent">
                {order.profile.flat ? order.profile.flat : "-"}
              </Text>
            </VStack>
            <VStack>
              <Text className="text-sm">{t("profile.intercomCode")}</Text>
              <Text className="text-accent">
                {order.profile.intercomCode ? order.profile.intercomCode : "-"}
              </Text>
            </VStack>
          </VStack>
        </HStack>

        <Text className="text-accent text-lg font-bold">
          {t("ordersScreen.order")}
        </Text>

        <VStack className="gap-4">
          {order.cart.items.map((item) => (
            <Pressable
              key={item.id}
              className="active:bg-outline-light"
              onPress={() => {}}
            >
              <VStack className="items-start">
                <HStack className="gap-2">
                  <Image
                    className="h-24 w-28"
                    source={{ uri: item.product?.image }}
                    alt={item.name}
                  />
                  <VStack className="shrink">
                    <Text className="text-accent">{item.name}</Text>
                    <Text className="text-xs text-typography-light">
                      {item.product.short_desc}
                    </Text>
                  </VStack>
                </HStack>
                <HStack className="gap-4">
                  <VStack className="basis-24">
                    <Text className="text-sm">
                      {t("ordersScreen.quantity")}
                    </Text>
                    <Text className="text-accent">{item.quantity}</Text>
                  </VStack>
                  <VStack className="">
                    <Text className="text-sm">{t("ordersScreen.price")}</Text>
                    {item.discountPercent > 0 ? (
                      <HStack className="items-center gap-2">
                        <Text className="text-xs line-through">
                          {item.originalPrice} ₽
                        </Text>
                        <Text className="rounded bg-primary-main px-2 py-1 text-xs text-background">
                          -{item.discountPercent}%
                        </Text>
                        <Text className="text-primary-main">
                          {item.price} ₽
                        </Text>
                      </HStack>
                    ) : (
                      <Text className="text-primary-main">{item.price} ₽</Text>
                    )}
                  </VStack>
                  <VStack className="basis-24">
                    <Text className="text-sm">{t("ordersScreen.total")}</Text>
                    <Text className="text-primary-main">
                      {item.quantity * item.price} ₽
                    </Text>
                  </VStack>
                </HStack>
              </VStack>
            </Pressable>
          ))}
        </VStack>
        <VStack className="basis-24">
          <Text className="text-sm">{t("ordersScreen.promocodes")}</Text>
          <Text className="text-primary-main">
            {order.cart.promocodes.join(", ")}
          </Text>
        </VStack>

        {!!order.bonusSum && (
          <HStack className="">
            <Text>{t("orderHistoryScreen.bonusSum")}: </Text>
            <Text className="text-accent font-bold">{order.bonusSum}</Text>
          </HStack>
        )}
        <HStack className="">
          <Text>{t("ordersScreen.deliveryPrice")}: </Text>
          <Text className="text-accent font-bold">
            {order.cart.deliveryPrice} ₽
          </Text>
        </HStack>
        <Divider className="" />
        <HStack className="mb-4">
          <Text>{t("ordersScreen.total")}: </Text>
          <Text className="text-accent font-bold">
            {order.cart.sum} ₽{" "}
            {order.bonusSpent > 0
              ? `(${t("orderHistoryScreen.bonusSpent")}: ${order.bonusSpent})`
              : ``}
          </Text>
        </HStack>
      </Box>
    </ScrollView>
  );
}
