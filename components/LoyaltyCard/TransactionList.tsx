import React from "react";
import { useTranslation } from "react-i18next";
import { FlatList } from "react-native";

import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";
import { Spinner } from "@/components/ui/spinner";
import { Divider } from "@/components/ui/divider";
import type { AikoCardTransaction } from "@/hooks/useAikoCard";

export interface TransactionListProps {
  transactions: AikoCardTransaction[] | null | undefined;
  isLoading?: boolean;
  isError?: boolean;
}

/**
 * Форматирует дату транзакции
 */
const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateString;
  }
};

/**
 * Компонент для отображения одной транзакции
 */
const TransactionItem: React.FC<{ transaction: AikoCardTransaction }> = ({
  transaction,
}) => {
  const { t } = useTranslation();
  const isAccrual = transaction.type === "accrual";

  return (
    <HStack className="items-center justify-between py-3">
      <VStack className="flex-1 gap-1">
        <Text className="text-typography-main font-medium">
          {transaction.description || t(`loyalty.transaction.${transaction.type}`)}
        </Text>
        <Text className="text-sm text-typography-dark">
          {formatDate(transaction.date)}
        </Text>
      </VStack>
      <Text
        className={`text-lg font-bold ${
          isAccrual ? "text-green-600" : "text-red-500"
        }`}
      >
        {isAccrual ? "+" : "-"}{transaction.amount}
      </Text>
    </HStack>
  );
};

/**
 * Компонент для отображения истории транзакций AikoCard
 * Отображает дату, тип операции и сумму для каждой транзакции
 * Requirements: 3.3
 */
export const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
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

  if (!transactions || transactions.length === 0) {
    return (
      <Box className="items-center justify-center py-4">
        <Text className="text-typography-dark">
          {t("loyalty.noTransactions")}
        </Text>
      </Box>
    );
  }

  return (
    <FlatList
      data={transactions}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <TransactionItem transaction={item} />}
      ItemSeparatorComponent={() => <Divider className="bg-outline-light" />}
      scrollEnabled={false}
    />
  );
};

export default TransactionList;
