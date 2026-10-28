"use client";
import "./leadership.css";
import Image from "next/image";
import Link from "next/link";
import { BASE_URL } from "@/config/config";
import PaginationWrapper from "../common/pagination/PaginationWrapper";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { apiFetch } from "@/lib/api";
import Loading from "@/app/loading1";

interface LeaderItem {
  id: number;
  name: string;
  image: string | null;
  mobile_image: string | null;
  designation: string | null;
  message: string | null;
  slug: string;
  display_order?: string;
}

// Shape of the full API response: { status, data: { first, rest }, meta }
export interface LeadershipResponse {
  status?: boolean;
  data: {
    first: LeaderItem | null;
    rest: LeaderItem[];
  };
  meta: {
    current_page: number;
    last_page: number;
    per_page?: number;
    total?: number;
  };
}

const PLACEHOLDER = "/assets/images/placeholders/leadership.webp";

const fetchLeadershipPage = async (
  page: number,
): Promise<LeadershipResponse> => {
  const { data, error } = await apiFetch(`leadership?page=${page}`);
  if (error || !data) {
    throw new Error("Failed to fetch leadership");
  }
  return data; // keep whole body so we also get `meta`
};

const ArrowIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18.666"
    height="7.74"
    viewBox="0 0 18.666 7.74"
  >
    <g transform="translate(0.296 0.354)">
      <line
        x2="18"
        transform="translate(-0.296 3.482)"
        fill="none"
        stroke=""
        strokeWidth="1"
      ></line>
      <path
        d="M1288.879,911.93l3.517,3.517-3.517,3.517"
        transform="translate(-1274.732 -911.93)"
        fill="none"
        stroke=""
        strokeWidth="1"
      ></path>
    </g>
  </svg>
);

export default function Leaderships({
  pageData,
}: {
  pageData: LeadershipResponse;
}) {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page") || 1);

  const { data, isLoading } = useQuery({
    queryKey: ["leadership", page],
    queryFn: () => fetchLeadershipPage(page),
    initialData: page === pageData?.meta?.current_page ? pageData : undefined,
  });

  if (isLoading) return <Loading />;

  const first = data?.data?.first ?? null;
  const rest = data?.data?.rest ?? [];

  return (
    <section className="leadership_sec">
      {/* ---------- Top / featured leader ---------- */}
      {first && (
        <div className="container-full">
          <div className="leadship_top">
            <div className="leadship_img">
              <picture>
                <source
                  media="(max-width: 767px)"
                  srcSet={first.mobile_image || "/assets/images/leadership_pic.webp"}
                  type="image/webp"
                />

                <Image
                  src={first.image || "/assets/images/leadership_pic.webp"}
                  alt={first.name || "Leadership"}
                  width={1920}
                  height={800}
                  className="img-fluid w-100"
                  priority
                  sizes="100vw"
                />
              </picture>

              <div className="leadership_detail">
                {/* {first.message && (
                  <p
                    className="fade-up"
                    data-delay="0.3"
                    data-duration="2"
                    dangerouslySetInnerHTML={{ __html: first.message }}
                  />
                )} */}
                <p>With over two decades of experience in aerospace, defence, and advanced technologies, Puneet Kaura leads Samtel Avionics' growth and transformation, driving innovation, indigenous capability development, and expansion across defence electronics, avionics, railways, space, UAVs, and emerging strategic domains.
</p>
                <h2 className="fade-up" data-delay="0.3" data-duration="2.3">
                  {first.name}
                </h2>
                {first.designation && (
                  <h3 className="fade-up" data-delay="0.3" data-duration="3">
                    {first.designation}
                  </h3>
                )}

                {first.slug && (
                  <Link
                    href={`${BASE_URL}leadership/${first.slug}`}
                    className="more_btn fade-up"
                    data-delay="0.3"
                    data-duration="3.1"
                  >
                    <Image
                      src="/assets/images/right-arrow-white.svg"
                      alt="arrow"
                      width={20}
                      height={20}
                      className="img-fluid"
                    />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---------- Rest of the team ---------- */}
      <div className="container">
        <div className="col-lg-10 mx-auto">
          <div className="ledrsp_list">
            {rest.map((item) => (
              <div key={item.id} className="ledrsp_bx">
                <figure>
                  <Image
                    src={item.image || PLACEHOLDER}
                    className="img-fluid w-100"
                    alt={item.name || "Leadership"}
                    width={343}
                    height={389}
                    loading="lazy"
                  />
                </figure>
                <div className="ledrsp_txt">
                  <div className="ledrsp_txt_lft">
                    <h5>{item.name}</h5>
                    {item.designation && <p>{item.designation}</p>}
                  </div>

                  <div className="ledrsp_right">
                    <span className="web_btn" aria-label="View Profile">
                      <ArrowIcon />
                    </span>
                  </div>
                </div>
                {item.slug && (
                  <Link
                    href={`${BASE_URL}leadership/${item.slug}`}
                    className="streched_link"
                  ></Link>
                )}
              </div>
            ))}
          </div>
        </div>

        <PaginationWrapper
          currentPage={
            data?.meta?.current_page ?? pageData?.meta?.current_page ?? 1
          }
          totalPages={data?.meta?.last_page ?? pageData?.meta?.last_page ?? 1}
        />
      </div>
    </section>
  );
}
