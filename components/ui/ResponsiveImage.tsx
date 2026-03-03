import { useState, useEffect } from "react";
import { Image as RNImage } from "react-native";
import { Image, ImageProps } from "@/components/ui/image";

export default function ResponsiveImage({ source, ...props }: { source: string } & ImageProps ) {
  const [paintedWidth, setPaintedWidth] = useState(0);
  const [resultHeight, setResultHeight] = useState(0);

  useEffect(() => {
    let stillMounted = true;
    RNImage.getSize(source, (realW, realH) => {
      if (!paintedWidth || !stillMounted) return;
      const shrinkRatio = realW / paintedWidth;
      setResultHeight(realH / shrinkRatio);
    });
    return () => {
      stillMounted = false;
    };
  }, [paintedWidth]);

  return (
    <Image
      source={{ uri: source }}
      {...props}
    />
  );
}
