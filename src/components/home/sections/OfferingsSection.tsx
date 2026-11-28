"use client";

import { useState } from "react";
import SbButton from "@/components/ui/SbButton";
import SectionHead from "@/components/ui/SectionHead";
import SegmentedTabs from "@/components/ui/SegmentedTabs";
import { INSURANCE, LOANS, OFFERINGS_TABS } from "@/constants/sbi-home";
import styles from "./offerings.module.scss";

/** Fund It, Protect It — desktop Other Offerings 1:58404, mobile 0:46494. */
export default function OfferingsSection() {
  const [tab, setTab] = useState<string>(OFFERINGS_TABS[0]);
  const cards = tab === "Insurance" ? INSURANCE : LOANS;

  return (
    <section className={styles.section} id="loans-and-insurance">
      <div className={styles.inner}>
        <SectionHead
          title="Fund It, Protect It"
          subtext="Financial solutions for more than just investing"
          href="#offerings"
          hrefLabel="All loans and insurance"
          subtextBreakAfter={5}
        />

        <div className={styles.tabs}>
          <SegmentedTabs
            tabs={OFFERINGS_TABS}
            active={tab}
            onChange={setTab}
            label="Loans or insurance"
          />
        </div>

        <ul className={styles.grid}>
          {cards.map((card) => (
            <li
              key={card.slug}
              className={`${styles.card} ${card.mobileOrder === 1 ? styles.mobileFirst : ""}`}
              style={{ "--mobile-order": card.mobileOrder } as React.CSSProperties}
            >
              <picture>
                {card.artMobile ? (
                  <source media="(max-width: 767px)" srcSet={card.artMobile} />
                ) : null}
                <img className={styles.art} src={card.art} alt="" aria-hidden="true" loading="lazy" decoding="async" />
              </picture>
              <h3 className={styles.cardTitle}>{card.title}</h3>
              <p className={styles.cardBody}>
                {card.lede}
                <br />
                {card.highlightLead}
                <strong>{card.highlight}</strong>
              </p>
              <SbButton block>
                <span className={styles.desktopOnly}>{card.cta}</span>
                <span className={styles.mobileOnly}>{card.ctaMobile}</span>
              </SbButton>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
