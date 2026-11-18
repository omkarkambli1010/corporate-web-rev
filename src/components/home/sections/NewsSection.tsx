"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import RiveArrowUpRight from "@/components/ui/rive/RiveArrowUpRight";
import { NEWS } from "@/constants/sbi-home";
import styles from "./news.module.scss";

/** Your Daily Market Digest — desktop 1:59641, mobile 0:54159. */
export default function NewsSection() {
  const ref = useRef<HTMLElement>(null);
  // Shown by default so the cards are never left hidden if the observer cannot
  // run; the entrance is armed on mount only when the section is still below
  // the fold and will genuinely be scrolled into view.
  const [shown, setShown] = useState(true);

  // The Figma note asks for the cards to slide in one by one on arrival.
  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") return;
    if (node.getBoundingClientRect().top < window.innerHeight) return;

    setShown(false);
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShown(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section className={styles.section} ref={ref}>
      <div className={styles.inner}>
        <div className={styles.head}>
          <div>
            {/* The 360 frame breaks the heading itself — "Your daily /
                market digest" — rather than letting it wrap to the column. */}
            <h2 className={styles.title}>
              {NEWS.title.split(" ").slice(0, 2).join(" ")}{" "}
              <br className={styles.mobileBreak} />
              {NEWS.title.split(" ").slice(2).join(" ")}
            </h2>
            <p className={styles.subtext}>{NEWS.subtext}</p>
          </div>
          <Link href="#news" className={styles.arrow} aria-label="All market news">
            <RiveArrowUpRight tone="dark" />
          </Link>
        </div>

        <div className={`${styles.grid} ${shown ? styles.shown : ""}`}>
          <article className={styles.lead} style={{ transitionDelay: "0ms" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/figma/news/lead.png" alt="" aria-hidden="true" />
            <h3 className={styles.leadTitle}>{NEWS.lead.title}</h3>
            <p className={styles.stamp}>{NEWS.lead.timestamp}</p>
          </article>

          <div className={styles.list}>
            {NEWS.items.map((item, i) => (
              <article
                className={styles.item}
                key={item.title}
                style={{ transitionDelay: `${(i + 1) * 120}ms` }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/figma/news/item-${i + 1}.png`} alt="" aria-hidden="true" />
                <div>
                  <h3>{item.title}</h3>
                  <p className={styles.stamp}>{item.timestamp}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
