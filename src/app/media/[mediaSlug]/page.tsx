import ReactParserDynamic from "@/components/common/reactParser/ReactParserDynamic";
import { apiFetch } from "@/lib/api";
import { notFound } from "next/navigation";

export default async function PressCoveragePage({params, searchParams}:{params:Promise<{mediaSlug:string}>, searchParams: Promise<{ page?: string }>}){
    const {mediaSlug} = await params;
    const {data, error} = await apiFetch(`modular/${mediaSlug}`);

    if(error || !data?.status) notFound();

    const combinedHtml = Object.values(data?.data?.cms ?? {}).join(''); 

    return(
        <ReactParserDynamic html={combinedHtml} searchParams={searchParams}  />
    )
}