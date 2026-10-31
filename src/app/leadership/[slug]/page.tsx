import InnerSection from "@/components/common/innerSection/InnerSection";
import ReactParserDynamic from "@/components/common/reactParser/ReactParserDynamic";
import { apiFetch } from "@/lib/api";
import './leadership-detail.css'
import '@/styles/inner.css'
import Breadcrumbs from "@/components/common/breadcrumbs/Breadcrumbs";
import { getPageSEO } from "@/lib/seo";
import type { Metadata } from "next";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const seo = await getPageSEO(`leadership/${slug}`);

    return {
        title: seo.title,
        description: seo.description,
        keywords: seo.keywords,
        alternates: seo.alternates,
        robots: seo.robots,
        openGraph: seo.openGraph
            ? {
                  ...seo.openGraph,
              }
            : undefined,
    };
}

export default async function LeadershipDetailPage({params}:PageProps){
    const {slug} = await params;
    const {data, error} = await apiFetch(`leadership/${slug}`);
    const {data:cmsData} = await apiFetch(`cms/leadership`);
 
    if(error){
        throw new Error(`Failed to fetch leadership detail api`);
    }

    const combinedHtml = Object.values(data?.leadership?.cms ?? {}).join('');
    const descriptionData = cmsData?.data?.description;

    const innerData = {
        page_title:'Leadership', 
        description:descriptionData 
    };

    // const breadcrumb = {
    //     breadcrumbs:[
    //         {
    //             title:'test',
    //             slug:'test'
    //         },
    //     ]
    // }

    return(
        <>
            <InnerSection data={innerData} />
            <Breadcrumbs data={data?.leadership} />
            <ReactParserDynamic html={combinedHtml} />
        </>
    )
}