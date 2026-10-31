import Breadcrumbs from "@/components/common/breadcrumbs/Breadcrumbs";
import InnerSection from "@/components/common/innerSection/InnerSection";
import { apiFetch } from "@/lib/api";
import NotFound from "@/app/not-found";
import '@/styles/inner.css'
import { getPageSEO } from "@/lib/seo";
import type { Metadata } from "next";

type PageProps = {
    children: React.ReactNode;
    params: Promise<{ category?: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { category } = await params;
    const seo = await getPageSEO(`category/${category}`);

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