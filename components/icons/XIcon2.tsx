import { cn } from "@/lib/helpers";
import React from "react";
import Svg, { Path } from "react-native-svg";
import { createIcon } from "../ui/icon";

const XIcon2 = createIcon({
  // createIcon function is imported from '@/docs-components/nativewind/components/Icon/ui/icon'
  viewBox: "0 0 24 24",
  path: (
    <>
      <Path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M6 18L18 6M6 6l12 12"
      />
    </>
  ),
});

export default XIcon2;
// let XIcon2 = ({ className }: { className?: string }) => {
//   return (
//     <Svg
//       className={cn("h-full w-full", className)}
//       fill="none"
//       stroke="currentColor"
//       viewBox="0 0 24 24"
//     >
//       <Path
//         strokeLinecap="round"
//         strokeLinejoin="round"
//         strokeWidth="2"
//         d="M6 18L18 6M6 6l12 12"
//       />
//     </Svg>
//   );
// };

// export default XIcon2;
