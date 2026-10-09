"use client";

import PaginationWrapper from "@/components/common/pagination/PaginationWrapper";
import NoData from "@/components/ui/NoData";
import parse from "html-react-parser";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import sanitizeHtml from "sanitize-html";
import { KeyboardEvent as ReactKeyboardEvent, useEffect, useState } from "react";

interface MappingItemInterface{
    title?:string;
    description?:string;
}

interface ProductCategory {
    name: string;
    slug: string;
    subtitle?:string;
    description?:string;
    content?:string;
    products_count?:boolean;
}

interface Product {
    id: string | number;
    name: string;
    image?: string;
    description?: string;
    details?: string;
    content?: string;
    product_details?: string;
    product_details_html?: string;
    mapping_items?:{
        lists?:MappingItemInterface[]
    };
}

interface ProductSolutionsClientProps {
    categories: ProductCategory[];
    activeCategory?: ProductCategory;
    products: Product[];
    currentPage: number;
    totalPages: number;
}

const placeholderImage = "/assets/images/placeholders/product.webp";

function getProductDetails(product: Product) {
    return product.product_details_html
        ?? product.product_details
        ?? product.details
        ?? product.description
        ?? product.content
        ?? "";
}

export default function ProductSolutionsClient({
    categories,
    activeCategory,
    products,
    currentPage,
    totalPages,
}: ProductSolutionsClientProps) {
    const pathname = usePathname();
    const router = useRouter();
    const [accordionExpanded, setAccordionExpanded] = useState(true);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [modalOpen, setModalOpen] = useState(false);
    const selectedProduct = products[selectedIndex];

    useEffect(() => {
        setAccordionExpanded(true);
        setSelectedIndex(0);
        setModalOpen(false);
    }, [activeCategory?.slug]);

    useEffect(() => {
        if (!modalOpen) return;

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") setModalOpen(false);
            if (event.key === "ArrowLeft") {
                setSelectedIndex((index) => (index - 1 + products.length) % products.length);
            }
            if (event.key === "ArrowRight") {
                setSelectedIndex((index) => (index + 1) % products.length);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [modalOpen, products.length]);

    const openProduct = (index: number) => {
        setSelectedIndex(index);
        setModalOpen(true);
    };

    const moveProduct = (direction: -1 | 1) => {
        setSelectedIndex((index) => (index + direction + products.length) % products.length);
    };

    const handleCardKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>, index: number) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openProduct(index);
        }
    };

    return (
       <>
         <section className="products_systems_detail">
            <div className="container">
                <div className="products_systems_detail_grd">
                    <nav className="prodcut-nav" aria-label="Product categories">
                        <ul>
                            {categories.map((category) => {
                                if(category.products_count || category.name.includes('Custom Solutions')){
                                    return <li key={category.slug} className={category.slug === activeCategory?.slug ? "active" : ""}>
                                    <Link href={`${pathname}?type=${encodeURIComponent(category.slug)}`}>
                                        {category.name}
                                    </Link>
                                </li>
                                }
                            })}
                        </ul>
                    </nav>

                    <div className="pro_tab">
                        {categories.map((category) => {
                            const isActive = category.slug === activeCategory?.slug;
                            const href = `${pathname}?type=${encodeURIComponent(category.slug)}`;

                            return (
                                <div key={category.slug}>
                                    <button
                                        type="button"
                                        className={`accordion-header${isActive && accordionExpanded ? " active" : ""}`}
                                        aria-expanded={isActive && accordionExpanded}
                                        onClick={() => {
                                            if (isActive) setAccordionExpanded((expanded) => !expanded);
                                            else router.push(href);
                                        }}
                                    >
                                        <span className="acc-title">{category.name}</span>
                                        <span className="acc-icon" aria-hidden="true" />
                                    </button>

                                    {isActive && (
                                        <div className={`tab_content_wrapper${accordionExpanded ? " active" : ""}`}>
                                            <h3 className="fade-up" data-delay="0.3" data-duration="1">{category.name}</h3>
                                            
                                            <div className="prodcut_text">
                                                {category.subtitle && (
                                                    <blockquote className="fade-up" data-delay="0.3" data-duration="1">{category.subtitle}</blockquote>
                                                )}

                                                {category.description && (
                                                    <p className="fade-up" data-delay="0.3" data-duration="1">{category.description}</p>
                                                )}
                                                
                                                {category?.content && (
                                                    <div className="fade-up" data-delay="0.3" data-duration="1" dangerouslySetInnerHTML={{ __html: category.content }} />
                                                )}
                                            </div>
                                            {products.length > 0 && (
                                                <>
                                                    <div className="product_grid">
                                                        {products.map((product, index) => (
                                                            <div
                                                                key={product.id}
                                                                className="product_item"
                                                                role="button"
                                                                tabIndex={0}
                                                                aria-label={`View ${product.name} details`}
                                                                onClick={() => openProduct(index)}
                                                                onKeyDown={(event) => handleCardKeyDown(event, index)}
                                                            >
                                                                <span className="plus_icon" aria-hidden="true">
                                                                    <Image src="/assets/icons/plus-icon.svg" alt="" width={24} height={24} />
                                                                </span>
                                                                <figure>
                                                                    <Image
                                                                        src={product.image || placeholderImage}
                                                                        className="img-fluid"
                                                                        width={275}
                                                                        height={265}
                                                                        alt={product.name}
                                                                        loading="lazy"
                                                                    />
                                                                </figure>
                                                                <p>{product.name}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <PaginationWrapper currentPage={currentPage} totalPages={totalPages} />
                                                </>
                                            ) }
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            
        </section>
        {selectedProduct && (
                <div className={`product_modal${modalOpen ? " active" : ""}`} aria-hidden={!modalOpen}>
                    <div className="product_modal_overlay" onClick={() => setModalOpen(false)} />
                    <div className="product_modal_content" role="dialog" aria-modal="true" aria-labelledby="product-modal-title">
                        <div className="product_modal_close">
                            <button
                                type="button"
                                className=""
                                aria-label="Close product details"
                                onClick={() => setModalOpen(false)}
                            >
                                <Image src="/assets/icons/close-icon.svg" alt="" width={31} height={31} />
                            </button>
                        </div>
                        
                        <div className="container-full">
                            <div className="product_modal_grid">
                                <div className="product_image">
                                    <figure>
                                        <Image
                                            src={selectedProduct.image || placeholderImage}
                                            className="img-fluid w-100"
                                            width={850}
                                            height={850}
                                            alt={selectedProduct.name}
                                            priority
                                        />
                                    </figure>
                                </div>
                                <div>
                                    <section className="breadcrumb-sec">
                                        <nav aria-label="Breadcrumb">
                                            <ol className="breadcrumb">
                                                <li className="breadcrumb-item">Products &amp; Solutions</li>
                                                <li className="breadcrumb-item">{activeCategory?.name}</li>
                                                <li className="breadcrumb-item active" aria-current="page">{selectedProduct.name}</li>
                                            </ol>
                                        </nav>
                                    </section>
                                    <div className="product_content">
                                        <h1 className="font45" id="product-modal-title">{selectedProduct.name}</h1>
                                        <div id="modalDynamicBody">
                                            {selectedProduct?.description && (
                                                <div className="sort_desc_bx">
                                                    <p dangerouslySetInnerHTML={{__html:selectedProduct.description}} />
                                                </div>
                                            )}
                                            {Array.isArray(selectedProduct?.mapping_items?.lists) && selectedProduct?.mapping_items?.lists.length > 0 && selectedProduct?.mapping_items?.lists.map((item, index) => (
                                                <div key={index}>
                                                    <h3 dangerouslySetInnerHTML={{__html:item.title || ''}} />
                                                    <div className="produc_btmdesc" dangerouslySetInnerHTML={{__html:item.description || ''}} />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="product_slide_btns">
                            <button type="button" className="more_btn" aria-label="Previous product" onClick={() => moveProduct(-1)}>
                                <Image src="/assets/icons/left-arrow.svg" alt="" width={52} height={52} />
                            </button>
                            <div className="product_count"><p>{selectedIndex + 1}/{products.length}</p></div>
                            <button type="button" className="more_btn" aria-label="Next product" onClick={() => moveProduct(1)}>
                                <Image src="/assets/icons/right-arrow-white.svg" alt="" width={52} height={52} />
                            </button>
                        </div>
                    </div>
                </div>
            )}
       </>
    );
}