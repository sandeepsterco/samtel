import Link from 'next/link';
import './whowe.css'
import { BASE_URL } from '@/config/config';
import Image from 'next/image';

interface CategoryInterface {
    name: string;
    image: string;
    home_image: string;
    description: string;
    short_description?: string;
    display_order?: string;
    slug?: string;
    product_image?: string;
    content:String | null;
}

interface WhoWePropsInterface {
    data: {
        title: string;
        subtitle: string;
        categories: CategoryInterface[];
        short_description?: string;
    }
}

export default function WhoWe({ data }: WhoWePropsInterface) {
    const firstCategories = data?.categories.filter((item, idx) => idx < 4);
    const secondCategories = data?.categories.filter((item, idx) => idx > 3 && idx < 7);

    return (
        <section className="who_we">
            <div className="font_title">
                {data?.title && (
                    <p className="fade-up" data-delay="0.3" data-duration="1" dangerouslySetInnerHTML={{ __html: data.title }} />
                )}
                {data?.subtitle && (
                    <blockquote className="fade-up" data-delay="0.4" data-duration="1" dangerouslySetInnerHTML={{ __html: data.subtitle }} />
                )}
            </div>

            <div className="mobile_industries for_mobile">
                {data?.categories && data?.categories?.length > 0 && data.categories.map((item, idx)=>(
                    <div key={idx} className="inustries_item">
                        <figure>
                            <Image src={item?.product_image || item.home_image || '/assets/images/placeholders/placeholder2.webp'} className="img-fluid w-100" loading='lazy' width={366} height={304} alt={item?.name || 'Airborne Systems'} />
                        </figure> 
                        {item?.name && (
                            <p>{item.name}</p> 
                        )}
                        {item?.slug && (
                            <Link href={`${BASE_URL}category/${item.slug}`} className="streched_link"></Link>
                        )}
                    </div>
                ))}
                
                
                <div className="inustries_item"><div className="mb_ind_grid"><blockquote>Learn more about industrial sectors</blockquote>
                    <div className="mobile-trigger">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M9 6L15 12L9 18" stroke="" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                    </div>
                    <a className="streched_link" href="industries.php">link</a>
                </div>
                </div>
            </div>
            <div className="portfolio-grid for_desktop  fade-up" data-delay="0.6" data-duration="1">

                {firstCategories && firstCategories?.length > 0 && (
                    <div className="grid-row-top">
                        {firstCategories.map((item, idx) => (
                            <div key={idx} className="system-tile">
                                <div className="tile-backdrop" style={{ backgroundImage: `url(${item.home_image})` }}>
                                </div>
                                <div className="tile-info-wrapper">
                                    {item?.name && (
                                        <h3>{item.name}</h3>
                                    )}
                                    {item?.short_description && (
                                        <p dangerouslySetInnerHTML={{ __html: item.short_description }} />
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
                                <div className="tile-backdrop" style={{ backgroundImage: `url(${item.home_image})` }}>
                                </div>
                                <div className="tile-info-wrapper">
                                    {item?.name && (
                                        <h3>{item.name}</h3>
                                    )}
                                    {item?.short_description && (
                                        <p dangerouslySetInnerHTML={{ __html: item.short_description }} />
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