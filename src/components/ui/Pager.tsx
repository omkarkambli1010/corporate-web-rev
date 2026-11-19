import PlayPauseButton from "./PlayPauseButton";
import styles from "./pager.module.scss";

interface PagerProps {
  /** Zero-based. */
  index: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
  label: string;
  /** The dotted rules either side of the controls, as the carousels draw them;
   *  "tablet" draws them only in the 768 frames. */
  rules?: boolean | "tablet";
  /** "end" is the Awards rail: a progress rule fills the left, controls sit right. */
  align?: "center" | "end";
  /** The 16/24 pill the 768 frames give the CSR and Life at SSL pagers. */
  compact?: boolean;
  /** For a carousel that advances on its own: pass both to add pause / play
   *  after the next arrow (WCAG 2.2.2). */
  playing?: boolean;
  onTogglePlay?: () => void;
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

/**
 * "Arrows and Page Numbers" — two 40px dotted arrows around a 01/04 pill,
 * optionally flanked by a solid rule on the left and a dotted one on the right.
 */
export default function Pager({ index, total, onPrev, onNext, label, rules = false, align = "center", compact = false, playing, onTogglePlay }: PagerProps) {
  return (
    <div className={`${styles.pager} ${rules ? styles.withRules : ""} ${align === "end" ? styles.end : ""} ${compact ? styles.compact : ""} ${rules === "tablet" ? styles.rulesTablet : ""}`}>
      {rules && align === "end" ? <span className={styles.ruleSolid} aria-hidden="true" /> : null}
      {rules ? <span className={styles.ruleDotted} aria-hidden="true" /> : null}
      <div className={styles.controls}>
        <button type="button" className={`${styles.arrow} ${styles.prev}`} onClick={onPrev} aria-label={`Previous ${label}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/figma/about/csr/arrow-prev.svg" alt="" width={40} height={40} />
        </button>
        <p className={styles.pill} aria-live="polite">
          <span className={styles.current}>{pad(index + 1)}</span>
          <span className={styles.total}>/{pad(total)}</span>
        </p>
        <button type="button" className={styles.arrow} onClick={onNext} aria-label={`Next ${label}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/figma/about/csr/arrow-next.svg" alt="" width={40} height={40} />
        </button>
        {onTogglePlay && playing !== undefined ? (
          <PlayPauseButton playing={playing} onToggle={onTogglePlay} label={`${label} carousel`} className={styles.play} />
        ) : null}
      </div>
      {rules && align === "center" ? <span className={styles.ruleDotted} aria-hidden="true" /> : null}
    </div>
  );
}
