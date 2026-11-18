"use client";

import { useState } from "react";
import Link from "next/link";

import type { FooterColumn } from "@/constants/sbi-home";
import useMediaQuery, { MOBILE_QUERY } from "@/utils/useMediaQuery";
import RiveAnimation from "@/components/ui/rive/RiveAnimation";
import styles from "./Footer.module.scss";

/* The Figma lists every link by label only. Those with a route today point at
   it; the rest take the slug their page will live at, which is the convention
   the previous footer already used for /support and /open-account. */
const ROUTES: Record<string, string> = {
  "54EC Bonds": "/cgs-bond",
  "SBI Realty": "/sso-realty",
  Blogs: "/blogs",
  "Open Demat Account": "/open-account",
  "MF Returns Calculator": "/calculators",
  "SIP Calculator": "/calculators",
  "Lumpsum Calculator": "/calculators",
  "Step-up SIP Calculator": "/calculators",
  "SWP Calculator": "/calculators",
  "FD Calculator": "/calculators",
  "NPS Calculator": "/calculators",
  "Home Loan EMI Calculator": "/calculators",
  "Car Loan EMI Calculator": "/calculators",
  "CAGR Calculator": "/calculators",
  "Loan EMI Calculator": "/calculators",
  "RD Calculator": "/calculators",
  "Retirement Calculator": "/calculators",
};

function hrefFor(label: string, group: string): string {
  const known = ROUTES[label];
  if (known) return known;

  const slug = label
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  /* Loans and Insurances repeat the same three labels, so they are namespaced
     by their heading to keep the two sets apart. */
  if (group === "LOANS") return `/loans/${slug}`;
  if (group === "INSURANCES") return `/insurance/${slug}`;
  if (group === "MARKETS") return `/markets/${slug}`;
  return `/${slug}`;
}

interface FooterLinkGroupProps {
  group: FooterColumn;
  /** `Footer accordian` keeps the first two groups open in the 360 frame. */
  defaultOpen?: boolean;
}

/**
 * Footer accordian I0:66328;18333:22243.
 *
 * The 1440 footer sets every group out in full across five columns; the 360
 * footer stacks them and closes all but the first two behind a chevron, so
 * the nine headings stay reachable without nine screens of links. Above 768
 * the heading is plain text again and there is nothing to toggle.
 */
export default function FooterLinkGroup({
  group,
  defaultOpen = false,
}: FooterLinkGroupProps) {
  const isMobile = useMediaQuery(MOBILE_QUERY);
  const [open, setOpen] = useState(defaultOpen);
  const expanded = !isMobile || open;
  const id = `footer-${group.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

  return (
    <div className={`${styles.group} ${expanded ? "" : styles.groupClosed}`}>
      <h2 className={styles.groupHeading}>
        {isMobile ? (
          <button
            type="button"
            className={styles.groupToggle}
            aria-expanded={expanded}
            aria-controls={id}
            onClick={() => setOpen((current) => !current)}
          >
            {group.title}
            {/* Rive slot `chevron`, driven by `open`; the rotating SVG until supplied. */}
            <RiveAnimation
              slot="chevron"
              values={{ open: expanded }}
              className={styles.riveChevron}
              fallback={
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  className={styles.chevron}
                  src="/figma/footer/chevron.svg"
                  alt=""
                  width={18}
                  height={18}
                />
              }
            />
          </button>
        ) : (
          group.title
        )}
      </h2>

      {/* The 360 frame sets the ten Trade & Invest labels in two columns
          rather than one ten-deep list; the short groups stay single. */}
      <ul
        id={id}
        className={`${styles.groupLinks} ${group.links.length > 6 ? styles.groupLinksSplit : ""}`}
      >
        {group.links.map((label) => (
          <li key={`${group.title}-${label}`}>
            <Link href={hrefFor(label, group.title)} className={styles.link}>
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
