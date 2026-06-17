"use client"
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import './technology.css'
import { useEffect, useRef, useState } from 'react';
import { refreshScrollTriggers } from '@/hooks/useScrollTriggerRefresh';

gsap.registerPlugin(ScrollTrigger);

const TABS = [
    {
        id: 'tectab-01',
        label: '01',
        title: 'DESIGN',
        text: 'We engineer mission-ready avionics solutions built for performance, reliability, and compliance in the most demanding operational environments.'
    },
    {
        id: 'tectab-02',
        label: '02',
        title: 'MANFACTURING',
        text: 'We engineer mission-ready avionics solutions built for performance, reliability, and compliance in the most demanding operational environments.'
    },
    {
        id: 'tectab-03',
        label: '03',
        title: 'QUALITY',
        text: 'We engineer mission-ready avionics solutions built for performance, reliability, and compliance in the most demanding operational environments.'
    }
]

export default function Technology(){
    const [activeTab, setActiveTab] = useState(TABS[0].id)

    const sectionRef = useRef<HTMLElement | null>(null)
    const techno01Ref = useRef<HTMLElement | null>(null)
    const techno02Ref = useRef<HTMLElement | null>(null)
    const techno03Ref = useRef<HTMLElement | null>(null)
    const techno04Ref = useRef<HTMLElement | null>(null)

    useEffect(() => {
        const section = sectionRef.current

        if (!section || window.innerWidth < 1024) return

        const figures = [
            techno01Ref.current,
            techno02Ref.current,
            techno03Ref.current,
            techno04Ref.current
        ]

        if (figures.some((f) => !f)) return

        const ctx = gsap.context(() => {
            gsap.set(techno01Ref.current, { yPercent: -40 })
            gsap.set(techno02Ref.current, { yPercent: -15 })
            gsap.set(techno03Ref.current, { yPercent: 15 })
            gsap.set(techno04Ref.current, { yPercent: 40 })

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
                        let index: number

                        if (progress < 0.33) index = 0
                        else if (progress < 0.66) index = 1
                        else index = 2

                        setActiveTab(TABS[index].id)
                    }
                }
            })

            tl.to(techno01Ref.current, { yPercent: -60 }, 0)
                .to(techno02Ref.current, { yPercent: -20 }, 0)
                .to(techno03Ref.current, { yPercent: 25 }, 0)
                .to(techno04Ref.current, { yPercent: 60 }, 0)
        }, section)

        refreshScrollTriggers()

        return () => ctx.revert()
    }, [])

    return (
        <section className="technology_sec" ref={sectionRef}>
        <div className="container-fluid">
            <div className="techno_grid">
                <div className="techno_left">
                    <div className="tech_figureitem">
                        <figure className="techfigure techno01" ref={techno01Ref}>
                            <img src="/assets/images/homepage/technology/techno01.webp" alt="Technology" className="img-fluid w-100" />
                        </figure>
                        <figure className="techfigure techno02" ref={techno02Ref}>
                            <img src="/assets/images/homepage/technology/techno02.webp" alt="Technology" className="img-fluid w-100" />
                        </figure>
                        <figure className="techfigure techno03" ref={techno03Ref}>
                            <img src="/assets/images/homepage/technology/techno03.webp" alt="Technology" className="img-fluid w-100" />
                        </figure>
                        <figure className="techfigure techno04" ref={techno04Ref}>
                            <img src="/assets/images/homepage/technology/techno04.webp" alt="Technology" className="img-fluid w-100" />
                        </figure>
                    </div>

                    <div className="techtab">
                        {TABS.map((tab) => (
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
                    <h4>Technology</h4>
                    <div className="techno_tabwrapper">
                        {TABS.map((tab) => (
                            <div
                                key={tab.id}
                                className={`techno_tabdata${activeTab === tab.id ? ' show' : ''}`}
                                data-target={tab.id}
                            >
                                <h5>{tab.title}</h5>
                                <p>{tab.text}</p>
                                <a href="javascript:void(0)" className="more_btn">
                                    <img src="/assets/icons/right-arrow-white.svg" alt="arrow" className="img-fluid" />
                                </a>
                            </div>
                        ))}

                    </div>
                </div>
            </div>
        </div>
    </section>
    )
}