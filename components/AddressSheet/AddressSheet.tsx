import { useSheetStore } from "@/hooks/useSheetStore";
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
} from "../ui/actionsheet";
import { Text } from "../ui/text";
import { Box } from "../ui/box";
import { useTranslation } from "react-i18next";
import { Pressable } from "../ui/pressable";
import { HStack } from "../ui/hstack";
import MapView, { Polygon, Region, PROVIDER_GOOGLE } from "react-native-maps";
import { useAuthStore } from "@/stores/authStore";
import { cssInterop } from "nativewind";
import { Icon } from "../ui/icon";
import PinIcon from "../icons/PinIcon";
import { useEffect, useRef, useState } from "react";
import useDebounce from "@/hooks/useDebounce";
import { Input, InputField, InputSlot } from "../ui/input";
import { useSuggestionsByCoords } from "@/hooks/useSuggestionsByCoords";
import { Spinner } from "../ui/spinner";
import { Button } from "../ui/button";
import { Suggestion, useSuggestions } from "@/hooks/useSuggestions";
import {
  KeyboardAvoidingView,
  Platform,
  TextInputProps,
  useWindowDimensions,
} from "react-native";
import XIcon2 from "../icons/XIcon2";
import pointInPolygon from "@/components/pointInPolygon";
import { useDialogModal } from "../ModalDialog";
import { useCatalogStore, useCity } from "@/hooks/useCatalogStore";
import { UserProfile, useUserProfiles } from "@/hooks/useUserProfiles";
import { useMediaQuery } from "../ui/utils/use-media-query";
import { cn } from "@gluestack-ui/nativewind-utils/cn";
import ArrowIcon from "../icons/ArrowIcon";
import { useClearCart } from "@/hooks/useCart";
import { DeliveryZone, useAppSettings } from "@/hooks/useAppSettings";
import React from "react";
import * as Location from "expo-location";
import { use } from "i18next";
import { ScrollView } from "react-native-gesture-handler";
import { VStack } from "../ui/vstack";

cssInterop(MapView, {
  className: {
    target: "style",
  },
});

export function AddressSheet({ isOpen }: { isOpen: boolean }) {
  const { t } = useTranslation();

  const [isSm, isMd] = useMediaQuery([
    {
      maxHeight: 699,
    },
    {
      minHeight: 700,
    },
  ]);

  const openSheet = useSheetStore((state) => state.openSheet);
  const closeSheet = useSheetStore((state) => state.closeSheet);

  const userToken = useAuthStore((state) => state.userToken);

  const profile = useCatalogStore((state) => state.profile);
  const {
    useUserProfilesList: { data: profiles },
  } = useUserProfiles();

  const departmentId = useCatalogStore((state) => state.departmentId);
  const city = useCity();

  const [region, setRegion] = useState<Region>();
  const [address, setAddress] = useState(profile?.address ?? "");

  const mapRef = useRef<MapView>(null);

  const [deviceLocation, setDeviceLocation] =
    useState<Location.LocationObject | null>(null);

  useEffect(() => {
    (async () => {
      if (!isOpen) return;

      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setDeviceLocation(location);
    })();
  }, [isOpen]);

  useEffect(() => {
    setAddress(profile?.address ?? "");
    let newRegion: Region | null = null;

    if (profile) {
      newRegion = {
        latitude: profile.coords[0],
        longitude: profile.coords[1],
        latitudeDelta: 0.004,
        longitudeDelta: 0.004,
      };
    } else if (deviceLocation) {
      newRegion = {
        latitude: deviceLocation.coords.latitude,
        longitude: deviceLocation.coords.longitude,
        latitudeDelta: isSm ? 0.004 : 0.008,
        longitudeDelta: isSm ? 0.004 : 0.008,
      };

    } else {
      newRegion = {
        latitude: city.mapCenter[0],
        longitude: city.mapCenter[1],
        latitudeDelta: isSm ? 0.004 : 0.008,
        longitudeDelta: isSm ? 0.004 : 0.008,
      };
    }

    if (isOpen && newRegion) {
      //breaking out of event loop
      setTimeout(() => {
        mapRef.current?.animateToRegion(newRegion, 0);
      }, 0);
      setRegion(newRegion);
    }
  }, [deviceLocation, profile, isOpen, mapRef, city]);

  const debouncedAddress = useDebounce(address, 200);

  const { isPending: isSuggestionsPending, data: suggestions } =
    useSuggestions(debouncedAddress);

  const { isPending: isSuggestionsByCoordsPending, data: suggestionsByCoords } =
    useSuggestionsByCoords(
      region ? [region.latitude, region.longitude] : undefined,
    );

  // //TODO remove hack
  const [skipGeoLocation, setSkipGeoLocation] = useState(false);

  useEffect(() => {
    if (suggestionsByCoords?.length && suggestionsByCoords.length > 0) {
      setAddress(suggestionsByCoords[0].value ?? "");
      setChosenSuggestion(suggestionsByCoords[0]);
    }
  }, [suggestionsByCoords]);

  const [showSuggestions, setShowSuggestions] = useState(false);

  const inputRef = useRef<TextInputProps>(null);

  const [chosenSuggestion, setChosenSuggestion] = useState<Suggestion | null>(
    null,
  );

  const [chosenZone, setChosenZone] = useState<DeliveryZone | null>(null);

  useEffect(() => {
    const zone = city?.zones?.find((zone) =>
      pointInPolygon(
        [region?.latitude ?? 0, region?.longitude ?? 0],
        zone.coords,
      ),
    );
    setChosenZone(zone ?? null);
  }, [region]);

  const onCloseSheet = useSheetStore((state) => state.onClose);
  const showDialogModal = useDialogModal((state) => state.showDialogModal);

  const { mutateAsync: clearCart } = useClearCart();

  async function setCurrentAddress() {
    if (chosenSuggestion?.profile.coords) {
      const zone = city?.zones?.find((zone) =>
        pointInPolygon(chosenSuggestion?.profile.coords, zone.coords),
      );

      if (zone) {
        let newProfile: UserProfile | null =
          (profiles &&
            profiles.find(
              (profile) => profile.address === chosenSuggestion?.value,
            )) ||
          null;

        if (!newProfile) {
          newProfile = {
            name: chosenSuggestion.value,
            address: chosenSuggestion.value,
            coords: chosenSuggestion.profile.coords,
            entrance: "",
            floor: "",
            intercomCode: "",
            flat: chosenSuggestion.profile.flat ?? "",
          };
          // newProfile = await createUserProfile({
          //   name: chosenSuggestion.value,
          //   address: chosenSuggestion.value,
          //   coords: chosenSuggestion.profile.coords,
          //   street: chosenSuggestion.profile.street,
          //   streetId: chosenSuggestion.profile.street_fias_id,
          //   house: chosenSuggestion.profile.house,
          //   houseId: chosenSuggestion.profile.house_fias_id,
          // });
        }

        if (departmentId && departmentId !== zone.departmentId) {
          //show dialog modal
          showDialogModal({
            message: t("addressSheet.newDepartmentWarning"),
            onConfirm: async () => {
              await clearCart();
              onCloseSheet({
                departmentId: zone?.departmentId,
                profile: newProfile,
              });
            },
          });
        } else {
          onCloseSheet({
            departmentId: zone?.departmentId,
            profile: newProfile,
          });
        }
      } else {
        showDialogModal({
          message: t("addressSheet.outOfDeliveryZone"),
        });
      }
    }
  }

  return (
    <Actionsheet isOpen={isOpen} onClose={() => closeSheet()}>
      {/* <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      > */}
      <ActionsheetBackdrop />
      <ActionsheetContent
        className={cn("items-start gap-2 rounded-tl-lg rounded-tr-lg")}
        style={{ maxHeight: isSm && showSuggestions ? "100%" : "80%", flex: 1 }}
      >
        <ActionsheetDragIndicatorWrapper>
          <ActionsheetDragIndicator />
        </ActionsheetDragIndicatorWrapper>

        <VStack
          className={cn("h-full w-full items-start pb-4", {
            "gap-2": isSm,
            "gap-4": isMd,
          })}
        >
          <Text
            className={cn("w-full text-center font-extrabold text-accent", {
              "text-2xl": isSm,
              "text-3xl": isMd,
            })}
          >
            {t("addressSheet.selectAddress")}
          </Text>

          {!(isSm && showSuggestions) && (
            <HStack className={cn("flex-wrap")}>
              <Text
                className={cn({
                  "text-sm": isSm,
                  "text-base": isMd,
                })}
              >
                {t("addressSheet.chooseOrAuthStart")}
              </Text>
              {!userToken && (
                <>
                  <Pressable className="active:bg-typography-control">
                    <Text
                      className={cn("text-primary-main", {
                        "text-sm": isSm,
                        "text-base": isMd,
                      })}
                    >
                      {t("addressSheet.authorize")}
                    </Text>
                  </Pressable>
                </>
              )}
            </HStack>
          )}
          <Pressable
            className="flex flex-row items-center justify-start gap-2 active:bg-primary-pale"
            onPress={() => {
              openSheet({
                sheet: "city",
                params: {},
                onClose: () => {
                  //TODO think how reopen address sheet after city changed
                  // openSheet({
                  //   sheet: "address",
                  //   params: {},
                  //   onClose: () => {onCloseSheet();},
                  // });
                },
              });
            }}
          >
            <Box className="h-4 w-4">
              <ArrowIcon className="color-primary-main" />
            </Box>

            <Text
              className={cn("text-primary-main", {
                "text-sm": isSm,
                "text-base": isMd,
              })}
            >
              {city?.name}
            </Text>
          </Pressable>

          <Box className="z-10 h-16 w-full">
            <Input
              className="rounded-none"
              isDisabled={isSuggestionsByCoordsPending}
            >
              <InputField
                ref={inputRef}
                value={address}
                className="py-0"
                onChangeText={(text: string) => {
                  setChosenSuggestion(null);
                  setAddress(text);
                }}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setShowSuggestions(false)}
              />
              <InputSlot className={cn({ "pr-2": isSm, "pr-4": isMd })}>
                {isSuggestionsByCoordsPending || isSuggestionsPending ? (
                  <Spinner />
                ) : (
                  <Pressable
                    className="active:bg-typography-control"
                    onPress={() => {
                      setAddress("");
                      setChosenSuggestion(null);
                      //@ts-ignore
                      inputRef.current?.blur();
                    }}
                  >
                    <Icon as={XIcon2} className="h-6 w-6" />
                  </Pressable>
                )}
              </InputSlot>
            </Input>
            {chosenSuggestion && !chosenSuggestion.profile.house && (
              <Text className="text-red-500">
                {t("addressSheet.noHouseNumber")}
              </Text>
            )}
            {showSuggestions && !!suggestions?.length && (
              <Box className="absolute top-9 z-10 w-full border-[1px] border-typography-light bg-background">
                {suggestions?.map((suggestion, index) => (
                  <Pressable
                    key={index}
                    className="px-4 py-2 active:bg-typography-control"
                    onPress={() => {
                      setAddress(suggestion.value ?? "");
                      setChosenSuggestion(suggestion);

                      mapRef.current?.animateToRegion(
                        {
                          latitude: Number(suggestion.profile.coords[0]),
                          longitude: Number(suggestion.profile.coords[1]),
                          // latitudeDelta: isMd ? 0.17 : isSm ? 0.4 : 0.9,
                          // longitudeDelta: isMd ? 0.17 : isSm ? 0.4 : 0.9,
                          latitudeDelta: isSm ? 0.004 : 0.008,
                          longitudeDelta: isSm ? 0.004 : 0.008,
                        },
                        500,
                      );
                      setSkipGeoLocation(true);

                      if (!suggestion.profile.house) {
                      } else {
                        // @ts-ignore
                        inputRef.current?.blur();
                      }
                    }}
                  >
                    <Text>{suggestion.value}</Text>
                  </Pressable>
                ))}
              </Box>
            )}
          </Box>

          {/* mapView */}
          <Box
            className={cn("w-full flex-1 pb-4", {
              hidden: isSm && showSuggestions,
            })}
          >
            {isOpen && city && (
              <MapView
                ref={mapRef}
                provider={PROVIDER_GOOGLE}
                mapType="standard"
                className="h-full w-full"
                initialRegion={{
                  latitude: city?.mapCenter[0] ?? 55.74,
                  longitude: city?.mapCenter[1] ?? 37.63,
                  latitudeDelta: isMd ? 0.17 : isSm ? 0.4 : 0.9,
                  longitudeDelta: isMd ? 0.17 : isSm ? 0.4 : 0.9,
                }}
                onRegionChangeComplete={(region) => {
                  if (skipGeoLocation) {
                    setSkipGeoLocation(false);
                  } else {
                    setRegion(region);
                  }
                }}
              >
                {city.zones.map((zone, idx) => (
                  <Polygon
                    key={idx}
                    coordinates={zone.coords!.map((y) => ({
                      latitude: Number(y[0])!,
                      longitude: Number(y[1])!,
                    }))}
                    strokeWidth={1}
                    fillColor={zone.color ? `${zone.color}70` : "#ff000040"}
                    strokeColor="#3D3D3D60"
                    lineDashPattern={[1]}
                  />
                ))}
              </MapView>
            )}
            {isOpen && (
              <Icon
                className="absolute left-[50%] top-[50%] ml-[-20px] mt-[-20px] h-10 w-10 text-primary-main"
                as={PinIcon}
              />
            )}
            {isOpen && (
              <Box className="absolute bottom-0 right-0 bg-background p-1">
                {chosenZone && (
                  <Text>
                    {t("addressSheet.deliveryCost")}:{" "}
                    {Number(chosenZone?.delivery_price ?? 0)} ₽
                  </Text>
                )}
                {chosenZone && (
                  <Text>
                    {t("addressSheet.minPrice")}:{" "}
                    {Number(chosenZone?.price ?? 0)} ₽
                  </Text>
                )}
                {!chosenZone && (
                  <Text className="text-red-500">
                    {t("addressSheet.outOfDeliveryZone")}
                  </Text>
                )}
              </Box>
            )}
          </Box>

          <Box className="item flex w-full shrink flex-row justify-center">
            <Button
              className="bg-primary-main"
              isDisabled={
                chosenSuggestion === null || !chosenSuggestion.profile.house
              }
              onPress={() => {
                setCurrentAddress();
              }}
            >
              <Text className="text-lg font-semibold text-background">
                {t("addressSheet.confirmAddress")}
              </Text>
            </Button>
          </Box>
        </VStack>
      </ActionsheetContent>
      {/* </KeyboardAvoidingView> */}
    </Actionsheet>
  );
}
