import type { Metadata } from "next";

/* The page is a client component, which cannot set its own title. */
export const metadata: Metadata = { title: "SBI Realty" };

export default function SsoRealtyLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
