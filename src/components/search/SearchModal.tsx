"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  getSearchLanding,
  readRecentSearches,
  rememberSearch,
  searchPageHref,
  searchSite,
  type RecentSearch,
  type SearchItem,
  type SearchLanding,
  type SearchResult,
} from "@/services/search/searchService";
import { ArrowLeftIcon, ArrowUpRightIcon, CloseIcon, SearchGlyph } from "./SearchIcons";
import { NoResults, SearchLandingView, SearchResultsView, SearchTabs, type SearchTab } from "./SearchContent";
import styles from "./search-modal.module.scss";

const DEBOUNCE_MS = 150;
const EMPTY_LANDING: SearchLanding = { suggestions: [], latestResearch: [] };

/** What a chosen row is remembered as: an instrument keeps its quote. */
function recentFor(term: string, item?: SearchItem): RecentSearch {
  if (item && (item.type === "stock" || item.type === "mf") && item.price !== undefined) {
    return { label: item.title, price: item.price, pct: item.pct };
  }
  return { label: term };
}

/**
 * Search — Sprint 1 search frames. On desktop and tablet a centred modal
 * (865 / 560 wide) 52px under the header over a 20% scrim; below 768 a full
 * screen with a back arrow. Empty: Think it Search it, Recent Searches (this
 * session), Latest Research. Typing: tabs for the categories found, sections
 * with a → to their tab, and "View all" to the full page. Enter also opens
 * the full page (Figma note).
 */
export default function SearchModal({
  open,
  onClose,
  placeholder,
}: {
  open: boolean;
  onClose: () => void;
  placeholder: string;
}) {
  const router = useRouter();
  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);

  const [query, setQuery] = useState("");
  const [result, setResult] = useState<SearchResult | null>(null);
  const [tab, setTab] = useState<SearchTab>("all");
  const [landing, setLanding] = useState<SearchLanding>(EMPTY_LANDING);
  const [recent, setRecent] = useState<RecentSearch[]>([]);
  const [showAllRecent, setShowAllRecent] = useState(false);
  const [top, setTop] = useState(140);

  useEffect(() => {
    getSearchLanding().then(setLanding);
  }, []);

  // Opening: remember what had focus, sit 52 under the header, lock the page.
  useEffect(() => {
    if (!open) return;
    returnFocus.current = document.activeElement as HTMLElement | null;
    const header = document.querySelector("header");
    const frame = window.requestAnimationFrame(() => {
      setTop((header?.getBoundingClientRect().bottom ?? 88) + 52);
      setRecent(readRecentSearches());
      inputRef.current?.focus();
    });
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      window.cancelAnimationFrame(frame);
      document.body.style.overflow = overflow;
      returnFocus.current?.focus?.();
    };
  }, [open]);

  // Debounced lookup; a stale response never overwrites a newer one.
  useEffect(() => {
    const term = query.trim();
    if (!term) return;
    let cancelled = false;
    const timer = window.setTimeout(() => {
      searchSite(term).then((next) => {
        if (cancelled) return;
        setResult(next);
        setTab("all");
      });
    }, DEBOUNCE_MS);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [query]);

  const close = useCallback(() => {
    setQuery("");
    setResult(null);
    setShowAllRecent(false);
    onClose();
  }, [onClose]);

  const remember = (entry: RecentSearch) => setRecent(rememberSearch(entry));

  const openFullPage = () => {
    const term = query.trim();
    if (!term) return;
    remember({ label: term });
    close();
    router.push(searchPageHref(term, tab === "all" ? undefined : tab));
  };

  const onSelect = (item?: SearchItem) => {
    if (query.trim()) remember(recentFor(query.trim(), item));
    close();
  };

  // Escape closes; Tab stays inside the dialog.
  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") {
      event.preventDefault();
      close();
      return;
    }
    if (event.key !== "Tab" || !panelRef.current) return;
    const focusable = panelRef.current.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
    );
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  if (!open || typeof document === "undefined") return null;

  const term = query.trim();
  // Results belong to the query they were fetched for; until the next lookup
  // lands the previous ones stay up rather than flashing empty.
  const shown = term && result ? result : null;
  const noResults = Boolean(shown && shown.total === 0 && shown.query.trim() === term);

  return createPortal(
    <div className={styles.root} onKeyDown={onKeyDown}>
      <div className={styles.scrim} style={{ top: top - 52 }} onClick={close} aria-hidden="true" />
      <div
        ref={panelRef}
        className={styles.panel}
        style={{ "--search-top": `${top}px` } as React.CSSProperties}
        role="dialog"
        aria-modal="true"
        aria-label="Search"
      >
        <form
          className={styles.bar}
          role="search"
          action="/search"
          onSubmit={(e) => {
            e.preventDefault();
            openFullPage();
          }}
        >
          {/* 360: the back arrow always closes the screen. */}
          <button type="button" className={styles.mobileBack} onClick={close} aria-label="Close search">
            <ArrowLeftIcon size={24} />
          </button>
          <div className={styles.field}>
            {/* Desktop/tablet swap the glyph for a back arrow while typing;
                the 360 field keeps its glyph (its back arrow is on the bar). */}
            {term ? (
              <button
                type="button"
                className={styles.back}
                onClick={() => {
                  setQuery("");
                  inputRef.current?.focus();
                }}
                aria-label="Back to suggestions"
              >
                <ArrowLeftIcon />
              </button>
            ) : null}
            <SearchGlyph className={`${styles.fieldIcon} ${term ? styles.fieldIconTyping : ""}`} />
            <label htmlFor="search-modal-input" className="visually-hidden">
              Search
            </label>
            <input
              id="search-modal-input"
              ref={inputRef}
              name="q"
              type="search"
              autoComplete="off"
              spellCheck={false}
              className={styles.input}
              placeholder={placeholder}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {term ? (
              <button
                type="button"
                className={styles.clear}
                onClick={() => {
                  setQuery("");
                  inputRef.current?.focus();
                }}
                aria-label="Clear search"
              >
                <CloseIcon />
              </button>
            ) : null}
          </div>
          {/* Desktop/tablet: the × closes the modal once there is a query. */}
          <button type="button" className={styles.dismiss} onClick={close} aria-label="Close search">
            <CloseIcon />
          </button>
        </form>

        {shown && !noResults ? (
          <div className={styles.tabsWrap}>
            <SearchTabs result={shown} tab={tab} onTab={setTab} />
          </div>
        ) : null}

        <div className={styles.body}>
          {shown && !noResults ? (
            <SearchResultsView result={shown} tab={tab} onTab={setTab} onSelect={onSelect} />
          ) : (
            <>
              {noResults ? <NoResults query={term} /> : null}
              <SearchLandingView
                landing={landing}
                recent={noResults ? [] : recent}
                onPick={(t) => setQuery(t)}
                onSelect={onSelect}
                showAllRecent={showAllRecent}
                onToggleRecent={() => setShowAllRecent((v) => !v)}
              />
            </>
          )}
        </div>

        {shown && !noResults ? (
          <div className={styles.footer}>
            <Link
              href={searchPageHref(term, tab === "all" ? undefined : tab)}
              className={styles.viewAll}
              onClick={() => {
                remember({ label: term });
                close();
              }}
            >
              View all
              <ArrowUpRightIcon size={20} />
            </Link>
          </div>
        ) : null}

        <p className="visually-hidden" aria-live="polite">
          {shown ? (shown.total ? `${shown.total} results` : "No results") : ""}
        </p>
      </div>
    </div>,
    document.body,
  );
}
