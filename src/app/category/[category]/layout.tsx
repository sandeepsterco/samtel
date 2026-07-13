import Breadcrumbs from "@/components/common/breadcrumbs/Breadcrumbs";
import InnerSection from "@/components/common/innerSection/InnerSection";
import { apiFetch } from "@/lib/api";
import { getSlug } from "@/lib/getSlug";
import NotFound from "@/app/not-found";
import '@/styles/inner.css'

export default async function CategoryPageLayout({ children, params }: { children: React.ReactNode; params:Promise<{category?:string}> }) {
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