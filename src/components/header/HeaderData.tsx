"use client";
import { BASE_URL } from "@/config/config";
import Hamburger from "./Hamburger";
import Image from "next/image";
import Link from "next/link";
import MegaMenu from "./megaMenu/MegaMenu";
import { useRef, useState, useEffect } from "react";
import { HeaderMenuItem, ProductCategory, SidebarItem } from "./Header";
import { useHeader } from "./HeaderContext";
import "./header.css";

export default function HeaderData({
  headerData,
  sidebarData,
  productCategoryData,
}: {
  headerData: HeaderMenuItem[];
  sidebarData: SidebarItem[];
  productCategoryData: ProductCategory[];
}) {
  const navRef = useRef<HTMLDivElement>(null);
  const {showMegaMenu, setShowMegaMenu} = useHeader()
  const [headerHeight, setHeaderHeight] = useState(0);
  const closeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const updateHeight = () => {
      if (navRef.current) {
        setHeaderHeight(navRef.current.getBoundingClientRect().height);
      }
    };
    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  const openMenu = () => {
    if (closeTimeout.current) {
      clearTimeout(closeTimeout.current);
      closeTimeout.current = null;
    }
    setShowMegaMenu(true);
  };

  const closeMenu = () => {
    closeTimeout.current = setTimeout(() => {
      setShowMegaMenu(false);
    }, 150);
  };

  useEffect(() => {
    return () => {
      if (closeTimeout.current) clearTimeout(closeTimeout.current);
    };
  }, []);

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
                  className={`${item.title === "Industries" ? "mega-parent" : "" } ${item?.children?.length > 0 ? 'site_dropdown' : ''}`}
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
        onMouseEnter={openMenu}
        onMouseLeave={closeMenu}
      />
    </>
  );
}