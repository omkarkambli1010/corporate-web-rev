"use client";

import Image from "next/image";
import { useState } from "react";

import SbButton from "@/components/ui/SbButton";
import SectionHead from "@/components/ui/SectionHead";
import { PURPOSE } from "@/constants/sbi-home";
import useMediaQuery, { MOBILE_QUERY } from "@/utils/useMediaQuery";
import styles from "./purpose.module.scss";

/**
 * Invest with a purpose — desktop 1:58702, mobile 0:58378.
 *
 * The 1440 frame sets the four goals side by side, every one of them open.
 * The 360 frame — Plan Your Future Listing 0:58385 — keeps one open and
 * collapses the rest to a titled row with a plus, so the section fits the
 * 527 it is given rather than running for four screens.
 */
export default function PurposeSection() {
  const isMobile = useMediaQuery(MOBILE_QUERY);
  const [openSlug, setOpenSlug] = useState(PURPOSE.cards[0].slug);

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <SectionHead
          title={PURPOSE.title}
          subtext={PURPOSE.subtext}
          href="#goals"
          hrefLabel="All investment goals"
          titleBreakAfter={2}
          subtextBreakAfter={7}
        />

        <ul className={styles.grid}>
          {PURPOSE.cards.map((card) => {
            const open = !isMobile || card.slug === openSlug;

            return (
              <li
                key={card.slug}
                className={`${styles.card} ${open ? "" : styles.collapsed}`}
              >
                <Image
                  className={styles.art}
                  src={`/figma/purpose/${card.slug}.png`}
                  alt=""
                  aria-hidden="true"
                  width={620}
                  height={348}
                  sizes="(max-width: 767px) 100vw, 310px"
                />

                <div className={styles.cardHead}>
                  <h3 className={styles.cardTitle}>{card.title}</h3>
                  {/* Buttons I0:18179;1930:49451 — a 40-wide toggle carrying a
                      16px plus, drawn only on the 360 frame. */}
                  <button
                    type="button"
                    className={styles.toggle}
                    aria-expanded={open}
                    aria-controls={`purpose-${card.slug}`}
                    onClick={() => setOpenSlug(card.slug)}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/figma/faq/plus.svg" alt="" width={16} height={16} />
                    <span className="visually-hidden">{card.title}</span>
                  </button>
                </div>

                <div id={`purpose-${card.slug}`} className={styles.body}>
                  <p className={styles.lede}>{card.lede}</p>
                  <ul className={styles.points}>
                    {card.points.map((point) => (
                      <li key={point}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          className={styles.tick}
                          src="/figma/purpose/tick.svg"
                          alt=""
                          width={16}
                          height={16}
                        />
                        {point}
                      </li>
                    ))}
                  </ul>
                  <SbButton block>{card.cta}</SbButton>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
