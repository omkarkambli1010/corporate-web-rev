"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Inter } from "next/font/google";

import SearchModal from "@/components/search/SearchModal";
import { SEARCH_PLACEHOLDER, TOP_NAV } from "@/constants/sbi-home";
import styles from "./Header.module.scss";

/* The header renders on every marketing route, while the Inter that
   `sbi-home.scss` loads reaches only the routes rendering HomeComponent. It
   therefore carries its own copy rather than inheriting the root layout's Open
   Sans — next/font dedupes identical requests, so the home page and the footer,
   which ask for the same family, pay nothing extra. */
const inter = Inter({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
  variable: "--header-font-inter",
});

/** Top Nav — Figma `Top Nav` 0:64969, Pre-Login Home Page Sprint 2. */
export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  /* Search opens as a modal (desktop/tablet) or a full screen (360) — the
     field in the bar, the glyph below 1280, and ⌘K / Ctrl+K all open it. */
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setMenuOpen(false);
        setSearchOpen(true);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <header className={`${styles.siteHeader} ${inter.variable}`}>
      <div className={styles.inner}>
        {/* SSL-logo — a 182x48 box holding the wordmark and, set against its
            top-right corner, the registered mark, exactly as the frame nests
            the two exports. */}
        <Link href="/" className={styles.logo} aria-label="SBI Securities home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className={styles.logoMain} src="/figma/header/logo-main.svg" alt="SBI Securities" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className={styles.logoMark} src="/figma/header/logo-mark.svg" alt="" aria-hidden="true" />
        </Link>

        <button
          type="button"
          className={styles.menuToggle}
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
          onClick={() => {
            setMenuOpen((open) => !open);
            setSearchOpen(false);
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/figma/header/m-menu.svg" alt="" width={24} height={24} aria-hidden="true" />
          <span className="visually-hidden">
            {menuOpen ? "Close navigation menu" : "Open navigation menu"}
          </span>
        </button>

        <nav
          id="primary-navigation"
          className={`${styles.nav} ${menuOpen ? styles.navOpen : ""}`}
          aria-label="Primary navigation"
        >
          <ul className={styles.navList}>
            {TOP_NAV.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={styles.navLink} onClick={() => setMenuOpen(false)}>
                  {item.label}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    className={styles.caret}
                    src="/figma/header/caret-down.svg"
                    alt=""
                    width={16}
                    height={16}
                  />
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.actions}>
          {/* Frame 0:43020 — 24 square, first of the three glyphs the mobile
              bar carries. It is the only entry point to the field below 768. */}
          <button
            type="button"
            className={`${styles.iconButton} ${styles.searchToggle}`}
            aria-haspopup="dialog"
            aria-expanded={searchOpen}
            onClick={() => {
              setMenuOpen(false);
              setSearchOpen(true);
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/figma/header/m-search.svg" alt="" width={24} height={24} />
            <span className="visually-hidden">Search</span>
          </button>

          {/* Input Field 18571:6304 — looks like a field, opens the search. */}
          <button
            type="button"
            className={styles.search}
            aria-haspopup="dialog"
            aria-expanded={searchOpen}
            onClick={() => {
              setMenuOpen(false);
              setSearchOpen(true);
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className={styles.searchIcon} src="/figma/header/search.svg" alt="" width={20} height={20} />
            <span className={styles.searchLabel}>Search</span>
            <span className={styles.shortcut} aria-hidden="true">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/figma/header/command.svg" alt="" width={16} height={16} />K
            </span>
          </button>

          <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} placeholder={SEARCH_PLACEHOLDER} />

          <Link
            href="/support"
            className={`${styles.iconButton} ${styles.supportButton}`}
            aria-label="Help and support"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/figma/header/headset.svg" alt="" width={16} height={16} />
          </Link>

          {/* Keeps the existing offcanvas contract: AccessibilitySidebar renders
              the panel with this id and Bootstrap wires the toggle. */}
          <button
            type="button"
            className={styles.iconButton}
            data-bs-toggle="offcanvas"
            data-bs-target="#accessibilityPanel"
            aria-controls="accessibilityPanel"
            aria-label="Open accessibility options"
          >
            {/* 17, not 16: this export's artwork fills a 17.0526 viewBox, so
                forcing it to 16 scales by 0.938 and renders its 1.05 stroke at
                0.99px across a fractional offset — a soft grey ring rather than
                the crisp one the frame shows. At 17 it maps ~1:1. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className={styles.iconWide}
              src="/figma/header/accessibility.svg"
              alt=""
              width={17}
              height={17}
            />
            {/* Frame 0:43022 — the mobile bar draws the same glyph at 24, a
                different export rather than this one scaled up. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className={styles.iconNarrow}
              src="/figma/header/m-accessibility.svg"
              alt=""
              width={24}
              height={24}
            />
          </button>

          <Link href="/sso-realty" className={`${styles.cta} ${styles.ctaSecondary}`}>
            Log In
          </Link>

          <Link href="/demat-form-test" className={`${styles.cta} ${styles.ctaPrimary}`}>
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}
