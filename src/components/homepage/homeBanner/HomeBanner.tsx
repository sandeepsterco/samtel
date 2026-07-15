"use client"
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { refreshScrollTriggers } from '@/hooks/useScrollTriggerRefresh'
import './homeBanner.css'

gsap.registerPlugin(ScrollTrigger)

interface HomeBannerProps {
    data: {
        titles: any,
        description: string,
        video?: string,
        iframeurl?: string,
        poster?: string,
    }
}

function lockBodyScroll() {
    document.body.classList.add('body-locked')
}

function unlockBodyScroll() {
    document.body.classList.remove('body-locked')
}

function isYouTubeUrl(url: string): boolean {
    return /youtube\.com|youtu\.be/.test(url)
}

function getYouTubeId(url: string): string | null {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([\w-]{11})/)
    return match ? match[1] : null
}

declare global {
    interface Window {
        YT: any
        onYouTubeIframeAPIReady: (() => void) | undefined
    }
}

function loadYouTubeApi(): Promise<void> {
    return new Promise((resolve) => {
        if (window.YT && window.YT.Player) {
            resolve()
            return
        }

        const existingCallback = window.onYouTubeIframeAPIReady
        window.onYouTubeIframeAPIReady = () => {
            existingCallback?.()
            resolve()
        }

        if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
            const tag = document.createElement('script')
            tag.src = 'https://www.youtube.com/iframe_api'
            document.head.appendChild(tag)
        }
    })
}

interface VideoController {
    pause: () => void
    play: () => Promise<void> | void
    reset: () => void
    addVisibleClass: () => void
    removeVisibleClass: () => void
    ensureLoaded: () => void
}

export default function HomeBanner({ data }: HomeBannerProps) {
    const sectionRef = useRef<HTMLElement | null>(null)
    const videoElRef = useRef<HTMLVideoElement | null>(null)
    const sourceElRef = useRef<HTMLSourceElement | null>(null)
    const ytWrapperRef = useRef<HTMLDivElement | null>(null)
    const ytContainerRef = useRef<HTMLDivElement | null>(null)
    const ytPlayerRef = useRef<any>(null)
    const bannerCaptionRef = useRef<HTMLDivElement | null>(null)
    const h1Ref = useRef<HTMLHeadingElement | null>(null)
    const btnRef = useRef<HTMLDivElement | null>(null)
    const pListRef = useRef<HTMLParagraphElement[]>([])
    const pEmRef = useRef<HTMLElement | null>(null)

    const videoLoadedRef = useRef(false)

    pListRef.current = []

    const addPRef = (el: HTMLParagraphElement | null) => {
        if (el && !pListRef.current.includes(el)) {
            pListRef.current.push(el)
        }
    }

    const isYouTube = isYouTubeUrl(data?.iframeurl ?? '')
    const youtubeId = isYouTube ? getYouTubeId(data?.iframeurl ?? '') : null


    useLayoutEffect(() => {
        const section = sectionRef.current
        const bannerCaption = bannerCaptionRef.current
        const h1 = h1Ref.current
        const btn = btnRef.current
        const pEm = pEmRef.current
        const pList = pListRef.current

        if (!section || !h1) return

        let cancelled = false
        let scrollUnlocked = false

        const unlockOnce = () => {
            if (scrollUnlocked) return
            scrollUnlocked = true
            unlockBodyScroll()
        }

        lockBodyScroll()

        // Safety net: never leave scroll locked longer than this,
        // regardless of what happens with GSAP/animations.
        const safetyTimeout = setTimeout(unlockOnce, 6000)

        async function setup() {
            if (!section || !h1) return
            let controller: VideoController

            if (isYouTube && youtubeId) {
                await loadYouTubeApi()
                if (cancelled || !ytContainerRef.current) return

                let ytPlayerCreated = false

                const createPlayer = () => {
                    if (ytPlayerCreated || cancelled || !ytContainerRef.current) return
                    ytPlayerCreated = true
                    ytPlayerRef.current = new window.YT.Player(ytContainerRef.current, {
                        videoId: youtubeId,
                        playerVars: {
                            autoplay: 0,
                            controls: 0,
                            mute: 1,
                            playsinline: 1,
                            loop: 1,
                            playlist: youtubeId
                        },
                        events: {
                            onReady: () => {
                                ytPlayerRef.current?.mute()
                            }
                        }
                    })
                }

                controller = {
                    pause: () => ytPlayerRef.current?.pauseVideo(),
                    play: () => ytPlayerRef.current?.playVideo(),
                    reset: () => ytPlayerRef.current?.seekTo(0, true),
                    addVisibleClass: () => ytWrapperRef.current?.classList.add('visible'),
                    removeVisibleClass: () => ytWrapperRef.current?.classList.remove('visible'),
                    ensureLoaded: createPlayer
                }
            } else {
                const video = videoElRef.current
                if (!video) return

                video.pause()

                const ensureLoaded = () => {
                    if (videoLoadedRef.current || !sourceElRef.current || !data?.video) return
                    videoLoadedRef.current = true
                    sourceElRef.current.src = data.video
                    video.load()
                }

                controller = {
                    pause: () => video.pause(),
                    play: () => {
                        ensureLoaded()
                        return video.play().catch(() => { })
                    },
                    reset: () => { video.currentTime = 0 },
                    addVisibleClass: () => video.classList.add('visible'),
                    removeVisibleClass: () => video.classList.remove('visible'),
                    ensureLoaded
                }
            }

            if (cancelled) return

            const ctx = gsap.context(() => {
                let lastProgress = 0
                let videoStarted = false
                let mainScrollTrigger: ScrollTrigger | undefined

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

                const lineProgress = section.querySelector<HTMLElement>(".line-progress")
                if (!lineProgress) return

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

                            if (scrollingDown && self.progress > 0.35 && self.progress <= 0.50) {
                                controller.ensureLoaded()
                            }

                            if (scrollingDown && self.progress > 0.50) {
                                bannerCaption?.classList.add("transparent")

                                if (!videoStarted) {
                                    controller.ensureLoaded()
                                    controller.addVisibleClass()
                                    controller.play()
                                    videoStarted = true
                                }
                            }

                            if (scrollingUp && self.progress <= 0.50) {
                                bannerCaption?.classList.remove("transparent")
                                controller.removeVisibleClass()
                                controller.pause()
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
                        clearTimeout(safetyTimeout)
                        unlockOnce()
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
        }

        let cleanupFn: (() => void) | undefined
        setup().then((fn) => { cleanupFn = fn })

        return () => {
            cancelled = true
            cleanupFn?.()
            clearTimeout(safetyTimeout)
            unlockOnce()
            ScrollTrigger.getAll().forEach((st)=>{
                if(st.trigger === section) st.kill();
            })
            if (ytPlayerRef.current) {
                ytPlayerRef.current.destroy?.()
            }

        }
    }, [data, isYouTube, youtubeId])

    return (
        <section className="home_banner" ref={sectionRef}>
            {isYouTube ? (
                <div className=" yt_video_wrap" ref={ytWrapperRef}>
                    <div ref={ytContainerRef} className='desktop_video' />
                </div>
            ) : (
                <video
                    className="desktop_video"
                    ref={videoElRef}
                    muted
                    playsInline
                    loop
                    preload="none"
                    aria-hidden="true"
                >
                    <source ref={sourceElRef} type="video/mp4" />
                </video>
            )}

            {!isYouTube && data?.poster && (
                <img
                    className="desktop_video_poster"
                    src={data.poster}
                    alt="home video poster"
                    aria-hidden="true"
                    fetchPriority="high"
                />
            )}

            <div className="banner_caption" ref={bannerCaptionRef}>
                <div className="container">
                    <div className="banner_title">
                        {data?.titles?.[0] && (
                            <h1
                                dangerouslySetInnerHTML={{ __html: data.titles[0].heading }}
                                className='d-none'
                            />
                        )}
                        {data?.titles?.length > 0 && data?.titles.map((item:{paragraph:string}, idx:number)=>(
                            <p key={idx} ref={addPRef} dangerouslySetInnerHTML={{__html:item?.paragraph}} />
                        ))}
                        {data?.description && (
                            <em ref={pEmRef} dangerouslySetInnerHTML={{__html:data?.description}} />
                        )}
                        

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