"use client"

import { usePathname } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { HeaderContextProvider, useHeader } from "./HeaderContext"

// Sections where the header should stay hidden regardless of scroll direction
const HIDE_SECTIONS = [".testim_sec"]

function HeaderShell({ children }: { children: React.ReactNode }) {
    const [baseClass, setBaseClass] = useState("")
    const sectionRef = useRef<HTMLElement>(null)
    const lastScrollTop = useRef(0)
    const pathname = usePathname()
    const { showMegaMenu } = useHeader()

    useEffect(() => {
        setBaseClass(pathname !== "/" ? "inner" : "")
    }, [pathname])

    useEffect(() => {
        const section = sectionRef.current
        if (!section) return

        const onScroll = () => {
            const scrollTop = window.scrollY || document.documentElement.scrollTop

            section.classList.toggle("header_fix", scrollTop > 0)

            // Force-hide while inside certain sections
            let insideAnySection = false

            for (const selector of HIDE_SECTIONS) {
                const target = document.querySelector<HTMLElement>(selector)
                if (!target) continue

                const targetTop = target.getBoundingClientRect().top + window.scrollY
                const targetBottom = targetTop + target.offsetHeight

                if (scrollTop >= targetTop - 100 && scrollTop <= targetBottom) {
                    insideAnySection = true
                    break
                }
            }

            if (insideAnySection) {
                section.style.top = "-100%"
            } else if (scrollTop > lastScrollTop.current && scrollTop > 100) {
                // scrolling down -> hide
                section.style.top = "-100%"
            } else if (scrollTop < lastScrollTop.current) {
                // scrolling up -> show
                section.style.top = "0"
            }

            // Always show at the very top of the page
            if (scrollTop <= 0) {
                section.style.top = "0"
            }

            lastScrollTop.current = scrollTop
        }

        onScroll()
        window.addEventListener("scroll", onScroll, { passive: true })
        return () => window.removeEventListener("scroll", onScroll)
    }, [pathname])

    return (
        <section
            ref={sectionRef}
            className={`header ${baseClass} ${showMegaMenu ? "menu-open" : ""}`}
        >
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