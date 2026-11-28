"use client";

import { useState } from "react";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import SegmentedTabs from "@/components/ui/SegmentedTabs";
import AppPromo from "@/components/home/sections/AppPromo";
import StickyNudge from "@/components/home/sections/StickyNudge";
import SbScope from "@/components/ui/SbScope";
import type { LeadershipContent } from "@/types/pages";
import LeaderCard from "./LeaderCard";
import SectionTitle from "@/components/ui/SectionTitle";
import styles from "./leadership.module.scss";

/** Leadership listing — desktop 4:127542, tablet 2:73906, mobile 1:72949. */
export default function LeadershipListing({ content }: { content: LeadershipContent }) {
  const [tabKey, setTabKey] = useState(content.tabs[0]?.key ?? "");
  const leaders = content.leaders.filter((leader) => leader.groups.includes(tabKey));

  return (
    <SbScope>
      <section className={styles.banner}>
        <div className={styles.bannerInner}>
          <Breadcrumbs items={content.breadcrumbs} />
          <SectionTitle as="h1" size="page" className={styles.heading}>
            {content.heading.endsWith(".") ? (
              <>
                {content.heading.slice(0, -1)}
                <span className={styles.stop}>.</span>
              </>
            ) : (
              content.heading
            )}
          </SectionTitle>
        </div>
      </section>

      <section className={styles.listing}>
        <div className={styles.listingInner}>
          <div className={styles.tabs}>
            <SegmentedTabs
              tabs={content.tabs.map((t) => t.label)}
              active={content.tabs.find((t) => t.key === tabKey)?.label ?? ""}
              onChange={(label) => setTabKey(content.tabs.find((t) => t.label === label)?.key ?? tabKey)}
              label={content.tabsLabel}
              tone="onWhite"
              width={328}
            />
          </div>

          <ul className={styles.grid}>
            {leaders.map((leader) => (
              <li key={leader.slug}>
                <LeaderCard leader={leader} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <AppPromo content={content.shared.promo} />
      <StickyNudge content={content.shared.nudge} />
    </SbScope>
  );
}
