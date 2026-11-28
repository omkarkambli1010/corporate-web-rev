"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import SbScope from "@/components/ui/SbScope";
import {
  rememberSearch,
  searchPageHref,
  type SearchLanding,
  type SearchResult,
} from "@/services/search/searchService";
import { ArrowLeftIcon, CloseIcon, SearchGlyph } from "./SearchIcons";
import { NoResults, SearchLandingView, SearchResultsView, SearchTabs, type SearchTab } from "./SearchContent";
import styles from "./search-page.module.scss";

/**
 * /search — "Search full Page" (desktop 4:131170): an 880 column with a back
 * arrow and the field, full-width tabs, "Found N results", then every section.
 * Tabs and section arrows are links, so each view has its own URL.
 */
export default function SearchPageView({
  query,
  tab,
  result,
  landing,
  heading,
}: {
  query: string;
  tab: SearchTab;
  result: SearchResult;
  landing: SearchLanding;
  /** Shown instead of the count when there is no query (e.g. Latest Research). */
  heading?: string;
}) {
  const router = useRouter();
  const [value, setValue] = useState(query);
  const hasResults = result.total > 0;

  const go = (term: string) => {
    const t = term.trim();
    if (!t) return;
    rememberSearch({ label: t });
    router.push(searchPageHref(t));
  };

  return (
    <SbScope>
      <section className={styles.page}>
        <div className={styles.inner}>
          <form
            className={styles.bar}
            role="search"
            action="/search"
            method="get"
            onSubmit={(e) => {
              e.preventDefault();
              go(value);
            }}
          >
            <button type="button" className={styles.back} onClick={() => router.back()} aria-label="Go back">
              <ArrowLeftIcon size={24} />
            </button>
            <div className={styles.field}>
              <SearchGlyph className={styles.fieldIcon} />
              <label htmlFor="search-page-input" className="visually-hidden">
                Search
              </label>
              <input
                id="search-page-input"
                name="q"
                type="search"
                autoComplete="off"
                spellCheck={false}
                className={styles.input}
                placeholder="Search for Stocks, F&O, MF and More"
                value={value}
                onChange={(e) => setValue(e.target.value)}
              />
              {value ? (
                <button type="button" className={styles.clear} onClick={() => setValue("")} aria-label="Clear search">
                  <CloseIcon />
                </button>
              ) : null}
            </div>
          </form>

          {hasResults ? (
            <>
              {query ? (
                <div className={styles.tabs}>
                  <SearchTabs result={result} tab={tab} />
                </div>
              ) : null}
              {heading ? (
                <h1 className={styles.heading}>{heading}</h1>
              ) : (
                <h1 className="visually-hidden">Search results</h1>
              )}
              <SearchResultsView result={result} tab={tab} showCount={Boolean(query)} />
            </>
          ) : (
            <div className={styles.empty}>
              {query ? <NoResults query={query} /> : <h1 className="visually-hidden">Search</h1>}
              <SearchLandingView
                landing={landing}
                recent={[]}
                onPick={go}
                showAllRecent={false}
                onToggleRecent={() => {}}
              />
            </div>
          )}
        </div>
      </section>
    </SbScope>
  );
}
