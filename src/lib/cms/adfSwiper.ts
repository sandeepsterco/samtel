// lib/cms-sliders/adfSwiper.ts
import type Swiper from "swiper";
import type { SliderModule } from "./types";

export const adfSwiperModule: SliderModule<Swiper> = {
    init: initAdfSwiper,
    destroy: destroyAdfSwiper,
  };

const SELECTOR = ".adfSwiper:not([data-swiper-init])";

export async function initAdfSwiper(root: HTMLElement): Promise<Swiper[]> {
  const sliders = root.querySelectorAll<HTMLElement>(SELECTOR);
  if (!sliders.length) return [];

  const [{ default: SwiperCore }, { Pagination, Autoplay, Navigation }] = await Promise.all([
    import("swiper"),
    import("swiper/modules"),
  ]);
  await Promise.all([import("swiper/css"), import("swiper/css/pagination")]);

  const instances: Swiper[] = [];

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
        pagination: pagination ? { el: pagination, clickable: true } : undefined,
        navigation: nextEl && prevEl ? { nextEl, prevEl } : undefined,
      })
    );
  });

  return instances;
}

export function destroyAdfSwiper(instances: Swiper[]) {
  instances.forEach((s) => s.destroy(true, true));
}