import ComingSoon from "@/components/common/comingSoon/ComingSoon";
import ReactParserDynamic from "@/components/common/reactParser/ReactParserDynamic";
import { apiFetch } from "@/lib/api";
import { notFound } from "next/navigation";

export default async function PressCoveragePage({params, searchParams}:{params:Promise<{mediaSlug:string}>, searchParams: Promise<{ page?: string }>}){
    const {mediaSlug} = await params;
    const {data, error} = await apiFetch(`cms/${mediaSlug}`);

    if(error || !data?.status) notFound();

    const combinedHtml = Object.values(data?.data?.sections ?? {}).join(''); 

    const modularData = data?.data?.modular || {};

    if(combinedHtml?.length === 0) {
        return <ComingSoon />
    };

    return(
        <ReactParserDynamic html={combinedHtml} searchParams={searchParams} modularData={modularData}  />
    )
}