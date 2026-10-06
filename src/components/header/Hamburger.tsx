"use client";

import { useEffect, useState } from "react";
import type { SidebarItem } from "./Header";
import Link from "next/link";
import { BASE_URL } from "@/config/config";

interface HamburgerProps {
  sidebarData: SidebarItem[];
}

const specialMenus = ["contact us", "media"];

export default function Hamburger({ sidebarData }: HamburgerProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!isSidebarOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isSidebarOpen]);

  const topMenus =
    Array.isArray(sidebarData) &&
    sidebarData.filter((item) => {
      return specialMenus.includes(item.title.toLocaleLowerCase());
    });

  const bottomMenus =
    Array.isArray(sidebarData) &&
    sidebarData.filter((item) => {
      return !specialMenus.includes(item.title.toLocaleLowerCase());
    });

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
        <div className="custom_link">
          <ul>
            {Array.isArray(topMenus) &&
              topMenus.map((item: any, idx: number) => {
                const hasChildren = !!item.children && item.children.length > 0;
                const isOpen = openIndex === idx;

                return (
                  <li key={idx}>
                    {hasChildren ? (
                      <>
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
                          <span className="media-arrow">
                            +
                          </span>
                        </a>

                        <div
                          className={`media-dropdown-wrap ${isOpen ? "active" : ""}`}
                        >
                          <ul className="media-dropdown">
                            {Array.isArray(item.children) &&
                              item.children.map((child: any, cIdx: number) => (
                                <li key={cIdx}>
                                  <Link
                                    href={
                                      BASE_URL + item.slug + "/" + child.slug
                                    }
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

        <div className="cus-btn-link">
          <ul>
            {Array.isArray(bottomMenus) &&
              bottomMenus.map((item: any, idx: number) => {
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
                          <span className="media-arrow">
                            +
                          </span>
                        </a>

                        <div
                          className={`media-dropdown-wrap ${isOpen ? "open" : ""}`}
                        >
                          <ul className="media-dropdown">
                            {Array.isArray(item.children) &&
                              item.children.map((child: any, cIdx: number) => (
                                <li key={cIdx}>
                                  <Link
                                    href={
                                      BASE_URL + item.slug + "/" + child.slug
                                    }
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
      </div>

      {isSidebarOpen && (
        <div className="nav-overlay show" onClick={closeSidebar}></div>
      )}
    </>
  );
}

