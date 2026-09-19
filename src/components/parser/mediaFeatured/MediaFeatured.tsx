
import Image from "next/image";
import "@fancyapps/ui/dist/fancybox/fancybox.css";
import "@/components/parser/pressOnScreen/pressOnScreen.css";
import FancyboxWrapper from "@/components/common/FancyboxWrapper";

export default function MediaFeatured({ data }: { data: any }) {
  const pageData = data?.["featured-screen"] || [];

  if (pageData.length === 0) return null;

  return (
    <FancyboxWrapper className="video_grid" variant="video">
      {pageData.map((item:any, idx:number) => (
        <div key={idx} className="media_bx">
          <figure>
            <Image
              src={item.thumbnail_image}
              alt={item.title}
              className="img-fluid"
              width={343}
              height={244}
              loading="lazy"
            />
          </figure>

          <div className="zoombtn">
            <img
              src="/assets/icons/videopausebtn.svg"
              alt="play"
              className="img-fluid"
            />
          </div>

          {item?.title && <p dangerouslySetInnerHTML={{ __html: item.title }} />}

          {item?.video && (
            <a
              data-fancybox="video"
              href={item.video}
              className="streched_link"
            ></a>
          )}
        </div>
      ))}
    </FancyboxWrapper>
  );
}
