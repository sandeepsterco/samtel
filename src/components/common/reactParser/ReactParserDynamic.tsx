import ReactParser from "./ReactParser";

export default function ReactParserDynamic({html, pressCoverage, modularData, searchParams}:{html:string, pressCoverage?:any, modularData?:any; searchParams?:Promise<{page?:string}>}){
    return(
        <div data-react-parser-dynamic="" style={{ display: "contents" }}>
            <ReactParser html={html} pressCoverage={pressCoverage} searchParams={searchParams} modularData={modularData} />
        </div>
    )
}