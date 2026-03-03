import { Button } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useAddToCart, useCart, useClearCart } from "@/hooks/useCart";
import { useOrders } from "@/hooks/useOrders";
import i18n from "@/lib/i18n";
import { useTranslation } from "react-i18next";
import { ScrollView } from "react-native-gesture-handler";
import { router } from "expo-router";
import { Box } from "@/components/ui/box";
import { LoadingDots } from "@/components/ui/LoadingDots";
import { Center } from "@/components/ui/center";
import { useState } from "react";
import { useCatalogStore } from "@/hooks/useCatalogStore";
import { usePaysystems } from "@/hooks/usePaysystems";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { Platform } from "react-native";

export default function OrdersScreen() {
  const { t } = useTranslation();
  const { isPending: ordersIsPending, data: orders } = useOrders();
  const { isPending: cartIsPending, data: cart } = useCart();
  const { isPending: paysystemsIsPending, data: paysystems } = usePaysystems();

  const { mutateAsync: addToCart } = useAddToCart();
  const { mutateAsync: clearCart } = useClearCart();
  // const promocodes = useCatalogStore((state) => state.promocodes);
  const setPromocodes = useCatalogStore((state) => state.setPromocodes);

  const [reapeatPending, setRepeatPending] = useState(false);
  async function repeatOrder(orderId: string) {
    const order = orders?.find((order) => order.id === orderId);
    if (!order) return;
    setRepeatPending(true);
    await clearCart();
    setPromocodes(order.cart.promocodes);

    const promises = [];
    for (const item of order.cart.items) {
      promises.push(
        addToCart({
          product: item.product,
          quantity: item.quantity,
          additives: item.additivesIds,
        }),
      );
    }

    await Promise.allSettled(promises);
    setRepeatPending(false);
    router.push("/cart");
  }

  async function downloadInvoice(orderId: string) {
    const invoiceDir = FileSystem.cacheDirectory + "invoices/";

    const dirInfo = await FileSystem.getInfoAsync(invoiceDir);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(invoiceDir, { intermediates: true });
    }

    const fileUri = invoiceDir + `bluefin_invoice_${orderId}.pdf`;
    const fileInfo = await FileSystem.getInfoAsync(fileUri);

    if (!fileInfo.exists) {
      const fileUrl = `${process.env.EXPO_PUBLIC_INVOICE_URL}/?id=${orderId}`;
      await FileSystem.downloadAsync(fileUrl, fileUri);
    }

    return fileUri;
  }

  async function shareInvoice(orderId: string) {
    //TODO add error handler
    const fileUri = await downloadInvoice(orderId);
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(fileUri, {
        UTI: "pdf",
        mimeType: "application/pdf",
      });
    }
  }

  async function saveInvoice(orderId: string) {
    //TODO add error handler
    const fileUri = await downloadInvoice(orderId);
    const permissions =
      await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
    if (!permissions.granted) {
      return;
    }

    try {
      const base64Data = await FileSystem.readAsStringAsync(fileUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      await FileSystem.StorageAccessFramework.createFileAsync(
        permissions.directoryUri,
        `bluefin_invoice_${orderId}.pdf`,
        "application/pdf",
      )
        .then(async (uri) => {
          await FileSystem.writeAsStringAsync(uri, base64Data, {
            encoding: FileSystem.EncodingType.Base64,
          });
        })
        .catch((e) => {
          console.error(e);
        });
    } catch (e) {
      console.error(e);
    }
  }

  if (reapeatPending)
    return (
      <Box className="grow items-center justify-center gap-8">
        <Text className="text-lg">
          {t("orderHistoryScreen.repeatingOrder")}
        </Text>
        <LoadingDots />
      </Box>
    );

  if (ordersIsPending || cartIsPending)
    return (
      <Box className="grow items-center justify-center">
        <LoadingDots />
      </Box>
    );

  return (
    <ScrollView>
      <VStack className="mt-2 items-start justify-between gap-4 px-4">
        <Text className="text-3xl font-extrabold text-accent">
          {t("orderHistoryScreen.ordersHistory")}
        </Text>

        {orders?.map((order) => {
          const paysystem = paysystems?.find((p) => p.id === order.paySystemId);

          let status = t("orderHistoryScreen.accepted");
          if (order.isOnlinePayment && order.isPaid) {
            status = t("orderHistoryScreen.paid");
          } else if (order.isOnlinePayment) {
            status = t("orderHistoryScreen.awaitingPayment");
          }
          
          return (
            <VStack key={order.id} className="items-start gap-1">
              <Text className="text-accent">{`${t("orderHistoryScreen.orderNumber")} ${order.id}, ${new Date(order.dateCreated.date).toLocaleDateString(i18n.language)}`}</Text>
              <Text className="text-accent">{status}</Text>
              <Text className="text-accent">{paysystem?.name ?? ""}</Text>
              {!!order.bonusSum && <Text className="text-accent">{`${t("orderHistoryScreen.bonusSum")}`}{' '}{order.bonusSum}</Text>}
              <Text className="text-primary-main">{order.cart.sum} ₽ {order.bonusSpent > 0 ? `(${t('orderHistoryScreen.bonusSpent')}: ${order.bonusSpent})` : ``}</Text>

              <HStack className="flex-wrap gap-4">
                {paysystem?.code === "BILL" && Platform.OS === "ios" && (
                  <Button
                    className="rounded-none bg-primary-main"
                    onPress={() => shareInvoice(order.id)}
                    isDisabled={reapeatPending}
                  >
                    <Text className="text-background">
                      {t("orderHistoryScreen.shareInvoice")}
                    </Text>
                  </Button>
                )}
                {paysystem?.code === "BILL" && Platform.OS === "android" && (
                  <HStack className="flex-wrap gap-4">
                    <Button
                      className="rounded-none bg-primary-main"
                      onPress={() => shareInvoice(order.id)}
                      isDisabled={reapeatPending}
                    >
                      <Text className="text-background">
                        {t("orderHistoryScreen.shareInvoice")}
                      </Text>
                    </Button>
                    <Button
                      className="rounded-none bg-primary-main"
                      onPress={() => saveInvoice(order.id)}
                      isDisabled={reapeatPending}
                    >
                      <Text className="text-background">
                        {t("orderHistoryScreen.downloadInvoice")}
                      </Text>
                    </Button>
                  </HStack>
                )}
                {/*
                    <?if ($psCode === "ONLINE" && $arOrder["SUM_PAID"] == $arOrder["PRICE"]) :?>
                        Оплачен
                    <?elseif ($psCode === "ONLINE") :?>
                        Принят, ожидается оплата
                    <?else:?>
                        Принят
                    <?endif?>

                    <? if ($psCode === "BILL"): ?>
                        <a target="_blank" href="/personal/invoice/?id=<?=$arOrder['ID']?>" class="btn btn-primary">PDF счета</a>
                    <?elseif (($psCode === "ONLINE") && $arOrder["SUM_PAID"] < $arOrder["PRICE"]):?>
                        <a target="_blank" href="/checkout?ORDER_ID=<?=$arOrder['ID']?>" class="btn btn-primary">Оплатить</a>    
                    <? else: ?>
                */}

                {order.isOnlinePayment && !order.isPaid && (
                  <Button
                    className="w-44 rounded-none bg-primary-main"
                    onPress={() => router.push(`/payment/${order.id}`)}
                    isDisabled={reapeatPending}
                  >
                    <Text className="text-background">
                      {t("orderHistoryScreen.pay")}
                    </Text>
                  </Button>
                )}
                {(!order.isOnlinePayment ||
                  (order.isOnlinePayment && order.isPaid)) && (
                  <Button
                    className="w-44 rounded-none bg-primary-main"
                    onPress={() => repeatOrder(order.id)}
                    isDisabled={reapeatPending}
                  >
                    <Text className="text-background">
                      {t("orderHistoryScreen.repeat")}
                    </Text>
                  </Button>
                )}
                <Button
                  className="rounded-none border-primary-main bg-background"
                  variant="outline"
                  onPress={() => router.push(`/profile/orders/${order.id}`)}
                >
                  <Text>{t("orderHistoryScreen.details")}</Text>
                </Button>
              </HStack>
            </VStack>
          );
        })}
      </VStack>
    </ScrollView>
  );
}
