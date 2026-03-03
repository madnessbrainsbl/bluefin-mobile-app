/**
 * Property-Based Tests for User Utilities
 * 
 * Tests getDisplayName function using fast-check
 */
import * as fc from 'fast-check';
import { getDisplayName } from '../userUtils';

describe('User Utils - Property Tests', () => {
  /**
   * Feature: bluefin-app-improvements, Property 12: Корректная передача имени в ОСМИ
   * Validates: Requirements 5.1, 5.4
   * 
   * For any user name, getDisplayName should return "Гость" for empty/undefined values
   * and the original name for non-empty values.
   */
  describe('Property 12: Корректная передача имени в ОСМИ', () => {
    it('should return "Гость" for undefined input', () => {
      expect(getDisplayName(undefined)).toBe('Гость');
    });

    it('should return "Гость" for empty string', () => {
      expect(getDisplayName('')).toBe('Гость');
    });

    it('should return "Гость" for any whitespace-only string', () => {
      fc.assert(
        fc.property(
          // Generate strings containing only whitespace characters
          fc.stringOf(fc.constantFrom(' ', '\t', '\n', '\r'), { minLength: 1, maxLength: 50 }),
          (whitespaceString: string) => {
            return getDisplayName(whitespaceString) === 'Гость';
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should return trimmed name for any non-empty string with content', () => {
      fc.assert(
        fc.property(
          // Generate non-empty strings that have at least one non-whitespace character
          fc.string({ minLength: 1, maxLength: 100 }).filter((s) => s.trim().length > 0),
          (name: string) => {
            const result = getDisplayName(name);
            // Result should be the trimmed version of the input
            return result === name.trim();
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should never return empty string for any input', () => {
      fc.assert(
        fc.property(
          fc.option(fc.string({ minLength: 0, maxLength: 100 }), { nil: undefined }),
          (name: string | undefined) => {
            const result = getDisplayName(name);
            return result.length > 0;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should return "Гость" if and only if input is empty or whitespace-only', () => {
      fc.assert(
        fc.property(
          fc.option(fc.string({ minLength: 0, maxLength: 100 }), { nil: undefined }),
          (name: string | undefined) => {
            const result = getDisplayName(name);
            const isEmptyOrWhitespace = name === undefined || name.trim() === '';
            
            if (isEmptyOrWhitespace) {
              return result === 'Гость';
            } else {
              return result === name.trim() && result !== 'Гость';
            }
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
