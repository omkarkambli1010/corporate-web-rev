import Link from "next/link";
import RiveArrowUpRight from "./rive/RiveArrowUpRight";
import styles from "./section-head.module.scss";

interface SectionHeadProps {
  title: string;
  subtext?: string;
  /** Renders the dotted arrow-up-right that links through to the listing. */
  href?: string;
  /** Accessible name for that arrow, since the glyph carries no text. */
  hrefLabel?: string;
  align?: "start" | "center";
  /** The 360 frame left-aligns this centred heading (Awards, CSR). */
  mobileStart?: boolean;
  /** "h2" is the 40/48 heading Awards and CSR use; the default is the 48/56 H1. */
  size?: "h1" | "h2";
  tone?: "light" | "dark";
  /**
   * Words on the first line at the 360 frame. The mobile frames set their own
   * break in the heading rather than letting it wrap — "Analysis you / can
   * trust", not the "Analysis you can / trust" a 272 column gives — so the
   * break is carried as a `<br>` that only exists under the breakpoint.
   */
  titleBreakAfter?: number;
  /** The same, for the sub-heading under it. */
  subtextBreakAfter?: number;
}

/** Splits `text` at `after` words around a break that mobile alone renders. */
function withMobileBreak(text: string, after?: number) {
  if (!after) return text;
  const words = text.split(" ");
  if (after >= words.length) return text;
  return (
    <>
      {words.slice(0, after).join(" ")}{" "}
      <br className={styles.mobileBreak} />
      {words.slice(after).join(" ")}
    </>
  );
}

/**
 * The "Title + sutext" component that opens most sections — 40/48 heading,
 * optional 20/28 subtext, and an optional dotted arrow pinned to the far end.
 */
export default function SectionHead({
  title,
  subtext,
  href,
  hrefLabel,
  align = "start",
  mobileStart = false,
  size = "h1",
  tone = "light",
  titleBreakAfter,
  subtextBreakAfter,
}: SectionHeadProps) {
  return (
    <div
      className={`${styles.head} ${styles[align]} ${tone === "dark" ? styles.dark : ""} ${mobileStart ? styles.mobileStart : ""}`}
    >
      <div className={styles.text}>
        <h2 className={`${styles.title} ${size === "h2" ? styles.h2 : ""}`}>{withMobileBreak(title, titleBreakAfter)}</h2>
        {subtext ? (
          <p className={styles.subtext}>{withMobileBreak(subtext, subtextBreakAfter)}</p>
        ) : null}
      </div>
      {href ? (
        <Link href={href} className={styles.arrow} aria-label={hrefLabel ?? title}>
          <RiveArrowUpRight tone={tone === "dark" ? "dark" : "light"} />
        </Link>
      ) : null}
    </div>
  );
}
