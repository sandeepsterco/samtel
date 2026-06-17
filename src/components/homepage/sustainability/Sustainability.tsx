import './sustainability.css'
export default function Sustainability() {
    return (
        <section className="home_sustainbility">
            <div className="container">
                <div className="col-lg-11 mx-auto">
                    <div className="row">
                        <div className="col-lg-5">
                            <div className="font_title">
                                <p>SUSTAINABILITY</p>
                                <blockquote>Engineering Responsibility. <b>Delivering Sustainably.</b> </blockquote>

                                <a href="javascipt:void(0)" className="more_btn">
                                    <img src="/assets/icons/right-arrow-white.svg" alt="arrow" className="img-fluid" />
                                </a>
                            </div>
                        </div>
                        <div className="col-lg-7">
                            <div className="sustainbility-content">
                                <figure><img src="/assets/images/homepage/sustainability/sustainbility.webp" className="img-fluid" alt="sustainbility" /></figure>
                                <p>Sustainability is integral to how we design, manufacture, and operate. As a technology
                                    partner in mission-critical
                                    sectors, we recognize our responsibility to minimize environmental impact while
                                    delivering high-reliability solutions.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}