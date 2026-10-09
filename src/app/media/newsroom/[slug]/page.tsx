import NotFound from "@/app/not-found";
import ReactParserDynamic from "@/components/common/reactParser/ReactParserDynamic";
import { BASE_URL } from "@/config/config";
import { apiFetch } from "@/lib/api"
import Image from "next/image";
import Link from "next/link";

interface PageProps {
    params: Promise<{
        slug: string;
    }>
}

export default async function NewsDetailPage({ params }: PageProps) {
    const { slug } = await params;
    const { data, error } = await apiFetch(`news-events/${slug}`)

    if (error || !data.status) return <NotFound />

    const NewsData = data?.newsAndEvent?.data ?? {};

    const combinedHtml = Object.values(data?.newsAndEvent?.cms ?? {}).join('');

    const relatedNewsData = data?.relatedNews ?? [];

    return (
        <>
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

            {relatedNewsData?.length > 0 && (
                <section className="related-news">
                    <div className="container">
                        <h3>RELATED NEWS</h3>

                        <div className="related_news_grid">
                            {relatedNewsData?.map((item:any)=>(
                                <div key={item.id} className="related_news_item">
                                    <figure>
                                        <Image src={`${item?.image ?? '/assets/images/placeholders/related_news.webp'}`} className="img-fluid w-100" width={306} height={234} loading="lazy" alt={item.name} />
                                    </figure>
                                    <div className="replated_text">
                                        {item?.name && (
                                            <p className="name" dangerouslySetInnerHTML={{__html:item.name}} />
                                        )}
                                        {item?.date && (
                                            <em className="date">{new Date(item.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</em>
                                        )}
                                        <div className="read-icon">
                                            <img src="/assets/images/icons/read-icon.svg " />
                                        </div>
                                    </div>
                                    {item?.slug && (
                                        <Link href={`${BASE_URL}newsroom/${item.slug}`} className="streched_link" />
                                    )}
                                </div>
                            ))}
                            

                        </div>
                    </div>
                </section>
            )}
            
        </>
    )
}