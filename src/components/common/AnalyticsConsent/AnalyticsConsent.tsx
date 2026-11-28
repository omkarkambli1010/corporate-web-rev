"use client";

import { useState, useSyncExternalStore, type KeyboardEvent } from "react";

import GoogleTagManager from "@/components/common/GoogleTagManager/GoogleTagManager";
import {
  getConsent,
  getServerConsent,
  setConsent,
  subscribeConsent,
} from "@/utils/analyticsConsent";
import styles from "./AnalyticsConsent.module.scss";

/**
 * Loads Google Tag Manager only after the visitor allows it. The question is
 * laid out like a browser permission prompt: a small card under the header at
 * the left. Not a modal: the page stays usable while it is open.
 */
export default function AnalyticsConsent() {
  const consent = useSyncExternalStore(subscribeConsent, getConsent, getServerConsent);
  /* As with a browser prompt, closing it is not an answer: nothing is saved,
     nothing loads, and it asks again on the next page load. */
  const [dismissed, setDismissed] = useState(false);

  if (consent === "granted") return <GoogleTagManager />;
  if (consent !== "unset" || dismissed) return null;

  const closeOnEscape = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === "Escape") setDismissed(true);
  };

  return (
    <section
      className={styles.prompt}
      aria-labelledby="consent-title"
      aria-describedby="consent-text"
      data-testid="consent-banner"
      onKeyDown={closeOnEscape}
    >
      <div className={styles.head}>
        <h2 id="consent-title" className={styles.title}>
          SBI Securities wants to
        </h2>
        <button
          type="button"
          className={styles.close}
          aria-label="Close"
          onClick={() => setDismissed(true)}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true" focusable="false">
            <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <div className={styles.request}>
        {/* A cookie: the circle with a bite out of it, and three chips. */}
        <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path
            d="M12 3a9 9 0 109 9 3.5 3.5 0 01-4.5-4.5A3.5 3.5 0 0112 3z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <circle cx="9" cy="10" r="1.3" fill="currentColor" />
          <circle cx="9.5" cy="15.5" r="1.3" fill="currentColor" />
          <circle cx="15" cy="14.5" r="1.3" fill="currentColor" />
        </svg>
        {/* Placeholder wording: needs legal/compliance approval before release. */}
        <p id="consent-text" className={styles.text}>
          Use analytics and advertising cookies
        </p>
      </div>

      {/* Both choices look the same, so neither is nudged. */}
      <div className={styles.actions}>
        <button type="button" className={styles.choice} onClick={() => setConsent("denied")}>
          Block
        </button>
        <button type="button" className={styles.choice} onClick={() => setConsent("granted")}>
          Allow
        </button>
      </div>
    </section>
  );
}
