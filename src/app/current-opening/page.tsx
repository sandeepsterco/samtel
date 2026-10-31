import KekaJobs from "@/components/career/KekaJobs";
import { getPageSEO } from "@/lib/seo";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSEO("current-opening");

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

export default function CurrentOpeningPage() {
  return (
    <>
      <section className="apply_sec">
        <div className="container">
          <div className="col-lg-10 mx-auto">
            <KekaJobs />
          </div>
        </div>
      </section>

    </>
  );
}