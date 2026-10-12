import Breadcrumbs from "@/components/common/breadcrumbs/Breadcrumbs";
import InnerSection from "@/components/common/innerSection/InnerSection";
import { apiFetch } from "@/lib/api";
import { getSlug } from "@/lib/getSlug";

import '@/styles/inner.css'
import ComingSoon from "@/components/common/comingSoon/ComingSoon";
import ScrollToTop from "@/components/common/ScrollToTop";
import { notFound } from "next/navigation";

export default async function DynamicPageLayout({ children }: { children: React.ReactNode }) {
    const slug = await getSlug();
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