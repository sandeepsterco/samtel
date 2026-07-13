'use client'

import { useEffect, useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Image from 'next/image'
import Link from 'next/link'
import './people.css'


gsap.registerPlugin(ScrollTrigger)

interface ButtonInterface {
    name: string;
    url: string;
}

interface PeoplePropsInterface {
    data: {
        title: string;
        subtitle: string;
        image: string;
        message: string;
        slug: string;
        count: string;
        counttitle: string;
        buttonsgroup: ButtonInterface[];
    }
}

export default function People({ data }: PeoplePropsInterface) {
    const sectionRef = useRef<HTMLElement | null>(null)
    const imageWrapRef = useRef<HTMLDivElement | null>(null)
    const imageRef = useRef<HTMLImageElement | null>(null)
    const overlayRef = useRef<HTMLDivElement | null>(null)
    const picTextBlockquoteRef = useRef<HTMLQuoteElement | null>(null)
    const moreBtnRef = useRef<HTMLAnchorElement | null>(null)
    const leftFactRef = useRef<HTMLDivElement | null>(null)
    const rightLinkListRef = useRef<HTMLUListElement | null>(null)
    const lineProgressRef = useRef<HTMLSpanElement | null>(null)

    useLayoutEffect(() => {
        const section = sectionRef.current
        const imageWrap = imageWrapRef.current
        const image = imageRef.current
        const overlay = overlayRef.current
        const picTextBlockquote = picTextBlockquoteRef.current
        const moreBtn = moreBtnRef.current
        const leftFact = leftFactRef.current
        const rightLinkItems = rightLinkListRef.current?.querySelectorAll('li')
        const lineProgress = lineProgressRef.current

        if (!section || !imageWrap || !image || !overlay) return

        function getDistance() {
            return window.innerHeight || document.documentElement.clientHeight
        }

        const ctx = gsap.context(() => {
            const peopleTl = gsap.timeline({
                scrollTrigger: {
                    trigger: section,
                    start: 'top top',
                    end: '+=350%',
                    scrub: 1,
                    pin: true,
                    anticipatePin: 1,
                    invalidateOnRefresh: true,
                    pinSpacing: true,
                }
            })

            peopleTl
                .to(imageWrap, {
                    y: () => -(getDistance() * 0.3),
                    ease: 'none'
                }, 0)
                .to(imageWrap, {
                    width: '100%',
                    height: '90vh',
                    borderRadius: 0,
                    ease: 'none'
                }, 0)
                .to(image, {
                    scale: 1,
                    ease: 'none'
                }, 0)
                .to(overlay, {
                    autoAlpha: 1,
                    ease: 'none'
                }, 0)

            peopleTl.addLabel('textShow')

            peopleTl
                .fromTo(picTextBlockquote,
                    { opacity: 0, y: 40 },
                    { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
                    'textShow'
                )
                .fromTo(moreBtn,
                    { opacity: 0, scale: 0 },
                    { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.5)' },
                    'textShow+=0.1'
                )
                .fromTo(leftFact,
                    { opacity: 0, y: 50 },
                    { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
                    'textShow'
                )
                .fromTo(rightLinkItems ?? [],
                    { opacity: 0, y: 30 },
                    { opacity: 1, y: 0, stagger: 0.15, duration: 0.6, ease: 'power2.out' },
                    'textShow'
                )

            if (lineProgress) {
                gsap.fromTo(lineProgress,
                    { height: '0%' },
                    {
                        height: '100%',
                        ease: 'none',
                        scrollTrigger: {
                            trigger: section,
                            start: 'top center',
                            end: 'bottom center',
                            scrub: 1
                        }
                    }
                )
            }
        }, section)

        return () => {
            ctx.revert();
            ScrollTrigger.getAll().forEach((st)=>{
                if(st.trigger === section) st.kill();
            })
        }
    }, [])

    return (
        <section className="people_panel" ref={sectionRef}>
            <div className="font_title">
                {data?.title && (
                    <p dangerouslySetInnerHTML={{ __html: data.title }} />
                )}
                {data?.subtitle && (
                    <blockquote dangerouslySetInnerHTML={{ __html: data.subtitle }} />
                )}
            </div>

            <div className="line-wrap2">
                <span className="line-progress2" ref={lineProgressRef}></span>
            </div>

            <div className="people-image-wrap" ref={imageWrapRef}>
                {data?.image && (
                    <div className="people-image">
                        <Image src={data.image} width={2545} height={900} loading='lazy' className="img-fluid" alt="people image" ref={imageRef} />
                    </div>
                )}

                <div className="people-overlay" ref={overlayRef}>
                    <div className="container h-100">
                        <div className="col-lg-11 mx-auto h-100">
                            <div className="overlay-content">

                                {data?.message.trim() && (
                                    <div className="people_pic_text">
                                        <blockquote ref={picTextBlockquoteRef} dangerouslySetInnerHTML={{ __html: data.message }} />
                                        {data?.slug && (
                                            <Link href={data.slug} className="more_btn" ref={moreBtnRef}>
                                                <img src="/assets/icons/right-arrow-white.svg" alt="arrow" className="img-fluid" />
                                            </Link>
                                        )}

                                    </div>
                                )}

                                <div className="people_fact_link">
                                    <div className="people_left_fact" ref={leftFactRef}>
                                        {data?.count.trim() && (
                                            <h6 dangerouslySetInnerHTML={{ __html: data.count }} />
                                        )}
                                        {data?.counttitle && (
                                            <p dangerouslySetInnerHTML={{ __html: data.counttitle }} />
                                        )}
                                    </div>
                                    {data?.buttonsgroup && data.buttonsgroup.length > 0 && (
                                        <div className="people_right_link">
                                            <ul ref={rightLinkListRef}>
                                                {data.buttonsgroup.map((item, idx) => (
                                                    <li key={idx}>
                                                        <Link href={item?.url}>{item?.name} <img src="/assets/icons/right-arrow-white.svg" alt="arrow" className="img-fluid" /></Link>
                                                    </li>
                                                ))}

                                            </ul>
                                        </div>
                                    )}

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}