"use client";

import { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { Keyboard } from "swiper/modules";

import "swiper/css";
import Image from "next/image";

export type GalleryItem = {
    id: number;
    title: string;
    date: string;
    badge: string;
    media: string[];
    description: string;
};

function isVideo(url: string) {
    return /\.(mp4|webm|ogg)$/i.test(url.trim());
}

export default function GalleryClient({ items }: { items: GalleryItem[] }) {
    const [isOpen, setIsOpen] = useState(false);
    const [activeCardIndex, setActiveCardIndex] = useState(0);
    const swiperRef = useRef<SwiperType | null>(null);

    console.log('data items',items);

    const activeItem = items[activeCardIndex];

    const openModal = (cardIndex: number) => {
        setActiveCardIndex(cardIndex);
        setIsOpen(true);
    };

    const closeModal = () => setIsOpen(false);

    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) return;
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                event.preventDefault();
                closeModal();
            }
        };
        document.addEventListener("keydown", onKeyDown);
        return () => document.removeEventListener("keydown", onKeyDown);
    }, [isOpen]);
    
    useEffect(() => {
        if (isOpen && swiperRef.current) {
            requestAnimationFrame(() => {
                swiperRef.current?.update();
                swiperRef.current?.slideTo(0, 0);
            });
        }
    }, [isOpen, activeCardIndex]);

    if (!activeItem) return null;

    return (
        <>
            <div className="gallery-container">
                {items.map((item, index) => (
                    <div
                        key={item.id}
                        className="gallery-card"
                        role="button"
                        tabIndex={0}
                        onClick={() => openModal(index)}
                        onKeyDown={(event) => {
                            if (event.key === "Enter" || event.key === " ") {
                                event.preventDefault();
                                openModal(index);
                            }
                        }}
                    >
                        <div className="media-image-wrapper">
                            <Image src={item.media[0]} alt={item.title} width={376} height={211} priority />
                            <div
                                className="media-badge"
                                dangerouslySetInnerHTML={{ __html: item.badge }}
                            />
                        </div>
                        <div className="media-content">
                            <h3 className="media-title">{item.title}</h3>
                            {item?.date && (
                                <div className="date">{item.date}</div>
                            )}
                            <div className="read-icon">
                                <img src="/assets/icons/read-icon.svg" alt="read" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div
                className={`modal-overlay ${isOpen ? "active" : ""}`}
                id="galleryModal"
                onClick={closeModal}
            >
                <div className="modal-wrapper" onClick={(event) => event.stopPropagation()}>
                    <button
                        type="button"
                        className="modal-close"
                        id="closeModalBtn"
                        aria-label="Close gallery"
                        onClick={closeModal}
                    >
                        <img src="/assets/icons/close.svg" alt="close" />
                    </button>

                    {isOpen && (
                        <>
                            <div className="modal-media-holder" id="modalMediaHolder">
                                <Swiper
                                    key={activeItem.id}
                                    modules={[Keyboard]}
                                    keyboard={{ enabled: true }}
                                    onSwiper={(swiper) => {
                                        swiperRef.current = swiper;
                                    }}
                                    className="gallery-swiper"
                                >
                                    {activeItem.media.map((url, i) => (
                                        <SwiperSlide key={i}>
                                            <div className="modal-media-slide">
                                                {isVideo(url) ? (
                                                    <video src={url} controls className="modal-media" />
                                                ) : (
                                                    <Image
                                                        src={url}
                                                        alt={activeItem.title}
                                                        className="modal-media"
                                                        width={850}
                                                        height={478}
                                                        priority
                                                    />
                                                )}
                                            </div>
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                            </div>

                            <div className="modal-footer">
                                <div className="modal-text" id="modalDescription">
                                    {activeItem.description}
                                </div>
                                <div className="modal-nav-btns" id="modalNavContainer">
                                    <button
                                        type="button"
                                        className="nav-btn nav-btn-prev"
                                        aria-label="Previous"
                                        onClick={() => swiperRef.current?.slidePrev()}
                                    >
                                        <img src="/assets/icons/arrow-icon-left.svg" alt="prev" />
                                    </button>
                                    <button
                                        type="button"
                                        className="nav-btn nav-btn-next"
                                        aria-label="Next"
                                        onClick={() => swiperRef.current?.slideNext()}
                                    >
                                        <img src="/assets/icons/arrow-icon-right.svg" alt="next" />
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}