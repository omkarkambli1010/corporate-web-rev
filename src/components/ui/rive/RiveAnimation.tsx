"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { RIVE_SLOTS, type RiveSlot, type RiveSlotKey } from "@/config/rive.config";
import useMediaQuery from "@/utils/useMediaQuery";
import type { RiveSlides, RiveValues } from "./riveTypes";
import styles from "./rive.module.scss";

const RivePlayer = dynamic(() => import("./RivePlayer"), { ssr: false });

interface RiveAnimationProps {
  /** Which animation, from RIVE_SLOTS in src/config/rive.config.ts. */
  slot: RiveSlotKey;
  /** Overrides the slot's artboard, e.g. a light/dark or per-breakpoint variant. */
  artboard?: string;
  /** View Model properties to drive, e.g. { hover: true }. */
  values?: RiveValues;
  /** Page content for a View Model list, e.g. carousel slides from the CMS. */
  slides?: RiveSlides;
  /** Called when the file fires the named View Model trigger. */
  triggers?: Readonly<Record<string, () => void>>;
  /**
   * What renders when there is no .riv yet, under reduced motion, if the file
   * fails to load, and while it loads — the existing image/CSS version.
   */
  fallback: React.ReactNode;
  /** Sizes the box the canvas fills; the artboard is fitted into it. */
  className?: string;
  /** Accessible name when the animation carries meaning; decorative otherwise. */
  label?: string;
  /** Told whether the Rive canvas (true) or the fallback (false) is showing. */
  onActiveChange?: (active: boolean) => void;
}

type Status = "loading" | "ready" | "failed";

/**
 * The one way the site plays a Rive animation.
 *
 * - No `src` on the slot yet: renders `fallback` and never loads the runtime.
 * - prefers-reduced-motion: renders `fallback`.
 * - Otherwise shows `fallback` until the file loads, then swaps to the canvas;
 *   a load error keeps the fallback. Changing the artboard reloads.
 *
 * While the canvas is live the wrapper carries `data-rive-active`, so parent
 * styles can switch off the CSS motion the fallback used (see `:has()` rules).
 */
export default function RiveAnimation({
  slot,
  artboard,
  values,
  slides,
  triggers,
  fallback,
  className,
  label,
  onActiveChange,
}: RiveAnimationProps) {
  const config: RiveSlot = RIVE_SLOTS[slot];
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const board = artboard ?? config.artboard;
  const playerKey = `${config.src}|${board ?? ""}`;
  // Status belongs to one file + artboard; a new artboard starts loading again.
  const [loaded, setLoaded] = useState<{ key: string; status: Status }>({ key: "", status: "loading" });
  const status: Status = loaded.key === playerKey ? loaded.status : "loading";

  const enabled = Boolean(config.src) && !reducedMotion && status !== "failed";
  const active = enabled && status === "ready";
  useEffect(() => {
    onActiveChange?.(active);
  }, [active, onActiveChange]);

  if (!enabled || !config.src) return <>{fallback}</>;

  return (
    <span
      className={`${styles.wrap} ${className ?? ""}`.trim()}
      data-rive-active={active ? "" : undefined}
      // Only once the canvas has replaced the fallback: until then the
      // fallback (which may hold buttons) must stay in the accessibility tree.
      role={active && label ? "img" : undefined}
      aria-label={active ? label : undefined}
      aria-hidden={active && !label ? true : undefined}
    >
      {active ? null : fallback}
      <RivePlayer
        key={playerKey}
        src={config.src}
        artboard={board}
        stateMachine={config.stateMachine}
        fit={config.fit}
        values={values}
        slides={slides}
        triggers={triggers}
        className={`${styles.canvas} ${active ? styles.canvasReady : ""}`}
        onReady={() => setLoaded({ key: playerKey, status: "ready" })}
        onError={() => setLoaded({ key: playerKey, status: "failed" })}
      />
    </span>
  );
}
