import Breadcrumbs, { type BreadcrumbItem } from "@/components/ui/Breadcrumbs";
import SbScope from "@/components/ui/SbScope";
import type { LeaderContent } from "@/types/pages";
import SectionTitle from "@/components/ui/SectionTitle";
import styles from "./leadership.module.scss";

/** Leader detail — desktop 4:127648, tablet 2:73906 (Leader-Tablet), mobile 1:76177. */
export default function LeaderDetail({
  leader,
  breadcrumbs,
}: {
  leader: LeaderContent;
  breadcrumbs: readonly BreadcrumbItem[];
}) {
  return (
    <SbScope>
      <section className={styles.banner}>
        <div className={styles.bannerInner}>
          <Breadcrumbs items={breadcrumbs} />
          <SectionTitle as="h1" size="page" className={`${styles.heading} ${styles.desktopOnly}`}>{leader.name}</SectionTitle>
          {/* Leader-Tablet sets the role under the name, in the banner. */}
          <p className={`${styles.tabletRole} ${styles.tabletOnly}`}>{leader.role}</p>

          {/* 360 frame 1:79374 — the portrait sits beside the name and role inside
              the banner; the desktop layout keeps them under the heading. */}
          <div className={styles.mobileHead}>
            <span className={styles.mobilePortrait}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={leader.detailPhoto || leader.photo} alt="" />
            </span>
            <div className={styles.mobileText}>
              <h1 className={styles.mobileName}>{leader.name}</h1>
              <p className={styles.mobileRole}>{leader.role}</p>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.detail}>
        <div className={styles.detailInner}>
          <div className={`${styles.detailCard} ${styles.desktopOnly}`}>
            <span className={styles.portrait}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={leader.detailPhoto || leader.photo} alt={leader.name} />
            </span>
            <p className={styles.detailRole}>{leader.role}</p>
          </div>

          <div className={styles.bio}>
            {leader.bio.map((paragraph) => <p key={paragraph.slice(0, 32)} className={styles.para}>
                {paragraph}
              </p>)}
          </div>
        </div>
      </section>
    </SbScope>
  );
}
