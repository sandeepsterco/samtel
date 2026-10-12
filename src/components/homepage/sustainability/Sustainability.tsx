import Link from 'next/link';
import './sustainability.css'
import Image from 'next/image';

interface SustainabilityPropsInterface{
    data:{
        title:string;
        image:string;
        subtitle:string;
        description:string;
        pageslug?:string;
    }
}

export default function Sustainability({data}:SustainabilityPropsInterface) {
    return (
        <section className="home_sustainbility">
            <div className="container">
                <div className="col-lg-11 mx-auto">
                    <div className="row">
                        <div className="col-lg-4">
                            <div className="font_title">
                                {data?.title && (
                                    <p dangerouslySetInnerHTML={{__html:data.title}} className="fade-up" data-delay="0.4" data-duration="1" />
                                )}
                                {data?.subtitle && (
                                    <blockquote dangerouslySetInnerHTML={{__html:data.subtitle}} className="fade-up" data-delay="0.5" data-duration="1" />
                                )}

                                {data?.pageslug && (
                                    <div className="for_desktop">
                                    <Link href={data.pageslug} className="more_btn fade-up"  data-delay="0.6" data-duration="1">
                                        <img src="/assets/icons/right-arrow-white.svg" alt="arrow" className="img-fluid" />
                                    </Link>
                                    </div>
                                )}

                                
                            </div>
                        </div>
                        <div className="col-lg-8">
                            <div className="sustainbility-content">
                                <figure>
                                    <Image src={data?.image ?? '/assets/images/placeholders/image1.webp'} className="img-fluid" width={850} height={600} loading='lazy' alt="sustainbility" />
                                </figure>
                                {data?.description && (
                                    <p dangerouslySetInnerHTML={{__html:data.description}} className="fade-up" data-delay="0.7" data-duration="1" />
                                )}

                                {data?.pageslug && (
                                    <div className="for_mobile">
                                    <Link href={data.pageslug} className="more_btn fade-up"  data-delay="0.6" data-duration="1">
                                        <img src="/assets/icons/right-arrow-white.svg" alt="arrow" className="img-fluid" />
                                    </Link>
                                    </div>
                                )}

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}