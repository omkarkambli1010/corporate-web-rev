"use client";

import { useEffect, useRef, useState } from "react";
import useMediaQuery from "./useMediaQuery";

interface CarouselAutoplayOptions {
  /** Moves the carousel on by one. Called on every tick. */
  advance: () => void;
  /** Time between ticks. */
  intervalMs?: number;
  /** False while there is nothing to move, e.g. a rail that fits in view. */
  enabled?: boolean;
  /** Restarts the countdown when it changes — pass the current index so a
   *  manual step gets a full interval before the next automatic one. */
  resetKey?: unknown;
  /** The slides element. Hovering it holds the timer — point it at the slides,
   *  not the controls, so hovering the play button does not hold it. */
  hoverTarget?: React.RefObject<HTMLElement | null>;
}

/**
 * Auto-advance for every carousel, with the pause / play control WCAG 2.2.2
 * (Pause, Stop, Hide) asks of anything that moves on its own.
 *
 * - Starts paused for visitors who ask for reduced motion; after that the
 *   button decides.
 * - Holds while the pointer is over the slides (`hoverTarget`).
 * - Holds while the page is hidden, so a background tab does not tick.
 */
export default function useCarouselAutoplay({
  advance,
  intervalMs = 5000,
  enabled = true,
  resetKey,
  hoverTarget,
}: CarouselAutoplayOptions) {
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const [userPlaying, setUserPlaying] = useState<boolean | null>(null);
  const playing = userPlaying ?? !reducedMotion;
  const [hovered, setHovered] = useState(false);

  // Held in a ref so an inline `advance` does not restart the timer each render.
  const advanceRef = useRef(advance);
  useEffect(() => {
    advanceRef.current = advance;
  }, [advance]);

  useEffect(() => {
    const el = hoverTarget?.current;
    if (!el) return;
    const enter = () => setHovered(true);
    const leave = () => setHovered(false);
    el.addEventListener("pointerenter", enter);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointerenter", enter);
      el.removeEventListener("pointerleave", leave);
    };
  }, [hoverTarget]);

  useEffect(() => {
    if (!playing || hovered || !enabled) return;
    const id = window.setInterval(() => {
      if (document.visibilityState === "visible") advanceRef.current();
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [playing, hovered, enabled, intervalMs, resetKey]);

  return {
    /** True while auto-advance is on (the button then offers "Pause"). */
    playing,
    toggle: () => setUserPlaying(!playing),
    /** Stops auto-advance as though the visitor pressed pause. */
    pause: () => setUserPlaying(false),
  };
}

/**
 * Whether a scroll rail overflows its box — i.e. whether there is anything to
 * page. Read off the element rather than duplicating breakpoints in JS.
 */
export function useRailOverflow(ref: React.RefObject<HTMLElement | null>) {
  const [overflows, setOverflows] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => setOverflows(el.scrollWidth > el.clientWidth + 1);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);
  return overflows;
}
