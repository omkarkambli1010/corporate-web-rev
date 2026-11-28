"use client";

import { useEffect, useRef, useState } from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  LargeChevronLeftIcon,
  LargeChevronRightIcon,
} from "@/components/ui/SbIcons";
import { TESTIMONIALS } from "@/constants/sbi-home";
import { scrollRail } from "@/utils/scrollRail.utils";
import { carouselKeys, carouselLive, carouselRegion, carouselSlide } from "@/utils/carouselA11y";
import SectionTitle from "@/components/ui/SectionTitle";
import styles from "./testimonials.module.scss";

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function mod(n: number, m: number) {
  return ((n % m) + m) % m;
}

/**
 * The three slots the cards rotate through. Advancing sends the card on show
 * to the left, brings the right-hand card to the front and wraps the left one
 * round to the right — the rotation the Figma variants describe
 * (Property 1 = 1 → 2 → 3 → 1).
 */
const SLOTS = ["front", "left", "right"] as const;

/**
 * Which quote each slot carries, relative to the one on show. The left card is
 * the quote just retired and the right card the one coming in, so both are
 * already correct when the rotation lands and neither changes text mid-move.
 */
const SLOT_OFFSET = [0, -1, 1];

/**
 * Testimonials — section "6" 0:64620 of the Sprint 2 file.
 *
 * The Testimonial Interaction (0:64622) is a variant set, not a single card:
 * three cards sit in three slots and each click rotates the assignment, with
 * Figma's prototype transition set to Smart Animate 300ms linear on every
 * edge of the cycle. Smart Animate interpolates each card between its slots,
 * so a card moves, resizes and restyles rather than crossfading — hence the
 * slot geometry living in CSS where it can be transitioned.
 *
 * `step` counts rotations rather than reusing the quote index: with four
 * quotes in three slots the two do not stay in phase, and it is `step` that
 * has to survive going backwards.
 */
export default function TestimonialsSection() {
  const [step, setStep] = useState(0);
  const total = TESTIMONIALS.length;

  /**
   * Mobile (0:66113) lays the cards out as a 809-wide rail rather than a deck,
   * so the arrows page that rail and the pill follows the scroll. Which mode
   * applies is read off the element — the rail is the one that overflows —
   * rather than duplicating the breakpoint in JS.
   */
  const stackRef = useRef<HTMLDivElement>(null);
  const [isRail, setIsRail] = useState(false);
  const [railIndex, setRailIndex] = useState(0);

  useEffect(() => {
    const rail = stackRef.current;
    if (!rail) return;

    const measure = () => setIsRail(rail.scrollWidth > rail.clientWidth + 1);
    const onScroll = () => {
      const card = rail.firstElementChild as HTMLElement | null;
      if (!card) return;
      setRailIndex(Math.round(rail.scrollLeft / (card.clientWidth + 16)));
    };

    measure();
    rail.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      rail.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
    };
  }, []);

  const index = isRail ? railIndex : mod(step, total);

  const move = (delta: -1 | 1) => {
    const rail = stackRef.current;
    if (isRail && rail) {
      // The mobile rail loops at its ends, as the desktop deck does.
      scrollRail(rail, delta, 259);
      return;
    }
    setStep((current) => current + delta);
  };

  return (
    <section className={styles.section}>
      <div className={styles.inner} {...carouselRegion("Testimonials")}>
        <SectionTitle className={styles.title}>Testimonials</SectionTitle>

        <div className={styles.stage}>
          <div className={styles.row}>
            <button
              type="button"
              className={`${styles.arrow} ${styles.prev}`}
              onClick={() => move(-1)}
              aria-label="Previous testimonial"
            >
              <LargeChevronLeftIcon />
            </button>

            <div
              className={styles.stack}
              ref={stackRef}
              role="group"
              aria-label="Testimonial slides"
              tabIndex={0}
              onKeyDown={(e) => carouselKeys(e, move)}
            >
              {[0, 1, 2].map((card) => {
                const slot = mod(card + step, 3);
                const quote = mod(step + SLOT_OFFSET[slot], total);
                const entry = TESTIMONIALS[quote];

                // All three are on show in the rail, so only the deck hides
                // the two sitting behind the quote.
                return (
                  <div
                    key={card}
                    className={`${styles.card} ${styles[SLOTS[slot]]}`}
                    aria-hidden={!isRail && slot !== 0}
                    {...carouselSlide(quote, total, true)}
                  >
                    <figure className={styles.figure}>
                      <blockquote>
                        <p>{entry.quote}</p>
                      </blockquote>
                      <span className={styles.cardRule} aria-hidden="true" />
                      <figcaption>
                        <span className={styles.avatar} aria-hidden="true">
                          {entry.author.charAt(0)}
                        </span>
                        {entry.author}
                      </figcaption>
                    </figure>
                  </div>
                );
              })}
            </div>

            <button
              type="button"
              className={styles.arrow}
              onClick={() => move(1)}
              aria-label="Next testimonial"
            >
              <LargeChevronRightIcon />
            </button>
          </div>
        </div>

        <div className={styles.footer}>
          <span className={styles.rule} aria-hidden="true" />

          {/* Arrows and Page Numbers 0:64625 — the 40px chevrons sit inside the
              dotted rule, hugging the pill. */}
          <div className={styles.controls}>
            <button
              type="button"
              className={styles.pageArrow}
              onClick={() => move(-1)}
              aria-label="Previous testimonial"
            >
              <ChevronLeftIcon />
            </button>

            <p className={styles.pill} {...carouselLive}>
              <span className={styles.current}>{pad(index + 1)}</span>
              <span className={styles.total}>/{pad(total)}</span>
            </p>

            <button
              type="button"
              className={styles.pageArrow}
              onClick={() => move(1)}
              aria-label="Next testimonial"
            >
              <ChevronRightIcon />
            </button>
          </div>

          <span className={styles.rule} aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
