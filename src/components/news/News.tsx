import { BASE_URL } from "@/config/config";
import Image from "next/image";
import Link from "next/link";
import NewsFilter from "./NewsFilter";
import NoData from "../ui/NoData";

interface NewsInterface {
    name: string;
    date: string;
    image: string;
    slug: string;
    id: number;
}

interface NewsPropsInterface {
    data: {
        current_page: string;
        data: NewsInterface[];
        last_page: number;
    }
}

export default function News({ data }: NewsPropsInterface) {
    return (
        <section className="news-filter">
            <div className="container">
                <div className="col-lg-10 mx-auto">
                    <NewsFilter />

                    {data?.data?.length === 0 && <NoData />}

                    <div className="news_grid">
                        {data?.data?.length > 0 && data.data.map((item) => (
                            <div key={item.id} className="news_item">
                                <figure>
                                    <Image src={item?.image ?? '/assets/images/placeholders/news.webp'} className="img-fluid w-100" width={406} height={400} alt={item.name} loading="lazy" />
                                </figure>
                                <div className="news-des">
                                    {item?.date && (
                                        <div className="date">{new Date(item.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
                                    )}
                                    {item?.name && (
                                        <p>{item.name}</p>
                                    )}
                                </div>
                                {item?.slug && (
                                    <Link href={`${BASE_URL}newsroom/${item.slug}`} className="streched_link" />
                                )}
                            </div>
                        ))}

                    </div>
                </div>
            </div>
        </section>
    )
}