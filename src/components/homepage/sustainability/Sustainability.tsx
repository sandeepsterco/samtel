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
                        <div className="col-lg-5">
                            <div className="font_title">
                                {data?.title && (
                                    <p dangerouslySetInnerHTML={{__html:data.title}} />
                                )}
                                {data?.subtitle && (
                                    <blockquote dangerouslySetInnerHTML={{__html:data.subtitle}} />
                                )}

                                {data?.pageslug && (
                                    <Link href="javascipt:void(0)" className="more_btn">
                                        <img src="/assets/icons/right-arrow-white.svg" alt="arrow" className="img-fluid" />
                                    </Link>
                                )}

                                
                            </div>
                        </div>
                        <div className="col-lg-7">
                            <div className="sustainbility-content">
                                <figure>
                                    <Image src={data?.image ?? '/assets/images/placeholders/image1.webp'} className="img-fluid" width={850} height={600} loading='lazy' alt="sustainbility" />
                                </figure>
                                {data?.description && (
                                    <p dangerouslySetInnerHTML={{__html:data.description}} />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}