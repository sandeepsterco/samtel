import Breadcrumbs from "@/components/common/breadcrumbs/Breadcrumbs";
import InnerSection from "@/components/common/innerSection/InnerSection";
import { apiFetch } from "@/lib/api";
import { getSlug } from "@/lib/getSlug";
import NotFound from "@/app/not-found";
import '@/styles/inner.css'
import { createPageMetadata } from "@/lib/metadata";
import type { Metadata } from "next";

type PageProps = {
    children: React.ReactNode;
    params: Promise<{ category?: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { category } = await params;
    const { data, error } = await apiFetch(`product-category/${category}`);

    if (error || !data?.status) {
        return createPageMetadata(null, "Product Category", "Browse Samtel Group products by category.");
    }

    return createPageMetadata(
        data?.data,
        "Product Category",
        "Browse Samtel Group products by category.",
    );
}

export default async function CategoryPageLayout({ children, params }: PageProps) {
    const {category} = await params;
    const {data, error} = await apiFetch(`product-category/${category}`);

    if(error || !data.status){
        return <NotFound />;
    }

    const topData = data?.data || {};

    return (
        <>
            <InnerSection data={topData} />
            <Breadcrumbs data={topData} />
            {children}
        </>
    )
}