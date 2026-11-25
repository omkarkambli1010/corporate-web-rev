"use client";

import { useEffect, useRef, useState } from "react";
import Pager from "@/components/ui/Pager";
import SectionHead from "@/components/ui/SectionHead";
import type { AboutContent } from "@/types/pages";
import { scrollRail } from "@/utils/scrollRail.utils";
import { carouselKeys, carouselRegion, carouselSlide } from "@/utils/carouselA11y";
import styles from "./awards.module.scss";

/**
 * Analysis you can trust — desktop 4:127327, mobile 1:72643. Four 421-wide
 * cards run as a rail with a pager on desktop; the 360 frame stacks them.
 */
/** The rail's live column gap — 24 on desktop, 16 at 768. */
const railGap = (rail: HTMLElement) => parseFloat(getComputedStyle(rail).columnGap) || 0;

export default function AwardsSection({ awards }: { awards: AboutContent["awards"] }) {
  const AWARDS = awards.items;
  const railRef = useRef<HTMLUListElement>(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    const onScroll = () => {
      const card = rail.firstElementChild as HTMLElement | null;
      if (!card) return;
      setIndex(Math.round(rail.scrollLeft / (card.clientWidth + railGap(rail))));
    };
    rail.addEventListener("scroll", onScroll, { passive: true });
    return () => rail.removeEventListener("scroll", onScroll);
  }, []);

  const page = (delta: -1 | 1) => scrollRail(railRef.current, delta, 421);

  return (
    <section className={styles.section}>
      <div className={styles.inner} {...carouselRegion(awards.title)}>
        <SectionHead title={awards.title} align="center" mobileStart size="h2" />

        <ul className={styles.rail} ref={railRef} tabIndex={0} onKeyDown={(e) => carouselKeys(e, page)}>
          {AWARDS.map((award, i) => {
            const { pattern } = award;
            const crop = award.crop ?? null;
            return (
              <li key={award.title} className={styles.card} {...carouselSlide(i, AWARDS.length)}>
                <div className={styles.copy} style={{ top: `calc(50% - ${award.offset}px)` }}>
                  <span className={styles.logo} style={{ width: award.logoSize[0], height: award.logoSize[1] }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={award.logo}
                      alt=""
                      style={
                        crop
                          ? { width: `${crop.w}%`, height: `${crop.h}%`, left: `${crop.left}%`, top: `${crop.top}%` }
                          : undefined
                      }
                    />
                  </span>
                  <h3 className={styles.title} aria-label={award.title}>
                    {award.titleLines.map((line) => (
                      <span key={line} className={styles.line}>
                        {line}
                      </span>
                    ))}
                  </h3>
                  <p
                    className={`${styles.text} ${award.small ? styles.small : ""}`}
                    style={{ width: award.textWidth }}
                  >
                    {award.text}
                  </p>
                </div>
                <span
                  className={styles.pattern}
                  aria-hidden="true"
                  style={{
                    left: pattern.left,
                    top: pattern.top,
                    width: pattern.box,
                    height: pattern.box,
                  }}
                >
                  <span
                    className={styles.patternImage}
                    style={{
                      width: pattern.image,
                      height: pattern.image,
                      /* Figma sets rotate then scale as separate properties, so the flip
                         is applied to the rotated image: rotate first in the list. */
                      transform: `rotate(${pattern.rotate}deg)${pattern.flip ? " scaleY(-1)" : ""}`,
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/figma/about/awards/pattern.png" alt="" />
                  </span>
                </span>
              </li>
            );
          })}
        </ul>

        <div className={styles.pager}>
          <Pager
            index={Math.min(index, AWARDS.length - 1)}
            total={AWARDS.length}
            onPrev={() => page(-1)}
            onNext={() => page(1)}
            label="award"
            rules
            align="end"
          />
        </div>
      </div>
    </section>
  );
}
