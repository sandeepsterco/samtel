import Breadcrumbs from "@/components/common/breadcrumbs/Breadcrumbs";
import InnerSection from "@/components/common/innerSection/InnerSection";
import { apiFetch } from "@/lib/api";
import { notFound } from "next/navigation";
import '@/styles/inner.css'
import { createPageMetadata } from "@/lib/metadata";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
    const { data, error } = await apiFetch(`modular/press-coverage`);

    if (error || !data?.status) {
        return createPageMetadata(null, "Press Coverage", "Read media coverage featuring Samtel Group.");
    }

    return createPageMetadata(
        data?.data,
        "Press Coverage",
        "Read media coverage featuring Samtel Group.",
    );
}

export default async function PressCoverageLayout({ children }: { children: React.ReactNode }) {
    const {data, error} = await apiFetch(`modular/press-coverage`);

    if(error || !data.status){
        notFound()
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