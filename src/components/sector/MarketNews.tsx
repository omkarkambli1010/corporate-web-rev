"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Pager from "@/components/ui/Pager";
import RiveArrowUpRight from "@/components/ui/rive/RiveArrowUpRight";
import type { SectorContent } from "@/types/pages";
import styles from "./market-news.module.scss";

/**
 * Market News — desktop 4:117176 (four 310px cards), mobile 1:253387 (a rail of
 * 242px cards under a 328 column, paged by the dotted pager).
 */
export default function MarketNews({ news }: { news: SectorContent["news"] }) {
  const MARKET_NEWS = news.stories;
  const railRef = useRef<HTMLUListElement>(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    const onScroll = () => {
      const card = rail.firstElementChild as HTMLElement | null;
      if (!card) return;
      setIndex(Math.round(rail.scrollLeft / (card.clientWidth + 16)));
    };
    rail.addEventListener("scroll", onScroll, { passive: true });
    return () => rail.removeEventListener("scroll", onScroll);
  }, []);

  const page = (delta: -1 | 1) => {
    const rail = railRef.current;
    if (!rail) return;
    const card = rail.firstElementChild as HTMLElement | null;
    rail.scrollBy({ left: delta * ((card?.clientWidth ?? 242) + 16), behavior: "smooth" });
  };

  return (
    <section className={styles.section} id="market-news">
      <div className={styles.inner}>
        <div className={styles.head}>
          <h2 className={styles.title}>{news.title}</h2>
          <Link href={news.allHref} className={styles.arrow} aria-label={news.allLabel}>
            <RiveArrowUpRight size={40} />
          </Link>
        </div>

        <ul className={styles.rail} ref={railRef}>
          {MARKET_NEWS.map((story, i) => (
            <li key={`${story.image}-${i}`} className={styles.card}>
              <span className={styles.thumb}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={story.image} alt="" loading="lazy" />
              </span>
              <div className={styles.text}>
                <h3 className={styles.name}>{story.title}</h3>
                <p className={styles.stamp}>
                  <span>{story.date}</span>
                  <span aria-hidden="true">&bull;</span>
                  <span>{story.time}</span>
                </p>
                <Link href={story.href} className={styles.more}>
                  {news.moreLabel}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/figma/sector/news/arrow-right.svg" alt="" width={16} height={16} />
                </Link>
              </div>
            </li>
          ))}
        </ul>

        <div className={styles.pager}>
          <Pager
            index={Math.min(index, MARKET_NEWS.length - 1)}
            total={MARKET_NEWS.length}
            onPrev={() => page(-1)}
            onNext={() => page(1)}
            label="news"
            rules
            align="end"
          />
        </div>
      </div>
    </section>
  );
}
