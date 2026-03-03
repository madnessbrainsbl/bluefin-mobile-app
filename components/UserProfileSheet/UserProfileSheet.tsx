import { UserProfile, useUserProfiles } from "@/hooks/useUserProfiles";
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
} from "../ui/actionsheet";
import { useSheetStore } from "@/hooks/useSheetStore";
import { Text } from "../ui/text";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/Input";
import { VStack } from "../ui/vstack";
import { HStack } from "../ui/hstack";
import { Box } from "../ui/box";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform } from "react-native";

export function UserProfileSheet({
  isOpen,
  profile,
}: {
  isOpen: boolean;
  profile:
    | (Partial<UserProfile> &
        Partial<{
          street: string;
          streetId: string;
          house: string;
          houseId: string;
        }>)
    | null;
}) {
  const { t } = useTranslation();
  const closeSheet = useSheetStore((state) => state.closeSheet);
  const onClose = useSheetStore((state) => state.onClose);

  const {
    useUserProfileCreateMutation: { mutate: createUserProfile },
  } = useUserProfiles();
  const {
    useUserProfileUpdateMutation: { mutate: updateUserProfile },
  } = useUserProfiles();

  const [addressName, setAddressName] = useState(profile?.name);
  const [entrance, setEntrance] = useState(profile?.entrance);
  const [floor, setFloor] = useState(profile?.floor);
  const [flat, setFlat] = useState(profile?.flat);
  const [intercomCode, setIntercomCode] = useState(profile?.intercomCode);

  useEffect(() => {
    setAddressName(profile?.name);
    setEntrance(profile?.entrance);
    setFloor(profile?.floor);
    setFlat(profile?.flat);
    setIntercomCode(profile?.intercomCode);
  }, [profile]);
  
  return (
    <Actionsheet isOpen={isOpen} onClose={() => closeSheet()}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ActionsheetBackdrop />
        <ActionsheetContent className="rounded-tl-lg rounded-tr-lg">
          <ActionsheetDragIndicatorWrapper>
            <ActionsheetDragIndicator />
          </ActionsheetDragIndicatorWrapper>
          <Box className="w-full">
            <Text className="mt-2 text-center text-xl font-bold">
              {t("userProfileSheet.editUserProfile")}
            </Text>
            <VStack className="mt-4 w-full gap-4">
              <Input
                size="xl"
                label={t("profile.addressName")}
                value={addressName}
                onChange={(value) => setAddressName(value)}
              />

              <Input
                size="xl"
                label={t("profile.addressLine")}
                value={profile?.address}
                isDisabled={true}
              />

              <HStack className="gap-4">
                <Input
                  className="shrink grow basis-0"
                  size="xl"
                  label={t("profile.entrance")}
                  value={entrance}
                  onChange={(value) => setEntrance(value)}
                />

                <Input
                  className="shrink grow basis-0"
                  size="xl"
                  label={t("profile.floor")}
                  value={floor}
                  onChange={(value) => setFloor(value)}
                />
              </HStack>

              <HStack className="gap-4">
                <Input
                  className="shrink grow basis-0"
                  size="xl"
                  label={t("profile.flat")}
                  value={flat}
                  onChange={(value) => setFlat(value)}
                />

                <Input
                  className="shrink grow basis-0"
                  size="xl"
                  label={t("profile.intercomCode")}
                  value={intercomCode}
                  onChange={(value) => setIntercomCode(value)}
                />
              </HStack>

              <Button
                className="rounded-none bg-primary-main"
                onPress={() => {
                  if (profile?.id) {
                    updateUserProfile({
                      id: profile?.id,
                      name: addressName,
                      entrance,
                      floor,
                      flat,
                      intercomCode: intercomCode,
                    });
                  } else {
                    createUserProfile({
                      name: addressName,
                      address: profile?.address,
                      street: profile?.street,
                      streetId: profile?.streetId,
                      house: profile?.house,
                      houseId: profile?.houseId,
                      coords: profile?.coords,
                      entrance,
                      floor,
                      flat,
                      intercomCode: intercomCode,
                    });
                    onClose();
                  }
                  closeSheet();
                }}
              >
                <Text className="text-background">{t("userProfileSheet.save")}</Text>
              </Button>
            </VStack>
          </Box>
        </ActionsheetContent>
      </KeyboardAvoidingView>
    </Actionsheet>
  );
}
