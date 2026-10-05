"use client";
import { BASE_URL } from "@/config/config";
import Hamburger from "./Hamburger";
import Image from "next/image";
import Link from "next/link";
import MegaMenu from "./megaMenu/MegaMenu";
import { useRef, useState, useEffect, useCallback } from "react";
import { HeaderMenuItem, ProductCategory, SidebarItem } from "./Header";
import { useHeader } from "./HeaderContext";
import "./header.css";
import { usePathname } from "next/navigation";

const CLOSE_DELAY = 350; 


export default function HeaderData({
  headerData,
  sidebarData,
  productCategoryData,
  infoData
}: {
  headerData: HeaderMenuItem[];
  sidebarData: SidebarItem[];
  productCategoryData: ProductCategory[];
  infoData:any
}) {
  const navRef = useRef<HTMLDivElement>(null);
  const {showMegaMenu, setShowMegaMenu} = useHeader()
  const [headerHeight, setHeaderHeight] = useState(0);
  const closeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pathname = usePathname();

  const clearCloseTimer = useCallback(() => {
    if (closeTimeout.current) {
      clearTimeout(closeTimeout.current);
      closeTimeout.current = null;
    }
  }, []);

  const updateHeight = useCallback(() => {
    if (navRef.current) {
      setHeaderHeight(navRef.current.getBoundingClientRect().height);
    }
  }, []);

  useEffect(() => {
    updateHeight();
    const el = navRef.current;
    if (!el) return;
    const ro = new ResizeObserver(updateHeight);
    ro.observe(el);
    window.addEventListener("resize", updateHeight);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", updateHeight);
    };
  }, [updateHeight]);

  const openMenu = useCallback(() => {
    clearCloseTimer();
    updateHeight();
    setShowMegaMenu(true);
  }, [clearCloseTimer, updateHeight, setShowMegaMenu]);

  const closeMenu = useCallback(() => {
    clearCloseTimer();
    closeTimeout.current = setTimeout(() => setShowMegaMenu(false), CLOSE_DELAY);
  }, [clearCloseTimer, setShowMegaMenu]);

  const closeMenuNow = useCallback(() => {
    clearCloseTimer();
    setShowMegaMenu(false);
  }, [clearCloseTimer, setShowMegaMenu]);

  useEffect(() => {
    closeMenuNow();
  }, [pathname, closeMenuNow]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMenuNow();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [closeMenuNow]);

  useEffect(() => clearCloseTimer, [clearCloseTimer]);

  return (
    <>
      <div className="container">
        <div className="header_nav" ref={navRef}>
          <div className="logo">
            <Link href={BASE_URL ?? "/"}>
              <figure>
                <Image
                  src="/assets/images/main-logo.webp"
                  className="img-fluid"
                  alt="Logo"
                  width={164}
                  height={125}
                  priority
                  loading="eager"
                  fetchPriority="high"
                />
              </figure>
            </Link>
          </div>
          <nav className="main-nav">
            <ul>
              {headerData.map((item: any, idx: number) => (
                <li
                  key={idx}
                  className={`${item.title === "Industries" ? "mega-parent" : "" } ${item?.children?.length > 0 ? 'site_dropdown' : ''} ${showMegaMenu && item.title === "Industries" ? 'active' : ''}`}
                  onMouseEnter={() => {
                    if (item.title === "Industries") openMenu();
                  }}
                  onMouseLeave={() => {
                    if (item.title === "Industries") closeMenu();
                  }}
                >
                  <Link href={BASE_URL + item.slug}>{item.title}</Link>

                  {item?.children?.length > 0 && (
                    <ul className="site_dropdown_menu">
                      {item.children.map((li:any, liIdx:number)=>(
                        <li key={liIdx}>
                          <Link href={`${BASE_URL}${li.slug}`}>{li.title}</Link>
                        </li>
                      ))}
                      
                    </ul>
                  )}

                  
                </li>
              ))}
            </ul>
          </nav>

          <Hamburger sidebarData={sidebarData} />
        </div>
      </div>

      <MegaMenu
        show={showMegaMenu}
        categoryData={productCategoryData}
        topOffset={headerHeight}
        infoData={infoData}
        onMouseEnter={openMenu}
        onMouseLeave={closeMenu}
        onClose={closeMenuNow}
      />
    </>
  );
}