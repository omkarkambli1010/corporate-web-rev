/**
 * The visitor's choice about analytics and advertising tags, kept in
 * localStorage. Shaped for useSyncExternalStore.
 */
export type ConsentChoice = "granted" | "denied";

/** "unset" means not asked yet; "unknown" is the server, which cannot tell. */
export type ConsentState = ConsentChoice | "unset" | "unknown";

const STORAGE_KEY = "sbisecurities-analytics-consent";

const listeners = new Set<() => void>();

/* Holds the choice for this visit when storage is blocked. */
let memoryChoice: ConsentChoice | null = null;

export function getConsent(): ConsentState {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === "granted" || saved === "denied") return saved;
  } catch {
    /* Storage is blocked: fall through to the in-memory choice. */
  }
  return memoryChoice ?? "unset";
}

export function getServerConsent(): ConsentState {
  return "unknown";
}

export function setConsent(choice: ConsentChoice): void {
  memoryChoice = choice;
  try {
    window.localStorage.setItem(STORAGE_KEY, choice);
  } catch {
    /* Not remembered past this visit, so the visitor is asked again. */
  }
  listeners.forEach((listener) => listener());
}

export function subscribeConsent(listener: () => void): () => void {
  listeners.add(listener);
  // A choice made in another tab.
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}
