import type { Metadata } from "next";
import SearchPageView from "@/components/search/SearchPageView";
import type { SearchTab } from "@/components/search/SearchContent";
import {
  getAllResearch,
  getSearchCategories,
  getSearchLanding,
  searchSite,
  type SearchResult,
} from "@/services/search/searchService";

type Params = Promise<{ [key: string]: string | string[] | undefined }>;

const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value) ?? "";

export async function generateMetadata({ searchParams }: { searchParams: Params }): Promise<Metadata> {
  const query = first((await searchParams).q).trim();
  return {
    title: query ? `Search results for “${query}”` : "Search",
    // Result pages are endless and thin; keep them out of the index.
    robots: { index: false, follow: true },
  };
}

export default async function Search({ searchParams }: { searchParams: Params }) {
  const params = await searchParams;
  const query = first(params.q).trim().slice(0, 100);
  const categories = await getSearchCategories();
  const requested = first(params.type);
  const category = categories.find((c) => c.key === requested);
  const landing = await getSearchLanding();

  let result: SearchResult;
  let heading: string | undefined;
  if (query) {
    result = await searchSite(query);
  } else if (category?.key === "research") {
    // The Latest Research arrow: every research call, no query needed.
    const items = await getAllResearch();
    result = { query: "", groups: [{ ...category, label: "Latest Research", items }], total: items.length, gateway: null };
    heading = "Latest Research";
  } else {
    result = { query: "", groups: [], total: 0, gateway: null };
  }

  // A tab that this query has no results for falls back to All.
  const tab: SearchTab =
    category && result.groups.some((g) => g.key === category.key) && query ? category.key : "all";

  return <SearchPageView key={query} query={query} tab={tab} result={result} landing={landing} heading={heading} />;
}
