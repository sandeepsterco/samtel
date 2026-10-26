// lib/cms/careerSlider.ts
import type Swiper from "swiper";
import type { SliderModule } from "./types";

const SELECTOR = ".career_slider:not([data-swiper-init])";

export async function initCareerSlider(root: HTMLElement): Promise<Swiper[]> {
  const sliders = root.querySelectorAll<HTMLElement>(SELECTOR);
  if (!sliders.length) return [];

  const [{ default: SwiperCore }, { Autoplay, Navigation, Pagination }] =
    await Promise.all([import("swiper"), import("swiper/modules")]);
  await Promise.all([
    import("swiper/css"),
    import("swiper/css/navigation"),
    import("swiper/css/pagination"),
  ]);

  const instances: Swiper[] = [];

  sliders.forEach((slider) => {
    if (slider.dataset.swiperInit) return;
    slider.dataset.swiperInit = "true";

    const nextEl = slider.querySelector<HTMLElement>(".swiper-button-next");
    const prevEl = slider.querySelector<HTMLElement>(".swiper-button-prev");
    const pagination = slider.querySelector<HTMLElement>(".swiper-pagination");

    instances.push(
      new SwiperCore(slider, {
        modules: [Autoplay, Navigation, Pagination],
        loop: true,
        slidesPerView: 3.8,
        spaceBetween: 5,
        autoplay: { delay: 2000, disableOnInteraction: false },
        navigation: nextEl && prevEl ? { nextEl, prevEl } : false,
        pagination: pagination ? { el: pagination, clickable: true } : false,
        breakpoints: {
          375: { slidesPerView: 1, spaceBetween: 5 },
          576: { slidesPerView: 1.5, spaceBetween: 5 },
          768: { slidesPerView: 2.2, spaceBetween: 5 },
          1024: { slidesPerView: 3.2, spaceBetween: 5 },
          1200: { slidesPerView: 3.8, spaceBetween: 5 },
        },
      })
    );
  });

  return instances;
}

export function destroyCareerSlider(instances: Swiper[]) {
  instances.forEach((s) => s.destroy(true, true));
}

export const careerSliderModule: SliderModule<Swiper> = {
  init: initCareerSlider,
  destroy: destroyCareerSlider,
};