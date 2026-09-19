import { apiFetch } from "@/lib/api";
import { notFound } from "next/navigation";
import FancyboxWrapper from "@/components/common/FancyboxWrapper";
import "./pressOnScreen.css";
import Image from "next/image";

interface FeaturedScreenInterface {
  title: string;
  thumbnail_image: string;
  video: string;
  id: number;
}

interface PageDataInterface {
  data: {
    current_page: number;
    data: FeaturedScreenInterface[];
    last_page: number;
  };
}

export default async function PressOnScreen({
  searchParams,
}: {
  searchParams?: Promise<{ page?: string }>;
}) {
  const { page } = (await searchParams) ?? {};

  const currentPage = Number(page) || 1;
  const { data, error } = await apiFetch(`featured-screen?page=${currentPage}`);

  if (error || !data?.status) notFound();

  const pageData = (data as PageDataInterface)?.data || { data: [] };

  if (pageData?.data?.length === 0) return null;

  return (
    <FancyboxWrapper className="video_grid" variant="video">
      {pageData.data.map((item) => (
        <div key={item.id} className="media_bx">
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