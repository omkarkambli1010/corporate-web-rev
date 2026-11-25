"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/ui/SbIcons";
import SectionHead from "@/components/ui/SectionHead";
import SegmentedTabs from "@/components/ui/SegmentedTabs";
import { RESEARCH, RESEARCH_TABS } from "@/constants/sbi-home";
import type { ResearchContent } from "@/types/pages";
import { scrollRail } from "@/utils/scrollRail.utils";
import useCarouselAutoplay from "@/utils/useCarouselAutoplay";
import PlayPauseButton from "@/components/ui/PlayPauseButton";
import styles from "./research.module.scss";

function pad(n: number) {
  return String(n).padStart(2, "0");
}

/** What the section prints when no content is passed — the built-in copy. */
const DEFAULT_CONTENT: ResearchContent = {
  title: "Analysis you can trust",
  tabs: RESEARCH_TABS.map((label) => ({
    label,
    reports: RESEARCH.map((r, i) => ({ ...r, cover: `/figma/research/report-${i + 1}.png` })),
  })),
};

/**
 * Analysis you can trust — desktop 1:59599, mobile 0:47880. The heading, tabs
 * and reports come from `content` (the CMS, on pages that read it). A tab with
 * no reports of its own shows the first tab's, as the design's placeholder does.
 */
export default function ResearchSection({ content = DEFAULT_CONTENT }: { content?: ResearchContent }) {
  const tabLabels = content.tabs.map((t) => t.label);
  const [tab, setTab] = useState<string>(tabLabels[0] ?? "");
  const activeTab = content.tabs.find((t) => t.label === tab);
  const reports = activeTab && activeTab.reports.length > 0 ? activeTab.reports : (content.tabs[0]?.reports ?? [])

  /**
   * Research cards 0:59780 — mobile lays the cards out as an 806-wide rail
   * rather than a grid, with a pagination row under it. Rail mode is read off
   * the element (it is the one that overflows) rather than duplicating the
   * breakpoint in JS, exactly as the testimonials rail does.
   */
  const railRef = useRef<HTMLUListElement>(null);
  const [isRail, setIsRail] = useState(false);
  const [railIndex, setRailIndex] = useState(0);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    const measure = () => setIsRail(rail.scrollWidth > rail.clientWidth + 1);
    const onScroll = () => {
      const card = rail.firstElementChild as HTMLElement | null;
      if (!card) return;
      setRailIndex(Math.round(rail.scrollLeft / (card.clientWidth + 16)));
    };

    measure();
    rail.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      rail.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
    };
  }, []);

  const page = (delta: -1 | 1) => scrollRail(railRef.current, delta, 258);

  // The rail only exists on mobile; on desktop the grid has nothing to move.
  const autoplay = useCarouselAutoplay({
    advance: () => page(1),
    enabled: isRail,
    resetKey: railIndex,
    hoverTarget: railRef,
  });

  return (
    <section className={styles.section} id="research">
      <div className={styles.inner}>
        <SectionHead
          title={content.title}
          href="#research-reports"
          hrefLabel="All research reports"
          titleBreakAfter={2}
        />

        <div className={styles.tabs}>
          <SegmentedTabs
            tabs={tabLabels}
            active={tab}
            onChange={setTab}
            label="Research type"
          />
        </div>

        <ul className={styles.grid} ref={railRef}>
          {reports.map((report, i) => (
            <li key={`${report.title}-${i}`} className={styles.card}>
              {/* The report kind is set inside the artwork, so it is repeated
                  here for assistive tech rather than drawn twice. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className={styles.cover}
                src={report.cover}
                alt=""
                aria-hidden="true"
              />
              <h3 className={styles.title}>
                <span className="sr-only">{report.kind}: </span>
                {report.title}
              </h3>
              <p className={styles.date}>{report.date}</p>
            </li>
          ))}
        </ul>

        {/* Pagination 0:66038 — mobile only: one dotted rule, then the arrows
            and the page pill hard against the right edge. */}
        <div className={styles.footer} aria-hidden={!isRail}>
          <span className={styles.rule} aria-hidden="true" />
          <div className={styles.controls}>
            <button
              type="button"
              className={styles.pageArrow}
              onClick={() => page(-1)}
              aria-label="Previous reports"
            >
              <ChevronLeftIcon />
            </button>
            <p className={styles.pill} aria-live={autoplay.playing ? "off" : "polite"}>
              <span className={styles.current}>{pad(railIndex + 1)}</span>
              <span className={styles.total}>/{pad(reports.length)}</span>
            </p>
            <button
              type="button"
              className={styles.pageArrow}
              onClick={() => page(1)}
              aria-label="Next reports"
            >
              <ChevronRightIcon />
            </button>
            {isRail ? (
              <PlayPauseButton
                playing={autoplay.playing}
                onToggle={autoplay.toggle}
                label="reports carousel"
                mobileSize={32}
              />
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
