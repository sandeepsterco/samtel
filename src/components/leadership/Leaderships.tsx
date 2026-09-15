"use client";
import { useState } from "react";
import "./leadership.css";
import Image from "next/image";
import Link from "next/link";
import { BASE_URL } from "@/config/config";

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

export default function Leaderships({ pageData }: { pageData: DataInterface }) {
  const [initialData, setInitialData] = useState(pageData?.data ?? []);

  return (
    <section className="leadership_sec">
      <div className="container">
        <div className="col-lg-10 mx-auto">
          <div className="ledrsp_list">
            {initialData.map((item) => (
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
                            stroke-width="1"
                          ></line>
                          <path
                            id="Path_680"
                            data-name="Path 680"
                            d="M1288.879,911.93l3.517,3.517-3.517,3.517"
                            transform="translate(-1274.732 -911.93)"
                            fill="none"
                            stroke=""
                            stroke-width="1"
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
      </div>
    </section>
  );
}
