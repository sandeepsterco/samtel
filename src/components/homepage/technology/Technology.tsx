"use client"
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useEffect, useLayoutEffect, useRef, useState, type PointerEvent } from 'react';
import { refreshScrollTriggers } from '@/hooks/useScrollTriggerRefresh';
import { BASE_URL } from '@/config/config';
import './technology.css'
import Image from 'next/image';

gsap.registerPlugin(ScrollTrigger);

interface TechnologyImage {
    image: string
}

interface TechnologyInfo {
    title: string
    id: string
    description: string
    slug: string;
}

interface TechnologyPropsInterface {
    data: {
        images: TechnologyImage[]
        heading: string
        info: TechnologyInfo[],
        mobileimage?: string
    }
}

export default function Technology({ data }: TechnologyPropsInterface) {
    const images = data?.images ?? []
    const info = data?.info ?? []
    const [activeTab, setActiveTab] = useState(info[0]?.id ?? '')
    const [isMobile, setIsMobile] = useState(false)
    const [isDragging, setIsDragging] = useState(false)
    const [dragOffset, setDragOffset] = useState(0)
    const sectionRef = useRef<HTMLElement | null>(null)
    const figureRefs = useRef<(HTMLElement | null)[]>([])
    const dragStartX = useRef(0)
    const dragDistance = useRef(0)
    const activeIndex = Math.max(0, info.findIndex((tab) => tab.id === activeTab))

    figureRefs.current = []
    const addFigureRef = (el: HTMLElement | null) => {
        if (el && !figureRefs.current.includes(el)) {
            figureRefs.current.push(el)
        }
    }

    useEffect(() => {
        const mobileQuery = window.matchMedia('(max-width: 992px)')
        const updateMobileState = () => {
            setIsMobile(mobileQuery.matches)
            setIsDragging(false)
            setDragOffset(0)
        }

        updateMobileState()
        mobileQuery.addEventListener('change', updateMobileState)

        return () => mobileQuery.removeEventListener('change', updateMobileState)
    }, [])

    const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
        if (!isMobile || !event.isPrimary || event.button !== 0) return

        dragStartX.current = event.clientX
        dragDistance.current = 0
        setIsDragging(true)
    }

    const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
        if (!isDragging) return

        dragDistance.current = event.clientX - dragStartX.current
        if (
            Math.abs(dragDistance.current) > 5 &&
            !event.currentTarget.hasPointerCapture(event.pointerId)
        ) {
            event.currentTarget.setPointerCapture(event.pointerId)
        }
        setDragOffset(dragDistance.current)
    }

    const handlePointerUp = (event: PointerEvent<HTMLDivElement>, cancelled = false) => {
        if (!isDragging) return

        const distance = dragDistance.current
        setIsDragging(false)
        setDragOffset(0)
        dragDistance.current = 0

        if (cancelled || Math.abs(distance) < 60) return

        const nextIndex = Math.max(
            0,
            Math.min(info.length - 1, activeIndex + (distance < 0 ? 1 : -1))
        )
        if (info[nextIndex]) setActiveTab(info[nextIndex].id)

        if (event.currentTarget.hasPointerCapture(event.pointerId)) {
            event.currentTarget.releasePointerCapture(event.pointerId)
        }
    }

    useLayoutEffect(() => {
        const section = sectionRef.current;
        const figures = figureRefs.current

        if (!section || window.innerWidth < 1024) return
        if (!figures.length || figures.some((f) => !f)) return

        const count = figures.length

        // spread figures symmetrically around 0, e.g. for 4 items: -40,-15,15,40 (scaled)
        const getSpread = (index: number, max: number) => {
            const mid = (count - 1) / 2
            const step = max / mid
            return (index - mid) * step
        }


        const ctx = gsap.context(() => {
            figures.forEach((fig, i) => {
                gsap.set(fig, { yPercent: getSpread(i, 40) })
            })


            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: section,
                    start: 'center center',
                    end: '+=1200',
                    pin: true,
                    pinSpacing: true,
                    scrub: 1.5,
                    invalidateOnRefresh: true,
                    anticipatePin: 1,
                    onUpdate: (self) => {
                        const progress = self.progress
                        const index = Math.min(
                            info.length - 1,
                            Math.floor(progress * info.length)
                        )
                        setActiveTab(info[index].id)

                    },
                },

            })

            figures.forEach((fig, i) => {
                tl.to(fig, { yPercent: getSpread(i, 60) }, 0)
            })

        }, section)

        return () => {
            ctx.revert()
            ScrollTrigger.getAll().forEach((st) => {
                if (st.trigger === section) st.kill()
            })
        }
    }, [images])

    return (
        <section className="technology_sec" ref={sectionRef}>
            <div className="container-fluid">
                <div className="techno_grid">
                    <div className="techno_left">
                        <div className="tech_figureitem">
                            {images.map((img, idx) => (
                                <figure
                                    key={idx}
                                    className={`techfigure techno0${idx + 1}`}
                                    ref={addFigureRef}
                                >
                                    <Image
                                        src={img.image}
                                        alt="Technology"
                                        width={437}
                                        height={237}
                                        className="img-fluid w-100"
                                        loading='lazy'
                                    />
                                </figure>
                            ))}

                        </div>

                        <div className="techtab">
                            {info.map((tab: any) => (
                                <button
                                    key={tab.id}
                                    type="button"
                                    className={`techtab_btn${activeTab === tab.id ? ' active' : ''}`}
                                    data-tabid={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="techno_right">
                        {data?.heading && (
                            <h4 dangerouslySetInnerHTML={{ __html: data.heading }} />
                        )}
                        {data?.mobileimage && (
                            <div className="techno_mobile for_mobile">
                            
                            <figure className="techfigure techno01">
                                <Image src={data.mobileimage} alt="Technology" className="img-fluid w-100" width={359} height={438}
                                 />
                            </figure>

                        </div>
                        )}
                        
                        <div className="techno_slider">

                            <div
                                className={`techno_tabwrapper${isDragging ? ' dragging' : ''}`}
                                style={isMobile ? {
                                    transform: `translate3d(calc(-${activeIndex * 100}% + ${dragOffset}px), 0, 0)`,
                                    transition: isDragging ? 'none' : 'transform 0.45s cubic-bezier(.22,.61,.36,1)',
                                } : undefined}
                                onPointerDown={handlePointerDown}
                                onPointerMove={handlePointerMove}
                                onPointerUp={handlePointerUp}
                                onPointerCancel={(event) => handlePointerUp(event, true)}
                            >
                                {info.map((tab) => (
                                    <div
                                        key={tab.id}
                                        className={`techno_tabdata${activeTab === tab.id ? ' show' : ''}`}
                                        data-target={tab.id}
                                    >
                                        {tab?.title && (
                                            <h5>{tab.title}</h5>
                                        )}
                                        {tab?.description && (
                                            <p>{tab.description}</p>
                                        )}
                                        {tab?.slug && (
                                            <a href={`${BASE_URL}${tab.slug}`} className="more_btn">
                                                <img src="/assets/icons/right-arrow-white.svg" alt="arrow" className="img-fluid" />
                                            </a>
                                        )}

                                    </div>
                                ))}

                            </div>

                            <div className="techno_mobile_nav">
                                <button
                                    type="button"
                                    className="techno_prev"
                                    aria-label="Previous technology"
                                    disabled={isMobile && activeIndex === 0}
                                    onClick={() => {
                                        if (activeIndex > 0) setActiveTab(info[activeIndex - 1].id)
                                    }}
                                >
                                    <img src="/assets/icons/red-left-btn.svg" alt="arrow" className="img-fluid" />
                                </button>
                                <button
                                    type="button"
                                    className="techno_next"
                                    aria-label="Next technology"
                                    disabled={isMobile && activeIndex >= info.length - 1}
                                    onClick={() => {
                                        if (activeIndex < info.length - 1) setActiveTab(info[activeIndex + 1].id)
                                    }}
                                >
                                    <img src="/assets/icons/red-right-btn.svg" alt="arrow" className="img-fluid" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}