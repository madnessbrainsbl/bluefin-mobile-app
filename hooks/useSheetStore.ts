import { P } from "@expo/html-elements";
import { create } from "zustand";

type SheetStoreProps = {
    sheet: 'none' | 'phone' | 'code' | 'city' | 'address' | 'profile' | 'product',
    params: any,
    onClose: (...arg: any) => void
}
interface SheetStoreActions {
    openSheet: ({
        sheet,
        params,
        onClose
    }: {
        sheet: SheetStoreProps['sheet'];
        params: SheetStoreProps['params'];
        onClose: SheetStoreProps["onClose"];
    }) => void;
    closeSheet: () => void;
}

export const useSheetStore = create<SheetStoreProps & SheetStoreActions>()((set) => ({
    sheet: 'none',
    params: null,
    onClose: (arg: any) => { },
    openSheet: ({ sheet, params, onClose }) => set((state) => {
        return {
            ...state,
            sheet,
            params,
            onClose
        }
    }),
    closeSheet: () => set((state) => {
        return {
            sheet: 'none',
            params: null,
            onClose: () => { }
        }
    })
}))