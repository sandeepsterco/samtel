"use client"

import { usePathname } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { HeaderContextProvider, useHeader } from "./HeaderContext"

// Sections where the header stays hidden regardless of scroll direction
const HIDE_SECTIONS = [".testim_sec"]

function HeaderShell({ children }: { children: React.ReactNode }) {
    const [hidden, setHidden] = useState(false)
    const [fixed, setFixed] = useState(false)
    const lastScroll = useRef(0)
    const pathname = usePathname()
    const { showMegaMenu } = useHeader()

    // Keep the latest menu state available to the scroll listener
    // without re-binding it every time the menu opens/closes
    const menuOpenRef = useRef(showMegaMenu)
    menuOpenRef.current = showMegaMenu

    const baseClass = pathname !== "/" ? "inner" : ""

    useEffect(() => {
        lastScroll.current = window.scrollY || 0
        setHidden(false)

        let ticking = false

        const update = () => {
            ticking = false
            const current = window.scrollY || document.documentElement.scrollTop

            setFixed(current > 400)

            // Always show at the very top
            if (current <= 0) {
                setHidden(false)
                lastScroll.current = 0
                return
            }

            // Force-hide inside specific sections
            const insideSection = HIDE_SECTIONS.some((selector) => {
                const el = document.querySelector<HTMLElement>(selector)
                if (!el) return false
                const top = el.getBoundingClientRect().top + window.scrollY
                return current >= top - 100 && current <= top + el.offsetHeight
            })

            if (insideSection) {
                setHidden(true)
            } else if (current > lastScroll.current) {
                // scrolling down -> hide (unless mega menu is open)
                if (!menuOpenRef.current) setHidden(true)
            } else if (current < lastScroll.current) {
                // scrolling up -> show
                setHidden(false)
            }

            lastScroll.current = current
        }

        const onScroll = () => {
            if (ticking) return
            ticking = true
            requestAnimationFrame(update)
        }

        update()
        window.addEventListener("scroll", onScroll, { passive: true })
        return () => window.removeEventListener("scroll", onScroll)
    }, [pathname])

    const className = [
        "header",
        baseClass,
        fixed && "header_fix",
        hidden && "hide-header",
        showMegaMenu && "menu-open",
    ]
        .filter(Boolean)
        .join(" ")

    return (
        <section className={className}>
            {children}
            {showMegaMenu &&
                createPortal(<div className="menu_backdrop"></div>, document.body)}
        </section>
    )
}

export default function HeaderWrapper({ children }: { children: React.ReactNode }) {
    return (
        <HeaderContextProvider>
            <HeaderShell>{children}</HeaderShell>
        </HeaderContextProvider>
    )
}