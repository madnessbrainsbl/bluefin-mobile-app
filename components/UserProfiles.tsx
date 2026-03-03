import { UserProfile, useUserProfiles } from "@/hooks/useUserProfiles";
import { VStack } from "./ui/vstack";
import { HStack } from "./ui/hstack";
import { Pressable } from "./ui/pressable";
import { EditIcon, Icon } from "./ui/icon";
import TrashIcon from "./icons/TrashIcon";
import { Text } from "./ui/text";
import { useTranslation } from "react-i18next";
import { LoadingDots } from "./ui/LoadingDots";
import { cn } from "@gluestack-ui/nativewind-utils/cn";
import { useSheetStore } from "@/hooks/useSheetStore";
import { useDialogModal } from "./ModalDialog";
import { useAuthStore } from "@/stores/authStore";

//TODO remove flickering
export function UserProfiles({
  className,
  onUpdate,
}: {
  className?: string;
  onUpdate?: () => void;
}) {
  const { t } = useTranslation();
  const userToken = useAuthStore((state) => state.userToken);
  
  const {
    useUserProfilesList: { data: profiles },
    useUserProfileCreateMutation: { mutateAsync: createUserProfile },
    useUserProfileDeleteMutation: { mutate: deleteProfile },
  } = useUserProfiles();

  const openSheet = useSheetStore((state) => state.openSheet);
  const showDialogModal = useDialogModal((state) => state.showDialogModal);

  return (
    <VStack className={cn("w-full gap-4 px-4", className)}>
      <Text className="text-3xl font-extrabold text-accent">
        {t("personalScreen.deliveryAddresses")}
      </Text>

      <VStack className="w-full gap-4">
        {/* {!profiles && <LoadingDots />} */}
        {profiles &&
          profiles.map((profile) => {
            return (
              <HStack key={profile.id} className="w-full justify-between gap-4">
                <VStack className="shrink grow basis-0">
                  <Text className="">{profile.name}</Text>
                  <Text className="text-typography-light">{profile.address}</Text>
                </VStack>
                <HStack className="gap-2">
                  <Pressable
                    className="active:bg-typography-control"
                    onPress={() => {
                      openSheet({
                        sheet: "profile",
                        params: profile,
                        onClose: () => {},
                      });
                    }}
                  >
                    <Icon
                      as={EditIcon}
                      className="fill-none text-typography-form"
                    />
                  </Pressable>
                  <Pressable
                    className="active:bg-typography-control"
                    onPress={() => {
                      showDialogModal({
                        message: t("modal.confirmDeleteAddress"),
                        onConfirm: () => {
                          deleteProfile(profile.id);
                        },
                      });
                    }}
                  >
                    <Icon
                      as={TrashIcon}
                      className="fill-none text-typography-form"
                    />
                  </Pressable>
                </HStack>
              </HStack>
            );
          })}
      </VStack>

      <Pressable
        className="active:bg-primary-light"
        onPress={() => {
          openSheet({
            sheet: "address",
            params: null,
            onClose: ({ profile }) => {
              openSheet({
                sheet: "profile",
                params: {
                  ...profile
                },
                onClose: () => {
                  onUpdate && onUpdate();
                },
              });
            },
          });
        }}
      >
        <Text className="font-bold text-primary-main">
          {t("personalScreen.addAddress")}
        </Text>
      </Pressable>
    </VStack>
  );
}
