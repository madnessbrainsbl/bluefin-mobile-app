import React, { useCallback, useRef } from "react";

import {
  TextInputProps,
  TextInput,
  NativeSyntheticEvent,
  TextInputFocusEventData,
} from "react-native";
import { Input as GSInput, InputField, InputIcon, InputSlot } from "./ui/input";
import { Text } from "./ui/text";
import { cn } from "@gluestack-ui/nativewind-utils/cn";
import XIcon2 from "./icons/XIcon2";
import { Pressable } from "./ui/pressable";
import { useFocusEffect } from "expo-router";

//
export function Input({
  className,
  label,
  placeholder,
  keyboardType,
  value,
  autofocus,
  onChange,
  onFocus,
  ...props
}: {
  //   className?: string;
  label?: string;
  value?: string;
  placeholder?: string;
  keyboardType?: TextInputProps["keyboardType"];
  autofocus?: boolean;
  onChange?: (value: string) => void;
  onFocus?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void;
} & React.ComponentPropsWithRef<typeof GSInput>) {
  const inputFieldRef = useRef<TextInputProps & TextInput>(null);

  useFocusEffect(
    useCallback(() => {
      const focus = () => {
        if (!autofocus) return;
        setTimeout(() => {
          inputFieldRef?.current?.focus();
        }, 100);
      };
      focus();
      return focus;
    }, [autofocus]),
  );

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

      <InputField
        ref={inputFieldRef}
        type="text"
        className={cn("text-base py-0", {
          "opacity-50": props.isDisabled,
          "mb-1": label && (value || !placeholder),
        })}
        placeholder={placeholder}
        keyboardType={keyboardType}
        value={value}
        onChangeText={onChange}
        onFocus={onFocus}
      />
      {value && !props.isDisabled && (
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
