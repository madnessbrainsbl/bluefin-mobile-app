import React from "react";
import { useTranslation } from "react-i18next";
import QRCode from "react-native-qrcode-svg";

import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";
import { Spinner } from "@/components/ui/spinner";
import type { AikoCardProfile } from "@/hooks/useAikoCard";

export interface LoyaltyCardProps {
  profile: AikoCardProfile | null | undefined;
  isLoading?: boolean;
  isError?: boolean;
}

/**
 * Компонент для отображения карты лояльности AikoCard
 * Отображает номер карты, баланс, бонусные баллы и QR-код
 * Requirements: 3.2
 */
export const LoyaltyCard: React.FC<LoyaltyCardProps> = ({
  profile,
  isLoading = false,
  isError = false,
}) => {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <Box className="items-center justify-center py-8">
        <Spinner size="large" />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box className="items-center justify-center py-4">
        <Text className="text-typography-dark">
          {t("loyalty.serviceUnavailable")}
        </Text>
      </Box>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <VStack className="gap-4">
      <HStack className="justify-center">
        <VStack className="items-center gap-2 rounded-lg bg-white p-4 shadow-sm">
          <QRCode value={profile.cardNumber} size={150} />
          <Text className="text-typography-main font-medium">
            {profile.cardNumber}
          </Text>
        </VStack>
      </HStack>

      <VStack className="gap-2 px-4">
        <HStack className="items-center justify-between">
          <Text className="text-typography-dark">
            {t("loyalty.balance")}:
          </Text>
          <Text className="text-xl font-bold text-primary-main">
            {profile.balance} ₽
          </Text>
        </HStack>

        <HStack className="items-center justify-between">
          <Text className="text-typography-dark">
            {t("loyalty.points")}:
          </Text>
          <Text className="text-xl font-bold text-primary-main">
            {profile.points}
          </Text>
        </HStack>

        {profile.level && (
          <HStack className="items-center justify-between">
            <Text className="text-typography-dark">
              {t("loyalty.level")}:
            </Text>
            <Text className="font-medium">{profile.level}</Text>
          </HStack>
        )}

        {profile.status && (
          <HStack className="items-center justify-between">
            <Text className="text-typography-dark">
              {t("loyalty.status")}:
            </Text>
            <Text className="font-medium">{profile.status}</Text>
          </HStack>
        )}
      </VStack>
    </VStack>
  );
};

export default LoyaltyCard;
