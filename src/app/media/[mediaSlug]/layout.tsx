import Breadcrumbs from "@/components/common/breadcrumbs/Breadcrumbs";
import InnerSection from "@/components/common/innerSection/InnerSection";
import { apiFetch } from "@/lib/api";
import { notFound } from "next/navigation";
import '@/styles/inner.css'
import { getPageSEO } from "@/lib/seo";
import type { Metadata } from "next";

type PageProps = {
    children: React.ReactNode;
    params: Promise<{ mediaSlug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { mediaSlug } = await params;
    const seo = await getPageSEO(`media/${mediaSlug}`);

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

export default async function MediaDetailLayout({ children, params }: PageProps) {
    const {mediaSlug} = await params;
    const {data, error} = await apiFetch(`cms/${mediaSlug}`);

    if(error || !data.status){
        notFound()
    }

    const topData = data?.data || {};

     const updatedBreadcrumbsData = {
        breadcrumbs:[
            // {
            //     "title": 'Media',
            //     "slug": 'media'
            // },,
            ...topData?.breadcrumbs ?? [],
        ]
    }

    return (
        <>
            <InnerSection data={topData} />
            <Breadcrumbs data={updatedBreadcrumbsData} />
            {children}
        </>
    )
}