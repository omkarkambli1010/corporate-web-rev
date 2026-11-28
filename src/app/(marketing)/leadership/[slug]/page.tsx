import type { Metadata } from "next";
import { notFound } from "next/navigation";
import LeaderDetail from "@/components/leadership/LeaderDetail";
import { getLeadershipContent } from "@/server/cms/leadershipContent";

type Props = { params: Promise<{ slug: string }> };

/* Leaders are CMS items, so a leader added after the build must still resolve:
   the known ones are prebuilt, the rest render on demand (the default for
   dynamicParams), and an unknown slug is a 404. */
export async function generateStaticParams() {
  return (await getLeadershipContent()).leaders.map((leader) => ({ slug: leader.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const leader = (await getLeadershipContent()).leaders.find((l) => l.slug === slug);
  return leader ? { title: leader.name, description: leader.role } : {};
}

export default async function LeaderPage({ params }: Props) {
  const { slug } = await params;
  const content = await getLeadershipContent();
  const leader = content.leaders.find((l) => l.slug === slug);
  if (!leader) notFound();

  /* The trail ends with the leader's own name, which is data, not a CMS crumb. */
  const breadcrumbs = [...content.detailBreadcrumbs, { label: leader.name }];
  return <LeaderDetail leader={leader} breadcrumbs={breadcrumbs} />;
}
