import Breadcrumbs from "@/components/common/breadcrumbs/Breadcrumbs";
import InnerSection from "@/components/common/innerSection/InnerSection";
import { apiFetch } from "@/lib/api";
import { getSlug } from "@/lib/getSlug";

import '@/styles/inner.css'
import NotFound from "../not-found";
import ComingSoon from "@/components/common/comingSoon/ComingSoon";
import ScrollToTop from "@/components/common/ScrollToTop";
import { createPageMetadata } from "@/lib/metadata";
import type { Metadata } from "next";

type PageProps = {
    children: React.ReactNode;
    params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const { data, error } = await apiFetch(`cms/${slug}`);

    if (error || !data?.status) {
        return createPageMetadata(null, slug, "Explore information from Samtel Group.");
    }

    return createPageMetadata(
        data?.data,
        slug.replace(/-/g, " "),
        "Explore information from Samtel Group.",
    );
}

export default async function DynamicPageLayout({ children }: PageProps) {
    const slug = await getSlug();
    const {data, error} = await apiFetch(`cms/${slug}`);

    if(error ){
        return <NotFound />;
    }

    const topData = data?.data || {};

    return (
        <>
            <InnerSection data={topData} />
            <Breadcrumbs data={topData} />
            {data.data.sections.length == 0 ? <ComingSoon /> : children}
            <ScrollToTop />
        </>
    )
}