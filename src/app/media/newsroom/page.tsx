import FeaturedNews from "@/components/news/FeaturedNews";
import News from "@/components/news/News";
import { apiFetch } from "@/lib/api";
import { getSlug } from "@/lib/getSlug";

interface PageProps{
    searchParams:Promise<{
        year?:string;
        month?:string;
    }>
}

export default async function NewsRoom({searchParams}:PageProps) {
    const {year, month} = await searchParams;
    const slug = await getSlug();

    const query = new URLSearchParams();
    if(year) query.set('year', year);
    if(month) query.set('month', month);

    const [{data:cmsData, error:cmsError}, {data:newsData, error:newsError}] = await Promise.all([apiFetch(`cms/${slug}`), apiFetch(`news-events${query.toString() ? `?${query.toString()}` : ''}`)])

    if(newsError || !newsData.status) throw new Error(`Failed to fetch news events`);

    const featuredData = newsData?.featuredNewsAndEvents ?? [];

    const updatedNewsData = newsData?.newsAndEvents ?? {};

    return (
        <>
            {featuredData?.length > 0 && (
                <FeaturedNews data={featuredData} title={cmsData?.data?.description ?? ''} />
            )}
            <News data={updatedNewsData} />
        </>
    )
}