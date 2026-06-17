"use client"
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect, useRef } from 'react'
import './homeBanner.css'
import { refreshScrollTriggers } from '@/hooks/useScrollTriggerRefresh';

gsap.registerPlugin(ScrollTrigger);

export default function HomeBanner() {
    const sectionRef = useRef<HTMLElement | null>(null)
    const videoRef = useRef<HTMLVideoElement | null>(null)
    const bannerCaptionRef = useRef<HTMLDivElement | null>(null)
    const h1Ref = useRef<HTMLHeadingElement | null>(null)
    const btnRef = useRef<HTMLDivElement | null>(null)
    const pListRef = useRef<HTMLParagraphElement[]>([])
    const pEmRef = useRef<HTMLElement | null>(null)

    pListRef.current = [];

    const addPRef = (el: HTMLParagraphElement | null) => {
        if (el && !pListRef.current.includes(el)) {
            pListRef.current.push(el);
        }
    }

    useEffect(() => {
        const section = sectionRef.current
        const video = videoRef.current
        const bannerCaption = bannerCaptionRef.current
        const h1 = h1Ref.current
        const btn = btnRef.current
        const pEm = pEmRef.current
        const pList = pListRef.current

        if (!section || !h1) return;

        const ctx = gsap.context(() => {
            let lastProgress = 0;
            let videoStarted = false;
            let mainScrollTrigger: ScrollTrigger | undefined;

            if (video) {
                video.pause();
                video.currentTime = 0;
            }

            gsap.set(h1, {
                y: "100%",
                opacity: 1,
                transformOrigin: "center center",
                force3D: true
            })

            gsap.set([...pList, btn, pEm], {
                y: 50,
                opacity: 0
            })

            const lineProgress = section.querySelector(".line-progress");

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: section,
                    start: "top top",
                    end: "+180%",
                    scrub: 1,
                    pin: true,
                    pinSpacing: true,
                    invalidateOnRefresh: true,
                    anticipatePin: 1,

                    onUpdate: (self) => {
                        const scrollingDown = self.progress > lastProgress
                        const scrollingUp = self.progress < lastProgress
                        lastProgress = self.progress

                        if (scrollingDown && self.progress > 0.50) {
                            bannerCaption?.classList.add("transparent")

                            if (!videoStarted && video) {
                                video.classList.add("visible")
                                video.play().catch(() => { })
                                videoStarted = true
                            }
                        }

                        if (scrollingUp && self.progress <= 0.50) {
                            bannerCaption?.classList.remove("transparent")
                            video?.classList.remove("visible")
                            video?.pause()
                            videoStarted = false
                        }
                    }
                }
            })

            tl.to(lineProgress, {
                height: "100%",
                ease: "none",
                duration: 1
            }, 0)

                .to(h1, {
                    y: -100,
                    ease: "none",
                    duration: 1
                }, 0)

            tl.to(h1, {
                scale: 10,
                opacity: 0,
                ease: "power2.out",
                duration: 1.5,
                force3D: true
            }, 1)

                .to(pList, {
                    y: -1000,
                    opacity: 0,
                    ease: "power2.out",
                    force3D: true
                }, 1)

                .to(pEm, {
                    y: -1000,
                    opacity: 0,
                    ease: "power2.out",
                    force3D: true
                }, 1)

                .to(btn, {
                    y: -1000,
                    opacity: 0,
                    ease: "power1.out",
                    force3D: true
                }, 1)

            mainScrollTrigger = tl.scrollTrigger
            mainScrollTrigger?.disable()

            ScrollTrigger.create({
                trigger: section,
                start: "bottom bottom",

                onEnter: () => {
                    h1.classList.add("filled")
                },

                onLeaveBack: () => {
                    h1.classList.remove("filled")
                    gsap.set(h1, { y: 100, scale: 1, opacity: 1 })
                    gsap.set(pList, { y: 0, opacity: 1 })
                    gsap.set(pEm, { y: 0, opacity: 1 })
                    gsap.set(btn, { y: 0, opacity: 1 })
                }
            })

            gsap.timeline({
                onComplete: () => {
                    mainScrollTrigger?.enable()
                    refreshScrollTriggers()
                }
            })
                .to(pList, {
                    y: 0,
                    opacity: 1,
                    duration: 0.7,
                    delay: 1,
                    stagger: 0.2,
                    ease: "power3.out"
                }, "-=0.4")

                .to(pEm, {
                    y: 0,
                    opacity: 1,
                    duration: 0.5,
                    delay: .5,
                    stagger: 0.1,
                    ease: "power3.out"
                }, "-=0.3")

                .to(btn, {
                    y: 0,
                    opacity: 1,
                    duration: 0.7,
                    delay: 0.3,
                    ease: "power3.out"
                }, "-=0.4")
        }, section)

        refreshScrollTriggers()

        return () => ctx.revert()
    }, [])

    return (
        <section className="home_banner" ref={sectionRef}>
            <video className="desktop_video" ref={videoRef} muted autoPlay playsInline loop>
                <source src="/assets/videos/sample-video.mp4" type="video/mp4" />
            </video>
            <div className="banner_caption" ref={bannerCaptionRef}>
                <div className="container">
                    <div className="banner_title">
                        <p ref={addPRef}>A part of the 50-year old Samtel Group with a </p>
                        <p ref={addPRef}>multi-dimensional presence in various domains including </p>
                        <p ref={addPRef}><b> Defense, Avionics, Railways, and Education</b></p>
                        <em ref={pEmRef}>Samtel has a well-established history of being India’s largest integrated manufacturer of a wide
                            range of displays for <br />
                            avionics, television, industrial, medical and professional applications.</em>

                        <div className="down_btn" ref={btnRef}>
                            <div className="line-section">
                                <div className="line-wrap">
                                    <span className="line-progress"></span>
                                </div>
                            </div>
                        </div>
                        <div className="video_caption">
                            <h1 className="video_text" ref={h1Ref}> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 803.196 484.129">
                                <g id="Group_29855" data-name="Group 29855" transform="translate(13980.195 3658.485)">
                                    <path id="Path_3405" data-name="Path 3405"
                                        d="M181.419,2.139c33.213-.871,85.323,9.445,114.391,25.891,4.181,2.364,27.889,19.186,27.442,22.205L256.08,124.763C229,94.325,172.45,85.45,137.62,106.869c-24.439,15.028-28.823,48.577-5.839,66.808,37.8,29.987,108.348,30.619,150.63,64.057,71.66,56.664,52.252,172.423-22.214,217.61-66.984,40.651-198.209,34.246-255.4-22.366-3.549-3.514-6.882-7.523-3.171-12.125l65.165-72.185c23.839,18.712,43.329,37.375,75.351,40.649,37.712,3.855,97.2-12.778,80.693-62.373-11.482-34.493-96.939-50.671-129.343-64.783C57.457,246.467,19.873,219.838,13.337,177.9-3.471,70.058,81.11,4.769,181.419,2.139"
                                        transform="translate(-13980.195 -3655.789)" />
                                    <path id="Path_3406" data-name="Path 3406"
                                        d="M551.476,481.319H506.93c-1.48,0-6.666-4.069-7.507-6.194-16.829-38.33-29.437-78.688-48.433-115.96l-255.874-3.409c-1.425-1.258,11.122-33.114,13.541-35.524,2.128-2.117,14.973-5.551,17.289-5.551H429.259c5.422,0,.121-12.389-.756-15.236-22.993-74.711-76.365-159.317-95.661-233.11C327.374,45.421,334.317,21.37,346.186,3.4c1.821-2.758,2.774-5.285,5.365-1.416Z"
                                        transform="translate(-13728.475 -3658.484)" />
                                </g>
                            </svg></h1>
                        </div>
                    </div>
                </div>
            </div>


        </section>
    )
}