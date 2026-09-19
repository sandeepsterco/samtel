import { apiFetch } from "@/lib/api";
import { notFound } from "next/navigation";
import Image from "next/image";
import PaginationWrapper from "@/components/common/pagination/PaginationWrapper";
import "./pressCollection.css";

interface MediaPDFInterface {
  name: string;
  pdf: string;
  id: number;
}

interface PageDataInterface {
  data: {
    current_page: number;
    data: MediaPDFInterface[];
    last_page: number;
  };
}

export default async function PressCollection({searchParams}:{searchParams?:Promise<{page?:string}>}) {
  const { page } = await searchParams;
  const currentPage = Number(page) || 1;
  const { data, error } = await apiFetch(`media-pdf?page=${currentPage}`);

  if (error || !data?.status) notFound();

  const pageData = (data as PageDataInterface)?.data || { data: [] };

  if (pageData?.data?.length === 0) return;

  return (
    <>
      <section className="media_sec2 inner">
        <div className="container">
          <div className="col-lg-10 mx-auto">
            <div className="press_grid">
              {pageData.data.map((item) => (
                <div key={item.id} className="press_bx">
                  <p dangerouslySetInnerHTML={{ __html: item.name }} />
                  <Image
                    src="/assets/icons/pdf_icon.webp"
                    className="img-fluid"
                    alt="pdf icon"
                    width={31}
                    height={39}
                    loading="lazy"
                  />
                  {item?.pdf && (
                    <a
                      href={item.pdf}
                      className="streched_link"
                      target="_blank"
                    ></a>
                  )}
                </div>
              ))}
            </div>

            <PaginationWrapper
              currentPage={pageData?.current_page || 1}
              totalPages={pageData?.last_page || 1}
            />
          </div>
        </div>
      </section>
    </>
  );
}
