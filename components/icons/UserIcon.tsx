import { cn } from "@/lib/helpers";
import { cssInterop } from "nativewind";
import React from "react";
import Svg, { Path } from "react-native-svg";

const UserIcon = ({ className = "dark" }: { className?: string }) => {
  return (
    <Svg
      className={cn("h-full w-full", className)}
      viewBox="0 0 24 24"
      fill="none"
    >
      <Path
        d="M5 19.9996C5 17.4996 7 15.5996 9.4 15.5996H14.5C17 15.5996 18.9 17.5996 18.9 19.9996"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M15 5.2C16.7 6.9 16.7 9.6 15 11.2C13.3 12.8 10.6 12.9 8.99999 11.2C7.39999 9.5 7.29999 6.8 8.99999 5.2C10.7 3.6 13.3 3.6 15 5.2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default UserIcon;

cssInterop(Svg, {
  className: {
    target: "style",
    nativeStyleToProp: { height: true, width: true },
  },
});
