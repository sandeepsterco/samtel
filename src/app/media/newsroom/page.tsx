import Breadcrumbs from "@/components/common/breadcrumbs/Breadcrumbs";
import FeaturedNews from "@/components/news/FeaturedNews";
import News from "@/components/news/News";
import { apiFetch } from "@/lib/api";

interface PageProps{
    searchParams:Promise<{
        year?:string;
        month?:string;
    }>
}

export default async function NewsRoom({searchParams}:PageProps) {
    const {year, month} = await searchParams;

    const query = new URLSearchParams();
    if(year) query.set('year', year);
    if(month) query.set('month', month);

    const [{data:cmsData, error:cmsError}, {data:newsData, error:newsError}] = await Promise.all([apiFetch(`cms/newsroom`), apiFetch(`news-events${query.toString() ? `?${query.toString()}` : ''}`)])

    if(newsError || !newsData.status) throw new Error(`Failed to fetch news events`);

    const featuredData = newsData?.featuredNewsAndEvents ?? [];

    const updatedNewsData = newsData?.newsAndEvents ?? {};

    return (
        <>
            <Breadcrumbs data={cmsData?.data} />
            {featuredData?.length > 0 && (
                <FeaturedNews data={featuredData} title={cmsData?.data?.description ?? ''} />
            )}
            <News data={updatedNewsData} />
        </>
    )
}