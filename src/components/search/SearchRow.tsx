import Link from "next/link";
import { resultHref, type SearchItem } from "@/services/search/searchService";
import { ArrowDownRightIcon, ArrowUpRightIcon, TypeIcon } from "./SearchIcons";
import styles from "./search-rows.module.scss";

const money = new Intl.NumberFormat("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const whole = new Intl.NumberFormat("en-IN");
const signedNum = (n: number) => `${n > 0 ? "+" : ""}${money.format(n)}`;
const pctText = (n: number) => `${Math.abs(n).toFixed(2)}%`;

/* Buy / Sell on hover — switched off for now; restore with the block in
   SearchRow below and the .trade rules in search-rows.module.scss.
   Where Buy / Sell go: the login flow (Figma note on the result rows).
const TRADE_HREF = "/sso-realty";
*/

function Badge({ text }: { text: string }) {
  const tone =
    text === "MF" ? styles.badgeGreen : text === "ETF" ? styles.badgeNeutral : styles.badgeLilac;
  return <span className={`${styles.badge} ${tone}`}>{text}</span>;
}

/** Price, change · percentage and the direction arrow (PriceChange). */
export function PriceBlock({ item }: { item: SearchItem }) {
  if (item.price === undefined || item.change === undefined || item.pct === undefined) return null;
  const up = item.change >= 0;
  return (
    <span className={styles.priceBlock}>
      <span className={styles.price}>{money.format(item.price)}</span>
      <span className={`${styles.change} ${up ? styles.up : styles.down}`}>
        <span>{signedNum(item.change)}</span>
        <span className={styles.dot} aria-hidden="true">
          ·
        </span>
        <span className={styles.pct}>{pctText(item.pct)}</span>
        {up ? <ArrowUpRightIcon size={20} /> : <ArrowDownRightIcon size={20} />}
      </span>
    </span>
  );
}

function Logo({ type }: { type: string }) {
  return (
    <span className={styles.logo} aria-hidden="true">
      <TypeIcon type={type} />
    </span>
  );
}

function NewsRow({ item }: { item: SearchItem }) {
  const up = (item.pct ?? 0) >= 0;
  return (
    <>
      {item.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img className={styles.thumb} src={item.image} alt="" width={48} height={48} loading="lazy" />
      ) : null}
      <span className={styles.newsText}>
        <span className={styles.newsTop}>
          <span className={`${styles.title} ${styles.clamp}`}>{item.title}</span>
          <span className={styles.time}>{item.time}</span>
        </span>
        <span className={styles.newsMeta}>
          <span className={styles.symbol}>{item.symbol}</span>
          {item.pct !== undefined ? (
            <span className={`${styles.pill} ${up ? styles.pillUp : styles.pillDown}`}>
              {up ? "+" : "−"}
              {pctText(item.pct)}
              {up ? <ArrowUpRightIcon size={16} /> : <ArrowDownRightIcon size={16} />}
            </span>
          ) : null}
        </span>
      </span>
    </>
  );
}

function ResearchText({ item }: { item: SearchItem }) {
  const profitUp = (item.expectedProfit ?? 0) >= 0;
  return (
    <span className={styles.text}>
      <span className={styles.line}>
        <span className={styles.title}>{item.title}</span>
        {item.badge ? <Badge text={item.badge} /> : null}
        <span className={styles.time}>{item.time}</span>
      </span>
      <span className={`${styles.line} ${styles.researchFigures}`}>
        <span className={styles.subtitle}>
          Expected Profit:{" "}
          <span className={profitUp ? styles.up : styles.down}>{Math.abs(item.expectedProfit ?? 0).toFixed(2)}%</span>
        </span>
        <span className={styles.subtitle}>
          Target Margin: <span className={styles.up}>₹ {whole.format(item.targetMargin ?? 0)}</span>
        </span>
      </span>
    </span>
  );
}

function ReportText({ item }: { item: SearchItem }) {
  return (
    <span className={styles.text}>
      <span className={styles.title}>{item.title}</span>
      <span className={styles.reportMeta}>
        <span>{item.subtitle}</span>
        <span aria-hidden="true">|</span>
        <span>{item.date}</span>
      </span>
    </span>
  );
}

function DefaultText({ item }: { item: SearchItem }) {
  return (
    <span className={styles.text}>
      <span className={styles.line}>
        <span className={`${styles.title} ${styles.ellipsis}`}>{item.title}</span>
        {item.badge ? <Badge text={item.badge} /> : null}
      </span>
      {item.subtitle ? <span className={styles.subtitle}>{item.subtitle}</span> : null}
    </span>
  );
}

/**
 * One result row — Figma "Search Rows": a 36px round logo, title (with its
 * badge), subtitle, and the price block on the right; news rows carry a
 * thumbnail instead. (Buy / Sell on hover is commented out for now.)
 */
export default function SearchRow({ item, onSelect }: { item: SearchItem; onSelect?: (item: SearchItem) => void }) {
  // const tradable = item.type === "stock" || item.type === "option";
  return (
    <li className={styles.row}>
      <Link href={resultHref(item)} className={styles.link} onClick={() => onSelect?.(item)}>
        {item.type === "news" ? (
          <NewsRow item={item} />
        ) : (
          <>
            <Logo type={item.type} />
            {item.type === "research" ? (
              <ResearchText item={item} />
            ) : item.type === "report" ? (
              <ReportText item={item} />
            ) : (
              <DefaultText item={item} />
            )}
            <PriceBlock item={item} />
          </>
        )}
      </Link>
      {/* Buy / Sell on hover — switched off for now.
      {tradable ? (
        <span className={styles.trade}>
          <Link href={TRADE_HREF} className={`${styles.tradeButton} ${styles.buy}`} aria-label={`Buy ${item.title}`}>
            B
          </Link>
          <Link href={TRADE_HREF} className={`${styles.tradeButton} ${styles.sell}`} aria-label={`Sell ${item.title}`}>
            S
          </Link>
        </span>
      ) : null}
      */}
    </li>
  );
}
