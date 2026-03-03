import { FlatList } from "react-native";
import { Banner } from "./Banner";
import { useBanners, Banner as BannerType } from "@/hooks/useBanners";
import { LoadingDots } from "@/components/ui/LoadingDots";
import { Box } from "@/components/ui/box";
import { VStack } from "@/components/ui/vstack";
import { filterActiveBanners, sortBannersByOrder } from "@/utils/bannerUtils";

interface BannerListProps {
  position: BannerType["position"];
  horizontal?: boolean;
  width?: number;
  height?: number;
  gap?: number;
}

export function BannerList({
  position,
  horizontal = false,
  width,
  height = 200,
  gap = 8,
}: BannerListProps) {
  const { data: banners, isPending, isError } = useBanners(position);

  // Скрываем секцию при ошибке загрузки (Requirements 2.6)
  if (isError) {
    return null;
  }

  if (isPending) {
    return (
      <Box className="items-center justify-center py-4">
        <LoadingDots />
      </Box>
    );
  }

  if (!banners || banners.length === 0) {
    return null;
  }

  // Фильтруем только активные баннеры и сортируем по order (Requirements 2.2, 2.3)
  const activeBanners = sortBannersByOrder(filterActiveBanners(banners));

  if (activeBanners.length === 0) {
    return null;
  }

  if (horizontal) {
    return (
      <FlatList
        data={activeBanners}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap, paddingHorizontal: gap }}
        renderItem={({ item }) => (
          <Banner banner={item} width={width} height={height} />
        )}
        keyExtractor={(item) => item.id.toString()}
      />
    );
  }

  return (
    <VStack gap={gap} className="px-2">
      {activeBanners.map((banner) => (
        <Banner key={banner.id} banner={banner} width={width} height={height} />
      ))}
    </VStack>
  );
}
