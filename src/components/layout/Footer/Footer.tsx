import Link from "next/link";
import { Inter, Poppins } from "next/font/google";

import {
  BRAND,
  FOOTER_LEGAL,
  FOOTER_PRIMARY,
  FOOTER_SECONDARY,
  STOCK_INDEX_LETTERS,
  STOCK_LINKS,
} from "@/constants/sbi-home";
import FooterLinkGroup from "./FooterLinkGroup";
import styles from "./Footer.module.scss";

/* The footer renders on every marketing route, while the Poppins/Inter that
   `sbi-home.scss` loads reach only the routes rendering HomeComponent. It
   therefore carries its own copies rather than inheriting the root layout's
   Open Sans — next/font dedupes identical requests, so the home page, which
   asks for the same two families, pays nothing extra. */
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--footer-font-inter",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
  variable: "--footer-font-poppins",
});

const SOCIALS = [
  { label: "Instagram", href: "https://www.instagram.com/", icon: "/figma/footer/social-1.svg" },
  { label: "X", href: "https://x.com/", icon: "/figma/footer/social-2.svg" },
  { label: "Facebook", href: "https://www.facebook.com/", icon: "/figma/footer/social-3.svg" },
  { label: "LinkedIn", href: "https://www.linkedin.com/", icon: "/figma/footer/social-4.svg" },
  { label: "YouTube", href: "https://www.youtube.com/", icon: "/figma/footer/social-5.svg" },
];

/** Footer — Figma `Footer` 0:64968, Pre-Login Home Page Sprint 2. */
export default function Footer() {
  return (
    <footer className={`${styles.siteFooter} ${inter.variable} ${poppins.variable}`}>
      <div className={styles.inner}>
        <div className={styles.band}>
          <div className={styles.top}>
            <div className={styles.contact}>
            <Link href="/" className={styles.logo} aria-label={`${BRAND.name} home`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/figma/footer/logo-a.svg" alt={BRAND.name} />
            </Link>

            <address className={styles.address}>{BRAND.address}</address>

            <p className={styles.contactLine}>
              <span className={styles.contactLabel}>Call:</span>
              <a href={`tel:${BRAND.phone.split("/")[0].replace(/\s/g, "")}`}>{BRAND.phone}</a>
            </p>

            <p className={styles.contactLine}>
              <span className={styles.contactLabel}>E-mail:</span>
              <a href={`mailto:${BRAND.email}`}>{BRAND.email}</a>
            </p>

            <div className={styles.social}>
              <span className={styles.contactLabel}>Connect with us</span>
              <ul className={styles.socialList}>
                {SOCIALS.map((s) => (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      className={styles.socialLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.label}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={s.icon} alt="" width={24} height={24} />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <Link href="/support" prefetch={false} className={styles.support}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/figma/footer/headset.svg" alt="" width={16} height={16} />
              Help &amp; Support
            </Link>
          </div>

            <div className={styles.primaryGroups}>
              {FOOTER_PRIMARY.map((group) => (
                <FooterLinkGroup
                  key={group.title}
                  group={group}

                  defaultOpen
                />
              ))}
            </div>
          </div>
        </div>

        <hr className={`${styles.rule} ${styles.ruleUpper}`} />

        <div className={styles.band}>
          <div className={styles.columns}>
            {FOOTER_SECONDARY.map((column, i) => (
              <div className={styles.column} key={column[0]?.title ?? i}>
                {column.map((group) => (
                  <FooterLinkGroup key={group.title} group={group} />
                ))}
              </div>
            ))}
          </div>
        </div>

        <hr className={`${styles.rule} ${styles.ruleLower}`} />

        <div className={styles.band}>
          <div className={styles.stocks}>
            <h2 className={styles.stocksHeading}>Stocks</h2>
          <ul className={styles.letters}>
            {STOCK_INDEX_LETTERS.map((letter) => (
              <li key={letter}>
                <Link
                  href={`/stocks/${letter.toLowerCase()}`}
                  className={styles.letter}
                  aria-label={`Stocks starting with ${letter}`}
                >
                  {letter}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <ul className={styles.chips}>
          {STOCK_LINKS.map((label, i) => (
            <li key={`${label}-${i}`}>
              <Link href="/stocks" className={styles.chip} title={label}>
                {label}
              </Link>
            </li>
          ))}
        </ul>

        <div className={styles.legal}>
          <p className={styles.legalTight}>
            {FOOTER_LEGAL.registration[0]}
            <br />
            {FOOTER_LEGAL.registration[1]}
          </p>
          <p>{FOOTER_LEGAL.trading}</p>
          <p>{FOOTER_LEGAL.authorization}</p>
          <p>{FOOTER_LEGAL.warning}</p>
          <p>{FOOTER_LEGAL.copyright}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
