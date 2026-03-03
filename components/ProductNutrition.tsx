import { useState } from "react";
import { HStack } from "./ui/hstack";
import {
  Radio,
  RadioGroup,
  RadioIcon,
  RadioIndicator,
  RadioLabel,
} from "./ui/radio";
import { VStack } from "./ui/vstack";
import { useTranslation } from "react-i18next";
import CircleIcon from "./icons/CircleIcon";
import { Text } from "./ui/text";
import { Product } from "@/hooks/useProducts";
import { cn } from "@/lib/helpers";
import { Box } from "./ui/box";
import { Center } from "./ui/center";
import { Pressable } from "./ui/pressable";

export function ProductNutrition({
  className,
  product,
}: {
  className?: string;
  product: Product;
}) {
  const [portion, setPortion] = useState<"100gr" | "fullportion">("100gr");
  const { t } = useTranslation();

  return (
    <VStack className={cn("gap-4", className)}>
      <RadioGroup value={portion} onChange={setPortion}>
        <HStack className="gap-4">
          <Radio value="100gr">
            <RadioIndicator className="border-surface-control bg-surface-control data-[checked=true]:bg-surface-control data-[active=true]:bg-surface-control data-[checked=true]:border-surface-control data-[active=true]:border-surface-control">
              <RadioIcon as={CircleIcon} />
            </RadioIndicator>
            <RadioLabel className="font-semibold tracking-tight">
              100 {t("product.gr")}
            </RadioLabel>
          </Radio>
          <Radio value="fullportion">
            <RadioIndicator className="border-surface-control bg-surface-control data-[checked=true]:bg-surface-control data-[active=true]:bg-surface-control data-[checked=true]:border-surface-control data-[active=true]:border-surface-control">
              <RadioIcon as={CircleIcon} />
            </RadioIndicator>
            <RadioLabel className="font-semibold tracking-tight">
              {t("product.portion")}
            </RadioLabel>
          </Radio>
        </HStack>
      </RadioGroup>

      <HStack className="gap-5">
        <Text>
          {t("product.kkal")}:{" "}
          {portion === "fullportion"
            ? product.kkal
            : ((product.kkal / product.weight) * 100).toFixed(1)}
        </Text>
        <Text>
          {t("product.proteins")}:{" "}
          {portion === "fullportion"
            ? product.proteins
            : ((product.proteins / product.weight) * 100).toFixed(1)}
        </Text>
        <Text>
          {t("product.fats")}:{" "}
          {portion === "fullportion"
            ? product.fats
            : ((product.fats / product.weight) * 100).toFixed(1)}
        </Text>
        <Text>
          {t("product.carbohydrates")}:{" "}
          {portion === "fullportion"
            ? product.carbohydrates
            : ((product.carbohydrates / product.weight) * 100).toFixed(2)}
        </Text>
      </HStack>
    </VStack>
  );
}
