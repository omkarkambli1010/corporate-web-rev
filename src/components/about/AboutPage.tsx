import AppPromo from "@/components/home/sections/AppPromo";
import FaqSection from "@/components/home/sections/FaqSection";
import StickyNudge from "@/components/home/sections/StickyNudge";
import type { AboutContent } from "@/types/pages";
import SbScope from "@/components/ui/SbScope";
import AboutHero from "./AboutHero";
import AboutIntro from "./AboutIntro";
import AwardsSection from "./AwardsSection";
import CsrSection from "./CsrSection";
import LifeAtSsl from "./LifeAtSsl";
import ValuesSection from "./ValuesSection";
import styles from "./about-page.module.scss";

/** About us — desktop 4:127197, tablet 2:73599, mobile 1:72554. */
export default function AboutPage({ content }: { content: AboutContent }) {
  return (
    <SbScope className={styles.page}>
      <AboutHero breadcrumbs={content.breadcrumbs} hero={content.hero} />
      <AboutIntro who={content.who} statements={content.statements} />
      <ValuesSection values={content.values} />
      <AwardsSection awards={content.awards} />
      <CsrSection csr={content.csr} />
      <LifeAtSsl life={content.life} />
      <FaqSection content={content.shared.faq} />
      <AppPromo content={content.shared.promo} />
      <StickyNudge content={content.shared.nudge} />
    </SbScope>
  );
}
