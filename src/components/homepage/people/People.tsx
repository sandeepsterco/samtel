'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { refreshScrollTriggers } from '@/hooks/useScrollTriggerRefresh'
import './people.css'


gsap.registerPlugin(ScrollTrigger)

export default function People() {
    const sectionRef = useRef<HTMLElement | null>(null)
    const imageWrapRef = useRef<HTMLDivElement | null>(null)
    const imageRef = useRef<HTMLImageElement | null>(null)
    const overlayRef = useRef<HTMLDivElement | null>(null)
    const picTextBlockquoteRef = useRef<HTMLQuoteElement | null>(null)
    const moreBtnRef = useRef<HTMLAnchorElement | null>(null)
    const leftFactRef = useRef<HTMLDivElement | null>(null)
    const rightLinkListRef = useRef<HTMLUListElement | null>(null)
    const lineProgressRef = useRef<HTMLSpanElement | null>(null)

    useEffect(() => {
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
                    pinSpacing:true,
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

        refreshScrollTriggers()

        return () => ctx.revert()
    }, [])

    return (
        <section className="people_panel" ref={sectionRef}>
            <div className="font_title">
                <p>PEOPLE</p>
                <blockquote><b>We're a diverse team</b> of thinkers and doers, united by a <br /> steadfast commitment to
                    serving our customers.</blockquote>
            </div>

            <div className="line-wrap2">
                <span className="line-progress2" ref={lineProgressRef}></span>
            </div>

            <div className="people-image-wrap" ref={imageWrapRef}>
                <div className="people-image">
                    <img src="/assets/images/homepage/people/people_pic.webp" className="img-fluid" alt="Worker smiling" ref={imageRef} />
                </div>

                <div className="people-overlay" ref={overlayRef}>
                    <div className="container h-100">
                        <div className="col-lg-11 mx-auto h-100">
                            <div className="overlay-content">

                                <div className="people_pic_text">
                                    <blockquote ref={picTextBlockquoteRef}>At Samtel Avionics, people are the true driving force behind innovation in
                                        aerospace and defense technology</blockquote>
                                    <a href="javascript:void(0)" className="more_btn" ref={moreBtnRef}>
                                        <img src="/assets/icons/right-arrow-white.svg" alt="arrow" className="img-fluid" />
                                    </a>
                                </div>

                                <div className="people_fact_link">
                                    <div className="people_left_fact" ref={leftFactRef}>
                                        <h6>6K<sup>+</sup></h6>
                                        <p>Total Samtel Group <br />Employees</p>
                                    </div>
                                    <div className="people_right_link">
                                        <ul ref={rightLinkListRef}>
                                            <li><a href="javascript:void(0)">Life at Samtel <img
                                                src="/assets/icons/right-arrow-white.svg" alt="arrow"
                                                className="img-fluid" /></a></li>
                                            <li><a href="javascript:void(0)">Open Positions <img
                                                src="/assets/icons/right-arrow-white.svg" alt="arrow"
                                                className="img-fluid" /></a></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}