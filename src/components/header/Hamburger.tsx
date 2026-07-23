"use client"

import { useState } from "react"
import { createPortal } from "react-dom";
import type { SidebarItem } from "./Header";
import Link from "next/link";
import { BASE_URL } from "@/config/config";

interface HamburgerProps {
    sidebarData: SidebarItem[]
}

export default function Hamburger({sidebarData }:HamburgerProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <>
            <div className={`hamburger ${isSidebarOpen ? 'active' : ''}`} onClick={()=>setIsSidebarOpen(!isSidebarOpen)}>
                <span></span>
                <span></span>
                <span></span>
            </div>

            <div className={`other-links-drawer ${isSidebarOpen ? 'open' : ''}`}>
            <ul>
            {sidebarData.map((item, idx) => (
                <li key={idx} >
                    <Link href={BASE_URL + item.slug}  onClick={()=>setIsSidebarOpen(!isSidebarOpen)}>{item.title}</Link>
                    {/* {item.children?.length > 0 && (
                        <SidebarList items={item.children} />
                    )} */}
                </li>
            ))}
        </ul>
            </div>

            {isSidebarOpen && createPortal(
                <div className="nav-overlay show" onClick={()=>setIsSidebarOpen(false)}></div>,
                document.body
            )}
        </>
    )
}