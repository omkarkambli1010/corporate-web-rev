"use client";

import Image from "next/image";
import { useState } from "react";
import CardRail from "@/components/ui/CardRail";
import SectionHead from "@/components/ui/SectionHead";
import SegmentedTabs from "@/components/ui/SegmentedTabs";
import VideoModal from "@/components/ui/VideoModal";
import { LEARN_TABS, LESSONS, type Lesson } from "@/constants/sbi-home";
import { parseVideoSource, type VideoSource } from "@/utils/videoSource";
import styles from "./learn.module.scss";

type PlayableSource = Exclude<VideoSource, { kind: "link" }>;

/**
 * A lesson's picture with its Play button and runtime. Both are drawn from the
 * lesson's data, so thumbnails should be uploaded without them. The four
 * bundled pictures still have them painted in; these sit exactly on top.
 */
function LessonThumb({
  lesson,
  image,
  onPlay,
}: {
  lesson: Lesson;
  image: string;
  onPlay: (source: PlayableSource) => void;
}) {
  const source = parseVideoSource(lesson.videoUrl);
  /* The runtime is visible on the button, so its name carries it too. */
  const runtime = lesson.duration ? `, ${lesson.duration}` : "";

  const art = (
    <>
      <Image src={image} alt="" width={620} height={348} sizes="(max-width: 767px) 80vw, 310px" />
      {source ? (
        <span className={styles.playCircle} data-testid="play-circle" aria-hidden="true">
          <svg viewBox="0 0 24 24" focusable="false">
            <path d="M8 5.2v13.6a1 1 0 001.5.86l11-6.8a1 1 0 000-1.72l-11-6.8A1 1 0 008 5.2z" fill="currentColor" />
          </svg>
        </span>
      ) : null}
      {lesson.duration ? (
        <span className={styles.duration} data-testid="lesson-duration" aria-hidden="true">
          {lesson.duration}
        </span>
      ) : null}
    </>
  );

  if (!source) return <div className={styles.thumb}>{art}</div>;

  if (source.kind === "link") {
    return (
      <a
        className={styles.thumb}
        href={source.href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Play video: ${lesson.title}${runtime} (opens in a new tab)`}
      >
        {art}
      </a>
    );
  }

  return (
    <button
      type="button"
      className={styles.thumb}
      aria-label={`Play video: ${lesson.title}${runtime}`}
      aria-haspopup="dialog"
      onClick={() => onPlay(source)}
    >
      {art}
    </button>
  );
}

/**
 * Learn before you invest — desktop 1:59642, mobile Learn & Educate 0:66064.
 *
 * The Figma note sets out the interaction: the top arrow goes to the listing
 * for the chosen tab, a card goes to its detail page, the tabs change as the
 * rail scrolls, and the arrows page that rail.
 */
export default function LearnSection() {
  const [tab, setTab] = useState<string>(LEARN_TABS[0]);
  const [playing, setPlaying] = useState<{ lesson: Lesson; source: PlayableSource } | null>(null);

  /**
   * "The tabs changes on scroll" — the rail reports the card in view and the
   * tabs follow. There are more lessons than tabs, so the card index is mapped
   * across the tab list rather than paired one to one.
   */
  const tabForPage = (page: number) => {
    const spread = (page - 1) / Math.max(1, LESSONS.length - 1);
    return LEARN_TABS[Math.round(spread * (LEARN_TABS.length - 1))];
  };

  const tabSlug = tab.toLowerCase().replace(/\s+/g, "-");

  return (
    <section className={styles.section} id="investor-awareness">
      <div className={styles.inner}>
        {/* The arrow leads to the listing for whichever tab is chosen. */}
        <SectionHead
          title="Learn before you invest"
          href={`#learn-${tabSlug}`}
          hrefLabel={`All lessons for ${tab}`}
          titleBreakAfter={2}
        />

        <div className={styles.tabs}>
          <SegmentedTabs
            tabs={LEARN_TABS}
            active={tab}
            onChange={setTab}
            label="Audience"
            width={543}
          />
        </div>

        <CardRail
          count={LESSONS.length}
          label="Lessons"
          showProgress
          onPageChange={(page) => setTab(tabForPage(page))}
        >
          {LESSONS.map((lesson, i) => (
            <article className={styles.card} key={`${lesson.title}-${i}`}>
              <LessonThumb
                lesson={lesson}
                image={`/figma/learn/lesson-${(i % 4) + 1}.png`}
                onPlay={(source) => setPlaying({ lesson, source })}
              />
              <a href={`#lesson-${i + 1}`} className={styles.link}>
                <h3>{lesson.title}</h3>
                {/* Frame 6 0:66075 — the 360 card carries the date; the 1440
                    card is title only, so it is hidden above the breakpoint. */}
                <p className={styles.date}>{lesson.date}</p>
                <span className="sr-only">Duration {lesson.duration}</span>
              </a>
            </article>
          ))}
        </CardRail>

        {playing ? (
          <VideoModal
            title={playing.lesson.title}
            captionsUrl={playing.lesson.captionsUrl}
            transcriptUrl={playing.lesson.transcriptUrl}
            source={playing.source}
            onClose={() => setPlaying(null)}
          />
        ) : null}
      </div>
    </section>
  );
}
