'use client'

import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import { useRef } from 'react'
import type { Swiper as SwiperType } from 'swiper'
import 'swiper/css'
import 'swiper/css/navigation'
import './happenings.css'
import Link from 'next/link'
import { BASE_URL } from '@/config/config'

export interface HappeningItem {
    name: string;
    image:string;
    date: string
    slug: string
}

interface HappeningsPropsInterface{
    data:{
        title:string;
        subtitle:string;
        link?:string;
        happeningsData?: HappeningItem[]
    }
}

export default function Happenings({data}:HappeningsPropsInterface) {
    const swiperRef = useRef<SwiperType | null>(null)

    return (
        <section className="happenings-section">
            <div className="container">
                <div className="happening-header">
                    <div className="font_title">
                        {data?.title && (
                            <p dangerouslySetInnerHTML={{__html:data.title}} />
                        )}
                        {data?.subtitle && (
                            <blockquote dangerouslySetInnerHTML={{__html:data.subtitle}}  />
                        )}
                    </div>
                    {data?.link && (
                        <Link href={data.link} className="more_btn">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                strokeWidth="1.1">
                                <polyline points="9 18 15 12 9 6"></polyline>
                            </svg>
                        </Link>
                    )}
                    
                </div>
            </div>

            {data?.happeningsData && data?.happeningsData?.length > 0 && (
                <div className="slider-outer-wrapper">
                    <Swiper
                        modules={[Navigation]}
                        className="happenings-slider"
                        slidesPerView={1.2}
                        spaceBetween={8}
                        grabCursor={true}
                        navigation={{ nextEl: '.swiper-button-next-custom' }}
                        onSwiper={(swiper) => { swiperRef.current = swiper }}
                        breakpoints={{
                            480: {
                                slidesPerView: 2.2,
                                spaceBetween: 8
                            },
                            768: {
                                slidesPerView: 3.2,
                                spaceBetween: 8
                            },
                            1024: {
                                slidesPerView: 4,
                                spaceBetween: 8,
                                allowTouchMove: true
                            }
                        }}
                    >
                        {data?.happeningsData.map((item, idx) => (
                            <SwiperSlide key={idx}>
                                <div className='content'>
                                    <div className="happening-image">
                                        <img src={item.image} className="img-fluid" alt={item.name} />
                                    </div>
                                    <div className="happening-content">
                                        <h3>{item.name}</h3>
                                        <span className="happening-date">{item.date}</span>
                                    </div>
                                    {item?.slug && (
                                        <Link className="streched_link" href={`${BASE_URL}newsroom/${item.slug}`}></Link>
                                    )}
                                </div>

                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            )}

            
        </section>
    )
}