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
                            <h1 dangerouslySetInnerHTML={{__html:data.page_title}} />
                        )}
                        {data?.description && (
                            <blockquote dangerouslySetInnerHTML={{__html:data.description}} />
                        )}
                    </div>
                </div>
            </div>
        </section>
    )
}