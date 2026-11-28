import { poppins } from "./sb-fonts";
import styles from "./section-title.module.scss";

export type TitleSize = "section" | "medium" | "page" | "compact";

interface SectionTitleProps {
  children: React.ReactNode;
  as?: "h1" | "h2";
  /**
   * section 48/56 (the default) · medium 40/48 · page 40/48, the h1 that opens
   * a page · compact 32/40. The smaller frames are set in the stylesheet.
   */
  size?: TitleSize;
  /** "dark" is white, for titles on dark grounds. */
  tone?: "light" | "dark";
  id?: string;
  /** Placement only (margin, alignment, grid area). Type is set here. */
  className?: string;
}

/**
 * Every page and section title on the site. Change the font, size or colour of
 * titles in this component's stylesheet and every page follows.
 */
export default function SectionTitle({
  children,
  as: Heading = "h2",
  size = "section",
  tone = "light",
  id,
  className,
}: SectionTitleProps) {
  /* The title brings its own font, so it also works outside SbScope. */
  const classes = [poppins.variable, styles.title, styles[size]];
  if (tone === "dark") classes.push(styles.dark);
  if (className) classes.push(className);

  return (
    <Heading id={id} className={classes.join(" ")}>
      {children}
    </Heading>
  );
}
