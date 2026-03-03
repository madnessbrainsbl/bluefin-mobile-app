import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/authStore";
import { useCatalogStore, useCity } from "./useCatalogStore";
import { apiUrl } from "@/constants/config";
import { useDialogModal } from "@/components/ModalDialog";
import { useTranslation } from "react-i18next";
import { useLastOrder } from "./useLastOrder";

export type UserProfile = {
  id?: string;
  name: string;
  address: string;
  coords: [number, number];
  entrance: string;
  floor: string;
  intercomCode: string;
  flat: string;
};

export const useUserProfiles = () => {
  const { t } = useTranslation();
  const showDialogModal = useDialogModal((state) => state.showDialogModal);
  const userToken = useAuthStore((state) => state.userToken);
  const { siteId } = useCity();

  const queryClient = useQueryClient();

  const useUserProfilesList = useQuery({
    queryKey: ["userProfiles", "userToken:" + userToken, "siteId:" + siteId],
    queryFn: async () => {
      if (!userToken || !siteId) return [];
      const response = await fetch(apiUrl + "/profiles/", {
        headers: {
          "Authorization": "Bearer " + userToken,
          "Site-Id": siteId,
        },
      });
      if (response.ok) {
        const resp = await response.json();
        return resp.profiles as (UserProfile & { id: string })[];
      } else {
        throw new Error("Failed to fetch user profiles");
      }
    },
  });

  const useUserProfileCreateMutation = useMutation<
    UserProfile | null,
    Error | { status: number; message: string },
    Partial<UserProfile> &
      Partial<{
        street: string;
        streetId: string;
        house: string;
        houseId: string;
      }> & { token?: string }
  >({
    mutationKey: ["userProfilesCreate", "userToken:" + userToken],
    mutationFn: async (
      profile: Partial<UserProfile> &
        Partial<{
          street: string;
          streetId: string;
          house: string;
          houseId: string;
        }> & { token?: string },
    ) => {
      const token = profile.token ?? userToken;
      if (!token)
        throw new Error("Profile creation failed. No user token found");

      const formData = new FormData();

      // formData.append("id", profile.id || "");
      if (profile.name) formData.append("name", profile.name);
      if (profile.address) formData.append("address", profile.address);
      if (profile.street) formData.append("street", profile.street);
      if (profile.streetId) formData.append("streetId", profile.streetId);
      if (profile.house) formData.append("house", profile.house);
      if (profile.houseId) formData.append("houseId", profile.houseId);
      if (profile.coords) formData.append("coords", profile.coords.join(","));
      if (profile.entrance) formData.append("entrance", profile.entrance);
      if (profile.floor) formData.append("floor", profile.floor);
      if (profile.intercomCode)
        formData.append("intercomCode", profile.intercomCode);
      if (profile.flat) formData.append("flat", profile.flat);

      const response = await fetch(apiUrl + "/profiles/create/", {
        method: "POST",
        headers: {
          "Authorization": "Bearer " + token,
          "Content-Type": "multipart/form-data",
          "Site-Id": siteId,
        },
        body: formData,
      });

      if (response.ok) {
        return (await response.json()) as UserProfile;
      } else {
        console.error("Failed to create user profile", await response.json());
        throw new Error("Failed to create user profile");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["userProfiles", "userToken:" + userToken, "siteId:" + siteId],
      });
    },
    onError: (err) => {
      console.warn(err.message);
      if (!(err instanceof Error) && err?.status === 502) {
        if (typeof err.message === "string") {
          showDialogModal({ message: t(err.message ?? "unknownError") });
        } else if (typeof err.message === "object") {
          showDialogModal({ message: Object.values(err.message).join(", ") });
        }
      } else {
        showDialogModal({ message: t("unknownError") });
      }
    },
  });

  const useUserProfileUpdateMutation = useMutation<
    void,
    Error | { status: number; message: string },
    Partial<UserProfile>
  >({
    mutationKey: ["userProfilesUpdate", "userToken:" + userToken],
    mutationFn: async (profile: Partial<UserProfile>) => {
      if (!userToken) return;
      const formData = new FormData();

      formData.append("id", profile.id || "");
      if (profile.name) formData.append("name", profile.name);
      if (profile.address) formData.append("address", profile.address);
      if (profile.coords) formData.append("coords", profile.coords.join(","));
      if (profile.entrance) formData.append("entrance", profile.entrance);
      if (profile.floor) formData.append("floor", profile.floor);
      if (profile.intercomCode)
        formData.append("intercomCode", profile.intercomCode);
      if (profile.flat) formData.append("flat", profile.flat);

      const response = await fetch(apiUrl + "/profiles/update/", {
        method: "POST",
        headers: {
          "Authorization": "Bearer " + userToken,
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to update user profile");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["userProfiles", "userToken:" + userToken, "siteId:" + siteId],
      });
    },
    onError: (err) => {
      console.warn(err.message);
      if (!(err instanceof Error) && err?.status === 502) {
        if (typeof err.message === "string") {
          showDialogModal({ message: t(err.message ?? "unknownError") });
        } else if (typeof err.message === "object") {
          showDialogModal({ message: Object.values(err.message).join(", ") });
        }
      } else {
        showDialogModal({ message: t("unknownError") });
      }
    },
  });

  const useUserProfileDeleteMutation = useMutation<
    void,
    Error | { status: number; message: string },
    string
  >({
    mutationKey: ["userProfileDelete", "userToken:" + userToken],
    mutationFn: async (id: string) => {
      if (!userToken) return;
      const formData = new FormData();

      formData.append("id", id);

      const response = await fetch(apiUrl + "/profiles/delete/", {
        method: "POST",
        headers: {
          "Authorization": "Bearer " + userToken,
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to delete user profile");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["userProfiles", "userToken:" + userToken, "siteId:" + siteId],
      });
    },
    onError: (err) => {
      console.warn(err.message);
      if (!(err instanceof Error) && err?.status === 502) {
        if (typeof err.message === "string") {
          showDialogModal({ message: t(err.message ?? "unknownError") });
        } else if (typeof err.message === "object") {
          showDialogModal({ message: Object.values(err.message).join(", ") });
        }
      } else {
        showDialogModal({ message: t("unknownError") });
      }
    },
  });

  return {
    useUserProfilesList,
    useUserProfileCreateMutation,
    useUserProfileUpdateMutation,
    useUserProfileDeleteMutation,
  };
};
