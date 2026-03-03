import { useTranslation } from "react-i18next";
import { Text } from "../ui/text";
import { VStack } from "../ui/vstack";
import { HStack } from "../ui/hstack";
import { cn } from "@/lib/helpers";
import { MaskedInput, MaskedInputField } from "../ui/maskedinput";
import { Pressable } from "../ui/pressable";
import { Icon } from "../ui/icon";
import XIcon2 from "../icons/XIcon2";
import { Button } from "../ui/button";
import { LoadingDots } from "../ui/LoadingDots";

export function PhoneForm({
  isPending,
  phone,
  setPhone,
  phoneError,
  action
}: {
  isPending: boolean;
  phone: string;
  setPhone: (value: string) => void;
  phoneError: boolean;
  action: () => void;
}) {
  const { t } = useTranslation();
  return (
    <VStack className="w-full pt-2">
      <Text className="text-center text-xl font-extrabold leading-snug tracking-tight">
        {t("loginSheet.phoneNumber")}
      </Text>

      <Text className="mt-4 text-center text-sm leading-tight text-typography-dark">
        {t("loginSheet.enterThePhoneNumber")}
      </Text>

      <HStack
        className={cn(
          "my-4 w-full items-center justify-between overflow-hidden rounded-sm border-[1px] border-primary-main px-4 py-1",
          {
            "border-red-500": phoneError,
          },
        )}
      >
        <VStack className="grow">
          <Text className="text-xs">{t("loginSheet.phone")} *</Text>
          {/* <Input className="border-b-0 py-0 my-0 leading-[0px] bg-blue-300 w-full h-auto" variant="underlined"> */}
          <MaskedInput
            className="my-0 h-auto w-full border-b-0 py-0 leading-[0px]"
            variant="underlined"
          >
            <MaskedInputField
              type="text"
              className="h-5 py-0 leading-[1rem]"
              keyboardType="phone-pad"
              mask="+7 (999) 999-99-99"
              value={phone}
              onChangeText={(value) => setPhone(value)}
              placeholder="+7 (___) ___-__-__"
            />
          </MaskedInput>
        </VStack>
        <Pressable onPress={() => setPhone("")}>
          <Icon as={XIcon2} />
        </Pressable>
      </HStack>

      <Button
        isDisabled={isPending}
        className="h-11 rounded-sm bg-primary-main"
        onPress={action}
      >
        {isPending && <LoadingDots />}
        {!isPending && (
          <Text className="font-bold text-background">{t("loginSheet.sendCode")}</Text>
        )}
      </Button>
    </VStack>
  );
}
