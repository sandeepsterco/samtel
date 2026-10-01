import { apiFetch } from "@/lib/api";
import { notFound } from "next/navigation";
import Image from "next/image";
import PaginationWrapper from "@/components/common/pagination/PaginationWrapper";
import "./mediaElectronic.css";
import Link from "next/link";

interface MediaDataInterface {
  title: string;
  image: string;
  media_name: string;
  link: string;
  id: number;
}

interface PageDataInterface {
  data: {
    current_page: number;
    data: MediaDataInterface[];
    last_page: number | null;
  };
}

export default async function MediaElectronic({searchParams}:{searchParams?:Promise<{page?:string}>}) {
  const page = await searchParams;
  const currentPage = Number(page) || 1;
  const { data, error } = await apiFetch(`media-coverage?page=${currentPage}`);

  if (error || !data?.status) notFound();

  const pageData = (data as PageDataInterface)?.data || { data: [] };

  if (pageData?.data?.length === 0) return;

  return (
    <>
      <div className="media_grid">
            {pageData.data.map((item) => (
              <div key={item.id} className="media_lst">
                <div className="media_logo">
                  <figure>
                    <Image
                      src={item.image}
                      className="img-fluid"
                      alt="The Times of India logo"
                      width={195}
                      height={156}
                      loading="lazy"
                    />
                  </figure>
                </div>
                {item?.title && (
                  <p dangerouslySetInnerHTML={{ __html: item.title }} />
                )}

                {item?.media_name && (
                  <div className="media_link">
                    <p dangerouslySetInnerHTML={{ __html: item.media_name }} />
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

          <PaginationWrapper
            currentPage={pageData?.current_page || 1}
            totalPages={pageData?.last_page || 1}
          />
    </>
  );
}
