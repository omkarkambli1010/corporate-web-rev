"use client";

import { useMemo, useState } from "react";
import Breadcrumbs, { type BreadcrumbItem } from "@/components/ui/Breadcrumbs";
import SegmentedTabs from "@/components/ui/SegmentedTabs";
import useMediaQuery, { MOBILE_QUERY } from "@/utils/useMediaQuery";
import {
  SECTOR_EXCHANGES,
  SECTOR_TABS,
  type Sector,
  type SectorExchange,
  type SectorTab,
  type SectorView,
} from "@/constants/sbi-sector";
import type { SectorContent } from "@/types/pages";
import SectionTitle from "@/components/ui/SectionTitle";
import styles from "./sector.module.scss";

type Snapshot = SectorContent["snapshot"];

const signed = (n: number) => `${n > 0 ? "+" : ""}${n.toFixed(2)}%`;
const tone = (n: number) => (n >= 0 ? styles.up : styles.down);

/** Green/red split bar over the advancing and declining counts. */
function AdvDec({ sector }: { sector: Sector }) {
  return (
    <span className={styles.advDec}>
      <span className={styles.bar} aria-hidden="true">
        <span className={styles.barUp} style={{ flexGrow: sector.advancing }} />
        <span className={styles.barDown} style={{ flexGrow: sector.declining }} />
      </span>
      <span className={styles.counts}>
        <span className={styles.up}>{sector.advancing}</span>
        <span className={styles.down}>{sector.declining}</span>
      </span>
    </span>
  );
}

function SectorTable({ rows, tab, labels }: { rows: readonly Sector[]; tab: SectorTab; labels: Snapshot }) {
  const c = labels.columns;
  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <caption className="visually-hidden">
          {labels.title}: {tab}
        </caption>
        <thead>
          <tr>
            <th scope="col" className={styles.name}>{c.name}</th>
            {tab === "Performance" ? <th scope="col">{c.dayChange}</th> : null}
            <th scope="col">{c.stocks}</th>
            {tab === "Overview" ? (
              <>
                <th scope="col">{c.advDec}</th>
                <th scope="col">{c.ratio}</th>
              </>
            ) : null}
            <th scope="col">{c.capPct}</th>
            <th scope="col">{c.cap}</th>
            <th scope="col">{c.pe}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((sector) => (
            <tr key={sector.name}>
              <th scope="row" className={styles.name}>{sector.name}</th>
              {tab === "Performance" ? (
                <td className={tone(sector.dayChange)}>{signed(sector.dayChange)}</td>
              ) : null}
              <td>{sector.stocks}</td>
              {tab === "Overview" ? (
                <>
                  <td><AdvDec sector={sector} /></td>
                  <td className={styles.up}>{sector.advDecRatio.toFixed(2)}</td>
                </>
              ) : null}
              <td>{sector.marketCapPct}%</td>
              <td>{sector.marketCap}</td>
              <td>{sector.pe.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** A label whose line breaks (typed with Enter in the CMS) are the design's. */
function Lines({ text }: { text: string }) {
  const parts = text.split("\n");
  return (
    <>
      {parts.map((part, i) => (
        <span key={i}>
          {i > 0 ? <br /> : null}
          {part}
        </span>
      ))}
    </>
  );
}

/** Fundamentals card 1:253341 — name, Advance/Decline split, then four figures. */
function SectorCards({ rows, tab, labels }: { rows: readonly Sector[]; tab: SectorTab; labels: Snapshot }) {
  const k = labels.card;
  return (
    <ul className={styles.cards}>
      {rows.map((sector) => (
        <li key={sector.name} className={styles.sectorCard}>
          <h2 className={styles.cardTitle}>{sector.name}</h2>
          {tab === "Performance" ? (
            <p className={styles.dayChange}>
              <span>{k.dayChange}</span>
              <strong className={tone(sector.dayChange)}>{signed(sector.dayChange)}</strong>
            </p>
          ) : null}
          <div className={styles.cardBar}>
            <p className={styles.cardCounts}>
              <span className={styles.badgeUp}>{k.advance}</span>
              <span className={styles.badgeDown}>{k.decline}</span>
            </p>
            <span className={styles.cardLine} aria-hidden="true">
              <span className={styles.barUp} style={{ flexGrow: sector.advancing }} />
              <span className={styles.barDown} style={{ flexGrow: sector.declining }} />
            </span>
            <p className={styles.cardRatio}>
              <span className={styles.up}>{sector.advancing}</span>
              <span>
                {k.ratio} <span className={styles.up}>{sector.advDecRatio}</span>
              </span>
              <span className={styles.down}>{sector.declining}</span>
            </p>
          </div>
          <dl className={styles.facts}>
            <div><dt><Lines text={k.stocks} /></dt><dd>{sector.stocks}</dd></div>
            <div><dt><Lines text={k.capPct} /></dt><dd>{sector.marketCapPct}</dd></div>
            <div><dt><Lines text={k.cap} /></dt><dd>{sector.marketCap}</dd></div>
            <div><dt><Lines text={k.pe} /></dt><dd>{sector.pe}</dd></div>
          </dl>
        </li>
      ))}
    </ul>
  );
}

/** Heatmap — tile tone follows the day change; a placeholder until the feed lands. */
function SectorHeatmap({ rows }: { rows: readonly Sector[] }) {
  return (
    <ul className={styles.heatmap}>
      {rows.map((sector) => {
        const strength = Math.min(Math.abs(sector.dayChange) / 2.5, 1);
        const base = sector.dayChange >= 0 ? "40, 168, 114" : "233, 93, 93";
        return (
          <li
            key={sector.name}
            className={styles.tile}
            style={{ background: `rgba(${base}, ${0.18 + strength * 0.72})` }}
          >
            <span className={styles.tileName}>{sector.name}</span>
            <span className={styles.tileValue}>{signed(sector.dayChange)}</span>
          </li>
        );
      })}
    </ul>
  );
}

/**
 * Pagination 1:253339 — ‹ 1 2 … 9 ›: the first and last page, the current
 * page with one either side, and an ellipsis over any run that is skipped.
 */
function pageWindow(page: number, pages: number): (number | null)[] {
  const keep = new Set([1, pages, page - 1, page, page + 1].filter((n) => n >= 1 && n <= pages));
  const out: (number | null)[] = [];
  let last = 0;
  for (const n of [...keep].sort((a, b) => a - b)) {
    if (n - last === 2) out.push(last + 1);
    else if (n - last > 2) out.push(null);
    out.push(n);
    last = n;
  }
  return out;
}

function Pagination({
  page,
  pages,
  label,
  onChange,
}: {
  page: number;
  pages: number;
  label: string;
  onChange: (page: number) => void;
}) {
  if (pages <= 1) return null;
  const caret = (dir: "prev" | "next") => (
    <button
      type="button"
      className={`${styles.pageButton} ${styles.pageCaret} ${dir === "prev" ? styles.pagePrev : ""}`}
      aria-label={dir === "prev" ? "Previous page" : "Next page"}
      disabled={dir === "prev" ? page === 1 : page === pages}
      onClick={() => onChange(dir === "prev" ? page - 1 : page + 1)}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/figma/about/hero/caret-right.svg" alt="" width={16} height={16} />
    </button>
  );
  return (
    <nav className={styles.pagination} aria-label={label}>
      {caret("prev")}
      {pageWindow(page, pages).map((n, i) =>
        n === null ? (
          <span key={`gap-${i}`} className={`${styles.pageButton} ${styles.pageGap}`} aria-hidden="true">
            ...
          </span>
        ) : (
          <button
            key={n}
            type="button"
            className={`${styles.pageButton} ${n === page ? styles.pageActive : ""}`}
            aria-current={n === page ? "page" : undefined}
            onClick={() => onChange(n)}
          >
            {n}
          </button>
        ),
      )}
      {caret("next")}
    </nav>
  );
}

export default function SectorSnapshot({
  breadcrumbs,
  content,
}: {
  breadcrumbs: readonly BreadcrumbItem[];
  content: SectorContent;
}) {
  const snap = content.snapshot;
  const SECTORS = content.sectors;
  const VIEW_LABELS: Record<SectorView, string> = {
    table: snap.viewLabels.table,
    card: snap.viewLabels.card,
    heatmap: snap.viewLabels.heatmap,
  };
  const TAB_LABEL: Record<SectorTab, string> = {
    Overview: snap.tabs.overview,
    Performance: snap.tabs.performance,
  };
  const EXCHANGE_LABEL: Record<SectorExchange, string> = {
    All: snap.exchanges.all,
    NSE: snap.exchanges.nse,
    BSE: snap.exchanges.bse,
  };
  const [view, setView] = useState<SectorView>("table");
  const [tab, setTab] = useState<SectorTab>("Overview");
  const [exchange, setExchange] = useState<SectorExchange>("All");
  const [page, setPage] = useState(1);

  const filtered = useMemo(
    () =>
      SECTORS.filter((s) => exchange === "All" || s.exchanges.includes(exchange)),
    [SECTORS, exchange],
  );

  // The table pages 12 at a time and the cards six; heatmap shows everything.
  /* The mobile frame lists six cards a page in every view (Table 1:253339). */
  const isMobile = useMediaQuery(MOBILE_QUERY);
  const pageSize = view === "card" || isMobile ? snap.cardPageSize : snap.tablePageSize;
  const pages = view === "heatmap" ? 1 : Math.max(1, Math.ceil(filtered.length / pageSize));
  const current = Math.min(page, pages);
  const rows = view === "heatmap" ? filtered : filtered.slice((current - 1) * pageSize, current * pageSize);

  const reset = <T,>(set: (v: T) => void) => (value: T) => {
    set(value);
    setPage(1);
  };

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <Breadcrumbs items={breadcrumbs} />

        <header className={styles.header}>
          <SectionTitle as="h1" size="page" className={styles.title}>{snap.title}</SectionTitle>
          <div className={styles.views} role="group" aria-label="View">
            {SECTOR_VIEWS_UI.map((v) => (
              <button
                key={v}
                type="button"
                className={`${styles.viewButton} ${styles[`view_${v}`]} ${
                  view === v ? styles.viewActive : ""
                } ${v === "card" && view === "table" ? styles.viewActiveMobile : ""}`}
                aria-pressed={view === v}
                aria-label={VIEW_LABELS[v]}
                onClick={() => reset(setView)(v)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/figma/sector/view-${v}.svg`} alt="" width={20} height={20} />
              </button>
            ))}
          </div>
        </header>

        <div className={styles.controls}>
          {view !== "heatmap" ? (
            <SegmentedTabs
              tabs={SECTOR_TABS.map((t) => TAB_LABEL[t])}
              active={TAB_LABEL[tab]}
              onChange={(label) => reset(setTab)(SECTOR_TABS.find((t) => TAB_LABEL[t] === label) ?? tab)}
              label="Sector data"
              tone="onWhite"
            />
          ) : (
            <span />
          )}
          <div className={styles.tags} role="group" aria-label="Exchange">
            {SECTOR_EXCHANGES.map((ex) => (
              <button
                key={ex}
                type="button"
                className={`${styles.tag} ${exchange === ex ? styles.tagActive : ""}`}
                aria-pressed={exchange === ex}
                onClick={() => reset(setExchange)(ex)}
              >
                {EXCHANGE_LABEL[ex]}
              </button>
            ))}
          </div>
        </div>

        {view === "table" ? (
          <>
            <div className={styles.desktopOnly}>
              <SectorTable rows={rows} tab={tab} labels={snap} />
            </div>
            <div className={styles.mobileOnly}>
              <SectorCards rows={rows} tab={tab} labels={snap} />
            </div>
          </>
        ) : null}
        {view === "card" ? <SectorCards rows={rows} tab={tab} labels={snap} /> : null}
        {view === "heatmap" ? <SectorHeatmap rows={rows} /> : null}

        <Pagination page={current} pages={pages} label={snap.paginationLabel} onChange={setPage} />
      </div>
    </section>
  );
}

/** The three view toggles; the table toggle is dropped on mobile via CSS. */
const SECTOR_VIEWS_UI: readonly SectorView[] = ["table", "card", "heatmap"];
