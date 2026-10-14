import InnerSection from "@/components/common/innerSection/InnerSection";
import ReactParserDynamic from "@/components/common/reactParser/ReactParserDynamic";
import { apiFetch } from "@/lib/api";
import './leadership-detail.css'
import '@/styles/inner.css'
import Breadcrumbs from "@/components/common/breadcrumbs/Breadcrumbs";
import { createPageMetadata } from "@/lib/metadata";
import type { Metadata } from "next";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const { data, error } = await apiFetch(`leadership/${slug}`);
    const leader = data?.leadership?.data;

    if (error || !data?.status) {
        return createPageMetadata(null, "Leadership", "Meet the Samtel Group leadership team.");
    }

    return createPageMetadata(
        leader,
        leader?.name || leader?.title || "Leadership",
        "Meet the Samtel Group leadership team.",
    );
}

export default async function LeadershipDetailPage({params}:PageProps){
    const {slug} = await params;
    const {data, error} = await apiFetch(`leadership/${slug}`);
 
    if(error){
        throw new Error(`Failed to fetch leadership detail api`);
    }

    const combinedHtml = Object.values(data?.leadership?.cms ?? {}).join('');
    const descriptionData = data?.leadership?.data?.message;

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