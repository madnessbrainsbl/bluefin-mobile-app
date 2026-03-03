import React, { useRef } from "react";

import { TextInputProps, TextInput, Pressable } from "react-native";
import {
  MaskedInput as GSInput,
  InputIcon,
  InputSlot,
  MaskedInputField,
} from "./ui/input";

import { Text } from "./ui/text";
import { cn } from "@gluestack-ui/nativewind-utils/cn";
import { MaskedTextInput } from "react-native-mask-text";
import XIcon2 from "./icons/XIcon2";

//
export function MaskedInput({
  className,
  label,
  value,
  onChange,
  keyboardType,
  mask,
  placeholder,
  ...props
}: {
  className?: string;
  label?: string;
  value: string;
  keyboardType?: TextInputProps["keyboardType"];
  mask: string;
  placeholder?: string;
  onChange?: (value: string) => void;
} & React.ComponentPropsWithRef<typeof GSInput>) {
  const inputFieldRef = useRef<
    React.ComponentPropsWithRef<typeof MaskedInputField> & TextInput
  >(null);

  return (
    <GSInput
      className={cn(
        "flex flex-col content-start items-stretch justify-between gap-1 rounded bg-background",
        className,
      )}
      size="xl"
      {...props}
    >
      {label && (value || !placeholder) && (
        <Text
          className={cn("px-3 pt-1 text-xs", {
            "opacity-50": props.isDisabled,
          })}
          onPress={() => {
            if (!props.isDisabled) inputFieldRef.current?.focus();
          }}
        >
          {label}
        </Text>
      )}

      <MaskedInputField
        ref={inputFieldRef}
        mask={mask}
        placeholder={placeholder}
        keyboardType={keyboardType}
        type="text"
        className={cn("text-base py-0", {
          "opacity-50": props.isDisabled,
          "mb-1": label && (value || !placeholder),
        })}
        value={value}
        onChangeText={onChange}
      />
      {(value || !props.isDisabled) && (
        <InputSlot className="absolute right-2 h-full">
          <Pressable
            className="active:bg-typography-control"
            onPress={() => onChange?.("")}
          >
            <InputIcon as={XIcon2} />
          </Pressable>
        </InputSlot>
      )}
    </GSInput>
  );
}
