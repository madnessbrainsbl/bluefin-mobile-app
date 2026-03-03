// import { HStack, Pressable, Text } from 'native-base'
import React, { useCallback } from "react";
import { HStack } from "./hstack";
import { Pressable } from "./pressable";
import { Text } from "./text";
import { cn } from "@/lib/helpers";
import i18n from "@/lib/i18n";
// import i18n from 'translate/i18n'
// import { selectLng, setLng } from 'store/auth'

const LngSwitcher = () => {

  return (
    <HStack
      className="justify-start gap-3"
    >
      <Pressable onPress={() => i18n.changeLanguage("ru-RU")}>
        <Text
          className={cn("text-xl color-primary-light", {
            "font-bold": i18n.language === "ru-RU",
          })}
        >
          RU
        </Text>
      </Pressable>

      <Pressable onPress={() => i18n.changeLanguage("en-US")}>
        <Text
          className={cn("text-xl color-primary-light", {
            "font-bold": i18n.language === "en-US",
          })}
        >
          EN
        </Text>
      </Pressable>
    </HStack>
  );
};

export default LngSwitcher;
