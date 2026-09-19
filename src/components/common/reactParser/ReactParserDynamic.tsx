import ReactParser from "./ReactParser";

export default function ReactParserDynamic({html, pressCoverage, searchParams}:{html:string, pressCoverage?:any, searchParams?:Promise<{page?:string}>}){
    return(
        <div data-react-parser-dynamic="" style={{ display: "contents" }}>
            <ReactParser html={html} pressCoverage={pressCoverage} searchParams={searchParams} />
        </div>
    )
}