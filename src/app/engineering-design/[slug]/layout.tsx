import Breadcrumbs from "@/components/common/breadcrumbs/Breadcrumbs";
import InnerSection from "@/components/common/innerSection/InnerSection";
import { apiFetch } from "@/lib/api";

import '@/styles/inner.css'
import ComingSoon from "@/components/common/comingSoon/ComingSoon";
import ScrollToTop from "@/components/common/ScrollToTop";
import { notFound } from "next/navigation";
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
        return createPageMetadata(null, slug, "Learn about Samtel Group engineering and design.");
    }

    return createPageMetadata(
        data?.data,
        slug.replace(/-/g, " "),
        "Learn about Samtel Group engineering and design.",
    );
}

export default async function DynamicPageLayout({ children, params }: PageProps) {
    const { slug } = await params;
    const {data, error} = await apiFetch(`cms/${slug}`);

    if(error ) return notFound();

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