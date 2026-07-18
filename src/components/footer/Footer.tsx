import { apiFetch } from '@/lib/api'
import Link from 'next/link';
import { BASE_URL } from '@/config/config';
import './footer.css'

interface ItemInterface{
    title:string;
    slug:string;
}

interface FooterInterface{
    footer:ItemInterface[]
}

interface InfoItemInterface{
    key:string;
    value:string;
    image:string;
}

interface InfoInterface{
    data: InfoItemInterface[]
}

export default async function Footer() {
    const [footerData, infoData] = await Promise.all([apiFetch(`footer`), apiFetch(`info`)])

    const footerUpdatedData = (footerData?.data as FooterInterface)?.footer ?? [];
    const infoUpdatedData = (infoData?.data as InfoInterface)?.data ?? [];

    return (
        <footer>
            <div className="container">
                <div className="col-lg-10 mx-auto">
                    <div className="footer_grid">
                        {footerUpdatedData?.length > 0 && (
                            <div className="footer_left">
                                <ul>
                                    {footerUpdatedData.map((item, idx)=>(
                                        <li key={idx}>
                                            <Link href={`${BASE_URL}${item.slug}`}>{item.title}</Link>
                                        </li>
                                    ))}
                                </ul>

                            </div>
                        )}
                        
                        <div className="footer_right">
                            <div className="social-icon">
                                {infoUpdatedData
                                    .filter((item:any)=>(item.key == 'facebook' || item.key == 'x' || item.key == 'youtube' || item.key == 'instagram' || item.key == 'linkedin'))
                                    .map((item:any)=>(
                                        <Link key={item.key} href={item.value ?? ''} target='_blank'>
                                            <img src={item.image} className="img-fluid" alt={item.key} />
                                        </Link>
                                    ))}
                            </div>
                            <div className="copyright">
                                <p>Copyright © Samtel Avionics. All rights Reserved.<br /> Website Design and Development by 
                                    <Link href={BASE_URL ?? '/'}> Sterco</Link>
                                </p>
                            </div>

                        </div>
                    </div>

                </div>
            </div>

        </footer>
    )
}