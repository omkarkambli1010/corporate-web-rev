"use client";

import { useEffect, useMemo, useState } from "react";
import Pager from "@/components/ui/Pager";
import PlayPauseButton from "@/components/ui/PlayPauseButton";
import useMediaQuery from "@/utils/useMediaQuery";
import SbButton from "@/components/ui/SbButton";
import RiveAnimation from "@/components/ui/rive/RiveAnimation";
import type { RiveSlides } from "@/components/ui/rive/riveTypes";
import { LIFE_AT_SSL as LIFE_GEOMETRY } from "@/constants/sbi-about";
import type { AboutContent } from "@/types/pages";
import styles from "./life-at-ssl.module.scss";

/**
 * Life at SSL — desktop 4:127383, mobile 1:72674. Photos advance every 60s and
 * on click; "Read more" expands the story and flips to "View less"; "View
 * Openings" goes to the careers page.
 *
 * The photo stack is the Rive slot `lifeAtSsl` (src/config/rive.config.ts):
 * each slide's three photos are bound into the file, which animates to the
 * page's `index`. Until that .riv exists the HTML stack below plays instead.
 */
export default function LifeAtSsl({ life }: { life: AboutContent["life"] }) {
  /* The photos change on their own every 60 seconds by default (Figma
     interaction note); the CMS can set the interval. */
  const { slides } = life;
  const [index, setIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);

  const total = slides.length;
  const go = (delta: number) => setIndex((i) => (i + delta + total) % total);

  /* Auto-advance can be paused (WCAG 2.2.2). It starts paused for visitors who
     ask for reduced motion; after that the button decides. */
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const [userPlaying, setUserPlaying] = useState<boolean | null>(null);
  const playing = userPlaying ?? !reducedMotion;
  const togglePlay = () => setUserPlaying(!playing);

  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(
      () => setIndex((i) => (i + 1) % total),
      life.autoAdvanceMs,
    );
    return () => window.clearInterval(id);
    // Restart the timer whenever the slide is changed by hand.
  }, [index, total, life.autoAdvanceMs, playing]);

  const slide = slides[index];

  const riveSlides = useMemo<RiveSlides>(
    () => ({
      list: "slides",
      viewModel: "LifeSlide",
      items: slides.map((s) => ({
        images: {
          front: s.front.photo,
          left: s.left.photo,
          right: s.right.photo,
        },
      })),
    }),
    [slides],
  );

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <header className={styles.head}>
          <h2 className={styles.title}>{life.title}</h2>
          <p className={styles.subtext}>{life.subtext}</p>
        </header>

        <div className={styles.body}>
          <div key={index} className={styles.story}>
            <h3 className={styles.storyTitle}>{slide.title}</h3>
            <p
              className={`${styles.storyText} ${expanded ? styles.expanded : ""}`}
              id="life-story"
            >
              {slide.body}
            </p>
            <button
              type="button"
              className={styles.more}
              aria-expanded={expanded}
              aria-controls="life-story"
              onClick={() => setExpanded((v) => !v)}
            >
              {expanded ? life.viewLess : life.readMore}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className={styles.caret}
                src="/figma/about/hero/caret-right.svg"
                alt=""
                width={20}
                height={20}
              />
            </button>
            <SbButton href={life.ctaHref} className={styles.cta}>
              {life.ctaLabel}
            </SbButton>
            {/* The 360 frame drops the pager, so pause / play stands alone. */}
            <PlayPauseButton
              playing={playing}
              onToggle={togglePlay}
              label="photo carousel"
              className={styles.mobilePlay}
            />
          </div>

          <div className={styles.gallery}>
            <button
              type="button"
              className={styles.stack}
              onClick={() => go(1)}
              aria-label="Show the next photo"
            >
              <RiveAnimation
                slot="lifeAtSsl"
                values={{ index }}
                slides={riveSlides}
                className={styles.riveStack}
                fallback={
                  <span className={styles.stackInner}>
                    {(["left", "right", "front"] as const).map((role) => {
                      const layer = LIFE_GEOMETRY.layers[role];
                      const { dx, dy } = slide[role];
                      return (
                        <span
                          key={role}
                          className={styles.photo}
                          style={{
                            left: layer.x + dx,
                            top: layer.y + dy,
                            transform: `translate(-50%, -50%) rotate(${layer.rotate}deg)`,
                          }}
                        >
                          {life.photos.map((photo) => (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              key={photo}
                              className={`${styles.img} ${slide[role].photo === photo ? styles.shown : ""}`}
                              src={photo}
                              alt=""
                            />
                          ))}
                        </span>
                      );
                    })}
                  </span>
                }
              />
            </button>
            <div className={styles.pager}>
              <Pager
                index={index}
                total={total}
                onPrev={() => go(-1)}
                onNext={() => go(1)}
                label="photo"
                rules="tablet"
                compact
                playing={playing}
                onTogglePlay={togglePlay}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
