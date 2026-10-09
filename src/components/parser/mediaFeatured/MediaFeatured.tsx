
import Image from "next/image";
import "@fancyapps/ui/dist/fancybox/fancybox.css";
import "@/components/parser/pressOnScreen/pressOnScreen.css";
import FancyboxWrapper from "@/components/common/FancyboxWrapper";

function getVideoUrl(item: any): string | undefined {
  const videoUrl = item?.video_url;
  if (!videoUrl) return item?.video;

  try {
    const url = new URL(videoUrl);
    const youtubeId = url.hostname === "youtu.be"
      ? url.pathname.slice(1)
      : url.searchParams.get("v") ?? url.pathname.match(/\/(?:embed|shorts|live)\/([^/?]+)/)?.[1];

    if (youtubeId && (/\.youtube\.com$/.test(url.hostname) || url.hostname === "youtu.be")) {
      return `https://www.youtube.com/embed/${youtubeId}`;
    }
  } catch {
    return videoUrl;
  }

  return videoUrl;
}

export default function MediaFeatured({ data }: { data: any }) {
  const pageData = data?.["featured-screen"] || [];

  if (pageData.length === 0) return null;

  return (
    <FancyboxWrapper className="video_grid" variant="video">
      {pageData.map((item:any, idx:number) => {
        const videoUrl = getVideoUrl(item);

        return (
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

          {videoUrl && (
            <a
              data-fancybox="video"
              href={videoUrl}
              className="streched_link"
            ></a>
          )}
          </div>
        );
      })}
    </FancyboxWrapper>
  );
}
