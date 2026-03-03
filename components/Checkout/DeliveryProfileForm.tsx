import { useTranslation } from "react-i18next";
import { HStack } from "../ui/hstack";
import { ChevronDownIcon } from "../ui/icon";
// import { Input, InputField } from "../ui/input";
import {
  Select,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectIcon,
  SelectInput,
  SelectItem,
  SelectPortal,
  SelectTrigger,
} from "../ui/select";
import { Text } from "../ui/text";
import { UserProfile, useUserProfiles } from "@/hooks/useUserProfiles";
import { ScrollView } from "react-native-gesture-handler";
import { Box } from "../ui/box";
import { useCatalogStore, useCity } from "@/hooks/useCatalogStore";
import { useSheetStore } from "@/hooks/useSheetStore";
import { useRef } from "react";
import { Input } from "../Input";
import { Divider } from "../ui/divider";
import { useAuthStore } from "@/stores/authStore";
import React from "react";
import { cn } from "@gluestack-ui/nativewind-utils/cn";
import { useDialogModal } from "../ModalDialog";
import { useClearCart } from "@/hooks/useCart";
import pointInPolygon from "@/components/pointInPolygon";

export function DeliveryProfileForm({ isError }: { isError?: string }) {
  const { t } = useTranslation();
  const userToken = useAuthStore((state) => state.userToken);

  const showDialogModal = useDialogModal((state) => state.showDialogModal);

  const city = useCity();
  const departmentId = useCatalogStore((state) => state.departmentId);
  const setDepartmentId = useCatalogStore((state) => state.setDepartmentId);
  const setViewCategoryId = useCatalogStore((state) => state.setViewCategoryId);
  const { mutateAsync: clearCart } = useClearCart();

  const openSheet = useSheetStore((state) => state.openSheet);
  const closeSheet = useSheetStore((state) => state.closeSheet);

  const {
    useUserProfilesList: { data: profiles },
  } = useUserProfiles();

  const profile = useCatalogStore((state) => state.profile);
  const setProfile = useCatalogStore((state) => state.setProfile);

  const {
    useUserProfileCreateMutation: { mutateAsync: createUserProfile },
  } = useUserProfiles();

  const selectPortalRef = useRef(null);

  function updateProfile(field: string, value: string) {
    if (!profile) return;
    const newProfile = { ...profile, [field]: value };
    setProfile(newProfile);
  }

  function getDepartmentIdByCoords(coords: [number, number]): number | null {
    const zone = city?.zones?.find((z) => pointInPolygon(coords, z.coords));
    return zone?.departmentId ?? null;
  }

  return (
    <>
      <Select
        // ref={selectRef}
        selectedValue={profile?.id ?? ""}
        initialLabel={profile?.name ?? ""}
        onValueChange={(value) => {
          if (value === "new") {
            openSheet({
              sheet: "address",
              params: {},
              onClose: async ({
                departmentId,
                profile,
              }: {
                departmentId: number;
                profile: UserProfile | null;
              }) => {
                const newProfile =
                  profile && !profile.id && userToken
                    ? await createUserProfile(profile)
                    : profile;

                setDepartmentId(departmentId);
                setViewCategoryId(null);
                setProfile(newProfile);
                closeSheet();
              },
            });
          } else {
            const newProfile = profiles?.find((p) => p.id === value) || null;
            if (!newProfile) return;

            const nextDepartmentId = getDepartmentIdByCoords(newProfile.coords);
            if (!nextDepartmentId) {
              showDialogModal({ message: t("addressSheet.outOfDeliveryZone") });
              return;
            }

            if (departmentId && departmentId !== nextDepartmentId) {
              showDialogModal({
                message: t("addressSheet.newDepartmentWarning"),
                onConfirm: async () => {
                  await clearCart();
                  setDepartmentId(nextDepartmentId);
                  setViewCategoryId(null);
                  setProfile(newProfile);
                },
              });
              return;
            }

            setDepartmentId(nextDepartmentId);
            setViewCategoryId(null);
            setProfile(newProfile);
          }
        }}
      >
        <SelectTrigger
          className={cn("h-12 justify-between bg-background", {
            "border-error-500": isError && !profile,
          })}
        >
          <SelectInput
            className="shrink overflow-hidden text-ellipsis"
            placeholder={t("checkoutScreen.chooseProfile")}
            value={profile?.name ?? ""}
          />
          <SelectIcon className="mr-3" as={ChevronDownIcon} />
        </SelectTrigger>
        {isError && !profile && (
          <Text className="text-xs text-error-500 mt-4">
            {isError}
          </Text>
        )}
        <SelectPortal ref={selectPortalRef}>
          <SelectBackdrop />
          <SelectContent style={{ maxHeight: "70%" }}>
            <SelectDragIndicatorWrapper>
              <SelectDragIndicator />
            </SelectDragIndicatorWrapper>
            <Box className="py-4">
              <ScrollView>
                {!!profiles?.length &&
                  profiles.map((profile) => (
                    <SelectItem
                      key={profile.id}
                      label={profile.name}
                      value={profile.id}
                    />
                  ))}

                <Divider className="my-1" />

                <SelectItem
                  label={t("checkoutScreen.addAddress")}
                  value="new"
                  className="text-primary-main"
                  // withIcon={() => (
                  //   <Icon
                  //     as={PlusIcon}
                  //     className="h-5 w-5 fill-primary-main text-primary-main"
                  //   />
                  // )}
                  textStyle={{
                    className: "text-primary-main font-bold leading-5",
                  }}
                />
              </ScrollView>
            </Box>
          </SelectContent>
        </SelectPortal>
      </Select>

      <HStack className="gap-4">
        <Input
          isDisabled={!profile}
          className="grow basis-0"
          label={t("profile.entrance")}
          value={profile?.entrance ?? ""}
          onChange={(value) => updateProfile("entrance", value)}
        />
        <Input
          isDisabled={!profile}
          className="grow basis-0"
          label={t("profile.floor")}
          value={profile?.floor ?? ""}
          onChange={(value) => updateProfile("floor", value)}
        />
      </HStack>

      <HStack className="gap-4">
        <Input
          isDisabled={!profile}
          className="grow basis-0"
          label={t("profile.flat")}
          value={profile?.flat ?? ""}
          onChange={(value) => updateProfile("flat", value)}
        />
        <Input
          isDisabled={!profile}
          className="grow basis-0"
          label={t("profile.intercomCode")}
          value={profile?.intercomCode ?? ""}
          onChange={(value) => updateProfile("intercomCode", value)}
        />
      </HStack>
    </>
  );
}
