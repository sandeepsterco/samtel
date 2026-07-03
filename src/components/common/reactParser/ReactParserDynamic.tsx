import ReactParser from "./ReactParser";

export default function ReactParserDynamic({html}:{html:string}){
    return(
        <div data-react-parser-dynamic="" style={{ display: "contents" }}>
            <ReactParser html={html} />
        </div>
    )
}