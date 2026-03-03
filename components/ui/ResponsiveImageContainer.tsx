import { useState, useEffect } from "react";
import { Image as RNImage } from "react-native";
import { Image, ImageProps } from "@/components/ui/image";
import { Center } from "@/components/ui/center";

export default function ResponsiveImageContainer({
  source,
  ...props
}: { source: string } & ImageProps) {
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
    <Center
      style={{ width: "100%", height: resultHeight }}
      className="bg-surface-dark"
      onLayout={(event) => setPaintedWidth(event.nativeEvent.layout.width)}
    >
      <Image source={{ uri: source }} {...props} />
    </Center>
  );
}
