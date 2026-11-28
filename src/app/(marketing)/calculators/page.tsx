import type { Metadata } from "next";

export const metadata: Metadata = { title: "Calculators" };

import SectionTitle from "@/components/ui/SectionTitle";

export default function CalculatorsPage() {
  return (
    <section className="section-padding">
      <div className="container">
        <SectionTitle as="h1" size="page" className="mb-2">
          Calculators
        </SectionTitle>
        <p>Calculator pages will be added here.</p>
      </div>
    </section>
  );
}