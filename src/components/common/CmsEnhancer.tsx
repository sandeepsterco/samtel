// CmsEnhancer.tsx — still "use client", but scoped, no doc-wide querySelectorAll
"use client";

import { useEffect } from "react";
import type Swiper from "swiper";

export default function CmsEnhancer({ containerId }: { containerId: string }) {
  useEffect(() => {
    let cancelled = false;
    let instances: Swiper[] = [];

    async function init() {
      const root = document.getElementById(containerId);
      if (!root) return;

      const sliders = root.querySelectorAll<HTMLElement>(
        ".adfSwiper:not([data-swiper-init])"
      );
      if (!sliders.length) return;

      const [{ default: SwiperCore }, { Pagination, Autoplay, Navigation }] = await Promise.all([
        import("swiper"),
        import("swiper/modules"),
      ]);
      await Promise.all([import("swiper/css"), import("swiper/css/pagination")]);

      if (cancelled) return;

      sliders.forEach((slider) => {
        if (slider.dataset.swiperInit) return;
        slider.dataset.swiperInit = "true";
      
        const pagination = slider.querySelector<HTMLElement>(".swiper-pagination");
        const nextEl = slider.querySelector<HTMLElement>(".swiper-button-next");
        const prevEl = slider.querySelector<HTMLElement>(".swiper-button-prev");
      
        const loop = slider.dataset.swiperLoop === "true";
        const autoplayDelay = slider.dataset.swiperAutoplay
          ? parseInt(slider.dataset.swiperAutoplay, 10)
          : undefined;
        const slidesPerView = slider.dataset.swiperSlidesPerView
          ? parseFloat(slider.dataset.swiperSlidesPerView)
          : 1;
      
        instances.push(
          new SwiperCore(slider, {
            modules: [Pagination, Autoplay, Navigation],
            loop,
            speed: 1000,
            slidesPerView,
            autoplay: autoplayDelay ? { delay: autoplayDelay, disableOnInteraction: false } : false,
            pagination: pagination ? { el: pagination, clickable: true } : false,
            navigation: nextEl && prevEl ? { nextEl, prevEl } : false,
          })
        );
      });
    }

    init();

    return () => {
      cancelled = true;
      instances.forEach((s) => s.destroy(true, true));
      instances = [];
    };
  }, [containerId]);

  return null;
}