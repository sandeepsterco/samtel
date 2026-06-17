'use client'

import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import { useRef } from 'react'
import type { Swiper as SwiperType } from 'swiper'
import 'swiper/css'
import 'swiper/css/navigation'
import './happenings.css'

export interface HappeningItem {
    id: string
    image: string
    title: string
    date: string
}

const happeningsData: HappeningItem[] = [
    {
        id: '1',
        image: '/assets/images/homepage/happenings/happening-pic1.webp',
        title: "Samtel Avionics To Make Display Units For HAL's 156 LCH | Aero India 2025",
        date: 'October 16, 2024'
    },
    {
        id: '2',
        image: '/assets/images/homepage/happenings/happening-pic2.webp',
        title: 'Celebrating Leadership: Samtel Wins Prestigious Engineering and Allied Goods',
        date: 'October 16, 2024'
    },
    {
        id: '3',
        image: '/assets/images/homepage/happenings/happening-pic3.webp',
        title: 'Strategic Expansion: Diverging into Drone Manufacturing and LEO Satellites',
        date: 'October 16, 2024'
    },
    {
        id: '4',
        image: '/assets/images/homepage/happenings/happening-pic4.webp',
        title: "Strengthening Global Alliances: Samtel's Latest Collaboration for Su-30MKM Support",
        date: 'October 16, 2024'
    },
    {
        id: '4',
        image: '/assets/images/homepage/happenings/happening-pic4.webp',
        title: "Strengthening Global Alliances: Samtel's Latest Collaboration for Su-30MKM Support",
        date: 'October 16, 2024'
    }
]

export default function Happenings() {
    const swiperRef = useRef<SwiperType | null>(null)

    return (
        <section className="happenings-section">
            <div className="container">
                <div className="happening-header">
                    <div className="font_title">
                        <p>HAPPENINGS</p>
                        <blockquote>News, Events, Insight and more</blockquote>
                    </div>
                    <a href="javascipt:void(0)" className="more_btn">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="1.1">
                            <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                    </a>
                </div>
            </div>

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
                    {happeningsData.map((item) => (
                        <SwiperSlide key={item.id}>
                            <div className="happening-image">
                                <img src={item.image} className="img-fluid" alt={item.title} />
                            </div>
                            <div className="happening-content">
                                <h3>{item.title}</h3>
                                <span className="happening-date">{item.date}</span>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    )
}