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
  await import("swiper/css");

  const instances: Swiper[] = [];

  sliders.forEach((slider) => {
    if (slider.dataset.swiperInit) return;
    slider.dataset.swiperInit = "true";

    // scope buttons to this slider instance, falling back to root
    // in case markup places them as siblings rather than children
    const nextEl =
      slider.querySelector<HTMLElement>(".custom-next-btn") ??
      root.querySelector<HTMLElement>(".custom-next-btn");
    const prevEl =
      slider.querySelector<HTMLElement>(".custom-prev-btn") ??
      root.querySelector<HTMLElement>(".custom-prev-btn");

    instances.push(
      new SwiperCore(slider, {
        modules: [Navigation],
        direction: "horizontal",
        loop: true,
        speed: 600,
        effect: "slide",
        grabCursor: true,
        navigation: nextEl && prevEl ? { nextEl, prevEl } : undefined,
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