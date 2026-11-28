"use client";

import type { KeyboardEvent } from "react";
import styles from "./segmented-tabs.module.scss";

interface SegmentedTabsProps {
  tabs: readonly string[];
  active: string;
  onChange: (tab: string) => void;
  /** Names the tab group for assistive tech, e.g. "IPO status". */
  label: string;
  /** The track width the Figma instance is sized to — 370 on most sections. */
  width?: number;
  /** "onWhite": the track is the tinted surface and the active tab the white chip
   *  (Leadership frames sit on a white ground). */
  tone?: "default" | "onWhite";
}

/**
 * tabs/segmented from the design system: 40px tall, 8px outer radius on a
 * #f7fbff track, the active tab a white 6px-radius pill with a hairline.
 */
export default function SegmentedTabs({
  tabs,
  active,
  onChange,
  label,
  width = 370,
  tone = "default",
}: SegmentedTabsProps) {
  /* Tabs pattern: one Tab stop; arrows, Home and End move and select. */
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const buttons = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="tab"]'));
    const current = buttons.indexOf(event.target as HTMLButtonElement);
    if (current < 0) return;
    const last = buttons.length - 1;
    const next = {
      ArrowRight: current === last ? 0 : current + 1,
      ArrowLeft: current === 0 ? last : current - 1,
      Home: 0,
      End: last,
    }[event.key];
    if (next === undefined) return;
    event.preventDefault();
    buttons[next].focus();
    onChange(tabs[next]);
  };

  return (
    <div
      onKeyDown={onKeyDown}
      className={`${styles.track} ${tone === "onWhite" ? styles.onWhite : ""}`}
      role="tablist"
      aria-label={label}
      style={{ "--tabs-width": `${width}px` } as React.CSSProperties}
    >
      {tabs.map((tab) => (
        <button
          key={tab}
          type="button"
          role="tab"
          aria-selected={tab === active}
          tabIndex={tab === active ? 0 : -1}
          className={`${styles.tab} ${tab === active ? styles.active : ""}`}
          onClick={() => onChange(tab)}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
