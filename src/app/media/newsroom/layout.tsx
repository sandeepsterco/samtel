import InnerSection from "@/components/common/innerSection/InnerSection";
import { apiFetch } from "@/lib/api";

import '@/styles/inner.css'
import { notFound } from "next/navigation";

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