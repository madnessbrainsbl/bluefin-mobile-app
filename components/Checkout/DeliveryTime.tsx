import { useTranslation } from "react-i18next";
import { HStack } from "../ui/hstack";
import { ChevronDownIcon } from "../ui/icon";
import {
  Select,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectIcon,
  SelectInput,
  SelectItem,
  SelectPortal,
  SelectTrigger,
} from "../ui/select";
import { Text } from "../ui/text";
import { VStack } from "../ui/vstack";
import { useEffect, useState } from "react";
import { useDeliverTime } from "@/hooks/useDeliverTime";
import { use } from "i18next";

export function DeliveryTime({
  onChange,
}: {
  onChange: (datetime: string) => void;
}) {
  const { t } = useTranslation();

  const { getDeliverDays, getDeliverHours, getDeliverMinutes } =
    useDeliverTime();
  // const [days, setDays] = useState(getDeliverDays());
  const days = getDeliverDays();
  const [hours, setHours] = useState(getDeliverHours(days[0].value, "0"));
  const [minutes, setMinutes] = useState(getDeliverMinutes(days[0].value, "0"));

  const [selectedDay, setSelectedDay] = useState<{
    label: string;
    value: string;
  } | null>(days[0] ?? null);
  const [selectedHour, setSelectedHour] = useState<{
    label: string;
    value: string;
  } | null>(hours[0] ?? null);
  const [selectedMinutes, setSelectedMinutes] = useState<{
    label: string;
    value: string;
  } | null>(minutes[0] ?? null);

  useEffect(() => {
    onChange(
      `${selectedDay?.value} ${selectedHour?.value}:${selectedMinutes?.value}`,
    );
  }, [selectedDay, selectedHour, selectedMinutes]);

  return (
    <HStack className="w-full gap-4">
      <VStack className="shrink grow basis-0 justify-between overflow-hidden rounded-sm py-1">
        <Text className="text-xs">{t("checkoutScreen.day")}</Text>
        <Select
          onValueChange={(value) => {
            setSelectedDay(days.find((d) => d.value === value) ?? null);
            const hours = getDeliverHours(value, selectedHour?.value ?? "0");
            if (!hours.find((h) => h.value === selectedHour?.value)) {
              setSelectedHour(hours[0]);
            }
            setHours(hours);
            setMinutes(getDeliverMinutes(value, selectedHour?.value ?? "0"));
          }}
        >
          <SelectTrigger className="justify-between bg-background">
            <SelectInput
              className="grow"
              value={selectedDay?.label}
            />
            <SelectIcon className="mr-2" as={ChevronDownIcon} />
          </SelectTrigger>
          <SelectPortal>
            <SelectBackdrop />
            <SelectContent>
              <SelectDragIndicatorWrapper>
                <SelectDragIndicator />
              </SelectDragIndicatorWrapper>
              {days.map((day) => (
                <SelectItem
                  key={day.value}
                  label={day.label}
                  value={day.value}
                />
              ))}
            </SelectContent>
          </SelectPortal>
        </Select>
      </VStack>

      <VStack className="shrink grow basis-0 justify-between overflow-hidden rounded-sm py-1">
        <Text className="text-xs">{t("checkoutScreen.hour")}</Text>
        <Select
          onValueChange={(value) => {
            setSelectedHour(hours.find((h) => h.value === value) ?? null);
            setMinutes(
              getDeliverMinutes(
                selectedDay?.value ?? days[0].value,
                minutes.find((m) => m.value === value)?.value ?? "0",
              ),
            );
          }}
        >
          <SelectTrigger className="justify-between bg-background">
            <SelectInput className="grow" value={selectedHour?.label} />
            <SelectIcon className="mr-2" as={ChevronDownIcon} />
          </SelectTrigger>
          <SelectPortal>
            <SelectBackdrop />
            <SelectContent>
              <SelectDragIndicatorWrapper>
                <SelectDragIndicator />
              </SelectDragIndicatorWrapper>
              {hours.map((hour) => (
                <SelectItem
                  key={hour.value}
                  label={hour.label.toString()}
                  value={hour.value.toString()}
                />
              ))}
            </SelectContent>
          </SelectPortal>
        </Select>
      </VStack>

      <VStack className="shrink grow basis-0 justify-between overflow-hidden rounded-sm py-1">
        <Text className="text-xs">{t("checkoutScreen.minute")}</Text>
        <Select
          onValueChange={(value) =>
            setSelectedMinutes(minutes.find((m) => m.value === value) ?? null)
          }
        >
          <SelectTrigger className="justify-between bg-background">
            <SelectInput
              className="grow"
              value={selectedMinutes?.label}
            />
            <SelectIcon className="mr-2" as={ChevronDownIcon} />
          </SelectTrigger>
          <SelectPortal>
            <SelectBackdrop />
            <SelectContent>
              <SelectDragIndicatorWrapper>
                <SelectDragIndicator />
              </SelectDragIndicatorWrapper>
              {minutes.map((minute) => (
                <SelectItem
                  key={minute.value}
                  label={minute.label}
                  value={minute.value}
                />
              ))}
            </SelectContent>
          </SelectPortal>
        </Select>
      </VStack>
    </HStack>
  );
}
