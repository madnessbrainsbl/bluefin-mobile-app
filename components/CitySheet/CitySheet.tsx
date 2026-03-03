import { useSheetStore } from "@/hooks/useSheetStore";
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
} from "../ui/actionsheet";
import { Text } from "../ui/text";
import { VStack } from "../ui/vstack";
import { Button } from "../ui/button";
import { Box } from "../ui/box";
import { Spinner } from "../ui/spinner";
import { t } from "i18next";
import { cn } from "@gluestack-ui/nativewind-utils/cn";
import { useCatalogStore, useCity } from "@/hooks/useCatalogStore";
import { useAppSettings } from "@/hooks/useAppSettings";
import { useTranslation } from "react-i18next";

export function CitySheet({ isOpen }: { isOpen: boolean }) {
  const closeSheet = useSheetStore((state) => state.closeSheet);
  const { siteId } = useCity();
  const setSiteId = useCatalogStore((state) => state.setSiteId);
  const setDepartmentId = useCatalogStore((state) => state.setDepartmentId);
  const setViewCategoryId = useCatalogStore((state) => state.setViewCategoryId);

  const {
    data: { cities },
  } = useAppSettings();

  return (
    <Actionsheet isOpen={isOpen} onClose={() => closeSheet()}>
      <ActionsheetBackdrop />
      <ActionsheetContent className="rounded-tl-lg rounded-tr-lg">
        <ActionsheetDragIndicatorWrapper>
          <ActionsheetDragIndicator />
        </ActionsheetDragIndicatorWrapper>
        <Text className="text-accent mt-4 text-center text-3xl font-extrabold">
          {t("citySheet.selectCity")}
        </Text>
        <Box className="flex w-full items-center justify-center p-4">
          {/* {isCitiesPending && <Spinner size="large" />} */}
          {
            <VStack className="w-full gap-4 px-4">
              {Object.values(cities).map((city) => (
                <Button
                  key={city.id}
                  className={cn("rounded-none", {
                    "bg-primary-main": siteId === city.siteId,
                    "border-[1px] border-primary-main bg-background":
                      siteId !== city.siteId,
                  })}
                  onPress={() => {
                    setSiteId(city.siteId);
                    setDepartmentId(city.defaultDepartmentId);
                    setViewCategoryId(null);
                    closeSheet();
                  }}
                >
                  <Text
                    className={cn("font-bold", {
                      "text-background": siteId === city.siteId,
                      "text-accent": siteId !== city.siteId,
                    })}
                  >
                    {city.name}
                  </Text>
                </Button>
              ))}
            </VStack>
          }
        </Box>
      </ActionsheetContent>
    </Actionsheet>
  );
}
