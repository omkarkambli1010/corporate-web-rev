"use client";

import { useEffect, useRef, useState } from "react";
import SegmentedTabs from "@/components/ui/SegmentedTabs";
import {
  PLATFORM,
  PLATFORM_PANEL_TRANSITION,
  PLATFORM_TABS,
} from "@/constants/sbi-home";
import PlayPauseButton from "@/components/ui/PlayPauseButton";
import useMediaQuery from "@/utils/useMediaQuery";
import styles from "./platform.module.scss";

/** Next-gen Investment Platform — desktop 1:59598, mobile 0:55678. */
export default function PlatformSection() {
  const [tab, setTab] = useState<string>(PLATFORM_TABS[0]);
  const [step, setStep] = useState(0);
  /* The steps advance on their own until someone picks or hovers one; the
     pause / play button controls that too (WCAG 2.2.2). Starts paused for
     visitors who ask for reduced motion. */
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const [userPlaying, setUserPlaying] = useState<boolean | null>(null);
  const playing = userPlaying ?? !reducedMotion;

  const steps = PLATFORM.steps[tab] ?? PLATFORM.steps[PLATFORM_TABS[0]];
  const panels = PLATFORM.panels[tab] ?? PLATFORM.panels[PLATFORM_TABS[0]];
  const panel = panels[step] ?? panels[0];
  const fade =
    PLATFORM_PANEL_TRANSITION[tab] ??
    PLATFORM_PANEL_TRANSITION[PLATFORM_TABS[0]];

  /**
   * Smart Animate between two panels that share no matching layers is a
   * cross-fade, so the incoming artwork is stacked over the outgoing one and
   * faded up. Both stay mounted for the length of the transition.
   *
   * A step that reuses the panel already showing adds no layer, so nothing
   * flashes while the per-step artwork is still pending; it starts animating
   * on its own once `PLATFORM.panels` holds three distinct exports.
   */
  const [layers, setLayers] = useState<{ src: string; id: number }[]>(() => [
    { src: panel, id: 0 },
  ]);
  const nextLayerId = useRef(0);

  useEffect(() => {
    setLayers((current) => {
      if (current[current.length - 1].src === panel) return current;
      nextLayerId.current += 1;
      return [...current, { src: panel, id: nextLayerId.current }];
    });
  }, [panel]);

  // Once the fade has run, the covered layers are dead weight.
  useEffect(() => {
    if (layers.length < 2) return;
    const id = window.setTimeout(
      () => setLayers((current) => current.slice(-1)),
      fade.durationMs
    );
    return () => window.clearTimeout(id);
  }, [layers, fade.durationMs]);

  // The steps auto-advance, as the Figma note describes, until someone picks one.
  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(
      () => setStep((current) => (current + 1) % steps.length),
      4000
    );
    return () => window.clearInterval(id);
  }, [playing, steps.length]);

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <header className={styles.head}>
          {/* Title + sutext 0:59051 — the 360 frame sets its own breaks,
              "Next-gen / Investment Platform" over "Trade, invest, and grow —
              all in / one place", rather than wrapping to the 328 column. */}
          <h2 className={styles.title}>
            {PLATFORM.title.split(" ")[0]}{" "}
            <br className={styles.mobileBreak} />
            {PLATFORM.title.split(" ").slice(1).join(" ")}
          </h2>
          <p className={styles.subtext}>
            {PLATFORM.subtext.split(" ").slice(0, 7).join(" ")}{" "}
            <br className={styles.mobileBreak} />
            {PLATFORM.subtext.split(" ").slice(7).join(" ")}
          </p>
        </header>

        <div className={styles.tabs}>
          <SegmentedTabs
            tabs={PLATFORM_TABS}
            active={tab}
            onChange={(next) => {
              setTab(next);
              // Each tab has its own three steps, so start the new one at the top.
              setStep(0);
            }}
            label="Platform surface"
          />
          <PlayPauseButton
            playing={playing}
            onToggle={() => setUserPlaying(!playing)}
            label="platform steps"
            className={styles.play}
          />
        </div>

        <div className={styles.body}>
          <ol className={styles.steps} onMouseEnter={() => setUserPlaying(false)}>
            {steps.map((item, i) => (
              <li key={item.title} className={i === step ? styles.active : ""}>
                <button
                  type="button"
                  onClick={() => {
                    setStep(i);
                    setUserPlaying(false);
                  }}
                  aria-current={i === step}
                >
                  <span className={styles.stepTitle}>{item.title}</span>
                  <span className={styles.stepBody}>{item.body}</span>
                </button>
              </li>
            ))}
          </ol>

          <div
            className={styles.panel}
            style={
              {
                "--panel-fade": `${fade.durationMs}ms`,
                "--panel-ease": fade.easing,
              } as React.CSSProperties
            }
          >
            {layers.map((layer) => (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                key={layer.id}
                className={styles.panelLayer}
                src={layer.src}
                alt=""
                aria-hidden="true"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
