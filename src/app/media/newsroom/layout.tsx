import Breadcrumbs from "@/components/common/breadcrumbs/Breadcrumbs";
import InnerSection from "@/components/common/innerSection/InnerSection";
import { apiFetch } from "@/lib/api";
import { getSlug } from "@/lib/getSlug";

import '@/styles/inner.css'
import { notFound } from "next/navigation";

export default async function DynamicPageLayout({ children }: { children: React.ReactNode }) {
    const slug = await getSlug(0);
    const {data, error} = await apiFetch(`cms/${slug}`);

    if(error || !data.status){
        return notFound();
    }

    const topData = data?.data || {};
    const updatedTopData = {...topData, description:''}

    return (
        <>
            <InnerSection data={updatedTopData} />
            <Breadcrumbs data={topData} />
            {children}
        </>
    )
}