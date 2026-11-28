import {
  ABOUT_HERO,
  AWARDS,
  CSR_ACTIVITIES,
  HERO_PRODUCTS,
  LIFE_AT_SSL,
  MISSION,
  VALUES,
  VISION,
  WHO_ARE_WE,
} from "@/constants/sbi-about";
import type {
  AboutActivity,
  AboutAward,
  AboutContent,
  AboutProduct,
  AboutSlide,
  AboutStatement,
  AboutValue,
  Crumb,
  SeoContent,
} from "@/types/pages";

import { getPageView, image, link, num, str, type Json } from "./pageContent";
import { toCrumbs, toFaq, toNudge, toPromo, toSeo } from "./sharedContent";

/**
 * About us — /about. The CMS slug is "about"; its sections are described in
 * cms-website/src/server/cms/pages.ts, whose field names are the keys read here.
 */

const CRUMBS: Crumb[] = [{ label: "Home", href: "/" }, { label: "About us" }];

const SEO: SeoContent = {
  title: "About us | SBI Securities",
  description: ABOUT_HERO.subtext.replace(/\n/g, " "),
  keywords: [],
  canonical: "",
  ogTitle: "",
  ogDescription: "",
  ogImage: "",
  robots: "index,follow",
};

const LIFE_PHOTO = (name: string) => `/figma/about/life/${name}.png`;

/** The built-in content, in the shape the components render. */
export const DEFAULT_ABOUT: AboutContent = {
  breadcrumbs: CRUMBS,
  seo: SEO,
  hero: {
    title: ABOUT_HERO.title,
    subtext: ABOUT_HERO.subtext,
    form: {
      mobileLabel: "Enter Mobile no.",
      mobilePlaceholder: "Enter your mobile number",
      mobileHelp: "Enter 10 digits. We will send an OTP to it",
      nameLabel: "Enter Full Name",
      namePlaceholder: "Enter your full name",
      consent: "I agree to terms and conditions",
      submit: "Get Started",
    },
    products: HERO_PRODUCTS.map((p) => ({
      key: p.icon,
      label: p.label,
      badge: "badge" in p ? p.badge : "",
      icon: `/figma/about/hero/${p.icon}.svg`,
    })),
  },
  who: { title: WHO_ARE_WE.title, paragraphs: [...WHO_ARE_WE.paragraphs] },
  statements: [
    { key: "mission", label: MISSION.label, statement: MISSION.statement, restLetters: MISSION.restLetters },
    { key: "vision", label: VISION.label, statement: VISION.statement, restLetters: VISION.restLetters },
  ],
  values: {
    title: "Our Values",
    items: VALUES.map((v) => ({ key: v.key, title: v.title, body: v.body, icon: `/figma/about/values/${v.key}.svg` })),
  },
  awards: {
    title: "Awards & Recognitions",
    items: AWARDS.map((a) => ({ ...a, logo: `/figma/about/awards/${a.logo}.png` }) as AboutAward),
  },
  csr: {
    title: "CSR Activities",
    items: CSR_ACTIVITIES.map((c) => ({
      key: c.key,
      title: c.title,
      text: c.text,
      layers: c.layers.map((l) => `/figma/about/csr/${l}.png`),
    })),
  },
  life: {
    title: LIFE_AT_SSL.title,
    subtext: LIFE_AT_SSL.subtext,
    ctaLabel: "View Openings",
    ctaHref: LIFE_AT_SSL.careersHref,
    readMore: "Read More",
    viewLess: "View Less",
    autoAdvanceMs: 60_000,
    slides: LIFE_AT_SSL.slides.map((s) => ({
      title: s.title,
      body: s.body,
      front: { ...s.front, photo: LIFE_PHOTO(s.front.photo) },
      left: { ...s.left, photo: LIFE_PHOTO(s.left.photo) },
      right: { ...s.right, photo: LIFE_PHOTO(s.right.photo) },
    })),
    photos: LIFE_AT_SSL.photos.map(LIFE_PHOTO),
  },
  shared: {
    faq: toFaq(null),
    promo: toPromo(null),
    nudge: toNudge(null),
  },
};

/* --- mapping ---------------------------------------------------------------- */

/** A list from the CMS, or the built-in one when the CMS has none. */
function list<T>(rowsIn: Json[], map: (row: Json, index: number) => T | null, fallback: readonly T[]): T[] {
  const out = rowsIn.map(map).filter((x): x is T => x !== null);
  return out.length > 0 ? out : [...fallback];
}

export async function getAboutContent(): Promise<AboutContent> {
  const view = await getPageView("about");
  if (!view) return DEFAULT_ABOUT;

  const D = DEFAULT_ABOUT;
  const hero = view.section("about-hero");
  const who = view.section("about-who");
  const values = view.section("about-values");
  const awards = view.section("about-awards");
  const csr = view.section("about-csr");
  const life = view.section("about-life");

  const heroBlock = hero?.block ?? {};
  const lifeBlock = life?.block ?? {};

  const products = list<AboutProduct>(
    hero?.items("products") ?? [],
    (r) => {
      if (typeof r.label !== "string" || !r.label.trim()) return null;
      const key = str(r.key, "");
      return {
        key,
        label: r.label,
        badge: str(r.badge, ""),
        icon: image(r.icon, key ? `/figma/about/hero/${key}.svg` : ""),
      };
    },
    D.hero.products,
  );

  const statements = list<AboutStatement>(
    view.section("about-mission-vision")?.items("statements") ?? [],
    (r) => {
      if (typeof r.statement !== "string" || !r.statement.trim()) return null;
      const key = str(r.key, "");
      const base = D.statements.find((s) => s.key === key);
      return {
        key,
        label: str(r.label, base?.label ?? ""),
        statement: r.statement,
        restLetters: num(r.rest_letters, base?.restLetters ?? 0),
      };
    },
    D.statements,
  );

  const valueItems = list<AboutValue>(
    values?.items("values") ?? [],
    (r) => {
      if (typeof r.title !== "string" || !r.title.trim()) return null;
      const key = str(r.key, "");
      return {
        key,
        title: r.title,
        body: str(r.body, ""),
        icon: image(r.icon, key ? `/figma/about/values/${key}.svg` : ""),
      };
    },
    D.values.items,
  );

  const awardItems = list<AboutAward>(
    awards?.items("awards") ?? [],
    (r, i) => {
      if (typeof r.title !== "string" || !r.title.trim()) return null;
      /* Placement of the pattern and logo crop is design geometry, kept in code
         per position; an award past the designed four reuses the first one's. */
      const base = D.awards.items[i] ?? D.awards.items[0];
      const logo = image(r.logo, base.logo);
      const lines = r.title.split("\n").map((l) => l.trim()).filter(Boolean);
      return {
        ...base,
        logo,
        crop: logo === base.logo ? base.crop : undefined,
        title: lines.join(" "),
        titleLines: lines,
        text: str(r.text, ""),
      };
    },
    D.awards.items,
  );

  const csrItems = list<AboutActivity>(
    csr?.items("activities") ?? [],
    (r, i) => {
      if (typeof r.title !== "string" || !r.title.trim()) return null;
      const base = D.csr.items[i];
      const photo = isImage(r.image) ? image(r.image, "") : "";
      /* Two shared backdrop layers sit under every photo; the first activity's
         photo is the second backdrop itself, so it is not stacked twice. */
      const backdrop = D.csr.items[0].layers;
      const layers = photo && !photo.endsWith("/layer-1.png") ? [...backdrop, photo] : [...backdrop];
      return {
        key: str(r.key, base?.key ?? `activity-${i + 1}`),
        title: r.title,
        text: str(r.text, ""),
        layers: photo ? layers : (base?.layers ?? layers),
      };
    },
    D.csr.items,
  );

  const slideRows = life?.items("slides") ?? [];
  const slides = list<AboutSlide>(
    slideRows,
    (r, i) => {
      if (typeof r.title !== "string" || !r.title.trim()) return null;
      const base = D.life.slides[i] ?? D.life.slides[0];
      const front = image(r.photo, base.front.photo);
      const back = image(r.back_photo, base.left.photo);
      /* The photo tilted to the right is the next slide's front photo, which is
         how the design chains them. Resolved below once every front is known. */
      return {
        title: r.title,
        body: str(r.body, ""),
        front: { ...base.front, photo: front },
        left: { ...base.left, photo: back },
        right: { ...base.right, photo: back },
      };
    },
    D.life.slides,
  );
  if (slideRows.length > 0) {
    slides.forEach((s, i) => {
      s.right = { ...s.right, photo: slides[(i + 1) % slides.length].front.photo };
    });
  }

  return {
    breadcrumbs: toCrumbs(view, "breadcrumbs", D.breadcrumbs),
    seo: toSeo(view, D.seo),
    hero: {
      title: str(heroBlock.title, D.hero.title),
      subtext: str(heroBlock.subtext, D.hero.subtext),
      form: {
        mobileLabel: str(heroBlock.mobile_label, D.hero.form.mobileLabel),
        mobilePlaceholder: str(heroBlock.mobile_placeholder, D.hero.form.mobilePlaceholder),
        mobileHelp: str(heroBlock.mobile_help, D.hero.form.mobileHelp),
        nameLabel: str(heroBlock.name_label, D.hero.form.nameLabel),
        namePlaceholder: str(heroBlock.name_placeholder, D.hero.form.namePlaceholder),
        consent: str(heroBlock.consent_label, D.hero.form.consent),
        submit: str(heroBlock.submit_label, D.hero.form.submit),
      },
      products,
    },
    who: {
      title: str(who?.block.title, D.who.title),
      paragraphs: Array.isArray(who?.block.paragraphs) && who.block.paragraphs.length > 0
        ? (who.block.paragraphs as unknown[]).filter((p): p is string => typeof p === "string" && p.trim() !== "")
        : D.who.paragraphs,
    },
    statements,
    values: { title: str(values?.block.title, D.values.title), items: valueItems },
    awards: { title: str(awards?.block.title, D.awards.title), items: awardItems },
    csr: { title: str(csr?.block.title, D.csr.title), items: csrItems },
    life: {
      title: str(lifeBlock.title, D.life.title),
      subtext: str(lifeBlock.subtext, D.life.subtext),
      ctaLabel: str(lifeBlock.cta_label, D.life.ctaLabel),
      ctaHref: link(lifeBlock.cta_href, D.life.ctaHref),
      readMore: str(lifeBlock.read_more_label, D.life.readMore),
      viewLess: str(lifeBlock.view_less_label, D.life.viewLess),
      autoAdvanceMs: Math.max(1, num(lifeBlock.auto_advance_seconds, 60)) * 1000,
      slides,
      photos: [...new Set(slides.flatMap((s) => [s.front.photo, s.left.photo, s.right.photo]))],
    },
    shared: { faq: toFaq(view), promo: toPromo(view), nudge: toNudge(view) },
  };
}

const isImage = (v: unknown) => typeof v === "object" && v !== null;
