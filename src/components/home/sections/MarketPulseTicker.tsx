import { MARKET_PULSE } from "@/constants/sbi-home";
import styles from "./market-pulse.module.scss";

/**
 * The Market Pulse marquee. It holds still while hovered, and for visitors who
 * ask for reduced motion — see the stylesheet.
 */
export default function MarketPulseTicker() {
  return (
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
  );
}
