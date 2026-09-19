import ReactParserDynamic from "@/components/common/reactParser/ReactParserDynamic";
import { apiFetch } from "@/lib/api";
import { notFound } from "next/navigation";

export default async function PressCoveragePage(){
    const {data, error} = await apiFetch(`modular/press-coverage`);

    if(error || !data?.status) notFound();

    const combinedHtml = Object.values(data?.data?.cms ?? {}).join(''); 

    const modularData = data?.data?.modular || {};

    return(
        <ReactParserDynamic html={combinedHtml} pressCoverage={modularData} />
    )
}