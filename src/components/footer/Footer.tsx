import './footer.css'

export default function Footer(){
    return(
        <footer>
        <div className="container">
            <div className="col-lg-10 mx-auto">
                <div className="footer_grid">
                    <div className="footer_left">
                        <ul>
                            <li><a href="javascript:void(0)">Who we are</a></li>
                            <li><a href="javascript:void(0)">What we do</a></li>
                            <li><a href="javascript:void(0)">Industries/ Domains</a></li>
                            <li><a href="javascript:void(0)">Products & Solutions</a></li>
                            <li><a href="javascript:void(0)">Infrastructure & Technology</a></li>
                            <li><a href="javascript:void(0)">Media</a></li>
                            <li><a href="javascript:void(0)">Careers</a></li>
                            <li><a href="javascript:void(0)">Contact</a></li>
                        </ul>



                    </div>
                    <div className="footer_right">
                        <div className="social-icon">
                            <a href="javascript:void(0)"><img src="/assets/icons/facebook-icon.svg" /></a>
                            <a href="javascript:void(0)"><img src="/assets/icons/x-icon.svg" /></a>
                            <a href="javascript:void(0)"><img src="/assets/icons/youtube-icon.svg" /></a>
                            <a href="javascript:void(0)"><img src="/assets/icons/instagram-icon.svg" /></a>
                            <a href="javascript:void(0)"><img src="/assets/icons/linkdin-icon.svg" /></a>

                        </div>
                        <div className="copyright">
                            <p>Copyright © Samtel Avionics. All rights Reserved.<br /> Website Design and Development by
                                <a href="javascript:void(0)">Sterco</a>
                            </p>
                        </div>

                    </div>
                </div>

            </div>
        </div>


    </footer>
    )
}