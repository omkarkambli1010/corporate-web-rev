import type { Metadata } from "next";

export const metadata: Metadata = { title: "Blogs" };

import SectionTitle from "@/components/ui/SectionTitle";

export default function BlogsPage() {
  return (
    <section className="section-padding">
      <div className="container">
        <SectionTitle as="h1" size="page" className="mb-2">
          Blogs
        </SectionTitle>
        <p>CMS-based blog listing will be added here.</p>
      </div>
    </section>
  );
}