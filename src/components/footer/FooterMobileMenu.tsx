"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { BASE_URL } from "@/config/config";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperInstance } from "swiper";
import "swiper/css";

export interface FooterMenuItem {
  title: string;
  slug: string;
  children?: FooterMenuItem[];
  child?: FooterMenuItem[];
}

export interface FooterProductCategory {
  name: string;
  slug: string;
  featured: boolean | string;
  image?: string;
  menu_image?:string;
}

interface MenuSection {
  title: string;
  href: string;
  links: { title: string; href: string }[];
}

const contactSlides = [
  {
    description: "For Business queries, please contact:",
    email: "marketing@samtegroup.com",
  },
  {
    description:
      "For Careers related queries or for, sending your CV, please contact:",
    email: "careers@samtelgroup.com",
  },
  {
    description: "For Sourcing or supplier related queries, please contact:",
    email: "sourcing@samtelgroup.com",
  },
  {
    description: "For events and media related queries, please contact:",
    email: "corpcomm@samtelgroup.com",
  },
  {
    description: "For any other queries, please write to:",
    email: "info@samtelgroup.com",
  },
];

type ActivePanel = "industries" | "contact" | "menu" | null;

function getIndustryClassName(category: FooterProductCategory) {
  const identity = `${category.slug} ${category.name}`.toLocaleLowerCase();

  if (identity.includes("airborne")) return "airborne";
  if (identity.includes("naval")) return "naval";
  if (identity.includes("space") || identity.includes("satellite")) return "space";
  if (identity.includes("unmanned")) return "unmanned";
  if (identity.includes("rail")) return "railways";
  if (identity.includes("industrial") || identity.includes("strategic")) {
    return "industrial";
  }
  if (identity.includes("land") || identity.includes("tactical")) return "land";

  return "category";
}

function isFeaturedCategory(category: FooterProductCategory) {
  return category.featured === true || category.featured === "true" || category.slug.includes('industrial');
}

function getMenuHref(slug: string) {
  const normalizedSlug = slug.replace(/^\/+/, "");
  return `${BASE_URL ?? "/"}${normalizedSlug}`;
}

function getMenuSections(
  headerMenu: FooterMenuItem[],
  sidebarMenu: FooterMenuItem[],
  productCategoryMenu: FooterProductCategory[],
): MenuSection[] {
  const sections = new Map<string, MenuSection>();

  const addMenuItems = (
    items: FooterMenuItem[],
    source: "header" | "sidebar",
  ) => {
    items.forEach((item) => {
      const key = item.title.trim().toLocaleLowerCase();
      const children = [...(item.children ?? []), ...(item.child ?? [])];
      const existing = sections.get(key);
      const section = existing ?? {
        title: item.title,
        href: getMenuHref(item.slug),
        links: [],
      };

      children.forEach((child) => {
        const childKey = child.title.trim().toLocaleLowerCase();
        if (
          section.links.some(
            (link) => link.title.trim().toLocaleLowerCase() === childKey,
          )
        ) {
          return;
        }

        const childPath =
          source === "header"
            ? child.slug
            : `${item.slug}/${child.slug}`;
        section.links.push({
          title: child.title,
          href: getMenuHref(childPath),
        });
      });

      sections.set(key, section);
    });
  };

  addMenuItems(headerMenu, "header");
  addMenuItems(sidebarMenu, "sidebar");

  const industriesSection = sections.get("industries");
  if (industriesSection) {
    productCategoryMenu
      .filter(isFeaturedCategory)
      .forEach((category) => {
        const categoryKey = category.name.trim().toLocaleLowerCase();
        if (
          industriesSection.links.some(
            (link) => link.title.trim().toLocaleLowerCase() === categoryKey,
          )
        ) {
          return;
        }

        industriesSection.links.push({
          title: category.name,
          href: `/category/${category.slug}`,
        });
      });
  }

  return Array.from(sections.values());
}

export default function FooterMobileMenu({
  headerMenu,
  sidebarMenu,
  productCategoryMenu,
}: {
  headerMenu: FooterMenuItem[];
  sidebarMenu: FooterMenuItem[];
  productCategoryMenu: FooterProductCategory[];
}) {
  const [activePanel, setActivePanel] = useState<ActivePanel>(null);
  const [openSubmenu, setOpenSubmenu] = useState<number | null>(null);
  const swiperRef = useRef<SwiperInstance | null>(null);
  const menuSections = getMenuSections(headerMenu, sidebarMenu, productCategoryMenu);

  useEffect(() => {
    document.body.classList.toggle("mobile-menu-open", activePanel !== null);
    return () => document.body.classList.remove("mobile-menu-open");
  }, [activePanel]);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActivePanel(null);
        setOpenSubmenu(null);
      }
    };

    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, []);

  const togglePanel = (panel: Exclude<ActivePanel, null>) => {
    setActivePanel((currentPanel) =>
      currentPanel === panel ? null : panel,
    );
    setOpenSubmenu(null);
  };

  const closePanels = () => {
    setActivePanel(null);
    setOpenSubmenu(null);
  };

  const featuredIndustries = productCategoryMenu.filter(
    isFeaturedCategory,
  );

  return (
    <>
      <div
        className={`mobile-panel industries-panel${activePanel === "industries" ? " active" : ""}`}
        id="industriesPanel"
        aria-hidden={activePanel !== "industries"}
      >
        <div className="mobile-panel-content">
          <div className="panel-title">
            <span>INDUSTRIES</span>
          </div>
          <div className="industries-section">
            <div className="industries-grid">
              {featuredIndustries.map((industry) => (
                <Link
                  href={`/category/${industry.slug}`}
                  className={`industry-card1 ${getIndustryClassName(industry)}`}
                  key={industry.slug}
                  tabIndex={activePanel === "industries" ? 0 : -1}
                  onClick={closePanels}
                >
                  {industry.menu_image && (
                    <img
                      src={industry.menu_image}
                      alt={industry.name}
                      loading="lazy"
                      // fill
                      // sizes="(max-width: 991px) 50vw, 0px"
                    />
                  )}
                  <span>{industry.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div
        className={`mobile-panel contact-panel${activePanel === "contact" ? " active" : ""}`}
        id="contactPanel"
        aria-hidden={activePanel !== "contact"}
      >
        <div className="mobile-panel-content contact-panel">
          <div className="contact-section">
            <div className="panel-title">
              <span>CONTACT</span>
            </div>
            <div className="contact-block">
              <h2>Design &amp; Production Facilities</h2>
              <p>
                2nd Floor, Plot No. 288-A, Udyog Vihar Phase-IV,
                <br />
                Gurugram 122015, Haryana, INDIA.
              </p>
              <p className="contact-phone">
                <a href="tel:+911244682000">
                  <Image
                    src="/assets/icons/phone.svg"
                    alt=""
                    width={18}
                    height={18}
                  />
                  +91 124 4682000
                </a>
              </p>
              <div className="contact-line" />
            </div>
            <div className="contact-block registered-office">
              <h2>Registered Office</h2>
              <p>
                1212, 12th Floor, 43, Chiranjiv Tower, Nehru
                <br />
                Place, New Delhi - 110019
              </p>
              <p className="contact-phone">
                <a href="tel:+911140555700">
                  <Image
                    src="/assets/icons/phone.svg"
                    alt=""
                    width={18}
                    height={18}
                  />
                  +91 11 40555700
                </a>
              </p>
              <div className="contact-line" />
            </div>
            <div className="contact-email-area">
              <div className="contact-swiper-section">
                <Swiper
                  className="contact-swiper"
                  slidesPerView={1}
                  rewind
                  onSwiper={(swiper) => {
                    swiperRef.current = swiper;
                  }}
                >
                  {contactSlides.map((slide) => (
                    <SwiperSlide key={slide.email}>
                      <div className="mobile-cont">
                        <div className="email-icon">
                          <Image
                            src="/assets/icons/mail.svg"
                            alt=""
                            width={24}
                            height={24}
                          />
                        </div>
                        <p className="email-text">{slide.description}</p>
                        <a
                          href={`mailto:${slide.email}`}
                          className="email-link"
                        >
                          {slide.email}
                        </a>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
              <div className="contact-arrows">
                <button
                  type="button"
                  className="contact-arrow contact-prev"
                  aria-label="Previous contact email"
                  onClick={() => swiperRef.current?.slidePrev()}
                >
                  <Image
                    src="/assets/icons/right-arrow-white.svg"
                    alt=""
                    className="img-fluid"
                    width={16}
                    height={16}
                  />
                </button>
                <button
                  type="button"
                  className="contact-arrow contact-next"
                  aria-label="Next contact email"
                  onClick={() => swiperRef.current?.slideNext()}
                >
                  <Image
                    src="/assets/icons/right-arrow-white.svg"
                    alt=""
                    className="img-fluid"
                    width={16}
                    height={16}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`mobile-menu${activePanel === "menu" ? " active" : ""}`}
        id="mobileMenu"
        aria-hidden={activePanel !== "menu"}
      >
        <div className="mobile-menu-inner">
          {menuSections.map((section, index) => {
            const isOpen = openSubmenu === index;
            if (section.links.length === 0) {
              return (
                <div className="mobile-menu-item" key={section.title}>
                  <Link
                    href={section.href}
                    className="main-menu-link"
                    onClick={closePanels}
                  >
                    <span>{section.title}</span>
                  </Link>
                </div>
              );
            }

            return (
              <div
                className={`mobile-menu-item has-submenu${isOpen ? " open" : ""}`}
                key={section.title}
              >
                <button
                  type="button"
                  className="submenu-toggle"
                  aria-expanded={isOpen}
                  aria-controls={`mobile-submenu-${index}`}
                  onClick={() =>
                    setOpenSubmenu((current) =>
                      current === index ? null : index,
                    )
                  }
                >
                  <span>{section.title}</span>
                  <span className="menu-arrow">
                    <Image
                      src="/assets/icons/right-arrow-white.svg"
                      alt=""
                      className="img-fluid"
                      width={16}
                      height={16}
                    />
                  </span>
                </button>
                <div className="submenu" id={`mobile-submenu-${index}`}>
                  {section.links.map(({ title, href }) => (
                    <Link
                      href={href}
                      key={href}
                      tabIndex={isOpen ? 0 : -1}
                      onClick={closePanels}
                    >
                      {title}
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <nav className={`mobile-bottom-nav${activePanel === "menu" ? " menu-open" : ""}`} aria-label="Mobile footer navigation">
        <button
          type="button"
          className={`bottom-nav-item industries-btn${activePanel === "industries" ? " active-btn" : ""}`}
          id="industriesToggle"
          aria-expanded={activePanel === "industries"}
          aria-controls="industriesPanel"
          onClick={() => togglePanel("industries")}
        >
          <span>Industries</span>
        </button>
        <button
          type="button"
          className={`bottom-nav-item contact-btn${activePanel === "contact" ? " active-btn" : ""}`}
          id="contactToggle"
          aria-expanded={activePanel === "contact"}
          aria-controls="contactPanel"
          onClick={() => togglePanel("contact")}
        >
          <span>Contact</span>
        </button>
        <button
          type="button"
          className={`bottom-nav-item menu-btn${activePanel === "menu" ? " active-btn" : ""}`}
          id="menuToggle"
          aria-expanded={activePanel === "menu"}
          aria-controls="mobileMenu"
          onClick={() => togglePanel("menu")}
        >
          <span className="menu-open-text">Menu</span>
        </button>
      </nav>
    </>
  );
}
