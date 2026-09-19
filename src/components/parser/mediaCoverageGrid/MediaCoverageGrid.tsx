import Image from "next/image";
import './mediaCoverageGrid.css'
import Link from "next/link";

export default async function MediaCoverageGrid({ data }: { data: any }) {
  const pageData = data[`media-coverage`] || [];

  if(pageData?.length === 0) return;

  return (
    <>
      <div className="media_grid">
        {pageData.map((item:any, idx:number)=>(
          <div key={idx} className="media_lst">
            <div className="media_logo">
              <figure>
                <Image
                  src={item?.image}
                  className="img-fluid"
                  alt="The Times of India logo"
                  width={195}
                  height={156}
                  loading="lazy"
                />
              </figure>
            </div>
            {item?.title && (
              <p dangerouslySetInnerHTML={{__html:item.title}} />
            )}

            {item?.media_name && (
              <div className="media_link">
                <p dangerouslySetInnerHTML={{__html:item.media_name}} />
              </div>
            )}
            
            
            <div className="divider">
              <span></span>
            </div>

            {item?.link && (
              <Link
                href={item.link}
                className="streched_link"
                target="_blank"
                rel="noopener"
              ></Link>
            )}
            
          </div>
        ))}
        
      </div>
    </>
  );
}
