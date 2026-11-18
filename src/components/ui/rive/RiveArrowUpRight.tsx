"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRightIcon } from "../SbIcons";
import RiveAnimation from "./RiveAnimation";
import styles from "./rive.module.scss";

/**
 * The dotted arrow-up-right as a Rive slot (`arrowUpRight`). Hover and focus
 * are read from the enclosing link, so the arrow reacts to the whole hit area
 * and to keyboard focus, not just the pointer over its own canvas.
 */
export default function RiveArrowUpRight({
  size = 46,
  tone = "light",
}: {
  size?: number;
  /** "dark" is the white arrow used on dark grounds. */
  tone?: "light" | "dark";
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [hover, setHover] = useState(false);

  useEffect(() => {
    const host = ref.current?.closest("a, button");
    if (!host) return;
    const on = () => setHover(true);
    const off = () => setHover(false);
    host.addEventListener("pointerenter", on);
    host.addEventListener("pointerleave", off);
    host.addEventListener("focusin", on);
    host.addEventListener("focusout", off);
    return () => {
      host.removeEventListener("pointerenter", on);
      host.removeEventListener("pointerleave", off);
      host.removeEventListener("focusin", on);
      host.removeEventListener("focusout", off);
    };
  }, []);

  return (
    <span
      ref={ref}
      className={styles.arrowBox}
      style={{ "--rive-arrow-default": `${size}px` } as React.CSSProperties}
    >
      <RiveAnimation
        slot="arrowUpRight"
        artboard={tone === "dark" ? "Dark" : "Light"}
        values={{ hover }}
        fallback={<ArrowUpRightIcon size={size} />}
        className={styles.fill}
      />
    </span>
  );
}
