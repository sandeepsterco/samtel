import Link from 'next/link';
import './breadcrumbs.css'
import { BASE_URL } from '@/config/config';

interface BreadcrumbsInterface{
    title:string;
    slug:string;
}

interface BreadcrumbPropsInterface{
    data:{
        breadcrumbs?:BreadcrumbsInterface[];
    }
}

export default function Breadcrumbs({data}:BreadcrumbPropsInterface) {
    const breadcrumbs = data?.breadcrumbs ?? [];
    const lastIndex = breadcrumbs.length - 1;

    return (
        <section className="breadcrumb-sec">
            <div className="container">
                <div className="col-lg-10 mx-auto">
                    <nav aria-label="breadcrumb" className="breadcrumb-custom">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item">
                                <Link href={BASE_URL ?? '/'}>Home</Link>
                            </li>
                            {breadcrumbs.map((item, idx) => {
                                const isLast = idx === lastIndex;
                                return (
                                    <li
                                        key={idx}
                                        className={`breadcrumb-item ${isLast ? 'active' : ''}`}
                                        aria-current={isLast ? 'page' : undefined}
                                    >
                                        {isLast ? (
                                            item.title
                                        ) : (
                                            <Link href={`/${item.slug}`}>{item.title}</Link>
                                        )}
                                    </li>
                                );
                            })}
                        </ol>
                    </nav>
                </div>
            </div>
        </section>
    )
}