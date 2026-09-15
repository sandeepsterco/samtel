import InnerSection from "@/components/common/innerSection/InnerSection";
import ReactParserDynamic from "@/components/common/reactParser/ReactParserDynamic";
import { apiFetch } from "@/lib/api";
import './leadership-detail.css'
import Breadcrumbs from "@/components/common/breadcrumbs/Breadcrumbs";

export default async function LeadershipDetailPage({params}:{params:Promise<{slug:string}>}){
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