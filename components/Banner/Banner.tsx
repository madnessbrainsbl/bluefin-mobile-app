import { Pressable } from "@/components/ui/pressable";
import { Image as ExpoImage } from "expo-image";
import { useRouter } from "expo-router";
import { Banner as BannerType } from "@/hooks/useBanners";
import { Box } from "@/components/ui/box";
import { Image as RNImage, Linking } from "react-native";
import { useEffect, useMemo, useState } from "react";
import { isInternalLink } from "@/utils/bannerUtils";
import { apiUrl } from "@/constants/config";

interface BannerProps {
  banner: BannerType;
  width?: number;
  height?: number;
}

export function Banner({ banner, width, height = 200 }: BannerProps) {
  const router = useRouter();
  const [measuredWidth, setMeasuredWidth] = useState(width ?? 0);
  const [computedHeight, setComputedHeight] = useState<number | null>(null);

  useEffect(() => {
    if (width) {
      setMeasuredWidth(width);
    }
  }, [width]);

  const imageUrl = useMemo(() => {
    if (banner.image.startsWith("http")) {
      return banner.image;
    }

    const apiBase = apiUrl ?? "";
    if (!apiBase) {
      return banner.image;
    }

    let origin = apiBase;
    try {
      origin = new URL(apiBase).origin;
    } catch { }

    const path = banner.image.startsWith("/")
      ? banner.image
      : `/${banner.image}`;
    return `${origin}${path}`;
  }, [banner.image]);

  useEffect(() => {
    if (!imageUrl || !measuredWidth) return;

    let isActive = true;
    setComputedHeight(null);

    RNImage.getSize(
      imageUrl,
      (realWidth, realHeight) => {
        if (!isActive || !realWidth) return;
        setComputedHeight((realHeight / realWidth) * measuredWidth);
      },
      () => { },
    );

    return () => {
      isActive = false;
    };
  }, [imageUrl, measuredWidth]);

  const containerHeight = height ?? computedHeight ?? 200;
  const containerWidth = width ?? "100%";

  const handlePress = async () => {
    if (!banner.link) return;

    // Если ссылка внутренняя (начинается с /), используем роутер (Requirements 2.4)
    if (isInternalLink(banner.link)) {
      router.push(banner.link as any);
    } else {
      // Иначе открываем внешнюю ссылку (Requirements 2.5)
      const canOpen = await Linking.canOpenURL(banner.link);
      if (canOpen) {
        await Linking.openURL(banner.link);
      }
    }
  };

  return (
    <Pressable onPress={handlePress} disabled={!banner.link}>
      <Box
        onLayout={(event) => {
          if (width) return;
          const layoutWidth = event.nativeEvent.layout.width;
          if (layoutWidth && layoutWidth !== measuredWidth) {
            setMeasuredWidth(layoutWidth);
          }
        }}
        style={{
          width: containerWidth,
          height: containerHeight,
          borderRadius: 8,
          overflow: "hidden",
        }}
      >
        <ExpoImage
          source={{ uri: imageUrl }}
          style={{ width: "100%", height: "100%" }}
          contentFit="cover"
          transition={200}
        />
      </Box>
    </Pressable>
  );
}
