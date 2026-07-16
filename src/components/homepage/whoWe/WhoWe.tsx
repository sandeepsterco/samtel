import Link from 'next/link';
import './whowe.css'
import { BASE_URL } from '@/config/config';

interface CategoryInterface {
    name: string;
    image: string;
    description: string;
    display_order?: string;
    slug?: string;
}

interface WhoWePropsInterface {
    data: {
        title: string;
        subtitle: string;
        categories: CategoryInterface[];
    }
}

export default function WhoWe({ data }: WhoWePropsInterface) {
    const firstCategories = data?.categories.filter((item, idx) => idx < 4);
    const secondCategories = data?.categories.filter((item, idx) => idx > 3 && idx < 7);

    return (
        <section className="who_we">
            <div className="font_title">
                {data?.title && (
                    <p dangerouslySetInnerHTML={{ __html: data.title }} />
                )}
                {data?.subtitle && (
                    <blockquote dangerouslySetInnerHTML={{ __html: data.subtitle }} />
                )}
            </div>

            <div className="portfolio-grid">

                {firstCategories && firstCategories?.length > 0 && (
                    <div className="grid-row-top">
                        {firstCategories.map((item, idx) => (
                            <div key={idx} className="system-tile">
                                <div className="tile-backdrop" style={{ backgroundImage: `url('/assets/images/homepage/who_we/who_we_pro1.webp')` }}>
                                </div>
                                <div className="tile-info-wrapper">
                                    {item?.name && (
                                        <h3>{item.name}</h3>
                                    )}
                                    {item?.description && (
                                        <p dangerouslySetInnerHTML={{ __html: item.description }} />
                                    )}

                                </div>
                                <div className="tile-action-trigger">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">

                                        <path d="M9 6L15 12L9 18" stroke="" strokeWidth="1.1" strokeLinecap="round"
                                            strokeLinejoin="round" />
                                    </svg>
                                </div>
                                {item?.slug && (
                                    <Link href={`${BASE_URL}category/${item.slug}`} className="streched_link"></Link>
                                )}
                            </div>
                        ))}

                    </div>
                )}

                {secondCategories && secondCategories?.length > 0 && (
                    <div className="grid-row-bottom">
                        {secondCategories.map((item, idx) => (
                            <div key={idx} className="system-tile">
                                <div className="tile-backdrop" style={{ backgroundImage: `url('/assets/images/homepage/who_we/who_we_pro1.webp')` }}>
                                </div>
                                <div className="tile-info-wrapper">
                                    {item?.name && (
                                        <h3>{item.name}</h3>
                                    )}
                                    {item?.description && (
                                        <p dangerouslySetInnerHTML={{ __html: item.description }} />
                                    )}

                                </div>
                                <div className="tile-action-trigger">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">

                                        <path d="M9 6L15 12L9 18" stroke="" strokeWidth="1.1" strokeLinecap="round"
                                            strokeLinejoin="round" />
                                    </svg>
                                </div>
                                {item?.slug && (
                                    <Link href={`${BASE_URL}category/${item.slug}`} className="streched_link"></Link>
                                )}
                            </div>
                        ))}
                    </div>
                )}



            </div>
        </section>
    )
}