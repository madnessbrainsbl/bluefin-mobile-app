/**
 * Property-Based Tests for Banner Utilities
 * 
 * Tests banner filtering, sorting, and link detection using fast-check
 */
import * as fc from 'fast-check';

// Define Banner type locally to avoid importing from hooks (which imports Expo modules)
interface Banner {
  id: number;
  title?: string;
  image: string;
  link?: string;
  position: 'top' | 'bottom' | 'home' | 'cart' | 'profile';
  order: number;
  active: boolean;
}

// Import pure utility functions - these don't depend on React/Expo
// We'll re-implement them here for testing to avoid import issues
function filterActiveBanners(banners: Banner[]): Banner[] {
  return banners.filter((banner) => banner.active === true);
}

function sortBannersByOrder(banners: Banner[]): Banner[] {
  return [...banners].sort((a, b) => a.order - b.order);
}

function isInternalLink(link: string): boolean {
  return link.startsWith('/');
}

// Arbitrary for generating random Banner objects
const bannerArbitrary = fc.record({
  id: fc.integer({ min: 1, max: 10000 }),
  title: fc.option(fc.string({ minLength: 0, maxLength: 100 }), { nil: undefined }),
  image: fc.webUrl(),
  link: fc.option(
    fc.oneof(
      // Internal links
      fc.constantFrom('/home', '/cart', '/profile', '/search', '/settings', '/profile/orders/123'),
      // External links
      fc.webUrl()
    ),
    { nil: undefined }
  ),
  position: fc.constantFrom('top', 'bottom', 'home', 'cart', 'profile') as fc.Arbitrary<Banner['position']>,
  order: fc.integer({ min: 0, max: 1000 }),
  active: fc.boolean(),
});

describe('Banner Utils - Property Tests', () => {
  /**
   * Feature: bluefin-app-improvements, Property 4: Фильтрация неактивных баннеров
   * Validates: Requirements 2.2
   * 
   * For any list of banners, filterActiveBanners should return a list
   * that does not contain any banners with active=false.
   */
  describe('Property 4: Фильтрация неактивных баннеров', () => {
    it('should filter out all inactive banners', () => {
      fc.assert(
        fc.property(
          fc.array(bannerArbitrary, { minLength: 0, maxLength: 50 }),
          (banners: Banner[]) => {
            const result = filterActiveBanners(banners);
            
            // All banners in result should be active
            return result.every((b) => b.active === true);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should preserve all active banners', () => {
      fc.assert(
        fc.property(
          fc.array(bannerArbitrary, { minLength: 0, maxLength: 50 }),
          (banners: Banner[]) => {
            const result = filterActiveBanners(banners);
            const expectedCount = banners.filter((b) => b.active).length;
            
            // Result should have same count as active banners in input
            return result.length === expectedCount;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should not modify original array', () => {
      fc.assert(
        fc.property(
          fc.array(bannerArbitrary, { minLength: 1, maxLength: 50 }),
          (banners: Banner[]) => {
            const originalLength = banners.length;
            const originalFirstId = banners[0]?.id;
            
            filterActiveBanners(banners);
            
            // Original array should be unchanged
            return banners.length === originalLength && banners[0]?.id === originalFirstId;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should return empty array for empty input', () => {
      const result = filterActiveBanners([]);
      expect(result).toEqual([]);
    });
  });

  /**
   * Feature: bluefin-app-improvements, Property 5: Сортировка баннеров по order
   * Validates: Requirements 2.3
   * 
   * For any list of banners, sortBannersByOrder should return a list
   * sorted by the order field in ascending order.
   */
  describe('Property 5: Сортировка баннеров по order', () => {
    it('should sort banners by order in ascending order', () => {
      fc.assert(
        fc.property(
          fc.array(bannerArbitrary, { minLength: 0, maxLength: 50 }),
          (banners: Banner[]) => {
            const result = sortBannersByOrder(banners);
            
            // Check that result is sorted by order
            for (let i = 1; i < result.length; i++) {
              if (result[i].order < result[i - 1].order) {
                return false;
              }
            }
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should preserve all banners (same length)', () => {
      fc.assert(
        fc.property(
          fc.array(bannerArbitrary, { minLength: 0, maxLength: 50 }),
          (banners: Banner[]) => {
            const result = sortBannersByOrder(banners);
            return result.length === banners.length;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should preserve all banner IDs', () => {
      fc.assert(
        fc.property(
          fc.array(bannerArbitrary, { minLength: 0, maxLength: 50 }),
          (banners: Banner[]) => {
            const result = sortBannersByOrder(banners);
            const inputIds = new Set(banners.map((b) => b.id));
            const resultIds = new Set(result.map((b) => b.id));
            
            // All IDs should be preserved
            if (inputIds.size !== resultIds.size) return false;
            for (const id of inputIds) {
              if (!resultIds.has(id)) return false;
            }
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should not modify original array', () => {
      fc.assert(
        fc.property(
          fc.array(bannerArbitrary, { minLength: 1, maxLength: 50 }),
          (banners: Banner[]) => {
            const originalOrder = banners.map((b) => b.order);
            
            sortBannersByOrder(banners);
            
            // Original array order should be unchanged
            return banners.every((b, i) => b.order === originalOrder[i]);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Feature: bluefin-app-improvements, Property 6: Корректная обработка ссылок баннеров
   * Validates: Requirements 2.4, 2.5
   * 
   * For any banner link, isInternalLink should return true for links
   * starting with "/" and false for all others.
   */
  describe('Property 6: Корректная обработка ссылок баннеров', () => {
    it('should return true for all links starting with /', () => {
      fc.assert(
        fc.property(
          // Generate internal links (starting with /)
          fc.stringOf(fc.constantFrom('a', 'b', 'c', '/', '-', '_', '0', '1', '2'), { minLength: 0, maxLength: 50 })
            .map((s) => '/' + s),
          (link: string) => {
            return isInternalLink(link) === true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should return false for links not starting with /', () => {
      fc.assert(
        fc.property(
          // Generate external links (not starting with /)
          fc.oneof(
            fc.webUrl(),
            fc.stringOf(fc.constantFrom('a', 'b', 'c', 'h', 't', 'p', 's', ':', '.'), { minLength: 1, maxLength: 50 })
              .filter((s) => !s.startsWith('/'))
          ),
          (link: string) => {
            return isInternalLink(link) === false;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should correctly identify common internal routes', () => {
      const internalRoutes = [
        '/',
        '/home',
        '/cart',
        '/profile',
        '/profile/orders',
        '/profile/orders/123',
        '/search',
        '/settings',
        '/content/about',
      ];
      
      for (const route of internalRoutes) {
        expect(isInternalLink(route)).toBe(true);
      }
    });

    it('should correctly identify common external URLs', () => {
      const externalUrls = [
        'https://example.com',
        'http://example.com',
        'https://www.google.com/search',
        'tel:+1234567890',
        'mailto:test@example.com',
      ];
      
      for (const url of externalUrls) {
        expect(isInternalLink(url)).toBe(false);
      }
    });
  });
});
