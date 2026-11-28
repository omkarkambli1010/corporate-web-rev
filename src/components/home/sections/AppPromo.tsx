import Image from "next/image";
import Link from "next/link";

import { FOOTER_CTA } from "@/constants/sbi-home";
import type { PromoContent } from "@/types/pages";
import styles from "./app-promo.module.scss";

/**
 * Boiler Plate — the app-download card the Figma nests inside `Footer`
 * 0:64968, carried here instead because it is home-page content: the Footer
 * component is chrome for every marketing route, and the card would otherwise
 * follow it onto /blogs, /calculators and the rest.
 */
const DEFAULT_CONTENT: PromoContent = {
  title: FOOTER_CTA.title,
  body: FOOTER_CTA.body,
  cta: FOOTER_CTA.cta,
  ctaHref: "/download-app",
};

export default function AppPromo({ content = DEFAULT_CONTENT }: { content?: PromoContent }) {
  return (
    <section className={styles.promo} aria-labelledby="app-promo-title">
      <div className={styles.card}>
        <div className={styles.copy}>
          {/* The 360 card breaks the heading itself — "Stop Scrolling, /
              Start investing!" — rather than letting it wrap. */}
          <h2 id="app-promo-title" className={styles.title}>
            {content.title.split(" ").slice(0, 2).join(" ")}{" "}
            <br className={styles.mobileBreak} />
            {content.title.split(" ").slice(2).join(" ")}
          </h2>
          <p className={styles.body}>{content.body}</p>
          <Link href={content.ctaHref} className={styles.cta}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/figma/footer/download.svg" alt="" width={16} height={16} />
            {content.cta}
          </Link>
        </div>

        {/* The handset is not placed at its natural size: the frame nests it in
            a clip window, a rotated frame, and an image scaled well past that
            frame so only part of the export shows. The chain is reproduced as
            the frame states it — see the stylesheet. */}
        <div className={styles.phoneWindow} aria-hidden="true">
          <div className={styles.phoneStage}>
            <div className={styles.phoneFrame}>
              <Image className={styles.phone} src="/figma/footer/phone.png" alt="" width={1600} height={1200} sizes="(max-width: 767px) 280vw, 1654px" />
            </div>
          </div>
        </div>

        {/* Overlay — the 65px wash that dissolves the handset into the card's
            bottom edge rather than letting it stop on a hard cut. */}
        <div className={styles.fade} aria-hidden="true" />
      </div>
    </section>
  );
}
