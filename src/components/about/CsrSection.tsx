"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import Pager from "@/components/ui/Pager";
import SectionHead from "@/components/ui/SectionHead";
import RiveAnimation from "@/components/ui/rive/RiveAnimation";
import type { RiveSlides } from "@/components/ui/rive/riveTypes";
import useMediaQuery, { MOBILE_QUERY } from "@/utils/useMediaQuery";
import type { AboutContent } from "@/types/pages";
import styles from "./csr.module.scss";

/**
 * CSR Activities — desktop 4:127367, mobile 1:72673. A carousel with the active
 * card large between its neighbours; it moves on horizontal scroll, on the
 * arrows, or on clicking a neighbour (the Figma interaction note).
 *
 * The image stage is the Rive slot `csrCarousel` (src/config/rive.config.ts):
 * the CMS photos and names are bound into the file, which animates to the
 * page's `index`. Until that .riv exists the HTML stage below plays instead.
 * The description, pager and arrows are HTML either way.
 */
export default function CsrSection({ csr }: { csr: AboutContent["csr"] }) {
  const CSR_ACTIVITIES = csr.items;
  const [active, setActive] = useState(0);
  const [dir, setDir] = useState<1 | -1>(1);
  const wheelLock = useRef(false);
  const total = CSR_ACTIVITIES.length;
  const isMobile = useMediaQuery(MOBILE_QUERY);
  const isTablet = useMediaQuery("(min-width: 768px) and (max-width: 1023px)");
  const [riveActive, setRiveActive] = useState(false);
  const onRiveActive = useCallback((on: boolean) => setRiveActive(on), []);

  /* The photo is an activity's top layer; the shared backdrop layers under it
     are drawn by the Rive file itself. */
  const riveSlides = useMemo<RiveSlides>(
    () => ({
      list: "slides",
      viewModel: "CsrSlide",
      items: CSR_ACTIVITIES.map((item) => ({
        images: { image: item.layers[item.layers.length - 1] },
        strings: { title: item.title },
      })),
    }),
    [CSR_ACTIVITIES],
  );

  const go = (delta: number) => {
    setDir(delta > 0 ? 1 : -1);
    setActive((i) => (((i + delta) % total) + total) % total);
  };

  const onWheel = (e: React.WheelEvent) => {
    if (Math.abs(e.deltaX) <= Math.abs(e.deltaY) || Math.abs(e.deltaX) < 20)
      return;
    if (wheelLock.current) return;
    wheelLock.current = true;
    go(e.deltaX > 0 ? 1 : -1);
    window.setTimeout(() => {
      wheelLock.current = false;
    }, 500);
  };

  const at = (delta: number) => (((active + delta) % total) + total) % total;

  /* Desktop shows prev / active / next; the 768 frame adds a further card
     either side, cut by the screen edge, so those two are hidden elsewhere. */
  const slots = [
    { index: at(-2), role: "farPrev" as const, delta: -2 },
    { index: at(-1), role: "prev" as const, delta: -1 },
    { index: active, role: "active" as const, delta: 0 },
    { index: at(1), role: "next" as const, delta: 1 },
    { index: at(2), role: "farNext" as const, delta: 2 },
  ];

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <SectionHead title={csr.title} align="center" mobileStart size="h2" />

        <div className={styles.stageWrap} onWheel={onWheel}>
          <RiveAnimation
            slot="csrCarousel"
            artboard={isMobile ? "Mobile" : isTablet ? "Tablet" : "Desktop"}
            values={{ index: active, direction: dir }}
            slides={riveSlides}
            triggers={{ prev: () => go(-1), next: () => go(1) }}
            label={CSR_ACTIVITIES[active]?.title}
            className={styles.riveStage}
            onActiveChange={onRiveActive}
            fallback={
              <div key={active} className={styles.stage} data-dir={dir}>
                {slots.map(({ index, role, delta }) => {
                  const item = CSR_ACTIVITIES[index];
                  const isActive = role === "active";
                  const Tag = isActive ? "div" : "button";
                  return (
                    <Tag
                      key={role}
                      className={`${styles.card} ${styles[role]} ${delta === -2 || delta === 2 ? styles.far : ""}`}
                      {...(isActive
                        ? {}
                        : {
                            type: "button" as const,
                            onClick: () => go(delta),
                            "aria-label": `Show ${item.title}`,
                          })}
                    >
                      <span className={styles.media}>
                        {item.layers.map((layer) => (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img key={layer} src={layer} alt="" />
                        ))}
                        <span className={styles.shade} aria-hidden="true">
                          <span className={styles.shadeBand} />
                        </span>
                        <span className={styles.name}>{item.title}</span>
                      </span>
                      {isActive && item.text ? (
                        <span className={styles.text}>{item.text}</span>
                      ) : null}
                    </Tag>
                  );
                })}
              </div>
            }
          />
          {riveActive && CSR_ACTIVITIES[active]?.text ? (
            <p
              key={active}
              className={`${styles.text} ${styles.riveText}`}
              aria-live="polite"
            >
              {CSR_ACTIVITIES[active].text}
            </p>
          ) : null}
        </div>

        <div className={`${styles.pager} ${styles.pagerDesktop}`}>
          <Pager
            index={active}
            total={total}
            onPrev={() => go(-1)}
            onNext={() => go(1)}
            label="activity"
            rules
            compact
          />
        </div>
        <div className={`${styles.pager} ${styles.pagerMobile}`}>
          <Pager
            index={active}
            total={total}
            onPrev={() => go(-1)}
            onNext={() => go(1)}
            label="activity"
            rules
            align="end"
          />
        </div>
      </div>
    </section>
  );
}
