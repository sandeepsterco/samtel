import Breadcrumbs from "@/components/common/breadcrumbs/Breadcrumbs";
import InnerSection from "@/components/common/innerSection/InnerSection";
import { apiFetch } from "@/lib/api";
import { getSlug } from "@/lib/getSlug";

import '@/styles/inner.css'
import NotFound from "../not-found";
import ComingSoon from "@/components/common/comingSoon/ComingSoon";
import ScrollToTop from "@/components/common/ScrollToTop";

export default async function CurrentOpeningPageLayout({ children }: { children: React.ReactNode }) {
    const {data, error} = await apiFetch(`cms/current-opening`);

    if(error ){
        return <NotFound />;
    }

    const topData = data?.data || {};

    return (
        <>
            <InnerSection data={topData} />
            <Breadcrumbs data={topData} />
            {children}
            <ScrollToTop />
        </>
    )
}