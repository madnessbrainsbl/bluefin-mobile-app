import { ScrollView } from "react-native";
import XIcon2 from "../icons/XIcon2";
import { Box } from "../ui/box";
import { Pressable } from "../ui/pressable";
import { HStack } from "../ui/hstack";
import Logo from "../ui/Logo";
import { VStack } from "../ui/vstack";
import { MenuItem, useMenues } from "@/hooks/useMenues";
import { Link } from "expo-router";
import {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionIcon,
  AccordionItem,
  AccordionTitleText,
  AccordionTrigger,
} from "../ui/accordion";
import { useEffect, useState } from "react";
import { DrawerContentComponentProps, useDrawerStatus } from "@react-navigation/drawer";
import { useTranslation } from "react-i18next";
import { Text } from "../ui/text";
import { useAuthStore } from "@/stores/authStore";
import { cn } from "@/lib/helpers";
import PencilIcon from "../icons/PencilIcon";
import ArrowIcon from "../icons/ArrowIcon";
import { Icon } from "../ui/icon";
import { useSheetStore } from "@/hooks/useSheetStore";
import {
  useCatalogStore,
  useCity,
  useDepartment,
} from "@/hooks/useCatalogStore";
import { UserProfile, useUserProfiles } from "@/hooks/useUserProfiles";
import { useAppSettings } from "@/hooks/useAppSettings";
import React from "react";
import { Button } from "../ui/button";
import appJson from "../../app.json";

const SubMenu = ({
  menuItem,
  isExpanded = false,
  ...props
}: {
  menuItem: MenuItem;
  isExpanded?: boolean;
}) => {
  const isDrawerOpen = useDrawerStatus();
  const [isExpandedState, setIsExpanded] = useState(false);

  useEffect(() => {
    if (isDrawerOpen === "closed") {
      setIsExpanded(false);
    }
  }, [isDrawerOpen]);

  return (
    <Accordion
      variant="unfilled"
      value={isExpandedState === true ? ["opened"] : []}
      {...props}
    >
      <AccordionItem value="opened" className="p-0">
        <AccordionHeader>
          <AccordionTrigger
            onPress={() => setIsExpanded(!isExpandedState)}
            className="pl-2"
          >
            <AccordionTitleText className="text-xl font-bold tracking-tight text-primary-light">
              {menuItem.name}
            </AccordionTitleText>
            <AccordionIcon />
          </AccordionTrigger>
        </AccordionHeader>
        <AccordionContent>
          <VStack className="">
            {menuItem.sub.map((item, index) => (
              <Link
                key={index}
                className="py-2 pl-1 text-xl font-bold tracking-tight text-primary-light active:bg-typography-control"
                href={item.link}
              >
                {"\u2022   "}
                {item.name}
              </Link>
            ))}
          </VStack>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

const GeoLocationSelect = ({
  className,
  closeDrawer,
}: {
  className?: string;
  closeDrawer: () => void;
}) => {
  const { t } = useTranslation();
  const userToken = useAuthStore((state) => state.userToken);
  const {
    useUserProfileCreateMutation: { mutateAsync: createUserProfile },
  } = useUserProfiles();

  const { siteId } = useCity();
  const {
    data: { cities },
  } = useAppSettings();
  const city = cities[siteId];
  const profile = useCatalogStore((state) => state.profile);
  const openSheet = useSheetStore((state) => state.openSheet);
  const closeSheet = useSheetStore((state) => state.closeSheet);
  const setDepartmentId = useCatalogStore((state) => state.setDepartmentId);
  const setProfile = useCatalogStore((state) => state.setProfile);

  return (
    <VStack className={cn(className)}>
      <Text className="text-typography-dark">
        {t("drawer.current_delivery_address")}
      </Text>
      <Pressable
        className="active:bg-typography-control"
        onPress={() => {
          closeDrawer();
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
              setDepartmentId(departmentId);
              const newProfile =
                profile && !profile.id && userToken
                  ? await createUserProfile(profile)
                  : profile;
              
              setProfile(newProfile);
              closeSheet();
            },
          });
        }}
      >
        <HStack className="items-center gap-2 p-2">
          <Box className="h-5 w-5">
            <PencilIcon className="color-primary-light" />
          </Box>
          <Text className="text-primary-light">
            {profile ? profile.address : t("drawer.select") + " ..."}
          </Text>
        </HStack>
      </Pressable>
      <Pressable
        className="active:bg-typography-control"
        onPress={() => {
          closeDrawer();
          openSheet({
            sheet: "city",
            params: {},
            onClose: () => {},
          });
        }}
      >
        <HStack className="items-center gap-2 p-2">
          <Box className="h-5 w-5">
            <ArrowIcon
              className="color-primary-light"
              aria-label={t("drawer.city")}
            />
          </Box>
          <Text className="text-primary-light">
            {city?.name ?? t("drawer.city")}
          </Text>
        </HStack>
      </Pressable>
    </VStack>
  );
};

const DrawerContent = ({
  closeDrawer,
}: Pick<DrawerContentComponentProps["navigation"], "closeDrawer">) => {
  const { t } = useTranslation();
  // const { data: department } = useDepartment();
  // const { data: { departments } } = useAppSettings();
  // const departmentId = useCatalogStore((state) => state.departmentId);
  const department = useDepartment();

  const { data: menu } = useMenues();

  return (
    <>
      <Box className="h-full bg-surface-dark">
        <Box className="absolute right-4 top-6 z-10">
          <Pressable
            className="h-10 w-10 active:bg-typography-control"
            onPress={closeDrawer}
          >
            <Box aria-label="Закрыть меню">
              <Icon as={XIcon2} className="h-full w-full color-background" />
            </Box>
          </Pressable>
        </Box>
        <ScrollView>
          <HStack
            className="items-end justify-between !pl-6 pr-6 pt-8 "
          >
            <Box className="grow items-start">
              <Logo variant="light" className="w-44 h-20   " />
            </Box>
            {/* <LngSwitcher /> */}
          </HStack>

          <VStack className="mb-8 mt-4 px-6 pr-12">
            <Link
              className="py-3 pl-2 text-xl font-bold tracking-tight text-primary-light active:bg-typography-control"
              href="/"
            >
              {t("drawer.menu")}
            </Link>
            {menu.main &&
              menu.main.map((item, index) => {
                return item.sub?.length ? (
                  <SubMenu key={index} menuItem={item} />
                ) : (
                  <Link
                    key={index}
                    className="py-3 pl-2 text-xl font-bold tracking-tight text-primary-light active:bg-typography-control"
                    href={item.link}
                  >
                    {item.name}
                  </Link>
                );
              })}

            <GeoLocationSelect
              className="my-4 ml-2"
              closeDrawer={closeDrawer}
            />

            {department.phone && (
              <Link
                className="py-3 pl-2 text-xl font-bold leading-snug tracking-tight text-background underline active:bg-typography-control"
                href={`tel:+${department.phone.replace(/[\s-]/g, "")}`}
              >
                {department.phone}
              </Link>
            )}
            {department.workHours?.length && (
              <VStack className="ml-2 gap-1 py-4">
                <Text className="text-background">
                  {t("drawer.work_hours") + ":"}
                </Text>
                {department.workHours.map((item, index) => (
                  <HStack key={index} className="gap-2">
                    <Text className="basis-14 tracking-tight text-background">
                      {item.days}
                    </Text>
                    <Text className="font-bold tracking-tight text-background">
                      {item.time}
                    </Text>
                  </HStack>
                ))}
              </VStack>
            )}
            <Link
              className="py-3 pl-2 text-xl font-bold tracking-tight text-background active:bg-typography-control"
              href="/settings"
            >
              {t("drawer.settings")}
            </Link>
            <Text className="mt-8 text-center text-typography-dark">
              v {appJson.expo.version}
            </Text>
          </VStack>
        </ScrollView>
      </Box>
    </>
  );
};

export default DrawerContent;
