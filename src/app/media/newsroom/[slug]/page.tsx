import NotFound from "@/app/not-found";
import Breadcrumbs from "@/components/common/breadcrumbs/Breadcrumbs";
import ReactParserDynamic from "@/components/common/reactParser/ReactParserDynamic";
import RelatedNews from "@/components/news/RelatedNews";
import { apiFetch } from "@/lib/api"
import { createPageMetadata } from "@/lib/metadata";
import type { Metadata } from "next";

interface PageProps {
    params: Promise<{
        slug: string;
    }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const { data, error } = await apiFetch(`news-events/${slug}`);
    const article = data?.newsAndEvent?.data;

    if (error || !data?.status) {
        return createPageMetadata(null, "Newsroom", "Read the latest news and updates from Samtel Group.");
    }

    return createPageMetadata(
        article,
        article?.name || "Newsroom",
        "Read the latest news and updates from Samtel Group.",
    );
}

export default async function NewsDetailPage({ params }: PageProps) {
    const { slug } = await params;
    const [{ data, error }, {data:cmsData}] = await Promise.all([
        apiFetch(`news-events/${slug}`),
        apiFetch(`cms/newsroom`)
    ])

    if (error || !data.status) return <NotFound />

    const NewsData = data?.newsAndEvent?.data ?? {};

    const combinedHtml = Object.values(data?.newsAndEvent?.cms ?? {}).join('');

    const relatedNewsData = data?.relatedNews ?? [];

    const updatedBreadcrumbsData = {
        breadcrumbs:[
            // ...cmsData?.data?.breadcrumbs ?? [],
            {
                "title": 'Media',
                "slug": 'media'
            },
            {
                "title": 'Newsroom',
                "slug": 'media/newsroom'
            },
            {
                "title": NewsData?.name || '',
                "slug": ""
            }

        ]
    }

    return (
        <>
        <Breadcrumbs data={updatedBreadcrumbsData} />
            <section className="company-sec1 newsroom-detail-panel">
                <div className="container">
                    <div className="col-lg-10 mx-auto">
                        <div className="company-text">
                            {NewsData?.date && (
                                <div className="date">{new Date(NewsData.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
                            )}
                            {NewsData?.name && (
                                <h2 dangerouslySetInnerHTML={{ __html: NewsData.name }} />
                            )}
                        </div>

                    </div>

                    <ReactParserDynamic html={combinedHtml} />
                </div>
            </section>

            {relatedNewsData?.length > 0 && <RelatedNews items={relatedNewsData} />}
            
        </>
    )
}