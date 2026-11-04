"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import "./breadcrumbs.css";

import { BASE_URL } from "@/config/config";

interface BreadcrumbsInterface {
    title: string;

    slug: string;
}

interface BreadcrumbPropsInterface {
    data: {
        breadcrumbs?: BreadcrumbsInterface[];
    };
}

export default function Breadcrumbs({ data }: BreadcrumbPropsInterface) {
const [isExpanded, setIsExpanded] = useState(false);
const [isMobile, setIsMobile] = useState(false);


useEffect(() => {
    const checkWidth = () => {
        setIsMobile(window.innerWidth <= 575);
    };

    checkWidth();

    window.addEventListener("resize", checkWidth);

    return () => window.removeEventListener("resize", checkWidth);
}, []);
    const breadcrumbs = data?.breadcrumbs ?? [];

    const allBreadcrumbs = [
        { title: "Home", slug: BASE_URL ?? "/", isHome: true },

        ...breadcrumbs.map((item) => ({ ...item, isHome: false })),
    ];


  const visibleBreadcrumbs =
    isMobile && !isExpanded
        ? allBreadcrumbs.slice(-2)
        : allBreadcrumbs;

const showDots = isMobile && allBreadcrumbs.length > 2;

    return (
        <section className="breadcrumb-sec">
            <div className="container">
                <div className="col-lg-10 mx-auto">
                    <nav aria-label="breadcrumb" className="breadcrumb-custom">
                        <ol
                            className={`breadcrumb ${isExpanded ? "breadcrumb-expanded" : ""}`}
                        >
                            {showDots && (
                                <li className="breadcrumb-collapsed">
                                    <button
                                        type="button"

                                        className="dots-icon expand-breadcrumbs"
onClick={() => setIsExpanded(prev => !prev)}

                                        aria-label={
                                            isExpanded
                                                ? "Collapse breadcrumbs"
                                                : "Expand breadcrumbs"
                                        }

                                        aria-expanded={isExpanded}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"

                                            viewBox="0 0 10 30"

                                            width="10"

                                            height="30"

                                            className="breadcrumb-dots-icon"
                                        >
                                            <circle
                                                cx="5"
                                                cy="5"
                                                r="2"
                                                fill="#C83030"
                                            />

                                            <circle
                                                cx="5"
                                                cy="15"
                                                r="2"
                                                fill="#C83030"
                                            />

                                            <circle
                                                cx="5"
                                                cy="25"
                                                r="2"
                                                fill="#C83030"
                                            />
                                        </svg>
                                    </button>
                                </li>
                            )}

                            {visibleBreadcrumbs.map((item, idx) => {
                                const isLast =
                                    allBreadcrumbs.indexOf(item) ===
                                    allBreadcrumbs.length - 1;

                                return (
                                    <li
                                        key={item.slug + idx}

                                        className={`breadcrumb-item ${isLast ? "active" : ""}`}

                                        aria-current={
                                            isLast ? "page" : undefined
                                        }
                                    >
                                        {item.isHome ? (
                                            <Link href={BASE_URL ?? "/"}>
                                                Home
                                            </Link>
                                        ) : isLast ||
                                          String(item.slug).includes("#") ||
                                          item.slug === "media" ? (
                                            item.title
                                        ) : (
                                            <Link href={`/${item.slug}`}>
                                                {item.title}
                                            </Link>
                                        )}
                                    </li>
                                );
                            })}
                        </ol>
                    </nav>
                </div>
            </div>
        </section>
    );
}
