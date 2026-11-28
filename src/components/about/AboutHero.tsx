import Breadcrumbs, { type BreadcrumbItem } from "@/components/ui/Breadcrumbs";
import type { AboutContent } from "@/types/pages";
import SectionTitle from "@/components/ui/SectionTitle";
import styles from "./about-hero.module.scss";

/** About us hero banner — desktop 4:127270, mobile 1:72561. */
export default function AboutHero({
  breadcrumbs,
  hero,
}: {
  breadcrumbs: readonly BreadcrumbItem[];
  hero: AboutContent["hero"];
}) {
  return (
    <section className={styles.hero}>
      <div className={styles.dots} aria-hidden="true">
        {[-138, 434, 1006].map((left) => (
          <span key={left} className={styles.dotBox} style={{ left }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/figma/about/hero/dots.png" alt="" className={styles.dot} />
          </span>
        ))}
      </div>
      <span className={styles.shadow} aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/figma/about/hero/bg-shadow.svg" alt="" />
      </span>

      <div className={styles.inner}>
        <Breadcrumbs items={breadcrumbs} className={styles.crumbs} />

        <div className={styles.copy}>
          <SectionTitle as="h1" size="page">{hero.title}</SectionTitle>
          <p className={styles.subtext}>
            {hero.subtext.split("\n").map((line) => (
              <span key={line} className={styles.line}>
                {line}{" "}
              </span>
            ))}
          </p>
        </div>

        <div className={styles.visual} aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/figma/about/hero/mockup.png" alt="" className={styles.phone} />
          <ul className={styles.products}>
            {hero.products.map((product) => (
              <li key={`${product.key}-${product.label}`} className={styles.product}>
                <span className={styles.iconWrap}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={product.icon} alt="" width={24} height={24} />
                  {product.badge ? <span className={styles.badge}>{product.badge}</span> : null}
                </span>
                <span className={styles.label}>{product.label}</span>
              </li>
            ))}
          </ul>
        </div>

        <form className={styles.form} action="#" aria-label="Get started">
          <div className={styles.field}>
            <label htmlFor="about-mobile">
              {hero.form.mobileLabel}
              <span aria-hidden="true"> *</span>
            </label>
            <input
              id="about-mobile"
              type="tel"
              inputMode="numeric"
              autoComplete="tel"
              required
              aria-describedby="about-mobile-help"
              placeholder={hero.form.mobilePlaceholder}
            />
            <p className={styles.help} id="about-mobile-help">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/figma/about/hero/info.svg" alt="" width={16} height={16} />
              {hero.form.mobileHelp}
            </p>
          </div>
          <div className={styles.field}>
            <label htmlFor="about-name">
              {hero.form.nameLabel}
              <span aria-hidden="true"> *</span>
            </label>
            <input
              id="about-name"
              type="text"
              required
              placeholder={hero.form.namePlaceholder}
              autoComplete="name"
            />
          </div>
          <label className={styles.agree}>
            <input type="checkbox" defaultChecked />
            <span className={styles.box} aria-hidden="true">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/figma/about/hero/check.svg" alt="" width={12} height={12} />
            </span>
            {hero.form.consent}
          </label>
          <button type="submit" className={styles.submit}>
            {hero.form.submit}
          </button>
        </form>
      </div>
    </section>
  );
}
