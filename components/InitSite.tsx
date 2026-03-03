import { useAppSettings } from "@/hooks/useAppSettings";
import { Box } from "./ui/box";
import { Text } from "./ui/text";
import { VStack } from "./ui/vstack";
import { Button } from "./ui/button";
import { cn } from "@gluestack-ui/nativewind-utils/cn";
import { useCatalogStore } from "@/hooks/useCatalogStore";
import { useTranslation } from "react-i18next";
import { Image } from "@/components/ui/image";
import { Image as RNImage } from "react-native";
import { Center } from "./ui/center";
import ResponsiveImage from "./ui/ResponsiveImage";

export function InitSite() {
  const { t } = useTranslation();
  const {
    data: { cities },
  } = useAppSettings();
  const setSiteId = useCatalogStore((state) => state.setSiteId);
  const setDepartmentId = useCatalogStore((state) => state.setDepartmentId);
  const setViewCategoryId = useCatalogStore((state) => state.setViewCategoryId);
  const source = RNImage.resolveAssetSource(
    require("../assets/images/logo-gold.png"),
  );
  return (
    <VStack className="h-full items-center justify-center gap-8 bg-background">
      <Box className="w-[200px] justify-center">
        <Image className="w-full" size="xl" source={source.uri} alt="splash" />
      </Box>
      <Box className="items-center justify-center">
        <VStack className="gap-4">
          <Text className="mb-4 text-2xl font-bold">
            {t("citySheet.selectCity")}
          </Text>
          {Object.values(cities).map((city) => (
            <Button
              key={city.id}
              className={cn("rounded-none border-none bg-primary-main")}
              onPress={() => {
                setSiteId(city.siteId);
                setDepartmentId(city.defaultDepartmentId);
                setViewCategoryId(null);
              }}
            >
              <Text className={cn("font-bold text-background")}>
                {city.name}
              </Text>
            </Button>
          ))}
        </VStack>
      </Box>
    </VStack>
  );
}
