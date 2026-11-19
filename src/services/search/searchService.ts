import searchIndex from "@/data/search-index.json";

/**
 * Site search over the mock index in src/data/search-index.json.
 *
 * Everything is async on purpose: it already has the shape a real search API
 * call will have, so swapping the data source means changing only `loadIndex`
 * (e.g. to `fetch("/api/search?q=")`) — the header modal, the mobile screen and
 * the /search page stay as they are.
 */

export type SearchType = "stock" | "news" | "option" | "mf" | "etf" | "research" | "report" | "faq";

export interface SearchItem {
  id: string;
  type: SearchType;
  title: string;
  subtitle?: string;
  /** NSE / BSE / MF / ETF / Margin / Intraday. */
  badge?: string;
  price?: number;
  change?: number;
  pct?: number;
  /* news */
  symbol?: string;
  time?: string;
  image?: string;
  /* research */
  expectedProfit?: number;
  targetMargin?: number;
  /* report */
  date?: string;
  /** A page on the site; items without one open the results page. */
  href?: string;
  keywords?: string[];
}

export interface SearchCategory {
  key: SearchType;
  /** Section heading, e.g. "Recent News". */
  label: string;
  /** Tab label, e.g. "News". */
  tab: string;
}

export interface SearchGroup extends SearchCategory {
  items: SearchItem[];
}

/** "Looking for Mutual Funds" — shown when the query names a category. */
export interface SearchGateway {
  type: SearchType;
  label: string;
}

export interface SearchResult {
  query: string;
  groups: SearchGroup[];
  total: number;
  gateway: SearchGateway | null;
}

export interface SearchLanding {
  suggestions: string[];
  latestResearch: SearchItem[];
}

interface SearchIndex {
  categories: SearchCategory[];
  suggestions: string[];
  gateways: (SearchGateway & { aliases: string[] })[];
  latestResearch: string[];
  items: SearchItem[];
}

async function loadIndex(): Promise<SearchIndex> {
  return searchIndex as unknown as SearchIndex;
}

const normalise = (text: string) =>
  text
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

/**
 * Scores one item against the query's words; 0 means no match. Every word must
 * match something. An exact title (symbol) beats a title start, which beats a
 * word start, which beats a match in the subtitle or keywords.
 */
function score(item: SearchItem, words: string[], whole: string): number {
  const title = normalise(item.title);
  const titleWords = title.split(" ");
  const extra = normalise([item.subtitle ?? "", item.symbol ?? "", ...(item.keywords ?? [])].join(" ")).split(" ");

  let total = 0;
  for (const word of words) {
    if (title === word) total += 100;
    else if (title.startsWith(word)) total += 50;
    else if (titleWords.some((w) => w.startsWith(word))) total += 30;
    else if (extra.some((w) => w.startsWith(word))) total += 10;
    else return 0;
  }
  if (title === whole) total += 200;
  return total;
}

/** Every match, grouped in category order and ranked within each group. */
export async function searchSite(query: string): Promise<SearchResult> {
  const whole = normalise(query);
  const index = await loadIndex();
  if (!whole) return { query, groups: [], total: 0, gateway: null };
  const words = whole.split(" ");

  const ranked = index.items
    .map((item) => ({ item, score: score(item, words, whole) }))
    .filter((hit) => hit.score > 0)
    .sort((a, b) => b.score - a.score);

  const groups = index.categories
    .map((category) => ({
      ...category,
      items: ranked.filter((hit) => hit.item.type === category.key).map((hit) => hit.item),
    }))
    .filter((group) => group.items.length > 0);

  const named = index.gateways.find((g) => g.aliases.includes(whole));
  const gateway = named && groups.some((g) => g.key === named.type) ? { type: named.type, label: named.label } : null;

  // A generic search ("Mutual Fund") leads with the category it names, in the
  // tabs and the sections alike (Generic Search - MF frame).
  if (gateway) groups.sort((a, b) => Number(b.key === gateway.type) - Number(a.key === gateway.type));

  return { query, groups, total: groups.reduce((n, g) => n + g.items.length, 0), gateway };
}

/** "Think it Search it" suggestions and the Latest Research list. */
export async function getSearchLanding(): Promise<SearchLanding> {
  const index = await loadIndex();
  const byId = new Map(index.items.map((item) => [item.id, item]));
  return {
    suggestions: index.suggestions,
    latestResearch: index.latestResearch.map((id) => byId.get(id)).filter((i): i is SearchItem => Boolean(i)),
  };
}

/** Every research item, for the Latest Research arrow. */
export async function getAllResearch(): Promise<SearchItem[]> {
  return (await loadIndex()).items.filter((item) => item.type === "research");
}

export async function getSearchCategories(): Promise<SearchCategory[]> {
  return (await loadIndex()).categories;
}

export function searchPageHref(query: string, type?: SearchType): string {
  const params = new URLSearchParams();
  if (query.trim()) params.set("q", query.trim());
  if (type) params.set("type", type);
  const qs = params.toString();
  return qs ? `/search?${qs}` : "/search";
}

/** Where a result goes: its own page, or the results page for it. */
export function resultHref(item: SearchItem): string {
  return item.href ?? searchPageHref(item.symbol && item.type === "news" ? item.symbol : item.title, item.type);
}

/* Recent searches — kept for the browser session only (Figma note: cleared
   once the session ends). Each entry carries the quote it was searched with
   when it was a single instrument, for the desktop recent-search cards. */
export interface RecentSearch {
  label: string;
  price?: number;
  pct?: number;
}

const RECENT_KEY = "sbisecurities-recent-searches";
const RECENT_MAX = 10;

export function readRecentSearches(): RecentSearch[] {
  try {
    const value = JSON.parse(window.sessionStorage.getItem(RECENT_KEY) ?? "[]");
    return Array.isArray(value) ? value.filter((v) => v && typeof v.label === "string").slice(0, RECENT_MAX) : [];
  } catch {
    return [];
  }
}

export function rememberSearch(entry: RecentSearch): RecentSearch[] {
  const label = entry.label.trim();
  if (!label) return readRecentSearches();
  const next = [{ ...entry, label }, ...readRecentSearches().filter((r) => r.label.toLowerCase() !== label.toLowerCase())].slice(
    0,
    RECENT_MAX,
  );
  try {
    window.sessionStorage.setItem(RECENT_KEY, JSON.stringify(next));
  } catch {
    /* storage unavailable — recent searches just are not kept */
  }
  return next;
}
