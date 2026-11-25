import type { KeyboardEvent } from "react";

/**
 * Accessibility wiring shared by every carousel, after the W3C ARIA Authoring
 * Practices "Carousel" pattern (https://www.w3.org/WAI/ARIA/apg/patterns/carousel/).
 *
 * - The carousel is a labelled region announced as "carousel".
 * - Each slide is announced as "slide", named "N of M".
 * - The page pill is a polite live region, so a change made with the arrows
 *   is read out once (carousels here never move on their own, so WCAG 2.2.2
 *   Pause, Stop, Hide needs no pause control).
 * - Left / Right arrow keys page the carousel when its slides have focus.
 * - Paging respects prefers-reduced-motion (WCAG 2.3.3).
 */

/** Spread on the element that wraps the slides and their controls. */
export function carouselRegion(label: string) {
  return {
    role: "region",
    "aria-roledescription": "carousel",
    "aria-label": label,
  } as const;
}

/**
 * Spread on each slide. `group` adds role="group" for slides that are plain
 * containers (div, figure); leave it off for <li> / <article>, which keep the
 * role they already have.
 */
export function carouselSlide(index: number, total: number, group = false) {
  return {
    ...(group ? { role: "group" as const } : {}),
    "aria-roledescription": "slide",
    "aria-label": `${index + 1} of ${total}`,
  };
}

/** Spread on the page pill ("02/04") so changes are announced once, whole. */
export const carouselLive = {
  "aria-live": "polite",
  "aria-atomic": true,
} as const;

/** Call from the slides area's onKeyDown: Left / Right page the carousel. */
export function carouselKeys(e: KeyboardEvent<HTMLElement>, move: (delta: -1 | 1) => void) {
  if (e.key === "ArrowLeft") {
    e.preventDefault();
    move(-1);
  } else if (e.key === "ArrowRight") {
    e.preventDefault();
    move(1);
  }
}

/** "smooth", unless the visitor asks for reduced motion. */
export function scrollBehavior(): ScrollBehavior {
  if (typeof window === "undefined") return "auto";
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
}
