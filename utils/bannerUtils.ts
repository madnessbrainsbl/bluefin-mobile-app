import { Banner } from "@/hooks/useBanners";

/**
 * Filters banners to return only active ones
 * @param banners - Array of banners to filter
 * @returns Array of banners with active=true
 * 
 * Validates: Requirements 2.2
 */
export function filterActiveBanners(banners: Banner[]): Banner[] {
  return banners.filter((banner) => banner.active === true);
}

/**
 * Sorts banners by order field in ascending order
 * @param banners - Array of banners to sort
 * @returns Sorted array of banners
 * 
 * Validates: Requirements 2.3
 */
export function sortBannersByOrder(banners: Banner[]): Banner[] {
  return [...banners].sort((a, b) => a.order - b.order);
}

/**
 * Checks if a link is internal (starts with "/")
 * @param link - Link string to check
 * @returns true if link is internal, false otherwise
 * 
 * Validates: Requirements 2.4, 2.5
 */
export function isInternalLink(link: string): boolean {
  return link.startsWith("/");
}

/**
 * Processes banners by filtering active ones and sorting by order
 * Combines filterActiveBanners and sortBannersByOrder
 * @param banners - Array of banners to process
 * @returns Filtered and sorted array of banners
 */
export function processActiveBanners(banners: Banner[]): Banner[] {
  return sortBannersByOrder(filterActiveBanners(banners));
}
