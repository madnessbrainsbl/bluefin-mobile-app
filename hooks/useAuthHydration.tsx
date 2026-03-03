import { useAuthStore } from "@/stores/authStore";

let hydrationPromise: Promise<void> | null = null;

export function useAuthHydration() {
  const hasHydrated = useAuthStore.persist.hasHydrated();

  if (hasHydrated) {
    return true;
  }

  // Lazily create a promise that resolves when hydration finishes
  if (!hydrationPromise) {
    hydrationPromise = new Promise<void>((resolve) => {
      useAuthStore.persist.onFinishHydration(() => {
        resolve();
        hydrationPromise = null; // reset for future calls
      });
    });
  }

  // 🚨 Throwing a promise tells React "suspend here"
  throw hydrationPromise;
}