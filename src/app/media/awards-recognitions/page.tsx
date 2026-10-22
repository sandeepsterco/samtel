import FancyboxWrapper from "@/components/common/FancyboxWrapper";
import PaginationWrapper from "@/components/common/pagination/PaginationWrapper";
import NoData from "@/components/ui/NoData";
import { apiFetch } from "@/lib/api";
import { createPageMetadata } from "@/lib/metadata";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export const metadata = createPageMetadata(
  null,
  "Awards & Recognitions",
  "Explore Samtel Group awards and recognitions.",
);

interface AwardItem {
  id: number;
  title: string;
  image: string;
  image_large?: string | null;
  slug: string;
}

interface AwardsResponse {
  status: boolean;
  data: {
    current_page: number;
    data: AwardItem[];
    last_page: number;
  };
}

export default async function AwardsRecognitionsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  const currentPage = Math.max(1, Number(page) || 1);
  const { data, error } = await apiFetch(`award-recognition?page=${currentPage}`);

  if (error || !data?.status) notFound();

  const awardsData = (data as AwardsResponse).data;
  const awards = awardsData?.data ?? [];

  return (
    <section className="company-sec1 award-sec">
      <div className="container">
        <div className="col-lg-10 mx-auto">
          {awards.length > 0 ? (
            <>
              <FancyboxWrapper className="pres_list">
                {awards.map((award) => {
                  const largeImage = award.image_large || award.image;

                  return (
                    <div key={award.id} className="media_bx">
                      <figure>
                        <Image
                          src={award.image}
                          alt={award.title}
                          className="img-fluid"
                          width={500}
                          height={400}
                          loading="lazy"
                        />
                      </figure>
                      <div className="zoombtn" aria-hidden="true">
                        <Image
                          src="/assets/icons/zoombtn.svg"
                          alt=""
                          className="img-fluid"
                          width={39}
                          height={39}
                        />
                      </div>
                      <Link
                        data-fancybox="gallery"
                        href={largeImage}
                        className="streched_link"
                        aria-label={`View ${award.title}`}
                      />
                      <div className="award-text">
                        <p>{award.title}</p>
                      </div>
                    </div>
                  );
                })}
              </FancyboxWrapper>
              <PaginationWrapper
                currentPage={awardsData?.current_page || 1}
                totalPages={awardsData?.last_page || 1}
              />
            </>
          ) : (
            <NoData />
          )}
        </div>
      </div>
    </section>
  );
}
