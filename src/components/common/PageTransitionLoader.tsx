"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Loading from "@/app/loading1";

export function notifyPageNavigation(destination: string) {
    const target = new URL(destination, window.location.href);
    const current = new URL(window.location.href);

    if (target.origin !== current.origin || target.pathname === current.pathname) {
        return;
    }

    window.dispatchEvent(new Event("samtel:navigation-start"));
}

export default function PageTransitionLoader() {
    const pathname = usePathname();
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const frameId = requestAnimationFrame(() => setIsVisible(false));
        return () => cancelAnimationFrame(frameId);
    }, [pathname]);

    useEffect(() => {
        const showLoader = () => setIsVisible(true);
        const handleClick = (event: MouseEvent) => {
            if (
                event.button !== 0 ||
                event.metaKey ||
                event.ctrlKey ||
                event.shiftKey ||
                event.altKey
            ) {
                return;
            }

            const target = event.target;
            if (!(target instanceof Element)) return;

            const link = target.closest("a");
            if (
                !link ||
                link.hasAttribute("download") ||
                link.hasAttribute("data-fancybox")
            ) {
                return;
            }
            if (link.target && link.target !== "_self") return;

            const destination = new URL(link.href, window.location.href);
            const current = new URL(window.location.href);
            if (
                destination.origin === current.origin &&
                destination.pathname !== current.pathname
            ) {
                showLoader();
            }
        };

        document.addEventListener("click", handleClick, true);
        window.addEventListener("popstate", showLoader);
        window.addEventListener("samtel:navigation-start", showLoader);

        return () => {
            document.removeEventListener("click", handleClick, true);
            window.removeEventListener("popstate", showLoader);
            window.removeEventListener("samtel:navigation-start", showLoader);
        };
    }, []);

    return isVisible ? <Loading /> : null;
}
