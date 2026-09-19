"use client"

import { useState } from "react"
import type { SidebarItem } from "./Header";
import Link from "next/link";
import { BASE_URL } from "@/config/config";

interface HamburgerProps {
    sidebarData: SidebarItem[]
}

export default function Hamburger({ sidebarData }: HamburgerProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    // index of the parent item whose dropdown is open (null = all closed)
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const closeSidebar = () => {
        setIsSidebarOpen(false);
        setOpenIndex(null);
    };

    const toggleSidebar = () => {
        if (isSidebarOpen) {
            closeSidebar();
        } else {
            setIsSidebarOpen(true);
        }
    };

    // Same behaviour as the jQuery version: opening one closes the others,
    // clicking the open one closes it.
    const toggleDropdown = (idx: number) => {
        setOpenIndex((prev) => (prev === idx ? null : idx));
    };

    return (
        <>
            <div
                className={`hamburger ${isSidebarOpen ? "active" : ""}`}
                onClick={toggleSidebar}
            >
                <span></span>
                <span></span>
                <span></span>
            </div>

            <div className={`other-links-drawer ${isSidebarOpen ? "open" : ""}`}>
                <ul>
                    {sidebarData.map((item, idx) => {
                        const hasChildren = !!item.children && item.children.length > 0;
                        const isOpen = openIndex === idx;

                        return (
                            <li key={idx}>
                                {hasChildren ? (
                                    <>
                                        {/* Parent with children: toggles the dropdown, doesn't navigate */}
                                        <a
                                            href="#"
                                            role="button"
                                            aria-expanded={isOpen}
                                            className={`media-toggle ${isOpen ? "active" : ""}`}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                toggleDropdown(idx);
                                            }}
                                        >
                                            {item.title}
                                            <span className="media-arrow">{isOpen ? "−" : "+"}</span>
                                        </a>

                                        <div className={`media-dropdown-wrap ${isOpen ? "open" : ""}`}>
                                            <ul className="media-dropdown">
                                                {item.children!.map((child, cIdx) => (
                                                    <li key={cIdx}>
                                                        <Link
                                                            href={BASE_URL + item.slug + '/' + child.slug}
                                                            onClick={closeSidebar}
                                                        >
                                                            {child.title}
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </>
                                ) : (
                                    <Link href={BASE_URL + item.slug} onClick={closeSidebar}>
                                        {item.title}
                                    </Link>
                                )}
                            </li>
                        );
                    })}
                </ul>
            </div>

            {isSidebarOpen && (
                <div className="nav-overlay show" onClick={closeSidebar}></div>
            )}
        </>
    )
}

/*
  Update the type in ./Header so children are optional and recursive
  (the API's child items have no "children" key):

  export interface SidebarItem {
      title: string;
      slug: string;
      children?: SidebarItem[];
  }
*/