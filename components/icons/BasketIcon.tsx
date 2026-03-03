// import { useToken } from 'native-base'
import { cn } from "@/lib/helpers";
import { cssInterop } from "nativewind";
import React from "react";
import Svg, { Path } from "react-native-svg";

const BasketIcon = ({ className = "dark" }: { className?: string }) => {
  return (
    <Svg
      className={cn("h-full w-full", className)}
      viewBox="0 0 24 24"
      fill="none"
    >
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M18.064 7H5.936C5.409 7 4.973 7.408 4.938 7.933L4.142 19.867C4.065 21.021 4.981 22 6.138 22H17.862C19.019 22 19.935 21.021 19.858 19.867L19.062 7.933C19.027 7.408 18.591 7 18.064 7Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M15.001 9V5V5V5C15.001 3.343 13.658 2 12.001 2H12C10.343 2 9 3.343 9 5V5V5V9"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default BasketIcon;

cssInterop(Svg, {
  className: {
    target: "style",
    nativeStyleToProp: { height: true, width: true },
  },
});
