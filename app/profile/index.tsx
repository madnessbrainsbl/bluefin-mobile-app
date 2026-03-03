import { useDialogModal } from "@/components/ModalDialog";
import { BirthdayEdit } from "@/components/profile/BirthdayEdit";
import { EmailEdit } from "@/components/profile/EmailEdit";
import { NameEdit } from "@/components/profile/NameEdit";
import { LoyaltyCard } from "@/components/LoyaltyCard/LoyaltyCard";
import { TransactionList } from "@/components/LoyaltyCard/TransactionList";
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
import { CheckIcon, EditIcon, Icon } from "@/components/ui/icon";
import { Input, InputField } from "@/components/ui/input";
import { LoadingDots } from "@/components/ui/LoadingDots";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { UserProfiles } from "@/components/UserProfiles";
import { apiUrl } from "@/constants/config";
import { useAuth } from "@/hooks/useAuth";
import { useAuthStore } from "@/stores/authStore";
import { useOsmiProfile } from "@/hooks/useOsmi";
import { useAikoCardProfile, useAikoCardTransactions } from "@/hooks/useAikoCard";
import { User, useUser, useUserMutation } from "@/hooks/useUser";

import { cn } from "@gluestack-ui/nativewind-utils/cn";
import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";
import { use } from "i18next";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { ScrollView } from "react-native-gesture-handler";
import QRCode from "react-native-qrcode-svg";
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
} from "@/components/ui/actionsheet";

export default function AccountScreen() {
  const { t } = useTranslation();
  // const userToken = useAuthStore((state) => state.userToken);
  const showDialogModal = useDialogModal((state) => state.showDialogModal);
  const [showTransactions, setShowTransactions] = useState(false);

  const { isPending: isUserPending, data: user, refetch } = useUser();
  
  // AikoCard hooks - Requirements: 3.1
  const { 
    data: aikoProfile, 
    isLoading: isAikoLoading, 
    isError: isAikoError 
  } = useAikoCardProfile();
  
  const { 
    data: aikoTransactions, 
    isLoading: isTransactionsLoading, 
    isError: isTransactionsError 
  } = useAikoCardTransactions();

  useLayoutEffect(() => {
    refetch();
  }, []);

  const {
    updateUserMutation: { mutate: updateUserMutate },
    deleteUserMutation: { mutate: deleteUserMutate },
  } = useUserMutation();

  const updateUser = (user: Partial<User>) =>
    updateUserMutate(user, {
      onError: (err) => {
        console.warn(err.message);
        if (!(err instanceof Error) && err?.status === 422) {
          if (typeof err.message === "string") {
            showDialogModal({
              message: t(err.message ?? "errors.unknownError"),
            });
          } else if (typeof err.message === "object") {
            showDialogModal({ message: Object.values(err.message).join(", ") });
          }
        } else {
          showDialogModal({ message: t("errors.unknownError") });
        }
      },
    });

  const deleteUser = () => {
    deleteUserMutate(undefined, {
      onError: (err) => {
        console.warn(err.message);
        if (!(err instanceof Error) && err?.status === 422) {
          if (typeof err.message === "string") {
            showDialogModal({
              message: t(err.message ?? "errors.unknownError"),
            });
          } else if (typeof err.message === "object") {
            showDialogModal({ message: Object.values(err.message).join(", ") });
          }
        } else {
          showDialogModal({ message: t("errors.unknownError") });
        }
      },
    });
  };

  const {
    updateNotificationFlagsMutation: { mutate: updateNotificationFlags },
  } = useUserMutation();
  const {
    logoutMutation: { isPending, mutate: logout },
  } = useAuth();

  const scrollViewRef = useRef<ScrollView>(null);

  const { data: osmiProfile } = useOsmiProfile();

  if (!user) {
    return null;
  }

  const notificationFlags: string[] = [];
  if (user.email_notify) notificationFlags.push("email");
  if (user.phone_notify) notificationFlags.push("phone");

  if (isUserPending) {
    return (
      <Box className="grow items-center justify-center">
        <LoadingDots />
      </Box>
    );
  }

  return (
    <ScrollView ref={scrollViewRef}>
      <HStack className="mt-2 items-center justify-between px-4">
        <Text className="text-accent text-3xl font-extrabold">
          {t("personalScreen.personalData")}
        </Text>
        <Pressable
          className="px-4 active:bg-typography-control"
          onPress={() =>
            logout(undefined, {
              onError: (err) => {
                console.warn(err.message);
                if (!(err instanceof Error) && err?.status === 502) {
                  showDialogModal({
                    message: t(err.message ?? "errors.unknownError"),
                  });
                } else {
                  showDialogModal({ message: t("errors.unknownError") });
                }
              },
            })
          }
          disabled={isPending}
        >
          <Text className="font-bold text-primary-main">
            {t("personalScreen.logout")}
          </Text>
        </Pressable>
      </HStack>
      <VStack className="mt-4 gap-4 px-4">
        <NameEdit
          name={user.name}
          onMutate={(newName) => updateUser({ name: newName })}
        />

        <HStack className="gap-4">
          <Text className="w-24 tracking-tight text-typography-dark">
            {t("personalScreen.phone")}:
          </Text>
          <Text>{user?.phone}</Text>
          {/* <Pressable>
            <Icon as={EditIcon} className="text-typography-form" />
          </Pressable> */}
        </HStack>

        <EmailEdit
          email={user.email}
          onMutate={(newEmail) => updateUser({ email: newEmail })}
        />

        <BirthdayEdit
          birthday={user.birthday}
          onMutate={(newBirthday) => updateUser({ birthday: newBirthday })}
        />

        <HStack className="items-center gap-4">
          <Text className="w-24 tracking-tight text-typography-dark">
            {t("personalScreen.loyaltyLevel.name") + ":"}
          </Text>
          <Text>
            {osmiProfile?.loyaltyLevel
              ? t(
                  "personalScreen.loyaltyLevel." +
                    osmiProfile.loyaltyLevel +
                    ".name",
                ) +
                ", " +
                t(
                  "personalScreen.loyaltyLevel." +
                    osmiProfile.loyaltyLevel +
                    ".description",
                )
              : "-"}
          </Text>
        </HStack>

        <HStack className="items-center gap-4">
          <Text className="w-24 font-bold tracking-tight text-typography-dark">
            {t("personalScreen.bonusBalance") + ":"}
          </Text>
          <Text className="text-xl font-bold">
            {osmiProfile?.bonusBalance ?? 0}
          </Text>
        </HStack>
        <CheckboxGroup
          className="gap-4"
          value={notificationFlags}
          onChange={(isSelected) => {
            updateNotificationFlags(isSelected, {
              onError: (err) => {
                console.warn(err.message);
                if (!(err instanceof Error) && err?.status === 502) {
                  if (typeof err.message === "string") {
                    showDialogModal({
                      message: t(err.message ?? "errors.unknownError"),
                    });
                  } else if (typeof err.message === "object") {
                    showDialogModal({
                      message: Object.values(err.message).join(", "),
                    });
                  }
                } else {
                  showDialogModal({ message: t("errors.unknownError") });
                }
              },
            });
          }}
        >
          <Checkbox size="md" value="phone">
            <CheckboxIndicator className="border-outline-light data-[checked=true]:border-0 data-[checked=true]:bg-primary-main">
              <CheckboxIcon as={CheckIcon} className="color-background" />
            </CheckboxIndicator>
            <CheckboxLabel className="px-2 text-xs">
              {t("personalScreen.agreePhoneSubscription")}
            </CheckboxLabel>
          </Checkbox>
          <Checkbox size="md" value="email">
            <CheckboxIndicator className="border-outline-light data-[checked=true]:border-0 data-[checked=true]:bg-primary-main">
              <CheckboxIcon as={CheckIcon} className="color-background" />
            </CheckboxIndicator>
            <CheckboxLabel className="px-2 text-xs">
              {t("personalScreen.agreeEmailSubscription")}
            </CheckboxLabel>
          </Checkbox>
        </CheckboxGroup>
      </VStack>

      <Text className="text-accent mt-8 px-4 text-3xl font-extrabold">
        {t("personalScreen.loyaltyCard")}
      </Text>
      
      {/* AikoCard Integration - Requirements: 3.1, 3.2, 3.5 */}
      <Box className="my-4">
        <LoyaltyCard
          profile={aikoProfile}
          isLoading={isAikoLoading}
          isError={isAikoError}
        />
        
        {aikoProfile && (
          <Box className="mt-4 px-4">
            <Button
              variant="outline"
              className="border-primary-main"
              onPress={() => setShowTransactions(true)}
            >
              <Text className="text-primary-main font-medium">
                {t("loyalty.viewTransactions")}
              </Text>
            </Button>
          </Box>
        )}
      </Box>

      {/* Fallback to OSMI profile if AikoCard is not available */}
      {!aikoProfile && !isAikoLoading && osmiProfile && (
        <HStack className="my-4 justify-center">
          <VStack className="items-center gap-2 bg-white p-4">
            <QRCode value={osmiProfile.cardNumber} />
            <Text className="color-typography-main">
              {osmiProfile.cardNumber}
            </Text>
          </VStack>
        </HStack>
      )}

      {/* Transaction History Actionsheet - Requirements: 3.3 */}
      <Actionsheet isOpen={showTransactions} onClose={() => setShowTransactions(false)}>
        <ActionsheetBackdrop />
        <ActionsheetContent className="max-h-[70%]">
          <ActionsheetDragIndicatorWrapper>
            <ActionsheetDragIndicator />
          </ActionsheetDragIndicatorWrapper>
          <VStack className="w-full px-4 pb-4">
            <Text className="text-xl font-bold mb-4">
              {t("loyalty.transactionHistory")}
            </Text>
            <TransactionList
              transactions={aikoTransactions}
              isLoading={isTransactionsLoading}
              isError={isTransactionsError}
            />
          </VStack>
        </ActionsheetContent>
      </Actionsheet>

      <UserProfiles
        className="my-8"
        onUpdate={() =>
          scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: true })
        }
      />

      <VStack className="my-4 gap-4 px-4">
        <Button
          className="bg-red-500"
          onPress={() => {
            showDialogModal({
              message: t("personalScreen.confirmUserDeletion"),
              onConfirm: () => deleteUser(),
            });
          }}
        >
          <Text className="text-background">
            {t("personalScreen.deleteUser")}
          </Text>
        </Button>
      </VStack>
      {/* <Pressable onPress={() => {
          scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: true })
        }}>
          <Text>UP</Text>
        </Pressable> */}
    </ScrollView>
  );
}
