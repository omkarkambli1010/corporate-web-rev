import SectionHead from "@/components/ui/SectionHead";
import type { AboutContent } from "@/types/pages";
import styles from "./values.module.scss";

/** Our values — desktop 4:127280, mobile 1:72677. Five cards on a 3 + 2 bento. */
/* The five card colours, in the design's order. A value added in the CMS gets the
   next colour round rather than none. */
const TONES = ["service", "transparency", "ethics", "politeness", "sustainability"] as const;

export default function ValuesSection({ values }: { values: AboutContent["values"] }) {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <SectionHead title={values.title} align="center" />

        <ul className={styles.bento}>
          {values.items.map((value, i) => (
            <li key={`${value.key}-${value.title}`} className={`${styles.card} ${styles[TONES[i % TONES.length]]}`}
              style={{ "--stack": i } as React.CSSProperties}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className={styles.icon}
                src={value.icon}
                alt=""
                width={60}
                height={60}
              />
              <h3 className={styles.title}>{value.title}</h3>
              <p className={styles.body}>{value.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
