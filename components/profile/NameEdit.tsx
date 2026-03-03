import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { HStack } from "../ui/hstack";
import { Text } from "../ui/text";
import { Pressable } from "../ui/pressable";
import { EditIcon, Icon } from "../ui/icon";
import { VStack } from "../ui/vstack";
import { Button } from "../ui/button";
import { cn } from "@gluestack-ui/nativewind-utils/cn";
import { Input } from "@/components/Input";

export const NameEdit = ({
  name,
  onMutate,
}: {
  name: string;
  onMutate: (newName: string) => void;
}) => {
  const { t } = useTranslation();

  const [editMode, setEditMode] = useState(false);
  const [editName, setEditName] = useState(name);

  useEffect(() => {
    setEditName(name);
  }, [name]);

  return (
    <HStack
      className={cn("gap-4", {
        "items-center": !editMode,
        "items-start": editMode,
      })}
    >
      <Text className="w-24 tracking-tight text-typography-dark">
        {t("personalScreen.name")}:
      </Text>
      {!editMode ? (
        <>
          <Text>{name}</Text>
          <Pressable
            className="active:bg-typography-control"
            onPress={() => {
              setEditName(name);
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
            value={editName}
            onChange={(value) => setEditName(value)}
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
                setEditName(name);
                onMutate(editName);
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
