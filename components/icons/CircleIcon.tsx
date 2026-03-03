// import { useToken } from 'native-base'
import { cn } from "@/lib/helpers";
import { cssInterop } from "nativewind";
import React from "react";
import Svg, { Path } from "react-native-svg";

const CircleIcon = ({ className }: { className?: string }) => {
  return (
    <Svg
      viewBox="0 0 24 24"
      stroke="currentColor"
      role="img"
      className={cn("h-3 w-3 items-center justify-center rounded-full fill-primary-main text-primary-main", className)}
      
    >
      <Path
        d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </Svg>
  );
};

export default CircleIcon;

cssInterop(Svg, {
  className: {
    target: "style",
    nativeStyleToProp: { height: true, width: true },
  },
});
