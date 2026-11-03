
"use client";

import { BASE_URL } from "@/config/config";
import Hamburger from "./Hamburger";
import Image from "next/image";
import Link from "next/link";
import { useRef, useEffect, useCallback, useState } from "react";
import type { ReactNode } from "react";
import MegaMenu from "./megaMenu/MegaMenu";
import {
  isIndustriesMegaMenu,
  type HeaderMenuItem,
  type ProductCategory,
  type SidebarItem,
} from "./Header";
import { useHeader } from "./HeaderContext";
import "./header.css";
import { usePathname } from "next/navigation";
import type { InfoItem } from "@/lib/info";

const CLOSE_DELAY = 200;

export default function HeaderData({
  headerData,
  dropdownContents,
  sidebarData,
  productCategoryData,
  infoData,
}: {
  headerData: HeaderMenuItem[];
  dropdownContents: (ReactNode | null)[];
  sidebarData: SidebarItem[];
  productCategoryData: ProductCategory[];
  infoData: InfoItem[];
}) {
  const { showMegaMenu, setShowMegaMenu } = useHeader();

  const [activeMegaMenuName, setActiveMegaMenuName] = useState<string | null>(null);

  const closeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const pathname = usePathname();

  const clearCloseTimer = useCallback(() => {
    if (closeTimeout.current) {
      clearTimeout(closeTimeout.current);
      closeTimeout.current = null;
    }
  }, []);

  // Open menu ONLY from actual navigation item
  const openMenu = useCallback(
    (name: string) => {
      clearCloseTimer();
      setActiveMegaMenuName(name);
      setShowMegaMenu(true);
    },
    [clearCloseTimer, setShowMegaMenu]
  );

  // Delayed close allows mouse movement from menu item to panel
  const closeMenu = useCallback(() => {
    clearCloseTimer();

    closeTimeout.current = setTimeout(() => {
      setActiveMegaMenuName(null);
      setShowMegaMenu(false);
      closeTimeout.current = null;
    }, CLOSE_DELAY);
  }, [clearCloseTimer, setShowMegaMenu]);

  // Immediate close
  const closeMenuNow = useCallback(() => {
    clearCloseTimer();
    setActiveMegaMenuName(null);
    setShowMegaMenu(false);
  }, [clearCloseTimer, setShowMegaMenu]);

  // Close on route change
  useEffect(() => {
    closeMenuNow();
  }, [pathname, closeMenuNow]);

  // Escape key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMenuNow();
    };

    document.addEventListener("keydown", onKey);

    return () => document.removeEventListener("keydown", onKey);
  }, [closeMenuNow]);

  // Clear pending timer on unmount
  useEffect(() => clearCloseTimer, [clearCloseTimer]);

  return (
    <>
      <div className="container">
        <div className="header_nav">
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
              {headerData.map((item, idx) => {
                const isClickableLink = !!item.slug && item.slug !== "#";
                const megaMenuName = item.mega_menu?.name;
                const hasMegaMenu = !!item.mega_menu?.content && !!megaMenuName;

                const isActive =
                  showMegaMenu && activeMegaMenuName === megaMenuName;

                return (
                  <li
                    key={idx}
                    className={`${hasMegaMenu ? "mega-hover-parent site_dropdown" : "mega-hover-parent"}${isActive ? " active" : ""}`}
                    onMouseEnter={() => {
                      if (hasMegaMenu) openMenu(megaMenuName);
                    }}
                    onMouseLeave={() => {
                      if (hasMegaMenu) closeMenu();
                    }}
                  >
                    {isClickableLink ? (
                      <Link href={`${BASE_URL}${item.slug}`}>
                        {item.title}
                      </Link>
                    ) : (
                      <Link href="#">
                        {item.title}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>

          <Hamburger sidebarData={sidebarData} />
        </div>
      </div>

      {headerData.map((item, idx) => {
        const megaMenuName = item.mega_menu?.name;

        if (!item.mega_menu?.content || !megaMenuName) {
          return null;
        }

        const isIndustriesMenu = isIndustriesMegaMenu(megaMenuName);

        const isActive =
          showMegaMenu && activeMegaMenuName === megaMenuName;

        if (!isIndustriesMenu && !dropdownContents[idx]) {
          return null;
        }

        return (
          <div
            key={megaMenuName}
            className={`site-dropdown-panel ${
              isIndustriesMenu
                ? "industry-dropdown-panel"
                : "parser-dropdown-panel"
            }${isActive ? " show" : ""}`}

            // IMPORTANT:
            // Panel hover cannot open a closed menu.
            // It only cancels pending close when this panel is already active.
            onMouseEnter={() => {
              if (showMegaMenu && activeMegaMenuName === megaMenuName) {
                clearCloseTimer();
              }
            }}

            onMouseLeave={closeMenu}
          >
            {isIndustriesMenu ? (
              <MegaMenu
                show={isActive}
                categoryData={productCategoryData}
                topOffset={0}
                infoData={infoData}
                onMouseEnter={() => {
                  if (showMegaMenu && activeMegaMenuName === megaMenuName) {
                    clearCloseTimer();
                  }
                }}
                onMouseLeave={closeMenu}
                onClose={closeMenuNow}
              />
            ) : (
              dropdownContents[idx]
            )}
          </div>
        );
      })}
    </>
  );
}
