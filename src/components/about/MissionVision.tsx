"use client";

import { Fragment, useEffect, useRef } from "react";
import styles from "./mission-vision.module.scss";

type Statement = {
  key?: string;
  label: string;
  statement: string;
  /** Letters already in the display colour before any scrolling. */
  restLetters: number;
};

/** The sticky frame scrolls in three beats: Mission fills, the column moves, Vision fills. */
const BEATS = { missionEnd: 0.4, moveEnd: 0.6 };

const clamp = (n: number, min = 0, max = 1) => Math.min(Math.max(n, min), max);

function Item({
  item,
  itemRef,
}: {
  item: Statement;
  itemRef: (el: HTMLDivElement | null) => void;
}) {
  let letter = 0;
  return (
    <div ref={itemRef} className={styles.statement} data-rest={item.restLetters} tabIndex={0}>
      <p className={styles.label}>{item.label}</p>
      {/* Figma: the text moves from Text Disabled to Text Display, letter by
          letter from left to right, as the section scrolls; entering a
          statement with the pointer fills the rest of it (0.5s, ease-out). */}
      <p className={styles.text}>
        {/* Read whole; the letter-by-letter copy below is hidden from it. */}
        <span className="visually-hidden">{item.statement}</span>
        {item.statement.split(" ").map((word, w) => (
          <Fragment key={`${w}-${word}`}>
            {w > 0 ? " " : null}
            <span className={styles.word} aria-hidden="true">
              {word.split("").map((char) => (
                <span key={letter} className={styles.letter} data-i={letter++}>
                  {char}
                </span>
              ))}
            </span>
          </Fragment>
        ))}
      </p>
    </div>
  );
}

/** Sets letters 0..count-1 to the display colour, touching only those that change. */
function paint(el: HTMLElement, count: number) {
  const letters = el.querySelectorAll<HTMLElement>("[data-i]");
  letters.forEach((node, i) => {
    const on = i < count;
    if (node.classList.contains(styles.on) !== on) node.classList.toggle(styles.on, on);
  });
}

/**
 * Mission & Vision 4:127276 — a 382px frame that scrolls a 636px column
 * (overflow: vertical). The frame is pinned for the length of the section and
 * one scroll position drives everything: the Mission highlights letter by
 * letter, the column then slides the Vision up, and the Vision highlights the
 * same way. Below 768px the statements are plain 540px screens and each one
 * highlights as it crosses the viewport.
 */
export default function MissionVision({ statements }: { statements: readonly Statement[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const columnRef = useRef<HTMLDivElement>(null);
  const items = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    const column = columnRef.current;
    if (!section || !column) return;
    const desktop = window.matchMedia("(min-width: 768px)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;

    const total = (el: HTMLElement | null) => (el ? el.querySelectorAll("[data-i]").length : 0);
    const rest = (el: HTMLElement | null) => Number(el?.dataset.rest ?? 0);
    const fill = (el: HTMLElement | null, progress: number) => {
      if (!el) return;
      const n = total(el);
      const r = rest(el);
      paint(el, Math.round(r + clamp(progress) * (n - r)));
    };

    const update = () => {
      frame = 0;
      const [mission, vision] = items.current;
      if (reduced.matches) {
        fill(mission, 1);
        fill(vision, 1);
        column.style.transform = "";
        return;
      }
      if (!desktop.matches) {
        column.style.transform = "";
        for (const el of items.current) {
          if (!el) continue;
          const r = el.getBoundingClientRect();
          fill(el, (window.innerHeight * 0.85 - r.top) / (r.height * 0.8));
        }
        return;
      }
      const style = getComputedStyle(section);
      const rootSize = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
      /* A custom property comes back as written, in px or in rem. */
      const length = (name: string) => {
        const value = style.getPropertyValue(name).trim();
        return (parseFloat(value) || 0) * (value.endsWith("rem") ? rootSize : 1);
      };
      const travel = length("--travel");
      const reveal = length("--reveal-run");
      const pinTop = length("--pin-top");
      const run = travel + reveal;
      const p = clamp((pinTop - section.getBoundingClientRect().top) / run);

      fill(mission, p / BEATS.missionEnd);
      fill(vision, (p - BEATS.moveEnd) / (1 - BEATS.moveEnd));
      const move = clamp((p - BEATS.missionEnd) / (BEATS.moveEnd - BEATS.missionEnd));
      column.style.transform = `translate3d(0, ${-move * travel}px, 0)`;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section ref={sectionRef} className={styles.mv} aria-label="Mission and vision">
      <div className={styles.pin}>
        <div ref={columnRef} className={styles.column}>
          {statements.map((item, i) => (
            <Item
              key={item.key || item.label}
              item={item}
              itemRef={(el) => {
                items.current[i] = el;
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
