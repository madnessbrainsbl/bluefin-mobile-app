import { cn } from "@/lib/helpers";
import { cssInterop } from "nativewind";
import React from "react";
import Svg, { Path } from "react-native-svg";

const MenuIcon = ({ className = "color-accent" }: { className?: string }) => {
  return (
    <Svg
      className={cn("h-full w-full", className)}
      viewBox="0 0 24 24"
      fill="none"
    >
      <Path
        d="M21 4.5H3"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M21 9.5H7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M21 14.5H3"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M21 19.5H7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default MenuIcon;

cssInterop(Svg, {
  className: {
    target: "style",
    nativeStyleToProp: { height: true, width: true },
  },
});
