import { Additive, Product } from "@/hooks/useProducts";
import { VStack } from "./ui/vstack";
import {
  Checkbox,
  CheckboxGroup,
  CheckboxIcon,
  CheckboxIndicator,
  CheckboxLabel,
} from "./ui/checkbox";
import { useState } from "react";
import CheckIcon from "./icons/CheckIcon";
import { HStack } from "./ui/hstack";
import { Text } from "./ui/text";
import { cn } from "@/lib/helpers";
import { Box } from "./ui/box";
import { createIcon, Icon } from "./ui/icon";
import { Path, Rect } from "react-native-svg";

export function ProductAdditives({
  disabled = false,
  className,
  additives = [],
  values,
  onChange
}: {
  disabled?: boolean;
  className?: string;
  additives?: Additive[];
  values: string[];
  onChange: (additives: string[]) => void;
}) {

  return (
    <Box>
      <CheckboxGroup
        className={cn(className)}
        value={values}
        onChange={(keys) => {
          onChange(keys);
        }}
      >
        {additives.map((additive) => (
          <Checkbox value={additive.id} key={additive.id} isDisabled={disabled}>
            <CheckboxIndicator className="data-[checked=true]:bg-primary-main border-outline-light data-[checked=true]:border-0" >
              <CheckboxIcon className="text-background" as={CheckIcon} />
            </CheckboxIndicator>
            <HStack className="flex-1 justify-between gap-4">
              <Text className="shrink">{additive.name}</Text>
              <Text className="font-bold text-primary-main">
                {additive.price} ₽
              </Text>
            </HStack>
          </Checkbox>
        ))}
      </CheckboxGroup>
    </Box>
  );
}
