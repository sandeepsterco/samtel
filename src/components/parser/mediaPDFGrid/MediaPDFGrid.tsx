import Image from "next/image";
import Link from "next/link";

export default async function MediaPDFGrid({ data }: { data: any }) {
  const pageData = data[`media-pdf`] || [];

  if (pageData?.length === 0) return;

  return (
    <>
      <div className="press_grid">
        {pageData.map((item:any, idx:number)=>(
          <div key={idx} className="press_bx">
            {item?.name && (
              <p dangerouslySetInnerHTML={{__html:item?.name}} />
            )}
            <Image src="/assets/icons/pdf_icon.webp" className="img-fluid" width={31} height={39} loading="lazy" alt="pdf icon" />
            {item?.pdf && (
              <Link
                href={item.pdf}
                className="streched_link"
                target="_blank"
              ></Link>
            )}
            
          </div>
        ))}
        
      </div>
    </>
  );
}
