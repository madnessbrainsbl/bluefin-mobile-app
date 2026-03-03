// import { useToken } from 'native-base'
import { cn } from "@/lib/helpers";
import { cssInterop } from "nativewind";
import React from "react";
import Svg, { Path } from "react-native-svg";

const ArrowIcon = ({ className = "dark" }: { className?: string }) => {
  return (
    <Svg
      width="14"
      height="14"
      viewBox="0 0 14 15"
      fill="none"
      className={cn("h-full w-full", className)}
    >
      <Path
        d="M14 0.5L0 6.35667V7.11889L5.32 9.18L7.37333 14.5H8.13556L14 0.5Z"
        fill="currentColor"
      ></Path>
    </Svg>
  );
};

export default ArrowIcon;

cssInterop(Svg, {
  className: {
    target: "style",
    nativeStyleToProp: { height: true, width: true },
  },
});
