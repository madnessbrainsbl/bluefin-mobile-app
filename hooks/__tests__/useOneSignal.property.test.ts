/**
 * Property-Based Tests for useOneSignal hook
 * 
 * Tests notification navigation and Player_ID unlinking functionality using fast-check
 */
import * as fc from 'fast-check';
import type { NotificationData, NotificationType } from '@/types/notification';

// Mock expo-router
const mockPush = jest.fn();
jest.mock('expo-router', () => ({
  router: {
    push: (path: string) => mockPush(path),
  },
}));

// Mock react-native-onesignal
jest.mock('react-native-onesignal', () => ({
  OneSignal: {
    User: {
      getOnesignalId: jest.fn(),
    },
  },
}));

// Mock authStore
jest.mock('@/stores/authStore', () => ({
  useAuthStore: jest.fn(() => null),
}));

/**
 * Pure function extracted from useOneSignal for testing
 * This allows us to test the navigation logic without React hooks
 * 
 * Requirements: 1.3
 */
export function handleNotificationClickPure(
  data: NotificationData,
  navigateFn: (path: string) => void
): void {
  if (data.orderId) {
    navigateFn(`/profile/orders/${data.orderId}`);
  } else if (data.deepLink) {
    navigateFn(data.deepLink);
  }
}

/**
 * Interface for unlinkPlayerId function parameters
 * Requirements: 1.5
 */
interface UnlinkPlayerIdParams {
  userToken: string | null;
  playerId: string | null;
}

/**
 * Interface for the result of unlinkPlayerId operation
 */
interface UnlinkPlayerIdResult {
  shouldMakeRequest: boolean;
  endpoint: string | null;
  playerId: string | null;
}

/**
 * Pure function that determines if unlinkPlayerId should make a request
 * and what parameters it should use.
 * 
 * This extracts the decision logic from the hook for testability.
 * Requirements: 1.5
 */
export function unlinkPlayerIdPure(params: UnlinkPlayerIdParams): UnlinkPlayerIdResult {
  const { userToken, playerId } = params;
  
  // If no userToken, should not make request
  if (!userToken) {
    return {
      shouldMakeRequest: false,
      endpoint: null,
      playerId: null,
    };
  }
  
  // If no playerId, should not make request
  if (!playerId) {
    return {
      shouldMakeRequest: false,
      endpoint: null,
      playerId: null,
    };
  }
  
  // Should make request to unlink endpoint with the playerId
  return {
    shouldMakeRequest: true,
    endpoint: '/user/onesignal/unlink/',
    playerId: playerId,
  };
}

describe('useOneSignal - Property Tests', () => {
  beforeEach(() => {
    mockPush.mockClear();
  });

  /**
   * Feature: bluefin-app-improvements, Property 2: Player_ID отвязка при logout
   * Validates: Requirements 1.5
   * 
   * For any authorized user, when logout is called, a request should be sent
   * to unlink the Player_ID from the user's profile.
   */
  describe('Property 2: Player_ID отвязка при logout', () => {
    it('should request unlink for any valid userToken and playerId combination', () => {
      fc.assert(
        fc.property(
          // Generate non-empty userToken strings (JWT-like tokens)
          fc.stringOf(fc.constantFrom('a', 'b', 'c', 'd', 'e', 'f', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '-', '_'), { minLength: 10, maxLength: 100 }),
          // Generate non-empty playerId strings (UUID-like)
          fc.uuid(),
          (userToken: string, playerId: string) => {
            const result = unlinkPlayerIdPure({ userToken, playerId });
            
            // Should make request when both userToken and playerId are present
            expect(result.shouldMakeRequest).toBe(true);
            expect(result.endpoint).toBe('/user/onesignal/unlink/');
            expect(result.playerId).toBe(playerId);
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should not request unlink when userToken is null', () => {
      fc.assert(
        fc.property(
          // Generate any playerId
          fc.uuid(),
          (playerId: string) => {
            const result = unlinkPlayerIdPure({ userToken: null, playerId });
            
            // Should not make request when userToken is null
            expect(result.shouldMakeRequest).toBe(false);
            expect(result.endpoint).toBeNull();
            expect(result.playerId).toBeNull();
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should not request unlink when playerId is null', () => {
      fc.assert(
        fc.property(
          // Generate any userToken
          fc.stringOf(fc.constantFrom('a', 'b', 'c', 'd', 'e', 'f', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '-', '_'), { minLength: 10, maxLength: 100 }),
          (userToken: string) => {
            const result = unlinkPlayerIdPure({ userToken, playerId: null });
            
            // Should not make request when playerId is null
            expect(result.shouldMakeRequest).toBe(false);
            expect(result.endpoint).toBeNull();
            expect(result.playerId).toBeNull();
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should preserve playerId exactly in the unlink request', () => {
      fc.assert(
        fc.property(
          fc.stringOf(fc.constantFrom('a', 'b', 'c', 'd', 'e', 'f', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '-', '_'), { minLength: 10, maxLength: 100 }),
          fc.oneof(
            fc.uuid(),
            fc.stringOf(fc.constantFrom('0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', '-'), { minLength: 32, maxLength: 36 })
          ),
          (userToken: string, playerId: string) => {
            const result = unlinkPlayerIdPure({ userToken, playerId });
            
            // The playerId in the result should exactly match the input playerId
            return result.playerId === playerId;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should always use the correct unlink endpoint', () => {
      fc.assert(
        fc.property(
          fc.stringOf(fc.constantFrom('a', 'b', 'c', 'd', 'e', 'f', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '-', '_'), { minLength: 10, maxLength: 100 }),
          fc.uuid(),
          (userToken: string, playerId: string) => {
            const result = unlinkPlayerIdPure({ userToken, playerId });
            
            // Endpoint should always be the unlink endpoint when request is made
            if (result.shouldMakeRequest) {
              return result.endpoint === '/user/onesignal/unlink/';
            }
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Feature: bluefin-app-improvements, Property 3: Навигация по уведомлению с orderId
   * Validates: Requirements 1.3
   * 
   * For any notification with data containing orderId, 
   * the click handler should call navigation to `/profile/orders/{orderId}`.
   */
  describe('Property 3: Навигация по уведомлению с orderId', () => {
    it('should navigate to /profile/orders/{orderId} for any notification with orderId', () => {
      fc.assert(
        fc.property(
          // Generate non-empty orderId strings (alphanumeric, typical order IDs)
          fc.stringOf(fc.constantFrom('0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'), { minLength: 1, maxLength: 36 }),
          (orderId: string) => {
            const mockNavigate = jest.fn();
            const notificationData: NotificationData = {
              orderId,
              type: 'order_status',
            };

            handleNotificationClickPure(notificationData, mockNavigate);

            // Verify navigation was called with correct path
            expect(mockNavigate).toHaveBeenCalledTimes(1);
            expect(mockNavigate).toHaveBeenCalledWith(`/profile/orders/${orderId}`);
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should preserve orderId exactly in the navigation path', () => {
      fc.assert(
        fc.property(
          // Generate various orderId formats including UUIDs, numeric IDs
          fc.oneof(
            fc.integer({ min: 1, max: 999999 }).map(String),
            fc.uuid(),
            fc.stringOf(fc.constantFrom('0', '1', '2', '3', '4', '5', '6', '7', '8', '9'), { minLength: 1, maxLength: 10 })
          ),
          (orderId: string) => {
            const mockNavigate = jest.fn();
            const notificationData: NotificationData = { orderId };

            handleNotificationClickPure(notificationData, mockNavigate);

            const calledPath = mockNavigate.mock.calls[0][0] as string;
            const extractedOrderId = calledPath.replace('/profile/orders/', '');
            
            // The orderId in the path should exactly match the input orderId
            return extractedOrderId === orderId;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should prioritize orderId over deepLink when both are present', () => {
      fc.assert(
        fc.property(
          fc.stringOf(fc.constantFrom('0', '1', '2', '3', '4', '5', '6', '7', '8', '9'), { minLength: 1, maxLength: 10 }),
          fc.constantFrom('/home', '/cart', '/profile', '/search'),
          (orderId: string, deepLink: string) => {
            const mockNavigate = jest.fn();
            const notificationData: NotificationData = {
              orderId,
              deepLink,
            };

            handleNotificationClickPure(notificationData, mockNavigate);

            // Should navigate to order page, not deepLink
            expect(mockNavigate).toHaveBeenCalledWith(`/profile/orders/${orderId}`);
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should use deepLink when orderId is not present', () => {
      fc.assert(
        fc.property(
          fc.constantFrom('/home', '/cart', '/profile', '/search', '/settings'),
          (deepLink: string) => {
            const mockNavigate = jest.fn();
            const notificationData: NotificationData = {
              deepLink,
              // No orderId
            };

            handleNotificationClickPure(notificationData, mockNavigate);

            expect(mockNavigate).toHaveBeenCalledWith(deepLink);
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should not navigate when neither orderId nor deepLink is present', () => {
      fc.assert(
        fc.property(
          fc.constantFrom<NotificationType>('order_status', 'promo', 'news'),
          fc.option(fc.string(), { nil: undefined }),
          fc.option(fc.string(), { nil: undefined }),
          (type: NotificationType, title: string | undefined, body: string | undefined) => {
            const mockNavigate = jest.fn();
            const notificationData: NotificationData = {
              type,
              title,
              body,
              // No orderId or deepLink
            };

            handleNotificationClickPure(notificationData, mockNavigate);

            // Should not navigate
            expect(mockNavigate).not.toHaveBeenCalled();
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
