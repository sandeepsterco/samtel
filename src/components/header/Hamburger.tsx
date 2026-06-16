"use client"

import { useState } from "react"
import { createPortal } from "react-dom";

export default function Hamburger() {
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
                    <li><a href="javascript:void(0)">Careers</a></li>
                    <li><a href="javascript:void(0)">Resources & Media</a></li>
                    <li><a href="javascript:void(0)">Contact Us</a></li>
                    <li><a href="javascript:void(0)">Privacy Policy</a></li>
                </ul>
            </div>

            {isSidebarOpen && createPortal(
                <div className="nav-overlay show" onClick={()=>setIsSidebarOpen(false)}></div>,
                document.body
            )}
        </>
    )
}