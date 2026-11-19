import Link from "next/link";
import RiveArrowUpRight from "@/components/ui/rive/RiveArrowUpRight";
import MarketPulseTicker from "./MarketPulseTicker";
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

        <MarketPulseTicker />

        <Link href="#markets" className={styles.arrow} aria-label="All markets">
          <RiveArrowUpRight tone="dark" />
        </Link>
      </div>
    </section>
  );
}
