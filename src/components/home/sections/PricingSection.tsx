import Image from "next/image";
import SectionHead from "@/components/ui/SectionHead";
import { PLANS } from "@/constants/sbi-home";
import styles from "./pricing.module.scss";

/** Pricing Plans — desktop 1:59736, mobile 0:54265. */
export default function PricingSection() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <SectionHead title="Pricing Plans" href="#pricing" hrefLabel="All pricing plans" />

        <ul className={styles.grid}>
          {PLANS.map((plan) => (
            <li key={plan.name} className={`${styles.card} ${styles[plan.accent]}`}>
              <div className={styles.cardHead}>
                <p className={styles.name}>
                  <Image src={`/figma/pricing/${plan.accent}.png`} alt="" aria-hidden="true" width={30} height={30} />
                  {plan.name}
                </p>
                {/* Figma sets the ₹ at 20 alongside the 32/42 figure, with the
                    tax note smaller again and hung off the top. */}
                <p className={styles.price}>
                  <span className={styles.currency}>₹</span>
                  <span className={styles.amount}>{plan.price.replace(/^₹/, "")}</span>
                  {plan.priceNote ? (
                    <span className={styles.note}>{plan.priceNote}</span>
                  ) : null}
                </p>
              </div>

              <ul className={styles.features}>
                {plan.features.map((feature) => (
                  <li key={feature}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      className={styles.tick}
                      src="/figma/pricing/check.svg"
                      alt=""
                      width={24}
                      height={24}
                    />
                    {feature}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
