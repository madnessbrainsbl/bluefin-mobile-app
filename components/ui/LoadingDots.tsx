import { useCallback, useEffect, useRef, useState } from "react";
import { Animated, ViewProps } from "react-native";
import { Box } from "./box";
import { HStack } from "./hstack";
import { cn } from "@/lib/helpers";

const Dot = ({ delay, ...rest }: { delay: number }) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const [shouldAnimate, setShouldAnimate] = useState(true);

  const animateDots = useCallback(
    (reverse = false) => {
      if (!shouldAnimate) return;

      Animated.timing(opacity, {
        toValue: reverse ? 0 : 1,
        duration: 700,
        useNativeDriver: true,
      }).start(() => {
        animateDots(!reverse);
      });
    },
    [opacity, shouldAnimate],
  );

  useEffect(() => {
    const timer = setTimeout(() => animateDots(), delay);
    return () => {
      clearTimeout(timer);
      setShouldAnimate(false);
    };
  }, [animateDots, delay]);

  return (
    <Animated.View style={{ opacity }}>
      {/* <Box
          bg='gold'
          w='4'
          h='4'
          mx='1.5'
          borderRadius='full'
          {...rest}
        /> */}
      <Box
        className="mx-1.5 h-4 w-4 overflow-hidden rounded-full bg-primary-main"
        {...rest}
      />
    </Animated.View>
  );
};

export const LoadingDots = ({ className }: { className?: string }) => (
  <HStack className={cn("justify-center", className)}>
    {Array.from({ length: 3 }, (_, i) => (
      <Dot key={i} delay={i * 200} />
    ))}
  </HStack>
);
