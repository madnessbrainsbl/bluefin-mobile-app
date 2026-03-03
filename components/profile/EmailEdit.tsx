import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { HStack } from "../ui/hstack";
import { Text } from "../ui/text";
import { Pressable } from "../ui/pressable";
import { EditIcon, Icon } from "../ui/icon";
import { VStack } from "../ui/vstack";
import { Input } from "@/components/Input";
import { Button } from "../ui/button";
import { cn } from "@gluestack-ui/nativewind-utils/cn";
import React from "react";

export const EmailEdit = ({
  email,
  onMutate,
}: {
  email: string;
  onMutate: (newEmail: string) => void;
}) => {
  const { t } = useTranslation();

  const [editMode, setEditMode] = useState(false);
  const [editEmail, setEditEmail] = useState(email);

  useEffect(() => {
    setEditEmail(email);
  }, [email]);

  return (
    <HStack
      className={cn("gap-4", {
        "items-center": !editMode,
        "items-start": editMode,
      })}
    >
      <Text className="w-24 tracking-tight text-typography-dark">
        {t("personalScreen.email")}:
      </Text>
      {!editMode ? (
        <>
          <Text>{email}</Text>
          <Pressable
            className="active:bg-typography-control"
            onPress={() => {
              setEditEmail(email);
              setEditMode(true);
            }}
          >
            <Icon as={EditIcon} className="fill-none text-typography-form" />
          </Pressable>
        </>
      ) : (
        <VStack className="grow gap-4">
          <Input
            className="rounded-none bg-background data-[focus=true]:border-primary-main"
            value={editEmail}
            onChange={(value) => setEditEmail(value)}
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
                setEditEmail(email);
                onMutate(editEmail);
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
