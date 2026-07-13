"use client";

import { useEffect } from "react";
import type Swiper from "swiper";
import type { SwiperOptions, NavigationOptions, PaginationOptions } from "swiper/types";

type PaginationType = "bullets" | "fraction" | "progressbar" | "custom";

type RawSwiperConfig = Omit<SwiperOptions, "navigation" | "pagination"> & {
  navigation?: boolean | { nextEl?: string; prevEl?: string };
  pagination?:
    | boolean
    | { el?: string; clickable?: boolean; type?: PaginationType };
};

const DEFAULTS: RawSwiperConfig = {
  loop: false,
  speed: 600,
  slidesPerView: 1,
};

function parseConfig(raw: string | undefined): RawSwiperConfig {
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    console.warn("Invalid data-swiper-config JSON, falling back to defaults");
    return {};
  }
}

function resolveEl(root: HTMLElement, selector?: string) {
  if (!selector) return undefined;
  return root.querySelector<HTMLElement>(selector) || undefined;
}

function buildSwiperOptions(root: HTMLElement, config: RawSwiperConfig): SwiperOptions {
  const { navigation: rawNav, pagination: rawPag, ...rest } = { ...DEFAULTS, ...config };

  let navigation: NavigationOptions | false = false;
  if (rawNav === true) {
    const nextEl = root.querySelector<HTMLElement>(".swiper-button-next") || undefined;
    const prevEl = root.querySelector<HTMLElement>(".swiper-button-prev") || undefined;
    navigation = nextEl && prevEl ? { nextEl, prevEl } : false;
  } else if (rawNav && typeof rawNav === "object") {
    const nextEl = resolveEl(root, rawNav.nextEl) ||
      root.querySelector<HTMLElement>(".swiper-button-next") || undefined;
    const prevEl = resolveEl(root, rawNav.prevEl) ||
      root.querySelector<HTMLElement>(".swiper-button-prev") || undefined;
    navigation = nextEl && prevEl ? { nextEl, prevEl } : false;
  }

  let pagination: PaginationOptions | false = false;
  if (rawPag === true) {
    const el = root.querySelector<HTMLElement>(".swiper-pagination") || undefined;
    pagination = el ? { el, clickable: true } : false;
  } else if (rawPag && typeof rawPag === "object") {
    const el = resolveEl(root, rawPag.el) ||
      root.querySelector<HTMLElement>(".swiper-pagination") || undefined;
    pagination = el ? { ...rawPag, el } : false;
  }

  return { ...rest, navigation, pagination };
}

export default function CmsEnhancer({ containerId }: { containerId: string }) {
  useEffect(() => {
    let cancelled = false;
    let instances: Swiper[] = [];

    async function init() {
      const root = document.getElementById(containerId);
      if (!root) return;

      const sliders = root.querySelectorAll<HTMLElement>(
        ".swiper:not([data-swiper-init])"
      );
      if (!sliders.length) return;

      const [{ default: SwiperCore }, modules] = await Promise.all([
        import("swiper"),
        import("swiper/modules"),
      ]);
      await Promise.all([
        import("swiper/css"),
        import("swiper/css/pagination"),
        import("swiper/css/navigation"),
      ]);

      if (cancelled) return;

      sliders.forEach((slider) => {
        if (slider.dataset.swiperInit) return;
        slider.dataset.swiperInit = "true";
      
        const config = parseConfig(slider.dataset.swiperConfig);
        const options = buildSwiperOptions(slider, config);
      
        console.log("raw config:", config);
        console.log("final swiper options:", options);
      
        instances.push(
          new SwiperCore(slider, {
            modules: [modules.Navigation, modules.Pagination, modules.Autoplay],
            ...options,
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