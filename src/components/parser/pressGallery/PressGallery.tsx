import { apiFetch } from "@/lib/api";
import { notFound } from "next/navigation";
import Image from "next/image";
import PaginationWrapper from "@/components/common/pagination/PaginationWrapper";
import FancyboxWrapper from "@/components/common/FancyboxWrapper";
import Link from "next/link";
import '@/components/parser/mediaGallery/mediaGallery.css'

interface MediaGalleryInterface {
  name: string;
  image: string;
  id: number;
}

interface PageDataInterface {
  data: {
    current_page: number;
    data: MediaGalleryInterface[];
    last_page: number;
  };
}

export default async function PressGallery({
  searchParams,
}: {
  searchParams?: Promise<{ page?: string }>;
}) {
  const { page } = (await searchParams) ?? {};

  const currentPage = Number(page) || 1;
  const { data, error } = await apiFetch(`media-press?page=${currentPage}`);

  if (error || !data?.status) notFound();

  const pageData = (data as PageDataInterface)?.data || { data: [] };

  if (pageData?.data?.length === 0) return null;

  return (
    <section className="media_sec3 inner">
      <div className="container">
        <div className="col-lg-10 mx-auto">
          <FancyboxWrapper className="pres_list">
            {pageData.data.map((item) => (
              <div key={item.id} className="media_bx">
                <figure>
                  <Image
                    src={item.image}
                    alt={`Media Gallery ${item.name}`}
                    className="img-fluid"
                    width={343}
                    height={374}
                    loading="lazy"
                  />
                </figure>
                <div className="zoombtn">
                  <Image
                    src="/assets/icons/zoombtn.svg"
                    alt="zoom icon"
                    className="img-fluid"
                    width={39}
                    height={39}
                    loading="lazy"
                  />
                </div>
                <Link
                  data-fancybox="gallery"
                  href={item.image}
                  className="streched_link"
                ></Link>
              </div>
            ))}
          </FancyboxWrapper>

          <PaginationWrapper
            currentPage={pageData?.current_page || 1}
            totalPages={pageData?.last_page || 1}
          />
        </div>
      </div>
    </section>
  );
}