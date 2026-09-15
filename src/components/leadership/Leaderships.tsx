"use client";
import { useState } from "react";
import "./leadership.css";
import Image from "next/image";
import Link from "next/link";
import { BASE_URL } from "@/config/config";
import PaginationWrapper from "../common/pagination/PaginationWrapper";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { apiFetch } from "@/lib/api";
import Loading from "@/app/loading";

interface DataItemInterface {
  name: string;
  image: string;
  designation: string;
  slug: string;
  id: number;
}

interface DataInterface {
  current_page: number;
  data: DataItemInterface[];
  last_page: number;
}

const fetchLeadershipPage = async(page:number)=>{
    const {data, error} = await apiFetch(`leadership?page=${page}`);
    if(error){
      throw new Error("Failed to fetch leadership");
    }

    return data?.data;
}

export default function Leaderships({ pageData }: { pageData: DataInterface }) {
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page") || 1);

  const { data, isLoading } = useQuery({
    queryKey:['leadership', page],
    queryFn:()=>fetchLeadershipPage(page),
    initialData:page === pageData.current_page ? pageData : undefined
  });  

  const leadershipData = data?.data ?? [];

  if(isLoading) return <Loading />

  return (
    <section className="leadership_sec">
      <div className="container">
        <div className="col-lg-10 mx-auto">
          <div className="ledrsp_list">
            {leadershipData.map((item:any) => (
              <div key={item.id} className="ledrsp_bx">
                <figure>
                  <Image
                    src={item?.image || "/assets/images/placeholders/leadership.webp"}
                    className="img-fluid"
                    alt={item?.name || 'Leadership'}
                    width={343}
                    height={389}
                    loading="lazy"
                  />
                </figure>
                <div className="ledrsp_txt">
                  <div className="ledrsp_txt_lft">
                    <h5>{item?.name}</h5>
                    <p>{item?.designation}</p>
                  </div>

                  <div className="ledrsp_right">
                    <span className="web_btn" aria-label="View Applications">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18.666"
                        height="7.74"
                        viewBox="0 0 18.666 7.74"
                      >
                        <g
                          id="Group_7232"
                          data-name="Group 7232"
                          transform="translate(0.296 0.354)"
                        >
                          <line
                            id="Line_7"
                            data-name="Line 7"
                            x2="18"
                            transform="translate(-0.296 3.482)"
                            fill="none"
                            stroke=""
                            strokeWidth="1"
                          ></line>
                          <path
                            id="Path_680"
                            data-name="Path 680"
                            d="M1288.879,911.93l3.517,3.517-3.517,3.517"
                            transform="translate(-1274.732 -911.93)"
                            fill="none"
                            stroke=""
                            strokeWidth="1"
                          ></path>
                        </g>
                      </svg>
                    </span>
                  </div>
                </div>
                {item?.slug && (
                    <Link href={`${BASE_URL}leadership/${item.slug}`} className="streched_link"></Link>
                )}
              </div>
            ))}
          </div>
        </div>

        <PaginationWrapper
          currentPage={data?.current_page ?? pageData?.current_page ?? 1}
          totalPages={data?.last_page ?? pageData?.last_page ?? 1}
        />
      </div>
    </section>
  );
}
