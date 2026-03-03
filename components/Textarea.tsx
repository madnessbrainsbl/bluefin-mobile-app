import React, { useEffect, useRef, useState } from "react";

import { TextInputProps, TextInput, NativeSyntheticEvent, TextInputFocusEventData, Keyboard } from "react-native";
// import { Input as GSInput, InputField, InputIcon, InputSlot } from "./ui/input";
import { Textarea as GSTextArea, TextareaInput } from "./ui/textarea";
import { Text } from "./ui/text";
import { cn } from "@gluestack-ui/nativewind-utils/cn";
import XIcon2 from "./icons/XIcon2";
import { Pressable } from "./ui/pressable";
import { Box } from "./ui/box";
import { Icon } from "./ui/icon";

//
export function Textarea({
  className,
  label,
  placeholder,
  keyboardType,
  value,
  onChange,
  onFocus,
  ...props
}: {
  //   className?: string;
  label: string;
  value?: string;
  placeholder?: string;
  keyboardType?: TextInputProps["keyboardType"];

  onChange?: (value: string) => void;
  onFocus?: ((e: NativeSyntheticEvent<TextInputFocusEventData>) => void);
} & React.ComponentPropsWithRef<typeof GSTextArea>) {
  const inputFieldRef = useRef<TextInputProps & TextInput>(null);

  const [ isScrollEnabled, setIsScrollEnabled ] = useState(false);
  
  function onKeyboardWillShow() {
    setIsScrollEnabled(false);
  }

  function onKeyboardDidShow() {
    setIsScrollEnabled(true);
  }

  useEffect(() => {
    const subKWS = Keyboard.addListener("keyboardWillShow", onKeyboardWillShow);
    const subKDS = Keyboard.addListener("keyboardDidShow", onKeyboardDidShow);

    return () => {
      subKWS.remove();
      subKDS.remove();
    }
  }, []);
  
  //   props.isDisabled;
  return (
    <GSTextArea
      className={cn(
        "flex flex-col content-start items-stretch justify-between gap-0 rounded bg-background",
        className,
      )}
      size="xl"
      {...props}
    >
      <Text
        className={cn("px-3 pt-1 text-xs", { "opacity-50": props.isDisabled })}
        onPress={() => {
          if (!props.isDisabled) inputFieldRef.current?.focus();
        }}
      >
        {label}
      </Text>

      <TextareaInput
        ref={inputFieldRef}
        type="text"
        className={cn("mb-1 h-6 text-base", { "opacity-50": props.isDisabled })}
        placeholder={placeholder}
        keyboardType={keyboardType}
        value={value}
        onChangeText={onChange}
        onFocus={onFocus}
        scrollEnabled={isScrollEnabled}
      />

      <Box className="absolute right-2 top-2 h-full">
        <Pressable
          className="active:bg-typography-control"
          onPress={() => onChange?.("")}
        >
          <Icon as={XIcon2} className="text-typography-400 h-6 w-6" />
        </Pressable>
      </Box>
    </GSTextArea>
  );
}
