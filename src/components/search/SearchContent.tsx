"use client";

import Link from "next/link";
import {
  searchPageHref,
  type RecentSearch,
  type SearchItem,
  type SearchLanding,
  type SearchResult,
  type SearchType,
} from "@/services/search/searchService";
import { ArrowDownRightIcon, ArrowRightIcon, ArrowUpRightIcon, ClockIcon, SearchGlyph, TypeIcon } from "./SearchIcons";
import SearchRow from "./SearchRow";
import styles from "./search-content.module.scss";

export type SearchTab = "all" | SearchType;

/** Rows a section shows in the "All" view — the frames give news five. */
const ALL_VIEW_LIMIT: Partial<Record<SearchType, number>> = { news: 5 };
const DEFAULT_LIMIT = 3;

/* ------------------------------------------------------------------------ */
/* Landing: Think it Search it, Recent Searches, Latest Research            */
/* ------------------------------------------------------------------------ */

export function SearchLandingView({
  landing,
  recent,
  onPick,
  onSelect,
  showAllRecent,
  onToggleRecent,
}: {
  landing: SearchLanding;
  recent: RecentSearch[];
  /** A suggestion or recent search was chosen — search for it. */
  onPick: (term: string) => void;
  /** A result link was followed (lets the modal close and remember it). */
  onSelect?: (item?: SearchItem) => void;
  showAllRecent: boolean;
  onToggleRecent: () => void;
}) {
  const shownRecent = showAllRecent ? recent : recent.slice(0, 5);
  return (
    <div className={styles.landing}>
      <section className={styles.block} aria-labelledby="search-think">
        <h2 id="search-think" className={styles.think}>
          Think it Search it
        </h2>
        <ul className={styles.chips}>
          {landing.suggestions.map((term) => (
            <li key={term}>
              <button type="button" className={styles.chip} onClick={() => onPick(term)}>
                <SearchGlyph size={12} />
                {term}
              </button>
            </li>
          ))}
        </ul>
      </section>

      {recent.length > 0 ? (
        <section className={styles.block} aria-labelledby="search-recent">
          <div className={styles.blockHead}>
            <h2 id="search-recent" className={styles.blockTitle}>
              Recent Searches
            </h2>
            {recent.length > 5 ? (
              <button type="button" className={styles.viewAllLink} onClick={onToggleRecent}>
                {showAllRecent ? "Show less" : "View All"}
              </button>
            ) : null}
          </div>
          <ul className={styles.recent}>
            {shownRecent.map((entry) => {
              const up = (entry.pct ?? 0) >= 0;
              return (
                <li key={entry.label}>
                  <button type="button" className={styles.recentCard} onClick={() => onPick(entry.label)}>
                    <span className={styles.recentName}>{entry.label}</span>
                    {entry.price !== undefined && entry.pct !== undefined ? (
                      <span className={styles.recentQuote}>
                        <span>{entry.price.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                        <span className={up ? styles.up : styles.down}>
                          {up ? "+" : "−"}
                          {Math.abs(entry.pct).toFixed(2)}%
                        </span>
                        {up ? <ArrowUpRightIcon size={16} className={styles.up} /> : <ArrowDownRightIcon size={16} className={styles.down} />}
                      </span>
                    ) : null}
                    {/* The 360 frames show recent searches as clock pills. */}
                    <ClockIcon size={16} className={styles.recentClock} />
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}

      <section className={styles.block} aria-labelledby="search-research">
        <div className={styles.blockHead}>
          <h2 id="search-research" className={styles.blockTitle}>
            Latest Research
          </h2>
          <Link href={searchPageHref("", "research")} className={styles.headArrow} aria-label="All research" onClick={() => onSelect?.()}>
            <ArrowRightIcon />
          </Link>
        </div>
        <ul className={styles.rows}>
          {landing.latestResearch.map((item) => (
            <SearchRow key={item.id} item={item} onSelect={onSelect} />
          ))}
        </ul>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Results: tabs, gateway, sections                                          */
/* ------------------------------------------------------------------------ */

interface ResultsProps {
  result: SearchResult;
  tab: SearchTab;
  /** In the modal tabs are buttons; on the page they are links. */
  onTab?: (tab: SearchTab) => void;
  onSelect?: (item?: SearchItem) => void;
  /** "Found 15 results for …" — the full page only. */
  showCount?: boolean;
}

export function SearchTabs({ result, tab, onTab }: Pick<ResultsProps, "result" | "tab" | "onTab">) {
  const tabs: { key: SearchTab; label: string }[] = [
    { key: "all", label: "All" },
    ...result.groups.map((g) => ({ key: g.key as SearchTab, label: g.tab })),
  ];
  return (
    <div className={styles.tabBar}>
      <nav className={styles.tabs} aria-label="Result types">
        {tabs.map((t) => {
          const current = t.key === tab;
          const className = `${styles.tab} ${current ? styles.tabActive : ""}`;
          return onTab ? (
            <button
              key={t.key}
              type="button"
              className={className}
              aria-pressed={current}
              onClick={() => onTab(t.key)}
            >
              {t.label}
            </button>
          ) : (
            <Link
              key={t.key}
              href={searchPageHref(result.query, t.key === "all" ? undefined : t.key)}
              className={className}
              aria-current={current ? "page" : undefined}
              scroll={false}
            >
              {t.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

export function SearchResultsView({ result, tab, onTab, onSelect, showCount }: ResultsProps) {
  const groups = tab === "all" ? result.groups : result.groups.filter((g) => g.key === tab);
  return (
    <div className={styles.results}>
      {showCount ? (
        <p className={styles.count}>
          Found <span className={styles.countNumber}>{result.total}</span> results for &quot;{result.query}&quot;
        </p>
      ) : null}

      {result.gateway && tab === "all" ? (
        <Gateway result={result} onTab={onTab} onSelect={onSelect} />
      ) : null}

      {groups.map((group) => {
        const limit = tab === "all" ? (ALL_VIEW_LIMIT[group.key] ?? DEFAULT_LIMIT) : Infinity;
        const items: SearchItem[] = group.items.slice(0, limit);
        return (
          <section key={group.key} className={styles.section} aria-labelledby={`search-group-${group.key}`}>
            <div className={styles.blockHead}>
              <h2 id={`search-group-${group.key}`} className={styles.blockTitle}>
                {group.label}
              </h2>
              {tab === "all" ? (
                onTab ? (
                  <button
                    type="button"
                    className={styles.headArrow}
                    aria-label={`Show all ${group.label}`}
                    onClick={() => onTab(group.key)}
                  >
                    <ArrowRightIcon />
                  </button>
                ) : (
                  <Link
                    href={searchPageHref(result.query, group.key)}
                    className={styles.headArrow}
                    aria-label={`Show all ${group.label}`}
                    scroll={false}
                  >
                    <ArrowRightIcon />
                  </Link>
                )
              ) : null}
            </div>
            <ul className={styles.rows}>
              {items.map((item) => (
                <SearchRow key={item.id} item={item} onSelect={onSelect} />
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}

/** "Looking for Mutual Funds" — the generic-search gateway row. */
function Gateway({ result, onTab, onSelect }: Pick<ResultsProps, "result" | "onTab" | "onSelect">) {
  const gateway = result.gateway!;
  const content = (
    <>
      <span className={styles.gatewayIcon} aria-hidden="true">
        <TypeIcon type={gateway.type} size={18} />
      </span>
      <span className={styles.gatewayText}>
        Looking for <strong>{gateway.label}</strong>
      </span>
      <ArrowRightIcon className={styles.gatewayArrow} />
    </>
  );
  return onTab ? (
    <button type="button" className={styles.gateway} onClick={() => onTab(gateway.type)}>
      {content}
    </button>
  ) : (
    <Link href={searchPageHref(result.query, gateway.type)} className={styles.gateway} onClick={() => onSelect?.()} scroll={false}>
      {content}
    </Link>
  );
}

export function NoResults({ query }: { query: string }) {
  return (
    <p className={styles.noResults} role="status">
      No results found for <span className={styles.noResultsQuery}>&lsquo;{query}&rsquo;</span>
    </p>
  );
}
