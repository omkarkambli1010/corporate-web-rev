"use client";

import Image from "next/image";
import { type ChangeEvent } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import SbButton from "@/components/ui/SbButton";
import { HERO } from "@/constants/sbi-home";
import {
  normalizeFullNameInput,
  normalizeMobileNumberInput,
} from "@/utils/dematFormInput.utils";
import { useDematLeadSubmit } from "@/utils/useDematLeadSubmit";
import useMediaQuery, { MOBILE_QUERY } from "@/utils/useMediaQuery";
import {
  dematAccountFormSchema,
  type DematAccountFormValues,
} from "@/validations/forms/dematAccountForm.schema";
import styles from "./hero.module.scss";

/* Selection-List 0:43037 draws the consent box already ticked, so a cleared
   form goes back to that rather than to an empty one. */
const HERO_FORM_DEFAULTS: DematAccountFormValues = {
  fullName: "",
  mobileNumber: "",
  consent: true,
};

/** Hero Section Main — desktop 1:60070, mobile Hero 3 0:33295 + Hero 2 0:39885. */
export default function HeroSection() {
  /* Hero 2 relabels both fields and rewrites both placeholders; the labels
     swap in CSS, but a placeholder is an attribute, so it swaps here. */
  const isMobile = useMediaQuery(MOBILE_QUERY);
  const form = isMobile ? { ...HERO.form, ...HERO.formMobile } : HERO.form;

  /* The same schema and the same journey the /open-account form runs, so a
     lead started from the hero reaches the DIY flow on identical terms. */
  const {
    register,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    formState: { errors, isSubmitting, isValid },
  } = useForm<DematAccountFormValues>({
    resolver: zodResolver(dematAccountFormSchema),
    defaultValues: HERO_FORM_DEFAULTS,
    mode: "onTouched",
  });

  const onSubmit: SubmitHandler<DematAccountFormValues> = useDematLeadSubmit({
    setError,
    reset,
    defaultValues: HERO_FORM_DEFAULTS,
  });

  const fullNameRegistration = register("fullName", {
    onChange: (event: ChangeEvent<HTMLInputElement>) => {
      event.target.value = normalizeFullNameInput(event.target.value);
      clearErrors("fullName");
    },
  });

  const mobileNumberRegistration = register("mobileNumber", {
    onChange: (event: ChangeEvent<HTMLInputElement>) => {
      event.target.value = normalizeMobileNumberInput(event.target.value);
    },
  });

  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.inner}>
        <div className={styles.copy}>
          <h1 id="hero-title" className={styles.title}>
            <span className={styles.titleLead}>{HERO.titleLead}</span>
            {/* The headline cycles in place inside a fixed two-line window. */}
            <span className={styles.rotator}>
              <span className={styles.rotatorTrack}>
                {[...HERO.rotatingLines, HERO.rotatingLines[0]].map((lines, i) => (
                  <span className={styles.rotatorItem} key={i} aria-hidden={i === 3}>
                    {lines[0]}
                    <br />
                    {lines[1]}
                  </span>
                ))}
              </span>
            </span>
          </h1>
          <p className={styles.subtext}>
            {HERO.subtext[0]}
            <br />
            {HERO.subtext[1]}
          </p>
        </div>

        <div className={styles.mockup} aria-hidden="true">
          <Image src="/figma/hero/mockup.png" alt="" width={828} height={1116} sizes="(max-width: 767px) 80vw, 414px" loading="eager" fetchPriority="high" />
        </div>

        <div className={styles.watermarks} aria-hidden="true">
          <p className={styles.watermark}>{HERO.watermarkLeft}</p>
          <p className={styles.watermark}>{HERO.watermarkRight}</p>
        </div>

        <form className={styles.form} noValidate onSubmit={handleSubmit(onSubmit)}>
          <div className={`${styles.field} ${styles.fieldName}`}>
            <label htmlFor="hero-name">
              <span className={styles.desktopOnly}>{HERO.form.nameLabel}</span>
              <span className={styles.mobileOnly}>{HERO.formMobile.nameLabel}</span>
              <span aria-hidden="true"> *</span>
            </label>
            <input
              id="hero-name"
              aria-required="true"
              type="text"
              placeholder={form.namePlaceholder}
              autoComplete="name"
              maxLength={100}
              aria-invalid={errors.fullName ? true : undefined}
              aria-describedby={errors.fullName ? "hero-name-error" : undefined}
              {...fullNameRegistration}
            />
            {errors.fullName ? (
              <p className={styles.error} id="hero-name-error" role="alert">
                {errors.fullName.message}
              </p>
            ) : null}
          </div>

          <div className={`${styles.field} ${styles.fieldMobile}`}>
            <label htmlFor="hero-mobile">
              <span className={styles.desktopOnly}>{HERO.form.mobileLabel}</span>
              <span className={styles.mobileOnly}>{HERO.formMobile.mobileLabel}</span>
              <span aria-hidden="true"> *</span>
            </label>
            <input
              id="hero-mobile"
              aria-required="true"
              type="tel"
              inputMode="numeric"
              placeholder={form.mobilePlaceholder}
              autoComplete="tel"
              maxLength={10}
              aria-invalid={errors.mobileNumber ? true : undefined}
              aria-describedby="hero-mobile-help"
              {...mobileNumberRegistration}
            />
            {/* Selection-List 0:43037 — Hero 2 sets the note as text alone,
                without the note icon the 1440 frame puts in front of it. The
                slot is a fixed 20 tall, so an error takes the note's place
                rather than pushing the button down. */}
            <p
              className={`${styles.help} ${errors.mobileNumber ? styles.helpError : ""}`}
              id="hero-mobile-help"
              role={errors.mobileNumber ? "alert" : undefined}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className={styles.helpIcon}
                src="/figma/hero/info.svg"
                alt=""
                width={16}
                height={16}
              />
              {errors.mobileNumber?.message ?? HERO.form.mobileHelp}
            </p>
          </div>

          <label className={styles.consent}>
            <input
              type="checkbox"
              aria-required="true"
              aria-invalid={errors.consent ? true : undefined}
              aria-describedby={errors.consent ? "hero-consent-error" : undefined}
              {...register("consent")}
            />
            <span className={styles.checkbox} aria-hidden="true">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/figma/hero/check.svg" alt="" width={12} height={12} />
            </span>
            <span>
              {HERO.form.consent}
              <span aria-hidden="true"> *</span>
            </span>
          </label>

          {errors.consent ? (
            <p className={styles.error} id="hero-consent-error" role="alert">
              {errors.consent.message}
            </p>
          ) : null}

          {/* Buttons 0:49629 stays shut until the schema is satisfied. The
              fields report themselves on blur, so what is still missing is
              readable without pressing it. */}
          <SbButton type="submit" block disabled={!isValid || isSubmitting}>
            {isSubmitting ? "Please wait..." : HERO.form.submit}
            {/* Buttons 0:49629 — the 360 frame carries a 16px arrow after the
                label that the 1440 one does not, so it is mobile-only. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className={styles.submitArrow}
              src="/figma/faq/arrow-right.svg"
              alt=""
              width={16}
              height={16}
            />
          </SbButton>
        </form>

        <dl className={styles.kpis}>
          <div className={styles.kpi}>
            <dd className={styles.kpiValue}>{HERO.kpis.downloads.value}</dd>
            <dt className={styles.kpiLabel}>{HERO.kpis.downloads.label}</dt>
          </div>
          <div className={styles.kpi}>
            <dd className={`${styles.kpiValue} ${styles.kpiRating}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/figma/hero/star.svg" alt="" />
              <span>{HERO.kpis.rating.value}</span>
            </dd>
            <dt className={styles.kpiLabel}>{HERO.kpis.rating.label}</dt>
          </div>
          <div className={styles.kpi}>
            <dd className={styles.kpiLogo}>
              <Image src="/figma/hero/backed-by-sbi.png" alt="" width={960} height={422} sizes="80px" />
            </dd>
            <dt className={styles.kpiLabel}>{HERO.kpis.backing.label}</dt>
          </div>
        </dl>
      </div>
    </section>
  );
}
