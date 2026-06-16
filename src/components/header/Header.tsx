import Hamburger from './Hamburger'
import './header.css'

export default function Header() {
    return (
        <section className="header">
            <div className="container">
                <div className="header_nav">
                    <div className="logo">
                        <a href="javascript:void(0)">
                            <figure><img src="/assets/images/main-logo.webp" className="img-fluid" alt="Logo" /></figure>
                        </a>
                    </div>

                    <nav className="main-nav">
                        <ul>
                            <li><a href="javascript:void(0)">Who we are</a></li>
                            <li><a href="javascript:void(0)">What we do</a></li>
                            <li><a href="javascript:void(0)">Industries</a></li>
                            <li><a href="javascript:void(0)">Products & Solutions</a></li>
                            <li><a href="javascript:void(0)">Technology</a></li>
                        </ul>
                    </nav>

                    <Hamburger />

                </div>
            </div>
        </section>
    )
}