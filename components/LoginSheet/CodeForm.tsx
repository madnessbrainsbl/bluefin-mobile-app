import { useTranslation } from "react-i18next";
import { VStack } from "../ui/vstack";
import { Text } from "../ui/text";
import { Pressable } from "react-native";
import { CodeInput } from "./CodeInput";
import { Button } from "../ui/button";
import { LoadingDots } from "../ui/LoadingDots";

export function CodeForm({
  isPending = false,
  phone,
  code,
  setCode,
  returnAction,
  action,
  shouldRetry,
  retryIn,
  retryAction,
}: {
  isPending: boolean;
  phone: string;
  code: string;
  setCode: (text: string) => void;
  returnAction: () => void;
  action: () => void;
  shouldRetry: boolean;
  retryIn: number;
  retryAction: () => void;
}) {
  const { t } = useTranslation();

  return (
    <VStack className="w-full pt-2">
      <Text className="text-center text-xl font-extrabold leading-snug tracking-tight">
        {t("loginSheet.enterCode")}
      </Text>

      <Text className="mt-4 text-center text-sm leading-tight text-typography-dark">
        {t("loginSheet.codeWasSent")}
      </Text>

      <Text className="mt-2 text-center font-medium">{phone}</Text>
      <Pressable className="mb-6 mt-4" onPress={() => returnAction()} disabled={isPending}>
        <Text className="text-center font-medium text-primary-main">
          {t("loginSheet.changePhoneNumber")}
        </Text>
      </Pressable>

      {!shouldRetry && (
        <CodeInput
          // className="mt-6"
          value={code}
          onChange={(text) => setCode(text)}
        />
      )}

      {shouldRetry && (
        <Button
          isDisabled={isPending || retryIn > 0}
          variant="outline"
          className="mt-4 h-11 rounded-sm"
          onPress={retryAction}
        >
          {isPending && <LoadingDots />}
          {!isPending && (
            <Text className="border-typography-control font-bold text-typography-control">
              {retryIn
                ? t("loginSheet.resendCode") + " (" + retryIn + ")"
                : t("loginSheet.resendCode")}
            </Text>
          )}
        </Button>
      )}

      {!shouldRetry && (
        <Button
          isDisabled={isPending || code.length < 4}
          className="mt-4 h-11 rounded-sm bg-primary-main"
          onPress={action}
        >
          {isPending && <LoadingDots />}
          {!isPending && (
            <Text className="font-bold text-background">{t("loginSheet.sendCode")}</Text>
          )}
        </Button>
      )}
    </VStack>
  );
}
