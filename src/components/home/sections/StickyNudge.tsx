"use client";

import { useEffect, useState } from "react";
import SbButton from "@/components/ui/SbButton";
import { STICKY_NUDGE } from "@/constants/sbi-home";
import type { NudgeContent } from "@/types/pages";
import styles from "./sticky-nudge.module.scss";

const DEFAULT_CONTENT: NudgeContent = {
  title: STICKY_NUDGE.title,
  mobilePlaceholder: STICKY_NUDGE.mobilePlaceholder,
  namePlaceholder: STICKY_NUDGE.namePlaceholder,
  cta: STICKY_NUDGE.cta,
};

/**
 * Sticky — 1:60071. The Figma note asks for this to stay pinned to the bottom
 * once the first fold has been passed, so it appears on scroll rather than
 * sitting in the flow. Its copy comes from `content` (the CMS, on pages that
 * read it).
 */
export default function StickyNudge({ content = DEFAULT_CONTENT }: { content?: NudgeContent }) {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const onScroll = () => setShown(window.scrollY > window.innerHeight * 0.8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className={`${styles.wrap} ${shown ? styles.shown : ""}`} inert={!shown}>
      <form className={styles.bar} onSubmit={(event) => event.preventDefault()}>
        <p className={styles.title}>{content.title}</p>
        <input
          type="tel"
          inputMode="numeric"
          placeholder={content.mobilePlaceholder}
          aria-label={content.mobilePlaceholder}
        />
        <input
          type="text"
          placeholder={content.namePlaceholder}
          aria-label={content.namePlaceholder}
        />
        <SbButton variant="secondary" type="submit">
          {content.cta}
          {/* Buttons 0:64981 pairs the label with a 16px ArrowRight at the
              button's own 6px gap, not a "→" glyph. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/figma/sticky/arrow-right.svg" alt="" width={16} height={16} />
        </SbButton>
      </form>
    </div>
  );
}
