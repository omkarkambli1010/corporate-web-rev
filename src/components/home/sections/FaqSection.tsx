"use client";

import { useState } from "react";
import SbButton from "@/components/ui/SbButton";
import { FAQS } from "@/constants/sbi-home";
import type { FaqContent } from "@/types/pages";
import RiveAnimation from "@/components/ui/rive/RiveAnimation";
import SectionTitle from "@/components/ui/SectionTitle";
import styles from "./faq.module.scss";

/** What the section prints when no content is passed — the built-in copy. */
const DEFAULT_CONTENT: FaqContent = {
  title: "Frequently Asked Questions",
  ctaLabel: "View All FAQs",
  ctaHref: "#faqs",
  items: FAQS.map((f) => ({ question: f.question, answer: f.answer })),
};

/**
 * Frequently Asked Questions — desktop 1:60054, mobile 0:54418. The heading,
 * button and questions come from `content` (the CMS, on pages that read it).
 */
export default function FaqSection({ content = DEFAULT_CONTENT }: { content?: FaqContent }) {
  const [open, setOpen] = useState(0);

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.aside}>
          <SectionTitle className={styles.title}>
            {content.title.split(" ").slice(0, 2).join(" ")}{" "}
            <br />
            {content.title.split(" ").slice(2).join(" ")}
          </SectionTitle>
          <SbButton href={content.ctaHref} className={styles.cta}>
            {content.ctaLabel}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/figma/faq/arrow-right.svg" alt="" width={16} height={16} />
          </SbButton>
        </div>

        <ul className={styles.list}>
          {content.items.map((faq, i) => (
            <li
              key={faq.question}
              className={`${styles.row} ${open === i ? styles.open : ""}`}
            >
              <h3>
                <button
                  type="button"
                  className={styles.question}
                  aria-expanded={open === i}
                  aria-controls={`faq-answer-${i}`}
                  onClick={() => setOpen(open === i ? -1 : i)}
                >
                  {faq.question}
                  {/* Rive slot `faqToggle`, driven by `open`; the plus/minus SVGs until supplied. */}
                  <RiveAnimation
                    slot="faqToggle"
                    values={{ open: open === i }}
                    className={styles.sign}
                    fallback={
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        className={styles.sign}
                        src={open === i ? "/figma/faq/minus.svg" : "/figma/faq/plus.svg"}
                        alt=""
                        width={24}
                        height={24}
                      />
                    }
                  />
                </button>
              </h3>
              <div id={`faq-answer-${i}`} className={styles.answer} hidden={open !== i}>
                <p className={styles.answerText}>{faq.answer}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
