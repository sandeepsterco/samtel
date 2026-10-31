import InnerSection from "@/components/common/innerSection/InnerSection";
import { apiFetch } from "@/lib/api";

import '@/styles/inner.css'
import { notFound } from "next/navigation";
import { getPageSEO } from "@/lib/seo";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
    const seo = await getPageSEO("media/newsroom");

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

export default async function DynamicPageLayout({ children }: { children: React.ReactNode }) {
    const {data, error} = await apiFetch(`cms/newsroom`);

    if(error || !data.status){
        return notFound();
    }

    const topData = data?.data || {};
    const updatedTopData = {...topData, description:''}

    return (
        <>
            <InnerSection data={updatedTopData} />
            {children}
        </>
    )
}