'use client'

import { useEffect } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

let refreshTimer: ReturnType<typeof setTimeout> | null = null

export function refreshScrollTriggers() {
    if (refreshTimer) clearTimeout(refreshTimer)

    refreshTimer = setTimeout(() => {
        ScrollTrigger.sort()
        ScrollTrigger.refresh()
        refreshTimer = null
    }, 100)
}


export function useScrollTriggerRefresh() {
    useEffect(() => {
        refreshScrollTriggers()

        const handleResize = () => refreshScrollTriggers()
        const handleLoad = () => refreshScrollTriggers()

        window.addEventListener('resize', handleResize)
        window.addEventListener('load', handleLoad)

        const images = Array.from(document.images)
        const pending = images.filter((img) => !img.complete)

        const handleImageLoad = () => refreshScrollTriggers()
        pending.forEach((img) => {
            img.addEventListener('load', handleImageLoad)
            img.addEventListener('error', handleImageLoad)
        })

        return () => {
            window.removeEventListener('resize', handleResize)
            window.removeEventListener('load', handleLoad)
            pending.forEach((img) => {
                img.removeEventListener('load', handleImageLoad)
                img.removeEventListener('error', handleImageLoad)
            })
        }
    }, [])
}
