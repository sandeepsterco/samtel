import Breadcrumbs from "@/components/common/breadcrumbs/Breadcrumbs";
import InnerSection from "@/components/common/innerSection/InnerSection";
import { apiFetch } from "@/lib/api";
import { notFound } from "next/navigation";
import '@/styles/inner.css'

export default async function MediaDetailLayout({ children, params }: { children: React.ReactNode, params:Promise<{mediaSlug:string}> }) {
    const {mediaSlug} = await params;
    const {data, error} = await apiFetch(`modular/${mediaSlug}`);

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