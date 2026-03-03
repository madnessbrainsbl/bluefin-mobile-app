import { cn } from "@/lib/helpers";
import { cssInterop } from "nativewind";
import React from "react";
import Svg, { Path } from "react-native-svg";

const SearchIcon = ({ className = "dark" }: { className?: string }) => {
  return (
    <Svg
      className={cn("h-full w-full", className)}
      viewBox="0 0 24 25"
      fill="none"
    >
      <Path
        d="M15.7138 7.3382C18.1647 9.78913 18.1647 13.7629 15.7138 16.2138C13.2629 18.6647 9.28913 18.6647 6.8382 16.2138C4.38727 13.7629 4.38727 9.78913 6.8382 7.3382C9.28913 4.88727 13.2629 4.88727 15.7138 7.3382"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M19 19.5L15.71 16.21"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default SearchIcon;

cssInterop(Svg, {
  className: {
    target: "style",
    nativeStyleToProp: { height: true, width: true },
  },
});
