import './breadcrumbs.css'

export default function Breadcrumbs() {
    return (
        <section className="breadcrumb-sec">
            <div className="container">
                <div className="col-lg-10 mx-auto">
                    <nav aria-label="breadcrumb" className="breadcrumb-custom">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><a href="#">Home</a></li>
                            <li className="breadcrumb-item">Who we are</li>
                            <li className="breadcrumb-item active" aria-current="page">Company Profile</li>
                        </ol>
                    </nav>
                </div>
            </div>
        </section>
    )
}