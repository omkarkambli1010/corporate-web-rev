import type { AboutContent } from "@/types/pages";
import MissionVision from "./MissionVision";
import SectionTitle from "@/components/ui/SectionTitle";
import styles from "./about-intro.module.scss";

/** Who are we? (4:127271) and Mission & Vision (4:127276). */
export default function AboutIntro({
  who,
  statements,
}: {
  who: AboutContent["who"];
  statements: AboutContent["statements"];
}) {
  return (
    <>
      <section className={styles.who}>
        <div className={styles.whoInner}>
          <SectionTitle size="medium" tone="dark" className={styles.whoTitle}>{who.title}</SectionTitle>
          <div className={styles.whoBody}>
            {who.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 24)} className={styles.para}>
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </section>

      <MissionVision statements={statements} />
    </>
  );
}
