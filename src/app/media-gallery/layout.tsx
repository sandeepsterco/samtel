import Breadcrumbs from "@/components/common/breadcrumbs/Breadcrumbs";
import InnerSection from "@/components/common/innerSection/InnerSection";
import { apiFetch } from "@/lib/api";
import { getSlug } from "@/lib/getSlug";
import NotFound from "../not-found";

import '@/styles/inner.css'

export default async function GalleryLayoutPage({ children }: { children: React.ReactNode }) {
    const slug = await getSlug();
    const {data, error} = await apiFetch(`cms/${slug}`);

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