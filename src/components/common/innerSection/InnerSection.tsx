import './inner-section.css'

interface InnerSectionPropsInterface{
    data:{
        page_title:string;
        description:string;
    }
}

export default function InnerSection({data}:InnerSectionPropsInterface) {
    return (
        <section className="inner-section">
            <div className="container">
                <div className="col-lg-10 mx-auto">
                    <div className="inner-text">
                        {data?.page_title && (
                            <h1 className="fade-up" data-aos="fade-up" data-aos-delay="300" data-aos-duration="1000" dangerouslySetInnerHTML={{__html:data.page_title}} />
                        )}
                        {data?.description && (
                            <blockquote className="fade-up" data-aos="fade-up" data-aos-delay="300" data-aos-duration="1400" dangerouslySetInnerHTML={{__html:data.description}} />
                        )}
                    </div>
                </div>
            </div>
        </section>
    )
}