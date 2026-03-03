// import { useToken } from 'native-base'
import { cn } from "@/lib/helpers";
import { cssInterop } from "nativewind";
import React from "react";
import Svg, { Path } from "react-native-svg";
import { createIcon } from "../ui/icon";

const CheckIcon = createIcon({
  // createIcon function is imported from '@/docs-components/nativewind/components/Icon/ui/icon'
  viewBox: "0 0 15 15",
  path: (
    <>
      <Path
        d="M12.5 3.75L5.625 10.625L2.5 7.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
});

export default CheckIcon;

// cssInterop(Svg, {
//   className: {
//     target: "style",
//     nativeStyleToProp: { height: true, width: true },
//   },
// });
