"use client";

import { useState } from "react";
import PlayPauseButton from "@/components/ui/PlayPauseButton";
import { MARKET_PULSE } from "@/constants/sbi-home";
import useMediaQuery from "@/utils/useMediaQuery";
import styles from "./market-pulse.module.scss";

/**
 * The Market Pulse marquee and its pause / play (WCAG 2.2.2). It starts
 * paused for visitors who ask for reduced motion; hovering the band still
 * pauses it while the pointer is there.
 */
export default function MarketPulseTicker() {
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const [userPlaying, setUserPlaying] = useState<boolean | null>(null);
  const playing = userPlaying ?? !reducedMotion;

  return (
    <>
      <div className={`${styles.ticker} ${playing ? "" : styles.paused}`}>
        {/* The track is duplicated so the marquee can loop seamlessly. */}
        <div className={styles.track}>
          {[0, 1].map((copy) => (
            <ul key={copy} className={styles.list} aria-hidden={copy === 1}>
              {MARKET_PULSE.map((item, i) => (
                <li key={`${item.name}-${i}`} className={styles.item}>
                  <span className={styles.name}>{item.name}</span>
                  <span className={styles.quote}>
                    <span className={styles.price}>{item.price}</span>
                    <span className={`${styles.change} ${styles[item.direction]}`}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={`/figma/market-pulse/caret-${item.direction}.svg`}
                        alt=""
                        width={20}
                        height={20}
                      />
                      {item.change}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
      <PlayPauseButton
        playing={playing}
        onToggle={() => setUserPlaying(!playing)}
        label="market ticker"
        tone="dark"
        size={36}
        className={styles.toggle}
      />
    </>
  );
}
