"use client"

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { BASE_URL } from '@/config/config';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import './news.css'

interface FeaturedItemInterface {
    name: string;
    date: string;
    image: string;
    featured: string;
    description: string;
    slug: string;
    id: number;
}

interface FeaturedDataInterface {
    data: FeaturedItemInterface[];
    title:string;
}

export default function FeaturedNews({ data, title }: FeaturedDataInterface) {
    return (
        <section className="company-sec1">
            <div className="container">
                {title && (
                    <div className="col-lg-10 mx-auto">
                        <div className="company-text">
                            <h2 dangerouslySetInnerHTML={{__html:title}} />
                        </div>
                    </div>
                )}
                

                <div className="col-lg-12">

                    <Swiper
                        modules={[Autoplay, Pagination]}
                        slidesPerView={1}
                        loop={data?.length > 1}
                        pagination={{ clickable: true }}
                        autoplay={{
                            delay: 3000,
                            disableOnInteraction: false,
                        }}
                    >
                        {data?.map((item) => (
                            <SwiperSlide key={item.id}>
                                <div className="newsroom_full">
                                    <figure>
                                        <Image src={item?.image ?? '/assets/images/placeholders/featured_news.webp'} className="img-fluid w-100" alt={item.name} width={1475} height={603} />
                                    </figure>
                                    <div className="newsroom_full_content">
                                        {item?.date && (
                                            <div className="date">{new Date(item.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
                                        )}
                                        {item?.name && (
                                            <blockquote dangerouslySetInnerHTML={{ __html: item.name }} />
                                        )}
                                        {item?.description && (
                                            <p>{item.description}</p>
                                        )}

                                        {item?.slug && (
                                            <Link href={`${BASE_URL}newsroom/${item.slug}`} className="more_btn">
                                                <img src="/assets/images/icons/right-arrow-red.svg" alt="arrow" className="img-fluid" />
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>

            </div>
        </section>
    )
}