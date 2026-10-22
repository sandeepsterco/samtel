// lib/cms-sliders/heroSlider.ts
import type Swiper from "swiper";
import type { SliderModule } from "./types";

const SELECTOR = ".swiper:not([data-swiper-init])";

export async function initHeroSlider(root: HTMLElement): Promise<Swiper[]> {
  const sliders = root.querySelectorAll<HTMLElement>(SELECTOR);
  if (!sliders.length) return [];

  const [{ default: SwiperCore }, { Navigation }] = await Promise.all([
    import("swiper"),
    import("swiper/modules"),
  ]);
  await Promise.all([import("swiper/css"), import("swiper/css/navigation")]);

  const instances: Swiper[] = [];

  sliders.forEach((slider) => {
    if (slider.dataset.swiperInit) return;
    slider.dataset.swiperInit = "true";

    // scope buttons to this slider instance, falling back to root
    // in case markup places them as siblings rather than children
    const findControl = (customSelector: string, defaultSelector: string) =>
      slider.querySelector<HTMLElement>(customSelector) ??
      root.querySelector<HTMLElement>(customSelector) ??
      root.ownerDocument.querySelector<HTMLElement>(customSelector) ??
      slider.querySelector<HTMLElement>(defaultSelector) ??
      root.querySelector<HTMLElement>(defaultSelector) ??
      root.ownerDocument.querySelector<HTMLElement>(defaultSelector);
    const nextEl = findControl(".custom-next-btn", ".swiper-button-next");
    const prevEl = findControl(".custom-prev-btn", ".swiper-button-prev");

    instances.push(
      new SwiperCore(slider, {
        modules: [Navigation],
        direction: "horizontal",
        loop: true,
        speed: 600,
        effect: "slide",
        grabCursor: true,
        navigation: nextEl && prevEl ? { nextEl, prevEl } : false,
      })
    );
  });

  return instances;
}

export function destroyHeroSlider(instances: Swiper[]) {
  instances.forEach((s) => s.destroy(true, true));
}

export const heroSliderModule: SliderModule<Swiper> = {
  init: initHeroSlider,
  destroy: destroyHeroSlider,
};