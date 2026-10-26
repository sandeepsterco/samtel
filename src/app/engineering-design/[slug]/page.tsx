import ReactParserDynamic from "@/components/common/reactParser/ReactParserDynamic";
import { apiFetch } from "@/lib/api";

export default async function DynamicInnerPage({params}:{params:Promise<{slug:string}>}){
    const {slug} = await params;
    const {data, error} = await apiFetch(`cms/${slug}`);

    const combinedHtml = Object.values(data?.data?.sections ?? {}).join(''); 

    return(
        <ReactParserDynamic html={combinedHtml} />
    )
}