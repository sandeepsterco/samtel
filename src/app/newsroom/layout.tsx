import Breadcrumbs from "@/components/common/breadcrumbs/Breadcrumbs";
import InnerSection from "@/components/common/innerSection/InnerSection";
import { apiFetch } from "@/lib/api";
import { getSlug } from "@/lib/getSlug";

import NotFound from "../not-found";
import ComingSoon from "@/components/common/comingSoon/ComingSoon";
import '@/styles/inner.css'

export default async function DynamicPageLayout({ children }: { children: React.ReactNode }) {
    const slug = await getSlug(0);
    const {data, error} = await apiFetch(`cms/${slug}`);

    if(error || !data.status){
        return <NotFound />;
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