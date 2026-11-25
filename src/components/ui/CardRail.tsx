"use client";

import { Children, cloneElement, isValidElement, useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "./SbIcons";
import { scrollRail } from "@/utils/scrollRail.utils";
import { carouselKeys, carouselLive, carouselRegion, carouselSlide } from "@/utils/carouselA11y";
import styles from "./card-rail.module.scss";

interface CardRailProps {
  children: React.ReactNode;
  /** Total cards on the rail — drives the NN/NN pill. */
  count: number;
  /** Names the rail for assistive tech, e.g. "Open IPOs". */
  label: string;
  /** The dotted progress rule that runs left of the controls. */
  showProgress?: boolean;
  /** Places the arrows either side of the rail instead of after it. */
  arrows?: "inline" | "flanking";
  /**
   * Fires with the 1-based card now in view. Learn before you invest uses it
   * to move its tabs as the rail scrolls, per the Figma note "The tabs changes
   * on scroll".
   */
  onPageChange?: (page: number) => void;
  tone?: "light" | "dark";
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

/**
 * The horizontal card carousel used by IPOs, Learn before you invest,
 * Testimonials and the mobile card sections. Scroll-snaps natively so a
 * trackpad or touch drag stays in sync with the arrows and the page pill.
 */
export default function CardRail({
  children,
  count,
  label,
  showProgress = false,
  arrows = "inline",
  tone = "light",
  onPageChange,
}: CardRailProps) {
  const railRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(1);
  const pageRef = useRef(1);

  // Held in a ref so a caller passing an inline arrow does not resubscribe the
  // scroll listener on every render. Written in an effect rather than during
  // render — a ref is not a render-time value (react-hooks/refs).
  const onPageChangeRef = useRef(onPageChange);

  useEffect(() => {
    onPageChangeRef.current = onPageChange;
  }, [onPageChange]);

  const syncPage = useCallback(() => {
    const rail = railRef.current;
    if (!rail) return;
    const first = rail.firstElementChild as HTMLElement | null;
    if (!first) return;
    const step = first.offsetWidth + parseFloat(getComputedStyle(rail).columnGap || "0");
    if (!step) return;
    const index = Math.round(rail.scrollLeft / step);
    const next = Math.min(count, Math.max(1, index + 1));
    // Compared against a ref rather than inside the setState updater, so the
    // callback cannot fire twice when React re-invokes the updater.
    if (pageRef.current === next) return;
    pageRef.current = next;
    setPage(next);
    onPageChangeRef.current?.(next);
  }, [count]);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    rail.addEventListener("scroll", syncPage, { passive: true });
    return () => rail.removeEventListener("scroll", syncPage);
  }, [syncPage]);

  // Loops at either end, like the Testimonials deck, so the arrows never
  // grey out.
  const move = (direction: -1 | 1) => scrollRail(railRef.current, direction);

  const controls = (
    <div className={styles.controls}>
      <button
        type="button"
        className={`${styles.arrow} ${styles.prev}`}
        onClick={() => move(-1)}
        aria-label={`Previous, ${label}`}
      >
        <ChevronLeftIcon />
      </button>
      <p className={styles.pill} {...carouselLive}>
        <span className={styles.current}>{pad(page)}</span>
        <span className={styles.total}>/{pad(count)}</span>
      </p>
      <button
        type="button"
        className={styles.arrow}
        onClick={() => move(1)}
        aria-label={`Next, ${label}`}
      >
        <ChevronRightIcon />
      </button>
    </div>
  );

  // Each card is announced as "slide, N of M" (W3C APG carousel pattern).
  const slides = Children.toArray(children).filter(isValidElement);
  const labelled = slides.map((slide, i) =>
    cloneElement(slide as React.ReactElement<Record<string, unknown>>, carouselSlide(i, slides.length)),
  );

  return (
    <div className={`${styles.wrap} ${tone === "dark" ? styles.dark : ""}`} {...carouselRegion(label)}>
      <div className={styles.railRow}>
        {arrows === "flanking" ? (
          <button
            type="button"
            className={`${styles.arrow} ${styles.prev} ${styles.flank}`}
            onClick={() => move(-1)}
            aria-label={`Previous, ${label}`}
          >
            <ChevronLeftIcon />
          </button>
        ) : null}

        <div
          className={arrows === "inline" ? `${styles.rail} ${styles.bleed}` : styles.rail}
          ref={railRef}
          role="group"
          aria-label={`${label} slides`}
          tabIndex={0}
          onKeyDown={(e) => carouselKeys(e, move)}
        >
          {labelled}
        </div>

        {arrows === "flanking" ? (
          <button
            type="button"
            className={`${styles.arrow} ${styles.flank}`}
            onClick={() => move(1)}
            aria-label={`Next, ${label}`}
          >
            <ChevronRightIcon />
          </button>
        ) : null}
      </div>

      <div className={styles.footer}>
        {showProgress ? (
          <span className={styles.progress} aria-hidden="true">
            <span
              className={styles.progressFill}
              style={{ width: `${(page / count) * 100}%` }}
            />
          </span>
        ) : null}
        {arrows === "flanking" ? (
          <div className={styles.centeredControls}>
            <span className={styles.progressShort} aria-hidden="true" />
            {controls}
            <span className={styles.progressShort} aria-hidden="true" />
          </div>
        ) : (
          controls
        )}
      </div>
    </div>
  );
}
