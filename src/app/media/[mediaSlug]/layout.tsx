import Breadcrumbs from "@/components/common/breadcrumbs/Breadcrumbs";
import InnerSection from "@/components/common/innerSection/InnerSection";
import { apiFetch } from "@/lib/api";
import { notFound } from "next/navigation";
import '@/styles/inner.css'
import { createPageMetadata } from "@/lib/metadata";
import type { Metadata } from "next";

type PageProps = {
    children: React.ReactNode;
    params: Promise<{ mediaSlug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { mediaSlug } = await params;
    const { data, error } = await apiFetch(`cms/${mediaSlug}`);

    if (error || !data?.status) {
        return createPageMetadata(null, "Media", "Explore media and updates from Samtel Group.");
    }

    return createPageMetadata(
        data?.data,
        "Media",
        "Explore media and updates from Samtel Group.",
    );
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