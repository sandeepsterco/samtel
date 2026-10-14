"use client"

import { useCallback, useLayoutEffect, useRef, useState } from "react"
import Image from "next/image"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay, Navigation  } from "swiper/modules"
import type { Swiper as SwiperType } from "swiper"
import { refreshScrollTriggers } from "@/hooks/useScrollTriggerRefresh"
import { BASE_URL } from "@/config/config"
import "swiper/css"
import "swiper/css/navigation"
import "./technology.css"

gsap.registerPlugin(ScrollTrigger)

interface TechnologyImage {
    image: string
}

interface TechnologyInfo {
    title: string
    id: string
    description: string
    label?: string
    slug?: string
    image?: string
}

interface TechnologyPropsInterface {
    data: {
        images?: TechnologyImage[]
        heading?: string
        info?: TechnologyInfo[]
        mobileimage?: string
    }
}

export default function Technology({ data }: TechnologyPropsInterface) {
    const images = data?.images ?? []
    const slides = (data?.info ?? []).map((item, index) => ({
        ...item,
        image: item.image || images[index]?.image,
    }))
    const [activeIndex, setActiveIndex] = useState(0)
    const gridRef = useRef<HTMLDivElement | null>(null)
    const activeIndexRef = useRef(0)
    const timelineRef = useRef<gsap.core.Timeline | null>(null)
    const swiperRef = useRef<SwiperType | null>(null)

    const showSlide = useCallback((requestedIndex: number) => {
        const index = Math.max(0, Math.min(requestedIndex, slides.length - 1))
        const previousIndex = activeIndexRef.current

        if (index === previousIndex) return

        activeIndexRef.current = index
        setActiveIndex(index)

        const grid = gridRef.current
        if (!grid) return

        const images = grid.querySelectorAll<HTMLElement>(".tech_figureitem .techfigure")
        const contents = grid.querySelectorAll<HTMLElement>(".techno_tabdata")
        const newImage = images[index]
        const newContent = contents[index]

        if (!newImage || !newContent) return

        timelineRef.current?.kill()
        gsap.killTweensOf([...images, ...contents])

        const timeline = gsap.timeline()
        images.forEach((image, imageIndex) => {
            const isTarget = imageIndex === index
            timeline.to(image, {
                autoAlpha: isTarget ? 1 : 0,
                scale: isTarget ? 1 : 0.97,
                duration: isTarget ? 0.65 : 0.35,
                ease: isTarget ? "power2.out" : "power2.inOut",
            }, 0)
        })
        contents.forEach((content, contentIndex) => {
            const isTarget = contentIndex === index
            timeline.to(content, {
                autoAlpha: isTarget ? 1 : 0,
                y: isTarget ? 0 : -15,
                duration: isTarget ? 0.5 : 0.25,
                ease: isTarget ? "power2.out" : "power2.in",
            }, isTarget ? 0.2 : 0)
        })
        timelineRef.current = timeline
    }, [slides.length])

    useLayoutEffect(() => {
        const grid = gridRef.current
        if (!grid || slides.length === 0) return

        const media = gsap.matchMedia()

        media.add("(min-width: 993px)", () => {
            const figures = gsap.utils.toArray<HTMLElement>(
                grid.querySelectorAll(".tech_figureitem .techfigure")
            )
            const contents = gsap.utils.toArray<HTMLElement>(
                grid.querySelectorAll(".techno_tabdata")
            )

            gsap.set(figures, { autoAlpha: 0, scale: 1 })
            gsap.set(contents, { autoAlpha: 0, y: 25 })
            gsap.set(figures[activeIndexRef.current], { autoAlpha: 1 })
            gsap.set(contents[activeIndexRef.current], { autoAlpha: 1, y: 0 })

            const trigger = ScrollTrigger.create({
                trigger: grid,
                start: "top 20rem",
                end: () => `+=${window.innerHeight * Math.max(1, slides.length - 1)}`,
                pin: true,
                scrub: false,
                anticipatePin: 1,
                invalidateOnRefresh: true,
                onUpdate: (self) => {
                    const index = Math.min(
                        slides.length - 1,
                        Math.round(self.progress * (slides.length - 1))
                    )
                    if (index !== activeIndexRef.current) showSlide(index)
                },
            })

            return () => {
                trigger.kill()
                timelineRef.current?.kill()
                timelineRef.current = null
            }
        })

        const handleLoad = () => refreshScrollTriggers()
        window.addEventListener("load", handleLoad)
        refreshScrollTriggers()

        return () => {
            window.removeEventListener("load", handleLoad)
            media.revert()
        }
    }, [showSlide, slides.length])

    // const setMobileActiveIndex = (index: number) => {
    //     activeIndexRef.current = index
    //     setActiveIndex(index)
    // }

    return (
        <section className="technology_sec">
            <div className="container-fluid">
                <div className="techno_grid" ref={gridRef}>
                    <div className="techno_left">
                        <div className="tech_figureitem">
                            {slides.map((item, index) => (
                                <figure
                                    key={item.id || index}
                                    className={`techfigure techno0${index + 1}${activeIndex === index ? " active" : ""}`}
                                >
                                    {item.image && (
                                        <Image
                                            src={item.image}
                                            alt={item.title || "Technology"}
                                            width={437}
                                            height={237}
                                            className="img-fluid w-100"
                                            loading="lazy"
                                        />
                                    )}
                                </figure>
                            ))}
                        </div>

                        <div className="techtab">
                            {slides.map((item, index) => (
                                <button
                                    key={item.id || index}
                                    type="button"
                                    className={`techtab_btn${activeIndex === index ? " active" : ""}`}
                                    data-tabid={item.id}
                                    aria-pressed={activeIndex === index}
                                    onClick={() => showSlide(index)}
                                >
                                    {item.label || String(index + 1).padStart(2, "0")}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="techno_right">
                        {data?.heading && (
                            <h4 dangerouslySetInnerHTML={{ __html: data.heading }} />
                        )}
                        <div className="techno_slider">
                            <div className="techno_tabwrapper">
                                {slides.map((item, index) => (
                                    <div
                                        key={item.id || index}
                                        className={`techno_tabdata${activeIndex === index ? " show" : ""}`}
                                        data-target={item.id}
                                    >
                                        {item.title && <h5>{item.title}</h5>}
                                        {item.description && <p>{item.description}</p>}
                                        {item.slug && (
                                            <a href={`${BASE_URL}${item.slug}`} className="more_btn">
                                                <img
                                                    src="/assets/icons/right-arrow-white.svg"
                                                    alt="arrow"
                                                    className="img-fluid"
                                                />
                                            </a>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="techno_mobile for_mobile">
                    {data?.heading && (
                        <h4 dangerouslySetInnerHTML={{ __html: data.heading }} />
                    )}
                    <Swiper
                        className="mySwiper"
                        modules={[Autoplay, Navigation]}
                        loop={slides.length > 1}
                        speed={600}
                        spaceBetween={10}
                        slidesPerView={1}
                        navigation
                        autoplay={slides.length > 1 ? {
                            delay: 3000,
                            disableOnInteraction: false,
                        } : false}
                        breakpoints={{
                            0: { slidesPerView: 1, spaceBetween: 10 },
                            576: { slidesPerView: 2, spaceBetween: 15 },
                            992: { slidesPerView: 3, spaceBetween: 20 },
                        }}
                    >
                        {slides.map((item, index) => (
                            <SwiperSlide key={item.id || index}>
                                <article className="techno_text">
                                    {item.image && (
                                        <figure>
                                            <Image
                                                src={item.image}
                                                alt={item.title || "Technology"}
                                                width={437}
                                                height={237}
                                                className="img-fluid w-100"
                                                loading="lazy"
                                            />
                                        </figure>
                                    )}
                                    {item.title && <h5>{item.title}</h5>}
                                    {item.description && <p>{item.description}</p>}
                                    {item.slug && (
                                        <a href={`${BASE_URL}${item.slug}`} className="more_btn">
                                            <img
                                                src="/assets/icons/right-arrow-white.svg"
                                                alt="arrow"
                                                className="img-fluid"
                                            />
                                        </a>
                                    )}
                                </article>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
        </section>
    )
}
