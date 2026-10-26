"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { BASE_URL } from "@/config/config";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";

export interface FooterMenuItem {
  title: string;
  slug: string;
  overwrite_url?: string | null;
  target_blank?: boolean | number | string | null;
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
  target?: "_blank";
  rel?: string;
  links: MenuLink[];
}

interface MenuLink {
  title: string;
  href: string;
  target?: "_blank";
  rel?: string;
  children?: {
    title: string;
    href: string;
    target?: "_blank";
    rel?: string;
  }[];
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
  return (
    category.featured === true ||
    category.featured === "true" ||
    category.slug.includes("industrial")
  );
}

function getIndustryCategories(categories: FooterProductCategory[]) {
  const seenSlugs = new Set<string>();

  return categories.filter((category) => {
    if (!isFeaturedCategory(category)) return false;

    const slug = category.slug.trim().toLocaleLowerCase();
    if (seenSlugs.has(slug)) return false;

    seenSlugs.add(slug);
    return true;
  });
}

function getMenuLinkProps(
  item: FooterMenuItem,
  slugPath: string,
): Pick<MenuLink, "href" | "target" | "rel"> {
  const overwriteUrl =
    typeof item.overwrite_url === "string" ? item.overwrite_url.trim() : "";
  const isAbsoluteUrl = /^https?:\/\//i.test(overwriteUrl);
  const href = overwriteUrl
    ? isAbsoluteUrl
      ? overwriteUrl
      : `${BASE_URL ?? "/"}${overwriteUrl.replace(/^\/+/, "")}`
    : `${BASE_URL ?? "/"}${slugPath.replace(/^\/+/, "")}`;

  const newTab = Number(item.target_blank) === 1;

  return {
    href,
    ...(newTab ? { target: "_blank" as const, rel: "noopener noreferrer" } : {}),
  };
}

function getMenuChildren(item: FooterMenuItem) {
  return [...(item.children ?? []), ...(item.child ?? [])];
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
      const children = getMenuChildren(item);
      const existing = sections.get(key);
      const sectionLinkProps = getMenuLinkProps(item, item.slug);
      const section = existing ?? {
        title: item.title,
        ...sectionLinkProps,
        links: [],
      };

      if (existing && source === "sidebar") {
        Object.assign(section, sectionLinkProps);
      }

      children.forEach((child) => {
        const childKey = child.title.trim().toLocaleLowerCase();
        const childPath =
          source === "header"
            ? child.slug
            : `${item.slug}/${child.slug}`;
        const childLinkProps = getMenuLinkProps(child, childPath);
        const nestedLinks = getMenuChildren(child).map((nestedChild) => ({
          title: nestedChild.title,
          ...getMenuLinkProps(
            nestedChild,
            `${childPath}/${nestedChild.slug}`,
          ),
        }));
        const existingLink = section.links.find(
          (link) => link.title.trim().toLocaleLowerCase() === childKey,
        );

        if (existingLink) {
          if (source === "sidebar") {
            Object.assign(existingLink, childLinkProps);
          }

          nestedLinks.forEach((nestedLink) => {
            const existingNestedLink = existingLink.children?.find(
              (link) =>
                link.title.trim().toLocaleLowerCase() ===
                nestedLink.title.trim().toLocaleLowerCase(),
            );

            if (existingNestedLink) {
              if (source === "sidebar") {
                Object.assign(existingNestedLink, nestedLink);
              }
              return;
            }

            existingLink.children = [
              ...(existingLink.children ?? []),
              nestedLink,
            ];
          });
          return;
        }

        section.links.push({
          title: child.title,
          ...childLinkProps,
          ...(nestedLinks.length > 0 ? { children: nestedLinks } : {}),
        });
      });

      sections.set(key, section);
    });
  };

  addMenuItems(headerMenu, "header");
  addMenuItems(sidebarMenu, "sidebar");

  const industriesSection = sections.get("industries");
  if (industriesSection) {
    industriesSection.links = getIndustryCategories(productCategoryMenu).map(
      (category) => ({
        title: category.name,
        href: `/category/${category.slug}`,
      }),
    );
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
  const [openNestedSubmenu, setOpenNestedSubmenu] = useState<string | null>(null);
  const previousContactButtonRef = useRef<HTMLButtonElement | null>(null);
  const nextContactButtonRef = useRef<HTMLButtonElement | null>(null);
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
        setOpenNestedSubmenu(null);
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
    setOpenNestedSubmenu(null);
  };

  const closePanels = () => {
    setActivePanel(null);
    setOpenSubmenu(null);
    setOpenNestedSubmenu(null);
  };

  const featuredIndustries = getIndustryCategories(productCategoryMenu);

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

                 <p className="contact-phone">
                  <Image
                    src="/assets/icons/fax2.svg"
                    alt=""
                    width={18}
                    height={18}
                  />
                +91 124 4682029
            
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

                  <p className="contact-phone">
                  <Image
                    src="/assets/icons/fax2.svg"
                    alt=""
                    width={18}
                    height={18}
                  />
                +91 11 41555006
            
              </p>
              <div className="contact-line" />
            </div>
            <div className="contact-email-area">
              <div className="contact-swiper-section">
                <Swiper
                  className="contact-swiper"
                  modules={[Navigation]}
                  navigation={false}
                  slidesPerView={1}
                  rewind
                  onSwiper={(swiper) => {
                    const previousButton = previousContactButtonRef.current;
                    const nextButton = nextContactButtonRef.current;
                    if (!previousButton || !nextButton) return;

                    swiper.params.navigation = {
                      prevEl: previousButton,
                      nextEl: nextButton,
                    };
                    swiper.navigation.init();
                    swiper.navigation.update();
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
                  ref={previousContactButtonRef}
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
                  ref={nextContactButtonRef}
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
                    target={section.target}
                    rel={section.rel}
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
                  {section.links.map(
                    ({ title, href, children, target, rel }, linkIndex) => {
                      const nestedKey = `${index}-${linkIndex}`;
                      const isNestedOpen = openNestedSubmenu === nestedKey;

                      if (!children?.length) {
                        return (
                          <Link
                            href={href}
                            key={href}
                            target={target}
                            rel={rel}
                            tabIndex={isOpen ? 0 : -1}
                            onClick={closePanels}
                          >
                            {title}
                          </Link>
                        );
                      }

                      return (
                        <div className="submenu-link-group" key={href}>
                          <div className="submenu-parent-row">
                            <Link
                              href={href}
                              className="submenu-parent-link"
                              target={target}
                              rel={rel}
                              tabIndex={isOpen ? 0 : -1}
                              onClick={closePanels}
                            >
                              {title}
                            </Link>
                            <button
                              type="button"
                              className="nested-submenu-toggle"
                              aria-label={`${isNestedOpen ? "Collapse" : "Expand"} ${title} submenu`}
                              aria-expanded={isNestedOpen}
                              aria-controls={`nested-submenu-${nestedKey}`}
                              tabIndex={isOpen ? 0 : -1}
                              onClick={() =>
                                setOpenNestedSubmenu((current) =>
                                  current === nestedKey ? null : nestedKey,
                                )
                              }
                            >
                              <Image
                                src="/assets/icons/right-arrow-white.svg"
                                alt=""
                                width={16}
                                height={16}
                              />
                            </button>
                          </div>
                          <div
                            className={`nested-submenu${isNestedOpen ? " open" : ""}`}
                            id={`nested-submenu-${nestedKey}`}
                          >
                            {children.map((nestedLink) => (
                              <Link
                                href={nestedLink.href}
                                key={nestedLink.href}
                                target={nestedLink.target}
                                rel={nestedLink.rel}
                                tabIndex={isOpen && isNestedOpen ? 0 : -1}
                                onClick={closePanels}
                              >
                                {nestedLink.title}
                              </Link>
                            ))}
                          </div>
                        </div>
                      );
                    },
                  )}
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
