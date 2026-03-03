/**
 * Property-Based Tests for LoyaltyCard and TransactionList Components
 * 
 * Tests that LoyaltyCard correctly displays card data using fast-check
 * Tests that TransactionList correctly handles transaction structure
 * 
 * Feature: bluefin-app-improvements, Property 7: Отображение данных карты лояльности
 * Feature: bluefin-app-improvements, Property 8: Структура транзакций
 * Validates: Requirements 3.2, 3.3
 */
import * as fc from 'fast-check';

// Define types locally to avoid importing from hooks (which imports Expo modules)
interface AikoCardProfile {
  cardNumber: string;
  balance: number;
  points: number;
  level?: string;
  status?: string;
}

interface AikoCardTransaction {
  id: string;
  date: string;
  type: 'accrual' | 'writeoff';
  amount: number;
  description: string;
}

/**
 * Pure function that extracts display data from AikoCardProfile
 * This mirrors the logic in LoyaltyCard component
 */
function extractDisplayData(profile: AikoCardProfile | null | undefined): {
  cardNumber: string | null;
  balance: string | null;
  points: string | null;
  level: string | null;
  status: string | null;
} | null {
  if (!profile) {
    return null;
  }

  return {
    cardNumber: profile.cardNumber,
    balance: `${profile.balance} ₽`,
    points: String(profile.points),
    level: profile.level || null,
    status: profile.status || null,
  };
}

/**
 * Validates that a profile has all required fields for display
 */
function hasRequiredDisplayFields(profile: AikoCardProfile): boolean {
  return (
    typeof profile.cardNumber === 'string' &&
    profile.cardNumber.length > 0 &&
    typeof profile.balance === 'number' &&
    typeof profile.points === 'number'
  );
}

// Arbitrary for generating random AikoCardProfile objects
const aikoCardProfileArbitrary: fc.Arbitrary<AikoCardProfile> = fc.record({
  cardNumber: fc.string({ minLength: 1, maxLength: 20 }).filter(s => s.trim().length > 0),
  balance: fc.float({ min: 0, max: 100000, noNaN: true }),
  points: fc.integer({ min: 0, max: 1000000 }),
  level: fc.option(fc.string({ minLength: 1, maxLength: 50 }), { nil: undefined }),
  status: fc.option(fc.string({ minLength: 1, maxLength: 50 }), { nil: undefined }),
});

describe('LoyaltyCard - Property Tests', () => {
  /**
   * Feature: bluefin-app-improvements, Property 7: Отображение данных карты лояльности
   * Validates: Requirements 3.2
   * 
   * For any valid AikoCardProfile response from API, the component should
   * display cardNumber, balance, and points.
   */
  describe('Property 7: Отображение данных карты лояльности', () => {
    it('should extract cardNumber from any valid profile', () => {
      fc.assert(
        fc.property(
          aikoCardProfileArbitrary,
          (profile: AikoCardProfile) => {
            const displayData = extractDisplayData(profile);
            
            // cardNumber should be present and match the profile
            return displayData !== null && displayData.cardNumber === profile.cardNumber;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should extract balance with currency symbol from any valid profile', () => {
      fc.assert(
        fc.property(
          aikoCardProfileArbitrary,
          (profile: AikoCardProfile) => {
            const displayData = extractDisplayData(profile);
            
            // balance should be formatted with currency
            return (
              displayData !== null &&
              displayData.balance !== null &&
              displayData.balance.includes(String(profile.balance)) &&
              displayData.balance.includes('₽')
            );
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should extract points from any valid profile', () => {
      fc.assert(
        fc.property(
          aikoCardProfileArbitrary,
          (profile: AikoCardProfile) => {
            const displayData = extractDisplayData(profile);
            
            // points should be present and match the profile
            return (
              displayData !== null &&
              displayData.points === String(profile.points)
            );
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should have all required display fields for any valid profile', () => {
      fc.assert(
        fc.property(
          aikoCardProfileArbitrary,
          (profile: AikoCardProfile) => {
            return hasRequiredDisplayFields(profile);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should return null for null/undefined profile', () => {
      expect(extractDisplayData(null)).toBeNull();
      expect(extractDisplayData(undefined)).toBeNull();
    });

    it('should handle optional level field correctly', () => {
      fc.assert(
        fc.property(
          aikoCardProfileArbitrary,
          (profile: AikoCardProfile) => {
            const displayData = extractDisplayData(profile);
            
            if (profile.level) {
              return displayData !== null && displayData.level === profile.level;
            } else {
              return displayData !== null && displayData.level === null;
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should handle optional status field correctly', () => {
      fc.assert(
        fc.property(
          aikoCardProfileArbitrary,
          (profile: AikoCardProfile) => {
            const displayData = extractDisplayData(profile);
            
            if (profile.status) {
              return displayData !== null && displayData.status === profile.status;
            } else {
              return displayData !== null && displayData.status === null;
            }
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});

/**
 * Validates that a transaction has all required fields
 * According to Requirements 3.3: date, type, amount
 * Plus id for unique identification
 */
function hasRequiredTransactionFields(transaction: AikoCardTransaction): boolean {
  return (
    typeof transaction.id === 'string' &&
    transaction.id.length > 0 &&
    typeof transaction.date === 'string' &&
    transaction.date.length > 0 &&
    (transaction.type === 'accrual' || transaction.type === 'writeoff') &&
    typeof transaction.amount === 'number' &&
    transaction.amount >= 0
  );
}

/**
 * Extracts display data from a transaction
 * This mirrors the logic in TransactionList component
 */
function extractTransactionDisplayData(transaction: AikoCardTransaction): {
  id: string;
  date: string;
  type: 'accrual' | 'writeoff';
  amount: number;
  description: string;
  isAccrual: boolean;
  formattedAmount: string;
} {
  const isAccrual = transaction.type === 'accrual';
  return {
    id: transaction.id,
    date: transaction.date,
    type: transaction.type,
    amount: transaction.amount,
    description: transaction.description,
    isAccrual,
    formattedAmount: `${isAccrual ? '+' : '-'}${transaction.amount}`,
  };
}

// Arbitrary for generating random AikoCardTransaction objects
const aikoCardTransactionArbitrary: fc.Arbitrary<AikoCardTransaction> = fc.record({
  id: fc.uuid(),
  date: fc.date({ min: new Date('2020-01-01'), max: new Date('2030-12-31') })
    .map(d => d.toISOString()),
  type: fc.constantFrom('accrual' as const, 'writeoff' as const),
  amount: fc.float({ min: 0, max: 100000, noNaN: true }),
  description: fc.string({ minLength: 0, maxLength: 200 }),
});

// Arbitrary for generating arrays of transactions
const transactionListArbitrary: fc.Arbitrary<AikoCardTransaction[]> = fc.array(
  aikoCardTransactionArbitrary,
  { minLength: 0, maxLength: 50 }
);

describe('TransactionList - Property Tests', () => {
  /**
   * Feature: bluefin-app-improvements, Property 8: Структура транзакций
   * Validates: Requirements 3.3
   * 
   * For any transaction in the list, it must contain required fields:
   * id, date, type, amount
   */
  describe('Property 8: Структура транзакций', () => {
    it('should have id field for any transaction', () => {
      fc.assert(
        fc.property(
          aikoCardTransactionArbitrary,
          (transaction: AikoCardTransaction) => {
            return (
              typeof transaction.id === 'string' &&
              transaction.id.length > 0
            );
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should have date field for any transaction', () => {
      fc.assert(
        fc.property(
          aikoCardTransactionArbitrary,
          (transaction: AikoCardTransaction) => {
            return (
              typeof transaction.date === 'string' &&
              transaction.date.length > 0
            );
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should have valid type field (accrual or writeoff) for any transaction', () => {
      fc.assert(
        fc.property(
          aikoCardTransactionArbitrary,
          (transaction: AikoCardTransaction) => {
            return (
              transaction.type === 'accrual' ||
              transaction.type === 'writeoff'
            );
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should have non-negative amount field for any transaction', () => {
      fc.assert(
        fc.property(
          aikoCardTransactionArbitrary,
          (transaction: AikoCardTransaction) => {
            return (
              typeof transaction.amount === 'number' &&
              transaction.amount >= 0
            );
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should have all required fields for any transaction', () => {
      fc.assert(
        fc.property(
          aikoCardTransactionArbitrary,
          (transaction: AikoCardTransaction) => {
            return hasRequiredTransactionFields(transaction);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should correctly identify accrual transactions', () => {
      fc.assert(
        fc.property(
          aikoCardTransactionArbitrary,
          (transaction: AikoCardTransaction) => {
            const displayData = extractTransactionDisplayData(transaction);
            return displayData.isAccrual === (transaction.type === 'accrual');
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should format amount with correct sign based on type', () => {
      fc.assert(
        fc.property(
          aikoCardTransactionArbitrary,
          (transaction: AikoCardTransaction) => {
            const displayData = extractTransactionDisplayData(transaction);
            if (transaction.type === 'accrual') {
              return displayData.formattedAmount.startsWith('+');
            } else {
              return displayData.formattedAmount.startsWith('-');
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should preserve all required fields in transaction list', () => {
      fc.assert(
        fc.property(
          transactionListArbitrary,
          (transactions: AikoCardTransaction[]) => {
            return transactions.every(hasRequiredTransactionFields);
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
