import Link from "next/link";
import RiveArrowUpRight from "@/components/ui/rive/RiveArrowUpRight";
import { MARKET_PULSE } from "@/constants/sbi-home";
import styles from "./market-pulse.module.scss";

/** Market Pulse — desktop 1:56198, mobile Live market 0:46476. */
export default function MarketPulse() {
  return (
    <section className={styles.pulse} aria-labelledby="market-pulse-title">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className={styles.art} src="/figma/market-pulse/bull-bear.svg" alt="" aria-hidden="true" />

      <div className={styles.inner}>
        <h2 id="market-pulse-title" className={styles.title}>
          Market Pulse
        </h2>

        <div className={styles.ticker}>
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

        <Link href="#markets" className={styles.arrow} aria-label="All markets">
          <RiveArrowUpRight tone="dark" />
        </Link>
      </div>
    </section>
  );
}
