"use client";

import Image from "next/image";
import Link from "next/link";
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { BASE_URL } from "@/config/config";
import "swiper/css";
import "swiper/css/pagination";

interface RelatedNewsItem {
    id: string | number;
    name: string;
    image?: string;
    date?: string;
    slug?: string;
}

interface RelatedNewsProps {
    items: RelatedNewsItem[];
}

export default function RelatedNews({ items }: RelatedNewsProps) {
    return (
        <section className="related-news">
            <div className="container">
                <h3 className="fade-up" data-aos="fade-up" data-aos-delay="0.3" data-aos-duration="1.3">
                    RELATED NEWS
                </h3>

                <div className="rela_newbx">
                    <Swiper
                        className="relatedNewsSwiper"
                        modules={[Pagination]}
                        slidesPerView={1}
                        spaceBetween={15}
                        speed={600}
                        centeredSlides={false}
                        allowTouchMove
                        grabCursor
                        watchOverflow
                        observer
                        observeParents
                        pagination={{ clickable: true }}
                        breakpoints={{
                            576: {
                                slidesPerView: 2,
                                spaceBetween: 20,
                            },
                            992: {
                                slidesPerView: 2,
                                spaceBetween: 20,
                            },
                            1200: {
                                slidesPerView: 4,
                                spaceBetween: 20,
                            },
                        }}
                    >
                        {items.map((item) => (
                            <SwiperSlide key={item.id}>
                                <div className="related_news_item">
                                    <figure>
                                        <Image
                                            src={item.image ?? "/assets/images/placeholders/related_news.webp"}
                                            className="img-fluid w-100"
                                            width={306}
                                            height={234}
                                            loading="lazy"
                                            alt={item.name}
                                        />
                                    </figure>
                                    <div className="replated_text">
                                        {item.name && (
                                            <p
                                                className="name"
                                                dangerouslySetInnerHTML={{ __html: item.name }}
                                            />
                                        )}
                                        <div className="relat_foot">
                                            {item.date && (
                                                <em className="date">
                                                    {new Date(item.date).toLocaleDateString("en-US", {
                                                        month: "long",
                                                        day: "numeric",
                                                        year: "numeric",
                                                    })}
                                                </em>
                                            )}
                                            <div className="">
                                                <Image
                                                    src="/assets/images/icons/read-icon.svg"
                                                    width={20}
                                                    height={20}
                                                    alt=""
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    {item.slug && (
                                        <Link
                                            href={`${BASE_URL}media/newsroom/${item.slug}`}
                                            className="streched_link"
                                            aria-label="Read related news article"
                                        />
                                    )}
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
        </section>
    );
}
