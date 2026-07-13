"use client"
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { refreshScrollTriggers } from '@/hooks/useScrollTriggerRefresh';
import { BASE_URL } from '@/config/config';
import './technology.css'

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
        info: TechnologyInfo[]
    }
}

export default function Technology({ data }: TechnologyPropsInterface) {
    const images = data?.images ?? []
    const info = data?.info ?? []
    const [activeTab, setActiveTab] = useState(info[0].id)
    const sectionRef = useRef<HTMLElement | null>(null)
    const figureRefs = useRef<(HTMLElement | null)[]>([])

    figureRefs.current = []
    const addFigureRef = (el: HTMLElement | null) => {
        if (el && !figureRefs.current.includes(el)) {
            figureRefs.current.push(el)
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
                                    <img
                                        src={img.image}
                                        alt="Technology"
                                        className="img-fluid w-100"
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
                        <div className="techno_tabwrapper">
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
                    </div>
                </div>
            </div>
        </section>
    )
}