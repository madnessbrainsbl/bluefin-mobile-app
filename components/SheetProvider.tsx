import { useAuthStore } from "@/stores/authStore";
import { AddressSheet } from "./AddressSheet/AddressSheet";
import { CitySheet } from "./CitySheet/CitySheet";
import { LoginSheet } from "./LoginSheet/LoginSheet";
import { DialogModal } from "./ModalDialog";
import { ProductSheet } from "./ProductSheet/ProductSheet";
import { UserProfileSheet } from "./UserProfileSheet/UserProfileSheet";
import { useSheetStore } from "@/hooks/useSheetStore";

export default function SheetProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const sheet = useSheetStore((state) => state.sheet);
  const params = useSheetStore((state) => state.params);

  const userToken = useAuthStore((state) => state.userToken);

  return (
    <>
      {children}
      <LoginSheet isOpen={!userToken && sheet === "phone"} />
      <CitySheet isOpen={sheet === "city"} />
      <AddressSheet isOpen={sheet === "address"} />
      <ProductSheet isOpen={sheet === "product"} product={params} />
      <UserProfileSheet isOpen={sheet === "profile"} profile={params} />
      <DialogModal />
    </>
  );
}
