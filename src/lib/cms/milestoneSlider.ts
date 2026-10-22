import type Swiper from "swiper";
import type { SliderModule } from "./types";

const SELECTOR = ".milestoneSwiper:not([data-swiper-init])";

async function initMilestoneSlider(root: HTMLElement): Promise<Swiper[]> {
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
    const controls = slider.closest<HTMLElement>(".milestone_slider") ?? root;
    const nextEl = controls.querySelector<HTMLElement>(".milestone-next");
    const prevEl = controls.querySelector<HTMLElement>(".milestone-prev");
    const paginationEl = controls.querySelector<HTMLElement>(".milestone-pagination");
    slider.dataset.swiperInit = "true";

    instances.push(
      new SwiperCore(slider, {
        modules: [Autoplay, Navigation, Pagination],
        slidesPerView: 1,
        spaceBetween: 20,
        speed: 800,
        loop: true,
        autoplay: {
          delay: 3000,
          disableOnInteraction: false,
        },
        navigation: nextEl && prevEl ? { nextEl, prevEl } : false,
        pagination: paginationEl ? { el: paginationEl, clickable: true } : false,
      }),
    );
  });

  return instances;
}

function destroyMilestoneSlider(instances: Swiper[]) {
  instances.forEach((swiper) => swiper.destroy(true, true));
}

export const milestoneSliderModule: SliderModule<Swiper> = {
  init: initMilestoneSlider,
  destroy: destroyMilestoneSlider,
};