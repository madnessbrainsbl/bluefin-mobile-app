import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { HStack } from "../ui/hstack";
import { Text } from "../ui/text";
import { Pressable } from "../ui/pressable";
import { EditIcon, Icon } from "../ui/icon";
import { VStack } from "../ui/vstack";
import { Button } from "../ui/button";
import { cn } from "@gluestack-ui/nativewind-utils/cn";
// import { MaskedInput, MaskedInputField } from "../ui/maskedinput";

import React from "react";
import { MaskedInput } from "@/components/MaskedInput";

export const BirthdayEdit = ({
  birthday,
  onMutate,
}: {
  birthday: string;
  onMutate: (newBirthday: string) => void;
}) => {
  const { t } = useTranslation();

  const [editMode, setEditMode] = useState(false);
  const [editBirthday, setEditBirthday] = useState(birthday);

  useEffect(() => {
    setEditBirthday(birthday);
  }, [birthday]);

  return (
    <HStack
      className={cn("gap-4", {
        "items-center": !editMode,
        "items-start": editMode,
      })}
    >
      <Text className="w-24 tracking-tight text-typography-dark">
        {t("personalScreen.birthday").replace(" ", "\n") + ":"}
      </Text>
      {!editMode ? (
        <>
          <Text>{birthday}</Text>
          <Pressable
            className="active:bg-typography-control"
            onPress={() => {
              setEditBirthday(birthday);
              setEditMode(true);
            }}
          >
            <Icon as={EditIcon} className="fill-none text-typography-form" />
          </Pressable>
        </>
      ) : (
        <VStack className="grow gap-4">
          <MaskedInput
            className="rounded-none bg-background data-[focus=true]:border-primary-main"
            mask="99.99.9999"
            placeholder="01.01.2000"
            value={editBirthday}
            onChange={(value) => setEditBirthday(value)}
          />

          <HStack className="gap-4">
            <Button
              className="grow rounded-none border-[1px] border-primary-main bg-background"
              onPress={() => {
                setEditMode(false);
              }}
            >
              <Text className="text-primary-main">
                {t("personalScreen.cancel")}
              </Text>
            </Button>
            <Button
              className="grow rounded-none bg-primary-main"
              onPress={() => {
                setEditMode(false);
                setEditBirthday(birthday);
                onMutate(editBirthday);
              }}
            >
              <Text className="text-background">
                {t("personalScreen.save")}
              </Text>
            </Button>
          </HStack>
        </VStack>
      )}
    </HStack>
  );
};
