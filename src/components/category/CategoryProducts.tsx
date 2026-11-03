"use client";

import Image from "next/image";
import { KeyboardEvent as ReactKeyboardEvent, useEffect, useState } from "react";
import PaginationWrapper from "../common/pagination/PaginationWrapper";
import Link from "next/link";
import { BASE_URL } from "@/config/config";
import { Fancybox } from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox/fancybox.css";
import { Autoplay, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

interface MappingItemInterface {
    title?: string;
    description?: string;
}

interface ProductMappingImage {
    image?: string;
    caption?: string;
}

interface ProductImage {
    src: string;
    caption?: string;
}

interface ProductInterface{
    name:string;
    image?:string;
    image_caption?:string;
    ['product-category']:string;
    slug:string;
    id:number;
    description?:string;
    mapping_items?:{
        lists?:MappingItemInterface[];
        images?:ProductMappingImage[];
    };
}

interface CategoryPropsInterface{
    title:string;
    data:{
        current_page:number;
        data:ProductInterface[];
        last_page:number;
    }
}

const placeholderImage = "/assets/images/placeholders/product.webp";

function getProductImages(product: ProductInterface): ProductImage[] {
    const seen = new Set<string>();
    const images: ProductImage[] = [];

    const addImage = (src?: string, caption?: string) => {
        if (!src || seen.has(src)) return;
        seen.add(src);
        images.push({ src, caption });
    };

    addImage(product.image, product.image_caption);
    (product.mapping_items?.images ?? []).forEach((item) => addImage(item.image, item.caption));

    return images;
}

export default function CategoryProducts({title, data}:CategoryPropsInterface) {
    const products = data?.data ?? [];
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [modalOpen, setModalOpen] = useState(false);
    const selectedProduct = products[selectedIndex];
    const selectedProductImages = selectedProduct ? getProductImages(selectedProduct) : [];

    const openImageGallery = (startIndex: number) => {
        Fancybox.show(
            selectedProductImages.map(({ src, caption }) => ({
                src,
                type: "image",
                caption: caption || selectedProduct?.name,
            })),
            { startIndex },
        );
    };

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
            <section className="products_systems">
                <div className="container">
                    <div className="col-lg-10 mx-auto">
                        {title && <h3>Products of {title}</h3>}

                        <div className="product_grid">
                            {products.map((item, index) => (
                                <div
                                    key={item.id}
                                    className="product_item"
                                    role="button"
                                    tabIndex={0}
                                    aria-label={`View ${item.name} details`}
                                    onClick={() => openProduct(index)}
                                    onKeyDown={(event) => handleCardKeyDown(event, index)}
                                >
                                    <span className="plus_icon" aria-hidden="true">
                                        <Image src="/assets/icons/plus-icon.svg" alt="" width={24} height={24} />
                                    </span>
                                    <figure>
                                        <Image src={item.image || placeholderImage} alt={item.name} className="img-fluid" width={275} height={265} loading="lazy" />
                                    </figure>
                                    {item.name && <p>{item.name}</p>}
                                </div>
                            ))}
                        </div>

                        <PaginationWrapper
                            currentPage={data?.current_page || 1}
                            totalPages={data?.last_page || 1}
                        />
                    </div>
                </div>
            </section>

            {selectedProduct && (
                <div className={`product_modal${modalOpen ? " active" : ""}`} aria-hidden={!modalOpen}>
                    <div className="product_modal_overlay" onClick={() => setModalOpen(false)} />
                    <div className="product_modal_content" role="dialog" aria-modal="true" aria-labelledby="category-product-modal-title">
                        <div className="product_modal_close">
                            <button type="button" aria-label="Close product details" onClick={() => setModalOpen(false)}>
                                <Image src="/assets/icons/close-icon.svg" alt="" width={31} height={31} />
                            </button>
                        </div>

                        <div className="container-full">
                            <div className="product_modal_grid">
                                <div className="product_image">
                                    <figure>
                                        <Swiper
                                            key={selectedProduct.id}
                                            className="product-image-swiper"
                                            modules={[Autoplay, Navigation]}
                                            slidesPerView={1}
                                            loop={selectedProductImages.length > 1}
                                            autoplay={selectedProductImages.length > 1 ? {
                                                delay: 3000,
                                                disableOnInteraction: false,
                                            } : false}
                                            navigation={{
                                                nextEl: ".swiper_custom_next",
                                                prevEl: ".swiper_custom_prev",
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
                                        {selectedProductImages.length > 1 && (
                                            <>
                                                <button type="button" className="swiper_custom_prev" aria-label="Previous image">
                                                    <Image src="/assets/icons/left-arrow.svg" alt="" width={52} height={52} />
                                                </button>
                                                <button type="button" className="swiper_custom_next" aria-label="Next image">
                                                    <Image src="/assets/icons/right-arrow-white.svg" alt="" width={52} height={52} />
                                                </button>
                                            </>
                                        )}
                                    </figure>
                                </div>
                                <div>
                                    <section className="breadcrumb-sec">
                                        <nav aria-label="Breadcrumb">
                                            <ol className="breadcrumb">
                                                <li className="breadcrumb-item">
                                                    <Link href={`${BASE_URL}industries`}>Industries</Link>
                                                </li>
                                                {title && <li className="breadcrumb-item">{title}</li>}
                                                <li className="breadcrumb-item active" aria-current="page">{selectedProduct.name}</li>
                                            </ol>
                                        </nav>
                                    </section>
                                    <div className="product_content">
                                        <h1 className="font45" id="category-product-modal-title">{selectedProduct.name}</h1>
                                        <div id="modalDynamicBody">
                                            {selectedProduct.description && (
                                                <p dangerouslySetInnerHTML={{ __html: selectedProduct.description }} />
                                            )}
                                            {selectedProduct.mapping_items?.lists?.map((item, index) => (
                                                <div key={index}>
                                                    <h3 dangerouslySetInnerHTML={{ __html: item.title || "" }} />
                                                    <div dangerouslySetInnerHTML={{ __html: item.description || "" }} />
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