import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
} from "../ui/actionsheet";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { unMask } from "react-native-mask-text";
// import { sendSmsCode, sendSmsRequest } from "@/lib/auth";
import { useMutation } from "@tanstack/react-query";
import { useDialogModal } from "../ModalDialog";
import { useSheetStore } from "@/hooks/useSheetStore";
import { PhoneForm } from "./PhoneForm";
import { CodeForm } from "./CodeForm";
import { useAuthStore } from "@/stores/authStore";
import { useCatalogStore, useCity } from "@/hooks/useCatalogStore";
import { useLastOrder } from "@/hooks/useLastOrder";
import { useUserProfiles } from "@/hooks/useUserProfiles";
import { useAuth } from "@/hooks/useAuth";
import { KeyboardAvoidingView, Platform } from "react-native";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

export function LoginSheet({ isOpen }: { isOpen: boolean }) {
  const { t } = useTranslation();

  const { siteId } = useCity();

  const closeSheet = useSheetStore((state) => state.closeSheet);

  const anonToken = useAuthStore((state) => state.anonToken);
  const setUserToken = useAuthStore((state) => state.setUserToken);

  const [form, setForm] = useState<"phone" | "code">("phone");

  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");

  const showDialogModal = useDialogModal((state) => state.showDialogModal);
  const [phoneError, setPhoneError] = useState(false);

  const RETRY_IN_SECONDS = 10;

  const [isWaitingRetryRemainingSec, setIsWaitingRetryRemainingSec] =
    useState(0);

  useEffect(() => {
    if (phoneError) setPhoneError(false);
  }, [phone]);

  const {
    sendCodeRequestMutation: {
      isPending: isSendPhonePending,
      mutate: sendCodeRequestMutate,
    },
    sendCodeMutation: {
      isPending: isSendCodePending,
      isError: isSendCodeError,
      isSuccess: isSendCodeSuccess,
      mutate: sendCodeMutate,
      reset: sendCodeReset,
    },
  } = useAuth();

  const sendCodeRequest = async (phone: string) =>
    sendCodeRequestMutate(unMask(phone), {
      onError: (err) => {
        console.warn(err.message);
        if (!(err instanceof Error) && err?.status === 502) {
          showDialogModal({
            message: t(err.message ?? "errors.unknownError"),
          });
          setPhoneError(true);
        } else {
          showDialogModal({ message: t("errors.unknownError") });
        }
      },
      onSuccess: () => {
        setPhoneError(false);
        setCode("");
        setForm("code");
        sendCodeReset();
      },
    });

  const sendCode = async (
    siteId: string,
    phone: string,
    code: string,
    token: string,
  ) => {
    sendCodeMutate(
      { siteId, phone, code, token },
      {
        onError: (err) => {
          console.warn(err.message);
          if (!(err instanceof Error) && err?.status === 502) {
            showDialogModal({
              message: t(
                err.message ? t("errors." + err.message) : "errors.unknownError",
              ),
            });
            setCode("");
            setIsWaitingRetryRemainingSec(RETRY_IN_SECONDS);
            // setPhoneError(true);
          } else {
            showDialogModal({ message: t("errors.unknownError") });
          }
        },
        onSuccess: async (token) => {
          if (siteId && token) {
            if (!profile) {
              // const order = await getLastOrder({ siteId, userToken: token });
              // console.log('LAST ORDER', order);
              // if (order?.profile) {
              //   console.log(
              //     "setting profile login sheet",
              //     order.profile.address,
              //   );
              //   setProfile(order.profile);
              // }
            } else {
              // if (!profile.id) {
              //   console.log(
              //     "New profile, creating profile",
              //     profile,
              //   );
              //   const newProfile = await createUserProfile({
              //     ...profile,
              //     token,
              //   });
              //   console.log("new profile created", newProfile);
              //   setProfile(newProfile);
              // }
            }
          }

          setUserToken(token);

          closeSheet();
          setForm("phone");
          setPhone("");
          setCode("");
        },
      },
    );
  };

  const profile = useCatalogStore((state) => state.profile);
  const setProfile = useCatalogStore((state) => state.setProfile);
  const { mutateAsync: getLastOrder } = useLastOrder();
  const {
    useUserProfileCreateMutation: { mutateAsync: createUserProfile },
  } = useUserProfiles();

  useEffect(() => {
    let timerInterval: ReturnType<typeof setInterval>;
    if (isSendCodeError) {
      timerInterval = setInterval(() => {
        setIsWaitingRetryRemainingSec((prevTime) => {
          if (prevTime <= 0) {
            clearInterval(timerInterval);
            return 0;
          } else {
            return prevTime - 1;
          }
        });
      }, 1000);
    }
    return () => clearInterval(timerInterval);
  }, [isSendCodeError]);

  return (
    <Actionsheet isOpen={isOpen} onClose={() => closeSheet()}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ActionsheetBackdrop />

        {/* <TouchableWithoutFeedback onPress={() => closeSheet()}> */}
        <ActionsheetContent className="rounded-tl-lg rounded-tr-lg">
          <ActionsheetDragIndicatorWrapper>
            <ActionsheetDragIndicator />
          </ActionsheetDragIndicatorWrapper>
          {form === "phone" && (
            <PhoneForm
              isPending={isSendPhonePending}
              phone={phone}
              setPhone={setPhone}
              phoneError={phoneError}
              action={() => sendCodeRequest(unMask(phone))}
            />
          )}
          {form === "code" && (
            <CodeForm
              isPending={isSendPhonePending || isSendCodePending}
              retryIn={isWaitingRetryRemainingSec}
              phone={phone}
              code={code}
              setCode={setCode}
              action={() =>
                sendCode(siteId, unMask(phone), code, anonToken ?? "")
              }
              shouldRetry={isSendCodeError}
              retryAction={() => {
                // sendCodeReset();
                sendCodeRequest(unMask(phone));
              }}
              returnAction={() => setForm("phone")}
            />
          )}
        </ActionsheetContent>
      </KeyboardAvoidingView>
      {/* </TouchableWithoutFeedback> */}
    </Actionsheet>
  );
}
