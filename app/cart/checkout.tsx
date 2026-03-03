import { DeliveryProfileForm } from "@/components/Checkout/DeliveryProfileForm";
import { DeliveryTime } from "@/components/Checkout/DeliveryTime";
import { Box } from "@/components/ui/box";
import { Button } from "@/components/ui/button";
import {
  Checkbox,
  CheckboxGroup,
  CheckboxIcon,
  CheckboxIndicator,
  CheckboxLabel,
} from "@/components/ui/checkbox";
import { HStack } from "@/components/ui/hstack";
import { CheckIcon, CircleIcon } from "@/components/ui/icon";
import { Input } from "@/components/Input";
import { MaskedInput } from "@/components/MaskedInput";
import {
  Radio,
  RadioGroup,
  RadioIcon,
  RadioIndicator,
  RadioLabel,
} from "@/components/ui/radio";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useAuthStore } from "@/stores/authStore";
import { useCart } from "@/hooks/useCart";
import { useCatalogStore } from "@/hooks/useCatalogStore";
import {
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { router, useFocusEffect } from "expo-router";
import { useUserProfiles } from "@/hooks/useUserProfiles";
import { useQueryClient } from "@tanstack/react-query";
import { unMask } from "react-native-mask-text";
import { useDialogModal } from "@/components/ModalDialog";
import { LoadingDots } from "@/components/ui/LoadingDots";
import { Textarea } from "@/components/Textarea";
import { useSheetStore } from "@/hooks/useSheetStore";
import { useUser } from "@/hooks/useUser";
import {
  CreateOrderParams,
  useCreateOrderMutation,
} from "@/hooks/useCreateOrderMutation";
import AppMetrica, { ECommerce } from "@appmetrica/react-native-analytics";
import { makeECommerceProduct } from "@/lib/helpers";
import { useCategories } from "@/hooks/useCategories";
import { Keyboard, KeyboardAvoidingView, Platform } from "react-native";
import { CartLayoutContext } from "./_layout";
import { useTrackingPermissions } from "expo-tracking-transparency";
import { cn } from "@gluestack-ui/nativewind-utils/cn";
import { useOsmiEstimation, useOsmiProfile } from "@/hooks/useOsmi";

export default function CheckoutScreen() {
  const { t } = useTranslation();
  const QueryClient = useQueryClient();
  const showDialogModal = useDialogModal((state) => state.showDialogModal);
  const openSheet = useSheetStore((state) => state.openSheet);
  const screenView = useContext(CartLayoutContext);

  const { data: user } = useUser();
  const profile = useCatalogStore((state) => state.profile);
  const promocodes = useCatalogStore((state) => state.promocodes);

  const [paysystemId, setPaysystemId] = useState<string | undefined>();
  const { data: cart, refetch } = useCart(paysystemId);

  //TODO make custom hook to extract category path
  const { data: categories } = useCategories();
  const viewCategoryId = useCatalogStore((state) => state.viewCategoryId);

  const [username, setUsername] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [showOtherPerson, setShowOtherPerson] = useState(false);
  const [otherPersonName, setOtherPersonName] = useState("");
  const [otherPersonNumber, setOtherPersonNumber] = useState("");
  const [showDeliverOnTime, setShowDeliverOnTime] = useState(false);
  const [deliveryDateTime, setDeliveryDateTime] = useState("");
  const [personNumber, setPersonNumber] = useState("1");
  const [requestedBonusPayment, setRequestedBonusPayment] = useState("");
  const [bonusEstimation, setBonusEstimation] = useState(0);
  const [comment, setComment] = useState("");

  const { data: osmiProfile, refetch: refetchOSMIProfile } = useOsmiProfile();
  const { mutateAsync: getBonusEstimation } = useOsmiEstimation();

  useEffect(() => {
    let isMounted = true;
    getBonusEstimation({
      requestedBonusPayment: requestedBonusPayment
        ? Number(requestedBonusPayment)
        : 0,
        paysystemId: paysystemId ?? '2',
        promocodes
      // orderSum: (cart?.sum ?? 0) + (cart?.deliveryPrice ?? 0),
    }).then((bonusSum) => {
      if (isMounted) {
        setBonusEstimation(bonusSum);
      }
    });
    return () => {
      isMounted = false; // Set flag to false when component unmounts
    };
  }, [cart?.sum, cart?.items, cart?.deliveryPrice, requestedBonusPayment]);

  useEffect(() => {
    if (Number(requestedBonusPayment) > (cart?.maxBonus ?? 0)) {
      setRequestedBonusPayment(cart?.maxBonus ? String(cart?.maxBonus) : "0");
    }
  }, [cart?.maxBonus]);

  useEffect(() => {
    setUsername(user?.name ?? "");
    setEmail(user?.email ?? "");
  }, [user]);

  useEffect(() => {
    if (!paysystemId && cart?.paysystems?.length) {
      setPaysystemId(cart.paysystems[0].id);
    }
  }, [cart?.paysystems, paysystemId]);

  const paysystem = cart?.paysystems?.find(
    (paysystem) => paysystem.id === paysystemId,
  );

  const [cashChange, setCashChange] = useState("");

  const [agreedToTerms, setAgreedToTerms] = useState(true);

  const userToken = useAuthStore((state) => state.userToken);

  useFocusEffect(
    useCallback(() => {
      if (!userToken) {
        openSheet({
          sheet: "phone",
          params: {},
          onClose: () => {},
        });
      }
    }, [userToken, openSheet]),
  );

  const {
    useUserProfileUpdateMutation: { mutateAsync: updateUserProfile },
  } = useUserProfiles();

  const { isPending: isOrderCreationPending, mutate: createOrderMutate } =
    useCreateOrderMutation();

  const [trackingPermissionStatus] = useTrackingPermissions();

  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  const prevalidate = () => {
    const errors: Record<string, string> = {};
    if (!username.trim()) {
      errors.username = t("checkoutScreen.validationErrors.emptyName");
    }

    if (!email.trim()) {
      errors.email = t("checkoutScreen.validationErrors.emptyEmail");
    }

    if (!profile) {
      errors.profile = t("checkoutScreen.validationErrors.emptyProfile");
    }

    if (!paysystem) {
      errors.paysystem = t("checkoutScreen.validationErrors.emptyPaysystem");
      showDialogModal({ message: errors.paysystem });
    }

    setValidationErrors(errors);

    if (Object.keys(errors).length > 0) {
      screenView?.current?.scrollTo({ x: 0, y: 0, animated: true });
      return false;
    }

    return true;
  };

  const createOrder = (params: CreateOrderParams) =>
    createOrderMutate(params, {
      onSuccess: (data) => {
        QueryClient.invalidateQueries({ queryKey: ["cart"] });

        profile &&
          updateUserProfile(profile).then(() =>
            QueryClient.invalidateQueries({ queryKey: ["userProfiles"] }),
          );

        QueryClient.invalidateQueries({ queryKey: ["user"] });

        const purchase = ECommerce.purchaseEvent({
          orderId: String(data.id),
          products:
            cart?.items.map((item) => ({
              product: {
                ...makeECommerceProduct(
                  { ...item.product },
                  categories,
                  viewCategoryId ?? categories[0].id,
                ),
                originalPrice: {
                  amount: { amount: item.originalPrice, unit: "RUB" },
                },
                actualPrice: {
                  amount: { amount: item.price, unit: "RUB" },
                },
              },
              quantity: item.quantity,
              price: {
                amount: { amount: item.price * item.quantity, unit: "RUB" },
              },
            })) ?? [],
        });
        // Sending an e-commerce event.
        if (trackingPermissionStatus?.granted) {
          AppMetrica.reportECommerce(purchase);
        }

        if (data?.isOnlinePayment) {
          router.push(`/payment/${data.id}`);
        } else {
          QueryClient.invalidateQueries({ queryKey: ["orders"] });
          showDialogModal({ message: t("modal.orderCreated") });
          router.push("/");
        }
      },
      onError: (err) => {
        showDialogModal({ message: err.message });
      },
    });

  
  // const { data: maxBonus } = useOsmiMaxBonus();
  // const maxBonus = 0;

  if (!userToken) {
    return (
      <Box className="flex items-center justify-center gap-4 py-4">
        <Text className="text-center text-xl text-typography-accent">
          {t("checkoutScreen.unathorized")}
        </Text>
        <Button
          className="bg-primary-main"
          onPress={() =>
            openSheet({
              sheet: "phone",
              params: {},
              onClose: () => {},
            })
          }
        >
          <Text className="font-bold text-background">
            {t("checkoutScreen.authorize")}
          </Text>
        </Button>
      </Box>
    );
  }

  return (
    <Box className="py-4">
      <Text className="text-3xl font-extrabold text-typography-accent">
        {t("checkoutScreen.checkout")}
      </Text>
      <VStack className="my-4 gap-4">
        {/* <MaskedInput
          mask="+7 (999) 999-99-99"
          label={t("checkoutScreen.phone") + " *"}
          value={user?.phone ?? ""}
          onChange={() => { }}
          isDisabled={true}
        /> */}
        <Input
          className={cn({
            "border-error-500":
              !!validationErrors.username && username.trim() === "",
          })}
          label={t("checkoutScreen.name") + " *"}
          value={username}
          onChange={(value) => setUsername(value)}
        />
        {!!validationErrors.username && username.trim() === "" && (
          <Text className="text-xs text-typography-error">
            {validationErrors.username}
          </Text>
        )}
        <Input
          className={cn({
            "border-error-500": !!validationErrors.email && email.trim() === "",
          })}
          label={t("checkoutScreen.email") + " *"}
          value={email}
          onChange={(value) => setEmail(value)}
        />
        {!!validationErrors.email && email.trim() === "" && (
          <Text className="text-xs text-typography-error">
            {validationErrors.email}
          </Text>
        )}
        <Text className="text-2xl font-semibold leading-snug tracking-tight text-typography-accent">
          {t("checkoutScreen.delivery")}
        </Text>

        <DeliveryProfileForm isError={validationErrors.profile} />

        <HStack className="gap-4">
          <Input
            className="grow basis-0"
            label={t("checkoutScreen.personNumber")}
            value={personNumber}
            onChange={(value) => setPersonNumber(value)}
          />

          <Box className="grow basis-0"></Box>
        </HStack>

        <CheckboxGroup
          className="gap-4"
          value={showOtherPerson ? ["true"] : []}
          onChange={(isSelected) => {
            setShowOtherPerson(!!isSelected.length);
          }}
        >
          <Checkbox
            // size="md"
            className="items-center"
            value="true"
            onChange={() => {
              // updateNotificationFlagsMutation({notificationFlags: ["phone"], userToken});
            }}
          >
            <CheckboxIndicator className="border-[1px] border-outline-light bg-background data-[checked=true]:border-0 data-[checked=true]:bg-primary-main">
              <CheckboxIcon as={CheckIcon} className="color-background" />
            </CheckboxIndicator>
            <CheckboxLabel className="px-2">
              {t("checkoutScreen.takeByAnotherPerson")}
            </CheckboxLabel>
          </Checkbox>
        </CheckboxGroup>

        {showOtherPerson && (
          <HStack className="gap-4">
            <Input
              className="shrink grow basis-0"
              label={t("checkoutScreen.anotherPersonName")}
              value={otherPersonName}
              onChange={(value) => setOtherPersonName(value)}
            />
            <MaskedInput
              keyboardType="phone-pad"
              mask="+7 (999) 999-99-99"
              placeholder="+7 (___) ___-__-__"
              className="shrink grow basis-0"
              label={t("checkoutScreen.phone")}
              value={otherPersonNumber}
              onChange={(value) => setOtherPersonNumber(value)}
            />
          </HStack>
        )}

        <Text className="text-2xl font-semibold leading-snug tracking-tight text-typography-accent">
          {t("checkoutScreen.whenToDeliver")}
        </Text>

        <RadioGroup
          value={showDeliverOnTime ? "ontime" : "now"}
          onChange={(isSelected) =>
            setShowDeliverOnTime(isSelected === "ontime")
          }
        >
          <VStack className="gap-4">
            <Radio value="now">
              <RadioIndicator className="border-[1px] border-primary-main bg-background data-[checked=true]:border-[1px] data-[checked=true]:border-primary-main data-[checked=true]:bg-background">
                <RadioIcon
                  as={CircleIcon}
                  className="bg-surface-checkbox fill-primary-main stroke-primary-main"
                />
              </RadioIndicator>
              <RadioLabel className="font-semibold tracking-tight">
                {t("checkoutScreen.deliverNow")}
              </RadioLabel>
            </Radio>
            <Radio value="ontime">
              <RadioIndicator className="border-[1px] border-primary-main bg-background data-[checked=true]:border-[1px] data-[checked=true]:border-primary-main data-[checked=true]:bg-background">
                <RadioIcon
                  as={CircleIcon}
                  className="bg-surface-checkbox fill-primary-main stroke-primary-main"
                />
              </RadioIndicator>
              <RadioLabel className="font-semibold tracking-tight">
                {t("checkoutScreen.selectDataAndTime")}
              </RadioLabel>
            </Radio>
          </VStack>
        </RadioGroup>

        {showDeliverOnTime && <DeliveryTime onChange={setDeliveryDateTime} />}

        <Text className="text-2xl font-semibold leading-snug tracking-tight text-typography-accent">
          {t("checkoutScreen.requestedBonusPayment")}{" "}
          {`(${osmiProfile?.bonusBalance ?? 0})`}
        </Text>

        {/* <HStack className="gap-4"> */}
        <Input
          className="grow basis-0"
          keyboardType="numeric"
          label={t("checkoutScreen.maxBonus") + ` (${cart?.maxBonus ?? 0})`}
          value={String(requestedBonusPayment)}
          onChange={async (value) => {
            const numVal = value ? Number(value) : 0;

            if (numVal > (cart?.maxBonus ?? 0)) {
              setRequestedBonusPayment(
                cart?.maxBonus ? String(cart?.maxBonus) : "",
              );
            } else {
              setRequestedBonusPayment(value);
            }

            const bonusSum = await getBonusEstimation({
              requestedBonusPayment: numVal,
              paysystemId: paysystemId ?? '2',
              promocodes
              // orderSum: (cart?.sum ?? 0) + (cart?.deliveryPrice ?? 0),
            });
            setBonusEstimation(bonusSum);
          }}
        />

        {/* <Box className="grow basis-0"></Box> */}
        {/* </HStack> */}

        <Text className="text-2xl font-semibold leading-snug tracking-tight text-typography-accent">
          {t("checkoutScreen.paymentType")}
        </Text>
        {cart?.paysystems && (
          <RadioGroup
            value={paysystemId}
            onChange={(isSelected) => setPaysystemId(isSelected)}
          >
            <VStack className="gap-4">
              {cart.paysystems.map((paysystem) => (
                <Radio value={paysystem.id} key={paysystem.id}>
                  <RadioIndicator className="border-[1px] border-primary-main bg-background data-[checked=true]:border-[1px] data-[checked=true]:border-primary-main data-[checked=true]:bg-background">
                    <RadioIcon
                      as={CircleIcon}
                      className="bg-surface-checkbox fill-primary-main stroke-primary-main"
                    />
                  </RadioIndicator>
                  <RadioLabel className="font-semibold tracking-tight">
                    {paysystem.name}
                  </RadioLabel>
                </Radio>
              ))}
            </VStack>
          </RadioGroup>
        )}
      </VStack>

      {paysystem?.code === "CASH" && (
        <Input
          className="mb-4"
          keyboardType="numeric"
          label={t("checkoutScreen.cashChange")}
          value={cashChange}
          onChange={(value) => setCashChange(value)}
        />
      )}

      <Textarea
        label={t("checkoutScreen.comment")}
        value={comment}
        onChange={setComment}
      />

      <CheckboxGroup
        className="gap-4"
        value={agreedToTerms ? ["true"] : []}
        onChange={(isSelected) => {
          setAgreedToTerms(!!isSelected.length);
        }}
      >
        <Checkbox className="mt-4" value="true">
          <CheckboxIndicator className="border-[1px] border-outline-light bg-background data-[checked=true]:border-0 data-[checked=true]:bg-primary-main">
            <CheckboxIcon as={CheckIcon} className="color-background" />
          </CheckboxIndicator>
          <CheckboxLabel className="px-2">
            {t("checkoutScreen.agreeToTerms")}
          </CheckboxLabel>
        </Checkbox>
      </CheckboxGroup>

      <HStack className="mt-6 gap-4">
        <Text className="text-xl font-bold text-typography-light">
          {t("checkoutScreen.deliveryPrice")}:
        </Text>
        <Text className="text-xl font-bold text-primary-main">
          {cart?.deliveryPrice
            ? cart?.deliveryPrice + " ₽"
            : t("cartScreen.free")}
        </Text>
      </HStack>
      <HStack className="mt-2 gap-4">
        <Text className="text-xl font-bold text-typography-accent">
          {t("checkoutScreen.bonusEstimation")}:
        </Text>
        <Text className="text-xl font-bold text-primary-main">
          {bonusEstimation} ₽
        </Text>
      </HStack>
      <HStack className="mt-2 gap-4">
        <Text className="text-xl font-bold text-typography-accent">
          {t("checkoutScreen.totalSum")}:
        </Text>
        <Text className="text-xl font-bold text-primary-main">
          {cart?.originalSum} ₽
        </Text>
      </HStack>
      <HStack className="mt-2 gap-4">
        <Text className="text-xl font-bold text-typography-accent">
          {t("checkoutScreen.discount")}:
        </Text>
        <Text className="text-xl font-bold text-primary-main">
          {cart ? cart?.originalSum - cart?.sum : 0} ₽
        </Text>
      </HStack>
      <HStack className="mt-2 gap-4">
        <Text className="text-xl font-bold text-typography-accent">
          {t("checkoutScreen.totalPrice")}:
        </Text>
        <Text className="text-xl font-bold text-primary-main">
          {(cart?.sum ?? 0) - Number(requestedBonusPayment)} ₽
        </Text>
      </HStack>

      <Button
        className="my-4 rounded-none bg-primary-main"
        onPress={() => {
          // prevalidate();
          if (prevalidate() && paysystem) {
            createOrder({
              username,
              email,
              otherPerson: showOtherPerson
                ? {
                    name: otherPersonName,
                    phone: unMask(otherPersonNumber),
                  }
                : undefined,
              deliveryDateTime,
              personNumber,
              paysystem,
              comment,
              cashChange,
              promocodes,
              requestedBonusPayment,
            });
          }
        }}
        isDisabled={
          !agreedToTerms ||
          isOrderCreationPending ||
          !cart ||
          cart?.minPrice > cart?.originalSum
        }
      >
        {isOrderCreationPending && <LoadingDots />}
        {!isOrderCreationPending && (
          <Text className="font-bold text-background">
            {t("checkoutScreen.order")}
          </Text>
        )}
      </Button>
    </Box>
  );
}
