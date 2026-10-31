import Happenings from "@/components/homepage/happenings/Happenings";
import HomeBanner from "@/components/homepage/homeBanner/HomeBanner";
import People from "@/components/homepage/people/People";
import Sustainability from "@/components/homepage/sustainability/Sustainability";
import Technology from "@/components/homepage/technology/Technology";
import WhoWe from "@/components/homepage/whoWe/WhoWe";
import { apiFetch } from "@/lib/api";
import { getPageSEO } from "@/lib/seo";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSEO("home");

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    alternates: seo.alternates,
    robots: seo.robots,
    openGraph: seo.openGraph
      ? {
          ...seo.openGraph,
        }
      : undefined,
  };
}

export default async function Home() {
  const {data, error} = await apiFetch(`home-page`);

  const pageData = data?.data;

  if (!data || error) {
    return <div className="min-h-[100vh] flex items-center justify-center">
      <h1 className="md:!text-[5rem] !text-[2rem] md:!font-bold !font-normal">Something wrong...</h1>
    </div>
  }

  const whoWeData = {...pageData?.who_we, categories:data?.modular?.['product-category'] ?? []};
  const happeningData = {...pageData?.news_and_events, happeningsData:data?.latestModuleEntries ?? []};

  return (
    <main className="homepage-content">
      <HomeBanner data={pageData?.banner}  />
      <WhoWe data={whoWeData} />
      <Technology data={pageData?.technology ?? {}} />
      <People data={pageData?.people ?? {}} />
      <Sustainability data={pageData?.sustainability ?? {}} />
      <Happenings data={happeningData} />
    </main>
  );
}
