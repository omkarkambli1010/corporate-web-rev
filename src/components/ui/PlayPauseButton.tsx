"use client";

import styles from "./play-pause.module.scss";

interface PlayPauseButtonProps {
  /** True while the content is moving; the button then offers "Pause". */
  playing: boolean;
  onToggle: () => void;
  /** What moves, for the accessible name: "Pause {label}" / "Play {label}". */
  label: string;
  /** "dark" is the white button for dark grounds (Market Pulse). */
  tone?: "light" | "dark";
  size?: number;
  /** Size below 767px, to match carousels whose mobile arrows shrink to 32. */
  mobileSize?: number;
  className?: string;
}

/**
 * Pause / play for anything that moves on its own — carousels, tickers,
 * rotating text (WCAG 2.2.2 Pause, Stop, Hide). The icon shows the action the
 * button will take, and the accessible name says it in words.
 */
export default function PlayPauseButton({
  playing,
  onToggle,
  label,
  tone = "light",
  size = 40,
  mobileSize,
  className,
}: PlayPauseButtonProps) {
  const icon = Math.round(size * 0.45);
  return (
    <button
      type="button"
      className={`${styles.button} ${tone === "dark" ? styles.dark : ""} ${className ?? ""}`}
      style={
        {
          "--pp-size": `${size}px`,
          ...(mobileSize ? { "--pp-size-mobile": `${mobileSize}px` } : {}),
        } as React.CSSProperties
      }
      onClick={onToggle}
      aria-label={`${playing ? "Pause" : "Play"} ${label}`}
    >
      {playing ? (
        <svg width={icon} height={icon} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <rect x="6" y="4.5" width="4" height="15" rx="1.2" fill="currentColor" />
          <rect x="14" y="4.5" width="4" height="15" rx="1.2" fill="currentColor" />
        </svg>
      ) : (
        <svg width={icon} height={icon} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M8 5.2v13.6a1 1 0 001.5.86l11-6.8a1 1 0 000-1.72l-11-6.8A1 1 0 008 5.2z" fill="currentColor" />
        </svg>
      )}
    </button>
  );
}
