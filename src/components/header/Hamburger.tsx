"use client";

import { useEffect, useState } from "react";
import type { SidebarItem } from "./Header";
import Link from "next/link";
import { BASE_URL } from "@/config/config";

interface HamburgerProps {
  sidebarData: SidebarItem[];
}

const specialMenus = ["contact us", "media", "careers"];

const isAbsolute = (url: string) => /^https?:\/\//i.test(url);

const getLinkProps = (node: any, slugPath: string) => {
  const custom =
    typeof node.overwrite_url === "string" ? node.overwrite_url.trim() : "";

  const href = custom
    ? isAbsolute(custom)
      ? custom
      : BASE_URL + custom.replace(/^\/+/, "")
    : BASE_URL + slugPath;

  const newTab = Number(node.target_blank) === 1;

  return {
    href,
    ...(newTab ? { target: "_blank", rel: "noopener noreferrer" } : {}),
  };
};

export default function Hamburger({ sidebarData }: HamburgerProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [openKey, setOpenKey] = useState<string | null>(null);

  useEffect(() => {
    if (!isSidebarOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isSidebarOpen]);

  const items = Array.isArray(sidebarData) ? sidebarData : [];
  const topMenus = items.filter((i) =>
    specialMenus.includes(i.title.toLowerCase())
  );
  const bottomMenus = items.filter(
    (i) => !specialMenus.includes(i.title.toLowerCase())
  );

  const closeSidebar = () => {
    setIsSidebarOpen(false);
    setOpenKey(null);
  };

  const toggleSidebar = () =>
    isSidebarOpen ? closeSidebar() : setIsSidebarOpen(true);

  const toggleDropdown = (key: string) =>
    setOpenKey((prev) => (prev === key ? null : key));

  const renderMenu = (menus: any[], prefix: string) =>
    menus.map((item, idx) => {
      const key = `${prefix}-${idx}`;
      const hasChildren =
        Array.isArray(item.children) && item.children.length > 0;
      const isOpen = openKey === key;

      return (
        <li key={key}>
          {hasChildren ? (
            <>
              <a
                href="#"
                role="button"
                aria-expanded={isOpen}
                className={`media-toggle ${isOpen ? "active" : ""}`}
                onClick={(e) => {
                  e.preventDefault();
                  toggleDropdown(key);
                }}
              >
                {item.title}
                <span className="media-arrow">+</span>
              </a>

              <div
                className={`media-dropdown-wrap ${isOpen ? "active open" : ""}`}
              >
                <ul className="media-dropdown">
                  {item.children.map((child: any, cIdx: number) => (
                    <li key={cIdx}>
                      <Link
                        {...getLinkProps(child, `${item.slug}/${child.slug}`)}
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
            <Link {...getLinkProps(item, item.slug)} onClick={closeSidebar}>
              {item.title}
            </Link>
          )}
        </li>
      );
    });

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
          <ul>{renderMenu(topMenus, "top")}</ul>
        </div>

        <div className="cus-btn-link">
          <ul>{renderMenu(bottomMenus, "bottom")}</ul>
        </div>
      </div>

      {isSidebarOpen && (
        <div className="nav-overlay show" onClick={closeSidebar}></div>
      )}
    </>
  );
}