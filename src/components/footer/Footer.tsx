import { apiFetch } from '@/lib/api'
import Link from 'next/link';
import { BASE_URL } from '@/config/config';
import FooterMobileMenu, {
    type FooterMenuItem,
    type FooterProductCategory,
} from './FooterMobileMenu';
import { normalizeInfoResponse } from '@/lib/info';
import './footer.css'

interface ItemInterface{
    title:string;
    slug:string;
    overwrite_url:String | null;
}

interface FooterInterface{
    footer:ItemInterface[]
}

interface HeaderMenuResponse {
    header: FooterMenuItem[];
}

interface SidebarMenuResponse {
    sidebar: FooterMenuItem[];
}

interface ProductCategoryResponse {
    data: FooterProductCategory[];
}

export default async function Footer() {
    const [footerData, infoData, headerData, sidebarData, productCategoryData] = await Promise.all([
        apiFetch(`footer`),
        apiFetch(`info`),
        apiFetch(`header`),
        apiFetch(`sidebar`),
        apiFetch(`product-categories`),
    ])

    const footerUpdatedData = (footerData?.data as FooterInterface)?.footer ?? [];
    const infoUpdatedData = normalizeInfoResponse(infoData?.data);
    const headerMenu = (headerData?.data as HeaderMenuResponse)?.header ?? [];
    const sidebarMenu = (sidebarData?.data as SidebarMenuResponse)?.sidebar ?? [];
    const productCategoryMenu = (productCategoryData?.data as ProductCategoryResponse)?.data ?? [];

    return (
        <>
        <footer>
            <div className="container">
                <div className="col-lg-10 mx-auto">
                    <div className="footer_grid">
                        {footerUpdatedData?.length > 0 && (
                            <div className="footer_left">
                                <ul>
                                    {footerUpdatedData.map((item, idx)=>(
                                        <li key={idx}>
                                            <Link href={item?.overwrite_url ? `${BASE_URL}${item.overwrite_url}` : `${BASE_URL}${item.slug}`}>{item.title}</Link>
                                        </li>
                                    ))}
                                </ul>

                            </div>
                        )}
                        
                        <div className="footer_right">
                            <div className="social-icon">
                                {infoUpdatedData
                                    .filter((item)=>(item.key == 'facebook' || item.key == 'x' || item.key == 'youtube' || item.key == 'insta' || item.key == 'linkedn'))
                                    .map((item)=>(
                                        item.image && (
                                            <Link key={item.key} href={item.value ?? ''} target='_blank'>
                                                <img src={item.image} className="img-fluid" alt={item.key} />
                                            </Link>
                                        )
                                    ))}
                            </div>
                            <div className="copyright">
                                <p>Copyright © Samtel Avionics. All rights Reserved.<br /> Website Design and Development by 
                                    <Link target='_blank' href={'https://www.stercodigitex.com/'}> Sterco Digitex</Link>
                                </p>
                            </div>

                        </div>
                    </div>

                </div>
            </div>

        </footer>
        <FooterMobileMenu headerMenu={headerMenu} sidebarMenu={sidebarMenu} productCategoryMenu={productCategoryMenu} />
        </>
    )
}