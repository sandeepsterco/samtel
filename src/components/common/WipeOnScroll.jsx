"use client"

import { usePathname } from "next/navigation";
import { useEffect } from "react";

const WIPERS = [
  { selector: ".image", revealClass: "reveal-image" },
//   { selector: ".image2", revealClass: "reveal-image2" },
//   { selector: ".image3", revealClass: "reveal-image3" },
];

export default function WipeOnScroll(){
    const pathname = usePathname();

    useEffect(()=>{
        const wipeOn = ()=>{
            if (window.innerWidth < 992) return;

            WIPERS.forEach(({selector, revealClass})=>{
                document.querySelectorAll(selector).forEach((el)=>{
                    const rect = el.getBoundingClientRect();
                    if (rect.top < window.innerHeight - 200) {
                        el.classList.add(revealClass);
                    }
                })
            })
        }
        // document.querySelectorAll('.image');

        wipeOn();

        window.addEventListener("scroll", wipeOn, { passive: true });
        window.addEventListener("resize", wipeOn);

        return()=>{
            window.removeEventListener("scroll", wipeOn);
            window.removeEventListener("resize", wipeOn);
        }

    }, [pathname])

    return null;
}