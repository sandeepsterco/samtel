import InnerSection from "@/components/common/innerSection/InnerSection";
import { apiFetch } from "@/lib/api";

import '@/styles/inner.css'
import { notFound } from "next/navigation";
import { createPageMetadata } from "@/lib/metadata";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
    const { data, error } = await apiFetch(`cms/newsroom`);

    if (error || !data?.status) {
        return createPageMetadata(null, "Newsroom", "Read the latest news and updates from Samtel Group.");
    }

    return createPageMetadata(
        data?.data,
        "Newsroom",
        "Read the latest news and updates from Samtel Group.",
    );
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