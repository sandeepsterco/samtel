"use client";

import PaginationWrapper from "@/components/common/pagination/PaginationWrapper";
import NoData from "@/components/ui/NoData";
import { Fancybox } from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox/fancybox.css";
import parse from "html-react-parser";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import sanitizeHtml from "sanitize-html";
import { KeyboardEvent as ReactKeyboardEvent, useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

interface MappingItemInterface{
    title?:string;
    description?:string;
}

interface ProductMappingImage {
    image?: string;
    caption?: string;
}

interface ProductImage {
    src: string;
    caption?: string;
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
        lists?:MappingItemInterface[];
        images?:ProductMappingImage[];
    };
    image_caption?:string;
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

function getProductImages(product: Product): ProductImage[] {
    const seen = new Set<string>();
    const result: ProductImage[] = [];

    const add = (src?: string, caption?: string) => {
        if (!src || seen.has(src)) return;
        seen.add(src);
        result.push({ src, caption });
    };

    add(product.image, product.image_caption);
    (product.mapping_items?.images ?? []).forEach((item) => add(item.image, item.caption));

    return result;
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
    const [isCategoryLoading, setIsCategoryLoading] = useState(false);
    const selectedProduct = products[selectedIndex];
    const selectedProductImages = selectedProduct ? getProductImages(selectedProduct) : [];

    const openImageGallery = (startIndex: number) => {
    Fancybox.show(
        selectedProductImages.map(({ src, caption }) => ({
            src,
            type: "image",
            caption: caption || selectedProduct.name,
        })),
        { startIndex },
    );
};

    useEffect(() => {
        setAccordionExpanded(true);
        setSelectedIndex(0);
        setModalOpen(false);
        setIsCategoryLoading(false);
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
                                    <Link
                                        href={`${pathname}?type=${encodeURIComponent(category.slug)}`}
                                        onClick={() => {
                                            if (category.slug !== activeCategory?.slug) {
                                                setIsCategoryLoading(true);
                                            }
                                        }}
                                    >
                                        {category.name}
                                    </Link>
                                </li>
                                }
                            })}
                        </ul>
                    </nav>

                    <div className="pro_tab" aria-busy={isCategoryLoading}>
                        {categories.map((category) => {
                            const isActive = category.slug === activeCategory?.slug;
                            const href = `${pathname}?type=${encodeURIComponent(category.slug)}`;

                            if(category.products_count){
                                return (
                                    <div key={category.slug}>
                                        <button
                                            type="button"
                                            className={`accordion-header${isActive && accordionExpanded ? " active" : ""}`}
                                            aria-expanded={isActive && accordionExpanded}
                                            onClick={() => {
                                                if (isActive) setAccordionExpanded((expanded) => !expanded);
                                                else {
                                                    setIsCategoryLoading(true);
                                                    router.push(href);
                                                }
                                            }}
                                        >
                                            <span className="acc-title">{category.name}</span>
                                            <span className="acc-icon" aria-hidden="true" />
                                        </button>

                                        {isActive && (
                                            <div className={`tab_content_wrapper${accordionExpanded ? " active" : ""}`}>
                                                <h3 className="fade-up" data-aos="fade-up" data-aos-delay="300">{category.name}</h3>
                                                
                                                <div className="prodcut_text">
                                                    {category.subtitle && (
                                                        <blockquote className="fade-up" data-aos="fade-up" data-aos-delay="300">{category.subtitle}</blockquote>
                                                    )}

                                                    {category.description && (
                                                        <p className="fade-up" data-aos="fade-up" data-aos-delay="300">{category.description}</p>
                                                    )}
                                                    
                                                    {category?.content && (
                                                        <div className="fade-up" data-aos="fade-up" data-aos-delay="300" dangerouslySetInnerHTML={{ __html: category.content }} />
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
                            }

                            
                        })}
                        {isCategoryLoading && (
                            <div className="pro-tab-loader" role="status" aria-label="Loading product category">
                                <div className="spinner" aria-hidden="true" />
                            </div>
                        )}
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
                                style={{
                                    padding: "10px 24px",
                                    backgroundColor: "#c83030",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: "6px",
                                    cursor: "pointer",
                                }}
                            >
                                Back
                            </button>
                        </div>
                        
                        <div className="container-full">
                            <div className="breadcrumb-sec popup">
                                <div className="col-lg-10 mx-auto">
                                    <nav aria-label="Breadcrumb">
                                        <ol className="breadcrumb">
                                            <li className="breadcrumb-item">Products &amp; Solutions</li>
                                            <li className="breadcrumb-item">{activeCategory?.name}</li>
                                            <li className="breadcrumb-item active" aria-current="page">{selectedProduct.name}</li>
                                        </ol>
                                    </nav>
                                </div>
                            </div>
                            <div className="product_modal_grid">
                                <div className="product_image">
                                    <figure>
                                        <Swiper
                                            key={selectedProduct.id}
                                            className="product-image-swiper"
                                            modules={[Pagination, Autoplay, Navigation]}
                                            slidesPerView={1}
                                            pagination={selectedProductImages.length > 1 ? { clickable: true } : false}
                                            loop={selectedProductImages.length > 1}
                                            autoplay={{
                                                delay:3000,
                                                disableOnInteraction: false,
                                            }}
                                            navigation={{
                                                nextEl:'.swiper_custom_next',
                                                prevEl: '.swiper_custom_prev',
                                            }}
                                        >
                                            {(selectedProductImages.length
                                                ? selectedProductImages
                                                : [{ src: placeholderImage, caption: undefined }]
                                            ).map((item, index) => (
                                                <SwiperSlide key={`${item.src}-${index}`}>
                                                    <Image
                                                        src={item.src}
                                                        className="img-fluid w-100"
                                                        width={850}
                                                        height={850}
                                                        alt={`${selectedProduct.name}${selectedProductImages.length > 1 ? ` - image ${index + 1}` : ""}`}
                                                        priority={index === 0}
                                                    />

                                                    {item.caption && (
                                                        <div className="image_title">
                                                            <h6>{item.caption}</h6>
                                                        </div>
                                                    )}

                                                    {selectedProductImages.length > 0 && (
                                                        <button
                                                            type="button"
                                                            className="product-image-zoom"
                                                            aria-label={`Zoom image ${index + 1} of ${selectedProduct.name}`}
                                                            onClick={() => openImageGallery(index)}
                                                        >
                                                            <Image src="/assets/icons/zoombtn.svg" alt="" width={39} height={39} />
                                                        </button>
                                                    )}
                                                </SwiperSlide>
                                            ))}
                                        </Swiper>

                                            <button type="button" className="swiper_custom_prev" aria-label="Previous product" >
                                                <Image src="/assets/icons/left-arrow.svg" alt="" width={52} height={52} />
                                            </button>
                                            
                                            <button type="button" className="swiper_custom_next" aria-label="Next product">
                                                <Image src="/assets/icons/right-arrow-white.svg" alt="" width={52} height={52} />
                                            </button>
                                    </figure>
                                </div>
                                <div className="product_content_main">
                                    
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