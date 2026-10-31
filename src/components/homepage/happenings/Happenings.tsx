'use client'

import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import { useRef } from 'react'
import type { Swiper as SwiperType } from 'swiper'
import 'swiper/css'
import 'swiper/css/navigation'
import './happenings.css'
import Link from 'next/link'
import FancyboxWrapper from '@/components/common/FancyboxWrapper'
import Image from 'next/image'

export interface HappeningItem {
    name?: string;
    title?: string;
    image?: string;
    thumbnail_image?: string;
    date: string
    slug: string;
    video?: string | null;
    video_url?: string | null;
    youtube_url?: string | null;
    pdf?: string | null;
    link?: string | null;
    external_link?: string | null;
}

function getUrl(value?: string | null): string | undefined {
    if (!value?.trim()) return undefined;

    const trimmedValue = value.trim();
    const markdownLink = trimmedValue.match(/^\[[^\]]+\]\((.+)\)$/);
    return (markdownLink?.[1] ?? trimmedValue).trim() || undefined;
}

function getVideoUrl(item: HappeningItem): string | undefined {
    const videoUrl = getUrl(item.video_url) || getUrl(item.video);
    if (!videoUrl) return undefined;

    try {
        const url = new URL(videoUrl);
        const youtubeId = url.hostname === 'youtu.be'
            ? url.pathname.slice(1)
            : url.searchParams.get('v') ?? url.pathname.match(/\/(?:embed|shorts|live)\/([^/?]+)/)?.[1];

        if (youtubeId && (/\.youtube\.com$/.test(url.hostname) || url.hostname === 'youtu.be')) {
            return `https://www.youtube.com/embed/${youtubeId}`;
        }
    } catch {
        return videoUrl;
    }

    return videoUrl;
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
                            <p dangerouslySetInnerHTML={{__html:data.title}}  className="fade-up" data-aos="fade-up" data-aos-delay="400" />
                        )}
                        {data?.subtitle && (
                            <blockquote className="fade-up" data-aos="fade-up" data-aos-delay="500" dangerouslySetInnerHTML={{__html:data.subtitle}}  />
                        )}
                    </div>
                    {data?.link && (
                        <div className="for_desktop">
                            <Link href={data.link} className="more_btn fade-up" data-aos="fade-up" data-aos-delay="600">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    strokeWidth="1.1">
                                    <polyline points="9 18 15 12 9 6"></polyline>
                                </svg>
                            </Link>
                        </div>
                    )}
                    
                </div>
            </div>

            {data?.happeningsData && data?.happeningsData?.length > 0 && (
                <div className="slider-outer-wrapper fade-up" data-aos="fade-up" data-aos-delay="700">
                    <FancyboxWrapper variant="video">
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
                            {data?.happeningsData.map((item, idx) => {
                                const videoUrl = getVideoUrl(item);
                                const href = getUrl(item.pdf)
                                    || getUrl(item.link)
                                    || getUrl(item.external_link)
                                    || getUrl(item.youtube_url);
                                const image = videoUrl
                                    ? item.thumbnail_image || item.image
                                    : item.image || item.thumbnail_image;
                                const title = item.name || item.title || '';

                                const content = (
                                    <>
                                        <div className="happening-image">
                                            {image && <Image loading='lazy' width={500} height={350} src={getUrl(image) ?? ''} className="img-fluid" alt={title} />}
                                            {videoUrl && (
                                                <span className="happening-video-play" aria-hidden="true">
                                                    <img src="/assets/icons/videopausebtn.svg" alt="" />
                                                </span>
                                            )}
                                        </div>

                                        <div className="happening-content">
                                            <h3>{title}</h3>
                                            <span className="happening-date">
                                                {new Date(item.date).toLocaleDateString('en-US', {
                                                    month: 'long',
                                                    day: 'numeric',
                                                    year: 'numeric',
                                                })}
                                            </span>
                                        </div>
                                    </>
                                );

                                return (
                                    <SwiperSlide key={item.slug || idx}>
                                        <div className="content">
                                            {videoUrl ? (
                                                <>
                                                    {content}
                                                    <a
                                                        data-fancybox="video"
                                                        href={videoUrl}
                                                        className="streched_link"
                                                        aria-label={`Play ${title}`}
                                                    />
                                                </>
                                            ) : href ? (
                                                <>
                                                    {content}
                                                    <Link
                                                        className="streched_link"
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        href={href}
                                                    />
                                                </>
                                            ) : (
                                                content
                                            )}
                                        </div>
                                    </SwiperSlide>
                                );
                            })}
                        </Swiper>
                    </FancyboxWrapper>
                </div>
            )}

            
        </section>
    )
}