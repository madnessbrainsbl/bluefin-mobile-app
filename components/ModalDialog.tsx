import { useTranslation } from "react-i18next";
import { Button } from "./ui/button";
import {
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "./ui/modal";
import { Text } from "./ui/text";

import { create } from "zustand";
import React from "react";

type DialogModal = {
  message: string;
  onConfirm?: () => void;
  onClose?: () => void;
};

interface DialogModalsStoreState {
  currentModal: DialogModal | null;
  modals: DialogModal[];
  showDialogModal: (dialogModal: DialogModal) => void;
  closeDialogModal: () => void;
}

export const useDialogModal = create<DialogModalsStoreState>()((set) => ({
  currentModal: null,
  modals: [],
  showDialogModal: (dialogModal) =>
    set((state) => ({
      currentModal: dialogModal,
      modals: [dialogModal, ...state.modals],
    })),
  closeDialogModal: () =>
    set((state) => {
      const newModals = state.modals.slice(1);
      return { modals: newModals, currentModal: newModals?.[0] ?? null };
    }),
}));

export function DialogModal() {
  const { t } = useTranslation();
  const currentModal = useDialogModal((state) => state.currentModal);
  const modals = useDialogModal((state) => state.modals);

  const closeDialogModal = useDialogModal((state) => state.closeDialogModal);

  return (
    <Modal
      isOpen={!!currentModal}
      onClose={() => {
        currentModal?.onClose && currentModal?.onClose();
        closeDialogModal();
      }}
    >
      <ModalBackdrop />
      <ModalContent>
        <ModalHeader>
          <ModalCloseButton></ModalCloseButton>
        </ModalHeader>
        <ModalBody>
          <Text className="text-center">{currentModal?.message}</Text>
        </ModalBody>
        <ModalFooter className="justify-center">
          {!currentModal?.onConfirm && (
            <Button
              className="bg-primary-main grow"
              onPress={() => {
                currentModal?.onClose && currentModal?.onClose();
                closeDialogModal();
              }}
            >
              <Text className="font-bold text-background">{t("modal.understood")}</Text>
            </Button>
          )}
          {currentModal?.onConfirm && (
            <>
              <Button
                className="bg-background rounded-none border-primary-main border-[1px] grow shrink basis-0"
                onPress={() => {
                  currentModal?.onClose && currentModal?.onClose();
                  closeDialogModal();
                }}
              >
                <Text className="font-bold text-primary-main ">{t("modal.cancel")}</Text>
              </Button>
              <Button
                className="bg-primary-main rounded-none grow shrink basis-0"
                onPress={() => {
                  currentModal?.onConfirm && currentModal.onConfirm();
                  closeDialogModal();
                }}
              >
                <Text className="font-bold text-background">{t("modal.ok")}</Text>
              </Button>
            </>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
