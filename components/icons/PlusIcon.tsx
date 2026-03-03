import React from "react";
import { Path } from "react-native-svg";
import { createIcon } from "../ui/icon";

const PlusIcon = createIcon({
  // createIcon function is imported from '@/docs-components/nativewind/components/Icon/ui/icon'
  viewBox: "0 0 16 17",
  path: (
    <>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.64513 7.70926H15.4751V9.30925H8.64513V16.5092H7.12736V9.30925H0.297363V7.70926H7.12736V0.509277H8.64513V7.70926Z"
        // fill="currentColor"
        // stroke="currentColor"
        // fill="#A77027"
        // stroke="#504E4E"
      />
    </>
  ),
});

export default PlusIcon;



// const PlusIcon = ({ className, ...props }: { className?: string }) => {
//   return (
//     <Svg
//       className={cn("h-full w-full", className)}
//       viewBox="0 0 16 17"
//       fill="none"
//     >
//       <Path
//         fillRule="evenodd"
//         clipRule="evenodd"
//         d="M8.64513 7.70926H15.4751V9.30925H8.64513V16.5092H7.12736V9.30925H0.297363V7.70926H7.12736V0.509277H8.64513V7.70926Z"
//         fill="#504E4E"
//         stroke="#504E4E"
//       />
//     </Svg>
//   );
// };

// export default PlusIcon;

// cssInterop(Svg, {
//   className: {
//     target: "style",
//     nativeStyleToProp: { height: true, width: true },
//   },
// });
