import { cn } from "@/lib/helpers";
import { cssInterop } from "nativewind";
import React from "react";
import Svg, { Path } from "react-native-svg";

const MinusIcon = ({ className, ...props }: { className?: string }) => {
  return (
    <Svg
      className={cn("h-full w-full ", className)}
      viewBox="0 0 20 2"
      fill="none"
      {...props}
    >
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M19.6607 0.0859375V1.50951H0.688477V0.0859375H19.6607Z"
        fill="#504E4E"
        stroke="#504E4E"
      />
    </Svg>
  );
};

export default MinusIcon;

cssInterop(Svg, {
  className: {
    target: "style",
    nativeStyleToProp: { height: true, width: true },
  },
});
