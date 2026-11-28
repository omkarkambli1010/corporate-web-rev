import type { Metadata } from "next";

import type { SeoContent } from "@/types/pages";

/**
 * A page's SEO block as Next metadata. Empty fields are left out so Next's own
 * defaults (and the root layout's) apply, rather than emitting blank tags.
 */
export function seoMetadata(seo: SeoContent, path: string): Metadata {
  const title = seo.ogTitle || seo.title;
  const description = seo.ogDescription || seo.description;
  const robots = seo.robots.toLowerCase();

  return {
    /* A title that already names the site must not get the layout suffix too. */
    title: seo.title.includes("SBI Securities") ? { absolute: seo.title } : seo.title,
    description: seo.description || undefined,
    keywords: seo.keywords.length > 0 ? seo.keywords : undefined,
    alternates: { canonical: seo.canonical || path },
    robots: {
      index: !robots.includes("noindex"),
      follow: !robots.includes("nofollow"),
    },
    openGraph: {
      type: "website",
      url: seo.canonical || path,
      title,
      description: description || undefined,
      siteName: "SBI Securities",
      locale: "en_IN",
      images: seo.ogImage ? [{ url: seo.ogImage }] : undefined,
    },
  };
}
