"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import Link from "next/link";
import RiveAnimation from "@/components/ui/rive/RiveAnimation";
import RiveArrowUpRight from "@/components/ui/rive/RiveArrowUpRight";
import type { RiveSlotKey } from "@/config/rive.config";
import { BENTO } from "@/constants/sbi-home";
import styles from "./bento.module.scss";

/** Whether the enclosing card has been scrolled to. */
const CardShown = createContext(false);

/**
 * A card's art as a Rive slot, driven by `shown`. Until the slot has a .riv,
 * the images render as before and slide in on the CSS transition.
 */
function BentoArt({ slot, children }: { slot: RiveSlotKey; children: React.ReactNode }) {
  const shown = useContext(CardShown);
  return (
    <RiveAnimation slot={slot} values={{ shown }} className={styles.riveArt} fallback={<>{children}</>} />
  );
}

function CardArrow({ label }: { label: string }) {
  return (
    <Link href="#explore" className={styles.arrow} aria-label={label}>
      <RiveArrowUpRight />
    </Link>
  );
}

/**
 * One card, revealed when it is scrolled to. The mobile design asks for the
 * animation to trigger "when the user scrolls to that card" (0:95087), so each
 * card carries its own observer instead of the section firing all four.
 */
function RevealCard({
  className,
  delay,
  stackIndex,
  children,
}: {
  className: string;
  delay: string;
  stackIndex: number;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  // Starts off-card so the first paint of every page load is the pre-animation
  // state and the art always has somewhere to slide in from. Rendering it in
  // place first and hiding it on mount would flash the art before moving it.
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const node = ref.current;
    // Without an observer there is nothing to wait for, so reveal rather than
    // leave the card bare.
    if (!node || typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }

    // Fires straight away when the card is already in view, and on arrival
    // when it is not; either way it runs once and then stops watching.
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
    <article
      ref={ref}
      className={`${className} ${shown ? styles.shown : ""}`}
      style={
        {
          "--card-delay": delay,
          "--stack-index": stackIndex,
        } as React.CSSProperties
      }
    >
      <CardShown.Provider value={shown}>{children}</CardShown.Provider>
    </article>
  );
}

/**
 * Explore our world — desktop Bento 1:58374, mobile Our Products 0:33274.
 *
 * The card art slides in once, over 0.5s ease-in — the Smart Animate the
 * Animations file puts on both folds (3:81826 / 3:81827). Figma fires it on
 * MOUSE_ENTER because a prototype has no other way to start it, but a hover
 * gate leaves the cards empty for anyone who never hovers, so it runs as an
 * arrival instead and stays put afterwards.
 *
 * The cards come in one at a time in reading order — margin trading, NRI,
 * support, baskets — on a 180ms step, so each starts about a third of the way
 * into the one before it and the four read as a wave rather than a queue.
 * Figma animates both folds at once, so the stagger is ours, not the file's.
 *
 * Mobile (v4PT6Emc2midcMWgXAUtBR, Explore our world 0:95080) is a different
 * shape: the four cards sit at one origin and stack into a deck as the section
 * scrolls, 25px of each left showing. The stagger is dropped there because
 * every card triggers on its own arrival, so an offset would only read as lag.
 */
export default function BentoSection() {
  const { marginTrading, nri, support, baskets } = BENTO;

  return (
    <section className={styles.section} aria-labelledby="bento-title">
      {/* The art is parked off-card until the observer reveals it, so without
          scripting there would be nothing to reveal it and the cards would read
          as empty. This puts it back rather than losing the content. */}
      <noscript>
        <style>{`.${styles.card} img { transform: none !important; }`}</style>
      </noscript>

      <div className={styles.inner}>
        <header className={styles.head}>
          <h2 id="bento-title" className={styles.title}>
            {BENTO.title}
          </h2>
          <p className={styles.subtext}>
            <span className={styles.desktopOnly}>{BENTO.subtext}</span>
            <span className={styles.mobileOnly}>{BENTO.subtextMobile}</span>
          </p>
        </header>

        <div className={styles.grid}>
          {/* Row one runs wide then narrow; row two mirrors it. */}
          <div className={`${styles.row} ${styles.rowOne}`}>
            <RevealCard
              className={`${styles.card} ${styles.dotted}`}
              delay="0ms"
              stackIndex={0}
            >
              <div className={styles.cardHead}>
                <h3 className={styles.cardTitle}>
                  {marginTrading.title[0]}
                  <br />
                  {marginTrading.title[1]}
                </h3>
                <CardArrow label={marginTrading.title.join(" ")} />
              </div>

              <p className={styles.leverage}>
                <span className={styles.leverageSmall}>{marginTrading.upto}</span>
                <span className={styles.leverageBig}>{marginTrading.multiple}</span>
                <span className={styles.leverageSmall}>{marginTrading.leverage}</span>
              </p>

              <BentoArt slot="bentoMarginTrading">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className={styles.scaleArt} src="/figma/bento/margin-scale.png" alt="" />
              </BentoArt>
            </RevealCard>

            <RevealCard
              className={styles.card}
              delay="180ms"
              stackIndex={1}
            >
              <div className={styles.cardHead}>
                <h3 className={styles.cardTitle}>
                  {nri.title[0]}
                  <br />
                  {nri.title[1]}
                  <br />
                  {nri.title[2]}
                </h3>
                <CardArrow label={nri.title.join(" ")} />
              </div>

              <BentoArt slot="bentoNri">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className={styles.nriGlobe} src="/figma/bento/nri-globe.png" alt="" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className={styles.nriPhone} src="/figma/bento/nri-phone.png" alt="" />
              </BentoArt>
            </RevealCard>
          </div>

          <div className={`${styles.row} ${styles.rowTwo}`}>
            <RevealCard
              className={styles.card}
              delay="360ms"
              stackIndex={2}
            >
              <div className={styles.cardHead}>
                <h3 className={styles.cardTitle}>
                  {support.title[0]}
                  <br />
                  {support.title[1]}
                  <br />
                  {support.title[2]}
                </h3>
                <CardArrow label={support.title.join(" ")} />
              </div>

              <dl className={styles.branches}>
                {support.stats.map((stat) => (
                  <div key={stat.value}>
                    <dd>{stat.value}</dd>
                    <dt>
                      {stat.label[0]}
                      <br />
                      {stat.label[1]}
                    </dt>
                  </div>
                ))}
              </dl>

              <BentoArt slot="bentoSupport">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className={styles.indiaArt} src="/figma/bento/support-india.png" alt="" />
              </BentoArt>
            </RevealCard>

            <RevealCard
              className={styles.card}
              delay="540ms"
              stackIndex={3}
            >
              <div className={styles.cardHead}>
                <h3 className={styles.cardTitle}>
                  {baskets.title[0]}
                  <br />
                  {baskets.title[1]}
                </h3>
                <CardArrow label={baskets.title.join(" ")} />
              </div>

              <BentoArt slot="bentoBaskets">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className={styles.basketChart} src="/figma/bento/baskets-chart.png" alt="" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className={styles.basketPhone} src="/figma/bento/baskets-phone.png" alt="" />
              </BentoArt>
            </RevealCard>
          </div>
        </div>
      </div>
    </section>
  );
}
