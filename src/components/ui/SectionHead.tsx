import Link from "next/link";
import RiveArrowUpRight from "./rive/RiveArrowUpRight";
import SectionTitle, { type TitleSize } from "./SectionTitle";
import styles from "./section-head.module.scss";

interface SectionHeadProps {
  title: string;
  /** Text, or markup where the frames carry different copy. */
  subtext?: React.ReactNode;
  /** Renders the dotted arrow-up-right that links through to the listing. */
  href?: string;
  /** Accessible name for that arrow, since the glyph carries no text. */
  hrefLabel?: string;
  align?: "start" | "center";
  /** The 360 frame left-aligns this centred heading (Awards, CSR). */
  mobileStart?: boolean;
  /** See SectionTitle; "medium" is the smaller heading the About page uses. */
  size?: TitleSize;
  headingId?: string;
  /** Placement and section-only tweaks for the whole block. */
  className?: string;
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
function withMobileBreak(text: React.ReactNode, after?: number) {
  if (!after || typeof text !== "string") return text;
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
  size = "section",
  headingId,
  className = "",
  tone = "light",
  titleBreakAfter,
  subtextBreakAfter,
}: SectionHeadProps) {
  return (
    <div
      className={`${styles.head} ${styles[align]} ${tone === "dark" ? styles.dark : ""} ${mobileStart ? styles.mobileStart : ""} ${className}`}
    >
      <div className={styles.text}>
        <SectionTitle id={headingId} size={size} tone={tone}>
          {withMobileBreak(title, titleBreakAfter)}
        </SectionTitle>
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
