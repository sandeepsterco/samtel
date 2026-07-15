import { BASE_URL } from '@/config/config'
import Hamburger from './Hamburger'
import Image from 'next/image'
import Link from 'next/link'
import './header.css'
import { apiFetch } from '@/lib/api'

interface HeaderMenuItem {
    title: string
    slug: string
}

interface HeaderResponse {
    header: HeaderMenuItem[]
}

export interface SidebarItem {
    title: string
    slug: string
    children: SidebarItem[]
}

interface SidebarResponse {
    sidebar: SidebarItem[]
}

export default async function Header() {
    const [headerRes, sidebarRes] = await Promise.all([
        apiFetch(`header`),
        apiFetch(`sidebar`),
    ]);

    console.log('sidebarRes',sidebarRes);

    const headerData = (headerRes.data as HeaderResponse)?.header ?? [];
    const sidebarData = (sidebarRes.data as SidebarResponse)?.sidebar ?? [];

    return (
        <section className="header">
            <div className="container">
                <div className="header_nav">
                    <div className="logo">
                        <Link href={BASE_URL ?? '/'}>
                            <figure>
                                <Image src="/assets/images/main-logo.webp" className="img-fluid" alt="Logo" width={164} height={125} priority loading="eager" />
                            </figure>
                        </Link>
                    </div>

                    <nav className="main-nav">
                        <ul>
                            {headerData?.map((item, idx) => (
                                <li key={idx}>
                                    <Link href={BASE_URL + item.slug}>{item.title}</Link>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    <Hamburger sidebarData={sidebarData} />

                </div>
            </div>
        </section>
    )
}